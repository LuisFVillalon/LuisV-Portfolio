// POST: answer one visitor question, streamed as newline-delimited JSON events:
//   {"t":"start","remaining":n}       question accepted (counted toward today's limit)
//   {"t":"text","v":"..."}            answer text as it streams
//   {"t":"replace","v":"..."}         Claude declined; show this instead of the streamed text
//   {"t":"done","sources":[...],"fallback":bool,"remaining":n}
//   {"t":"error","remaining":n}       answering failed; the question was refunded
// DELETE: forget a saved conversation (the visitor opted out of saving).
import { NextResponse } from 'next/server';
import { streamAnswer, type AnswerDone } from '@/app/lib/assistant/answer';
import { ASSISTANT, isAssistantConfigured } from '@/app/lib/assistant/config';
import { appendTurn, deleteConversation, isConversationId } from '@/app/lib/assistant/conversations';
import type { HistoryTurn } from '@/app/lib/assistant/prompt';
import { retrieve } from '@/app/lib/assistant/retrieve';
import { isOverBudget, recordSpend, refundQuestion, spendQuestion, visitorId } from '@/app/lib/assistant/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

const json = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: Request) {
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

    const visitor = visitorId(req);
    let remaining: number | null;
    try {
        remaining = await spendQuestion(visitor);
    } catch (err) {
        console.error('Assistant: question counter failed', err);
        return json({ code: 'unavailable' }, 503);
    }
    if (remaining === null) return json({ code: 'limit', remaining: 0 }, 429);

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const send = (event: object) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
            let spent = 0;
            send({ t: 'start', remaining });
            try {
                const retrieval = await retrieve(question, history);
                spent += retrieval.rewriteCostUsd;
                let done: AnswerDone | null = null;
                for await (const event of streamAnswer({ question, history, chunks: retrieval.chunks, signal: req.signal })) {
                    if (event.type === 'text') send({ t: 'text', v: event.text });
                    else if (event.type === 'replace') send({ t: 'replace', v: event.text });
                    else done = event;
                }
                if (!done) throw new Error('Answer stream ended without a result');
                spent += done.costUsd;
                send({
                    t: 'done',
                    sources: done.sources.map(({ label, href }) => ({ label, href })),
                    fallback: done.fallback,
                    remaining,
                });

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
            } catch (err) {
                console.error('Assistant: answering failed', err);
                const refunded = await refundQuestion(visitor).catch(() => remaining);
                try {
                    send({ t: 'error', remaining: refunded });
                } catch {
                    // The visitor already disconnected.
                }
            } finally {
                await recordSpend(spent).catch((err) => console.error('Assistant: recording spend failed', err));
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

export async function DELETE(req: Request) {
    if (!isAssistantConfigured()) return json({ code: 'off' }, 503);
    const { conversationId } = (await req.json().catch(() => ({}))) as { conversationId?: unknown };
    if (!isConversationId(conversationId)) return json({ code: 'bad_request' }, 400);
    await deleteConversation(conversationId);
    return json({ ok: true }, 200);
}

