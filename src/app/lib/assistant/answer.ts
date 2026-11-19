// Answering: Claude Haiku 5.5 streams an answer grounded in the retrieved chunks, which are
// passed as search-result blocks so Claude's native citations decide the source chips.
// Callable on its own (with any chunks) for evaluation.
import { ASSISTANT } from './config';
import { getAnthropic } from './clients';
import { buildMessages, FALLBACK_ANSWER, systemBlocks, type HistoryTurn } from './prompt';
import type { RetrievedChunk } from './retrieve';
import { costUsd } from './usage';

export type Source = { id: string; label: string; href: string };

export type AnswerEvent =
    | { type: 'text'; text: string }
    /** Claude declined (stop_reason "refusal"): show this text instead of anything streamed so far. */
    | { type: 'replace'; text: string }
    | AnswerDone;

export type AnswerDone = {
    type: 'done';
    text: string;
    /** Chunks Claude actually cited, in first-cited order. */
    sources: Source[];
    /** True when the answer rests on no cited source (don't-know, decline, refusal). */
    fallback: boolean;
    stopReason: string | null;
    costUsd: number;
};

export async function* streamAnswer({
    question,
    history = [],
    chunks,
    signal,
    meter,
}: {
    question: string;
    history?: HistoryTurn[];
    chunks: RetrievedChunk[];
    signal?: AbortSignal;
    /** Updated with the answer's cost so far as usage arrives, so a cut-off answer is still billed. */
    meter?: { costUsd: number };
}): AsyncGenerator<AnswerEvent> {
    const stream = getAnthropic().messages.stream(
        {
            model: ASSISTANT.model,
            max_tokens: ASSISTANT.answerMaxTokens,
            output_config: { effort: ASSISTANT.effort },
            system: systemBlocks(),
            messages: buildMessages(question, history, chunks),
        },
        { signal },
    );

    const cited: number[] = [];
    const cite = (index: number) => {
        if (!cited.includes(index)) cited.push(index);
    };
    let text = '';

    let usage: Parameters<typeof costUsd>[0] | null = null;

    for await (const event of stream) {
        if (event.type === 'message_start') {
            usage = event.message.usage;
            if (meter) meter.costUsd = costUsd(usage);
            continue;
        }
        if (event.type === 'message_delta') {
            if (usage) usage = { ...usage, output_tokens: event.usage.output_tokens };
            if (meter && usage) meter.costUsd = costUsd(usage);
            continue;
        }
        if (event.type !== 'content_block_delta') continue;
        if (event.delta.type === 'text_delta') {
            text += event.delta.text;
            yield { type: 'text', text: event.delta.text };
        } else if (event.delta.type === 'citations_delta' && event.delta.citation.type === 'search_result_location') {
            cite(event.delta.citation.search_result_index);
        }
    }

    const final = await stream.finalMessage();
    for (const block of final.content) {
        if (block.type !== 'text') continue;
        for (const c of block.citations ?? []) if (c.type === 'search_result_location') cite(c.search_result_index);
    }
    const cost = costUsd(final.usage);
    if (meter) meter.costUsd = cost;

    if (final.stop_reason === 'refusal' || !text.trim()) {
        yield { type: 'replace', text: FALLBACK_ANSWER };
        yield { type: 'done', text: FALLBACK_ANSWER, sources: [], fallback: true, stopReason: final.stop_reason, costUsd: cost };
        return;
    }

    const sources: Source[] = [];
    for (const i of cited) {
        const chunk = chunks[i];
        if (chunk && !sources.some((s) => s.label === chunk.label && s.href === chunk.href)) {
            sources.push({ id: chunk.id, label: chunk.label, href: chunk.href });
        }
    }
    yield { type: 'done', text, sources, fallback: sources.length === 0, stopReason: final.stop_reason, costUsd: cost };
}
