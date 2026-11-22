// THE ANSWERING STEP, shared by every criterion (through the `ask` tool in runner.ts).
//
// Each criterion must test the assistant exactly as visitors get it, so this is the one place
// that asks it a question, through the same retrieve() + streamAnswer() the chat route
// (/api/assistant/chat) uses, with the earlier turns of a conversation as `history`. If the way
// the assistant is called ever changes (a new retrieve() option, a different meter), change it
// here and every criterion follows.
//
// It returns the full retrieved chunks, not just their ids: some graders read the chunk text.
// The pipeline is imported dynamically by loadPipeline(), which runs after loadEvalEnv():
// config.ts reads some settings at import time.
import type { HistoryTurn } from '../../src/app/lib/assistant/prompt';
import type { RetrievedChunk } from '../../src/app/lib/assistant/retrieve';

export type { HistoryTurn };

export type Pipeline = Awaited<ReturnType<typeof loadPipeline>>;

/**
 * `model` (from --model) swaps the answering model for this run only: answer.ts and retrieve.ts
 * read ASSISTANT.model at call time, so setting it here reaches both, and the runners' reports
 * name it. usage.ts prices each call by ASSISTANT.model too, so costs follow.
 */
export async function loadPipeline(model?: string) {
    const { ASSISTANT } = await import('../../src/app/lib/assistant/config');
    const { getAnthropic } = await import('../../src/app/lib/assistant/clients');
    const { retrieve } = await import('../../src/app/lib/assistant/retrieve');
    const { streamAnswer } = await import('../../src/app/lib/assistant/answer');
    if (model) (ASSISTANT as { model: string }).model = model;
    return { ASSISTANT, getAnthropic, retrieve, streamAnswer };
}

export type Answered = {
    answer: string;
    /** The sources the answer cited (the chips shown under it on the site), with the chunk id each came from. */
    sources: { id: string; label: string; href: string }[];
    /** The chunks retrieval passed to the answering model, best first. */
    chunks: RetrievedChunk[];
    /** The answer rests on no cited source; the chat then shows "Contact Luis →" and "Message Luis" buttons under it. */
    fallback: boolean;
    answerCostUsd: number;
    answerLatencyMs: number;
};

/**
 * Answers one question. On failure the thrown error carries `partial`: whatever was spent and
 * retrieved before it, so the runner can still count the cost and report it (see partialAnswer).
 */
export async function answerQuestion(pipeline: Pipeline, question: string, history: HistoryTurn[] = []): Promise<Answered> {
    const out: Answered = { answer: '', sources: [], chunks: [], fallback: false, answerCostUsd: 0, answerLatencyMs: 0 };
    const meter = { costUsd: 0, estimateUsd: 0 };
    let rewriteCostUsd = 0;
    const t = performance.now();
    try {
        const retrieval = await pipeline.retrieve(question, history);
        rewriteCostUsd = retrieval.rewriteCostUsd;
        out.chunks = retrieval.chunks;
        for await (const event of pipeline.streamAnswer({ question, history, chunks: retrieval.chunks, meter })) {
            if (event.type === 'done') {
                out.answer = event.text;
                out.sources = event.sources.map(({ id, label, href }) => ({ id, label, href }));
                out.fallback = event.fallback;
            }
        }
        return out;
    } catch (err) {
        throw Object.assign(err instanceof Error ? err : new Error(String(err)), { partial: out });
    } finally {
        out.answerCostUsd = meter.costUsd + rewriteCostUsd;
        out.answerLatencyMs = performance.now() - t;
    }
}

/** What answerQuestion() had when it failed, if the error came from it. */
export const partialAnswer = (err: unknown): Answered | undefined => (err as { partial?: Answered })?.partial;
