// The Ask AI chat endpoint (app/api/assistant/chat/route.ts calls these). Retrieval and
// answering are passed in so the limit and logging evals (evals/criteria/limits, logging) can run
// the real handler with a stand-in for Voyage and Claude; the site always uses the real ones.
//
// POST: answer one visitor question, streamed as newline-delimited JSON events:
//   {"t":"start","remaining":n}       question accepted (counted toward today's limit)
//   {"t":"text","v":"..."}            answer text as it streams
//   {"t":"replace","v":"..."}         Claude declined; show this instead of the streamed text
//   {"t":"done","sources":[...],"fallback":bool,"remaining":n}
//   {"t":"error","remaining":n,"refunded":bool}  answering failed; refunded unless Claude had already billed the answer
// DELETE: forget a saved conversation (the visitor opted out of saving).
import { streamAnswer, type AnswerDone } from './answer';
import { ASSISTANT, isAssistantConfigured } from './config';
import { appendTurn, deleteConversation, isConversationId } from './conversations';
import type { HistoryTurn } from './prompt';
import { retrieve } from './retrieve';
import { ipId, isOverBudget, recordSpend, refundQuestion, spendQuestion, visitorId } from './usage';

export type ChatDeps = { retrieve: typeof retrieve; streamAnswer: typeof streamAnswer };

type Body = {
    question?: unknown;
    history?: unknown;
    conversationId?: unknown;
    save?: unknown;
    page?: unknown;
};

function parseHistory(raw: unknown): HistoryTurn[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .slice(-20)
        .filter(
            (t): t is HistoryTurn =>
                Boolean(t) && (t.role === 'user' || t.role === 'assistant') && typeof t.text === 'string',
        )
        .map((t) => ({ role: t.role, text: t.text.slice(0, ASSISTANT.historyTurnChars) }));
}

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export function chatHandlers(deps: ChatDeps = { retrieve, streamAnswer }) {
    async function POST(req: Request): Promise<Response> {
        if (!isAssistantConfigured()) return json({ code: 'off' }, 503);

        let body: Body;
        try {
            body = (await req.json()) as Body;
        } catch {
            return json({ code: 'bad_request' }, 400);
        }
        const question = typeof body.question === 'string' ? body.question.trim() : '';
        if (!question) return json({ code: 'bad_request' }, 400);
        if (question.length > ASSISTANT.maxQuestionChars) return json({ code: 'too_long', max: ASSISTANT.maxQuestionChars }, 400);
        const history = parseHistory(body.history);
        const conversationId = isConversationId(body.conversationId) ? body.conversationId : null;
        const save = body.save !== false;
        const page = typeof body.page === 'string' ? body.page.slice(0, 100) : '/';

        try {
            if (await isOverBudget()) return json({ code: 'budget' }, 503);
        } catch (err) {
            console.error('Assistant: budget check failed', err);
            return json({ code: 'unavailable' }, 503);
        }

        const asker = { visitor: visitorId(req), ip: ipId(req) };
        let spend: Awaited<ReturnType<typeof spendQuestion>>;
        try {
            spend = await spendQuestion(asker);
        } catch (err) {
            console.error('Assistant: question counter failed', err);
            return json({ code: 'unavailable' }, 503);
        }
        if (!spend.ok) return json(spend.reason === 'limit' ? { code: 'limit', remaining: 0 } : { code: 'busy' }, 429);
        const { remaining } = spend;

        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                const send = (event: object) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
                let spent = 0;
                let answering = false;
                const meter = { costUsd: 0, estimateUsd: 0 };
                const cutOff = () => answering && req.signal.aborted;
                send({ t: 'start', remaining });
                try {
                    const retrieval = await deps.retrieve(question, history);
                    spent += retrieval.rewriteCostUsd;
                    let done: AnswerDone | null = null;
                    answering = true;
                    for await (const event of deps.streamAnswer({ question, history, chunks: retrieval.chunks, signal: req.signal, meter })) {
                        if (event.type === 'text') send({ t: 'text', v: event.text });
                        else if (event.type === 'replace') send({ t: 'replace', v: event.text });
                        else done = event;
                    }
                    if (!done) throw new Error('Answer stream ended without a result');

                    // Saved before "done" is sent: the client keeps the opt-out toggle disabled until
                    // then, so a later opt-out's delete always lands after this write.
                    if (conversationId && save) {
                        await appendTurn(conversationId, page, {
                            q: question,
                            a: done.text,
                            sources: done.sources.map((s) => s.label),
                            fallback: done.fallback || undefined,
                            at: new Date().toISOString(),
                        }).catch((err) => console.error('Assistant: saving the conversation failed', err));
                    } else if (conversationId && !save) {
                        await deleteConversation(conversationId).catch(() => undefined);
                    }
                    send({
                        t: 'done',
                        sources: done.sources.map(({ label, href }) => ({ label, href })),
                        fallback: done.fallback,
                        remaining,
                    });
                } catch (err) {
                    console.error('Assistant: answering failed', err);
                    const billed = meter.costUsd > 0 || cutOff();
                    const left = billed ? remaining : await refundQuestion(asker).catch(() => remaining);
                    try {
                        send({ t: 'error', remaining: left, refunded: !billed });
                    } catch {
                        // The visitor already disconnected.
                    }
                } finally {
                    const answerCost = meter.costUsd || (cutOff() ? meter.estimateUsd : 0);
                    await recordSpend(spent + answerCost).catch((err) => console.error('Assistant: recording spend failed', err));
                    try {
                        controller.close();
                    } catch {
                        // Already closed by a disconnect.
                    }
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson; charset=utf-8',
                'Cache-Control': 'no-store',
                'X-Accel-Buffering': 'no',
            },
        });
    }

    async function DELETE(req: Request): Promise<Response> {
        if (!isAssistantConfigured()) return json({ code: 'off' }, 503);
        const { conversationId } = (await req.json().catch(() => ({}))) as { conversationId?: unknown };
        if (!isConversationId(conversationId)) return json({ code: 'bad_request' }, 400);
        await deleteConversation(conversationId);
        return json({ ok: true }, 200);
    }

    return { POST, DELETE };
}
