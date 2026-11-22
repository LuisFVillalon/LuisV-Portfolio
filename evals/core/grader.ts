// What every criterion's grader shares: the grading model, its price, the request shape
// (structured JSON output) and the first checks on what comes back. Each criterion's own
// grader.ts holds its prompt, schema and verdict rules.
import type Anthropic from '@anthropic-ai/sdk';

/**
 * The same model family that answers since the switch to Sonnet 5.5, graded at a higher effort
 * (medium vs the answer's low). A grader no stronger than the answerer may give it more benefit
 * of the doubt; a stronger grader would remove that.
 */
export const GRADER_MODEL = 'claude-sonnet-5-5';
/** Grading is a short judgment call; medium keeps every full run around $1 or less. */
export const GRADER_EFFORT = 'medium' as const;
/** Claude Sonnet 5.5 prices in USD per million tokens. */
export const GRADER_PRICES = { input: 2, output: 10, cacheWrite5m: 2.5, cacheRead: 0.1 } as const;

/** A grader request: the system prompt, the user message and the JSON schema the answer must follow. */
export function jsonRequest(o: { system: string; user: string; schema: object; maxTokens: number }): Anthropic.MessageCreateParamsNonStreaming {
    return {
        model: GRADER_MODEL,
        max_tokens: o.maxTokens,
        output_config: { effort: GRADER_EFFORT, format: { type: 'json_schema', schema: o.schema as Record<string, unknown> } },
        system: o.system,
        messages: [{ role: 'user', content: o.user }],
    };
}

/** Cost in USD of one grader call. */
export function graderCostUsd(usage: Pick<Anthropic.Usage, 'input_tokens' | 'output_tokens' | 'cache_creation_input_tokens' | 'cache_read_input_tokens'>): number {
    return (
        (usage.input_tokens * GRADER_PRICES.input +
            usage.output_tokens * GRADER_PRICES.output +
            (usage.cache_creation_input_tokens ?? 0) * GRADER_PRICES.cacheWrite5m +
            (usage.cache_read_input_tokens ?? 0) * GRADER_PRICES.cacheRead) /
        1_000_000
    );
}

/** The grader's output as a JSON object; throws when it isn't one. */
export function parseJsonObject(text: string): Record<string, unknown> {
    let raw: unknown;
    try {
        raw = JSON.parse(text);
    } catch {
        throw new Error(`Grader output is not JSON: ${text.slice(0, 200)}`);
    }
    if (!raw || typeof raw !== 'object') throw new Error('Grader output is not an object');
    return raw as Record<string, unknown>;
}

/** A string field of the grader's output, or '' when it's absent. */
export const text = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Escapes a value for an XML-style attribute in a grader prompt. */
export const escapeAttr = (s: string) => s.replace(/"/g, '&quot;').replace(/\n/g, ' ');

/** Earlier turns as context, then the last visitor message and the answer being graded. */
export function conversationMessage(turns: { question: string; answer: string }[]): string[] {
    const earlier = turns.slice(0, -1);
    const last = turns[turns.length - 1];
    return [
        ...(earlier.length ? ['Earlier in the conversation:', ...earlier.flatMap((t) => [`<visitor>${t.question}</visitor>`, `<assistant>${t.answer}</assistant>`]), ''] : []),
        `Visitor's message: ${last.question}`,
        '',
        '<answer>',
        last.answer,
        '</answer>',
    ];
}
