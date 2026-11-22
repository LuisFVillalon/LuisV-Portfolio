// Settings and environment checks for "Luis's Personal AI Assistant" (the Ask AI chat).
// Keep this file free of SDK imports: the root layout imports it to decide whether to show
// the chat entry points at all.

export const ASSISTANT = {
    name: "Luis's Personal AI Assistant",
    /** Claude model that answers visitors (and rewrites follow-up questions). */
    model: 'claude-sonnet-5-5' as AnswerModel,
    /** Chat answers do fine at low effort and cost less. */
    effort: 'low' as const,
    answerMaxTokens: 2048,
    rewriteMaxTokens: 512,

    /** Per device (the device cookie; IP + user agent without it), per UTC day. */
    dailyQuestionLimit: 8,
    /**
     * Ceiling per IP address per day, across every device behind it: 5 devices' worth, so a shared
     * campus or office network isn't capped at a couple of people, while clearing the device
     * cookie over and over still can't go past it.
     */
    dailyIpQuestionLimit: 40,
    /** Site-wide burst limit across all visitors. */
    questionsPerMinute: 15,
    maxQuestionChars: 500,
    /** Hard monthly cap on Anthropic spend; the assistant turns itself off when reached. */
    monthlyBudgetUsd: 5,

    /** How many earlier turns are sent with a question, and how long each may be. */
    historyTurns: 6,
    historyTurnChars: 1200,

    /** Hybrid search shortlist size, then how many reranked chunks reach Claude. */
    shortlistSize: 20,
    /** Hybrid search fetches shortlistSize × this, so the source-priority boost can reorder the cut. */
    candidateMultiplier: 2,
    rerankTopK: 5,
    /** Chunks scoring below this rerank-2.5 relevance score are dropped. */
    rerankMinScore: Number(process.env.ASSISTANT_RERANK_MIN_SCORE ?? 0.3),

    embeddingModel: process.env.VOYAGE_EMBED_MODEL ?? 'voyage-4',
    /** Must equal the Upstash Vector index dimension. */
    embeddingDimension: Number(process.env.VOYAGE_EMBED_DIMENSION ?? 1024),
    rerankModel: process.env.VOYAGE_RERANK_MODEL ?? 'rerank-2.5',

    /**
     * Contextual retrieval: at indexing time, Claude writes a short context for each chunk from
     * its source document; it is embedded, BM25-indexed and reranked with the chunk (never shown
     * to the answering model). Regenerated only when the chunk or its document changes.
     */
    contextualRetrieval: true,
    /** Indexing-time only, so the cheap model is plenty; must be in MODEL_PRICES. */
    contextModel: 'claude-haiku-5-5' as AnswerModel,
    contextMaxTokens: 200,
    /** Source documents contextualized at once (chunks of one document go in order, to reuse its prompt cache). */
    contextConcurrency: 4,

    conversationTtlDays: 90,
    leadsPerHour: 5,
} as const;

/**
 * Prices in USD per million tokens for each model the assistant may answer with. The monthly
 * budget guard (usage.ts) prices every call by the model it ran on, so ASSISTANT.model must be
 * one of these.
 */
export const MODEL_PRICES = {
    /** Claude Haiku 5.5 (prompts up to 100K tokens). */
    'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheWrite5m: 0.125, cacheRead: 0.01 },
    /** Claude Sonnet 5.5. */
    'claude-sonnet-5-5': { input: 2, output: 10, cacheWrite5m: 2.5, cacheRead: 0.1 },
} as const;

export type AnswerModel = keyof typeof MODEL_PRICES;

export function redisEnv(): { url: string; token: string } | null {
    const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    return url && token ? { url, token } : null;
}

export function vectorEnv(): { url: string; token: string } | null {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
    return url && token ? { url, token } : null;
}

/** Everything the indexing job needs: Voyage for embeddings and the vector index. */
export function isIndexingConfigured(): boolean {
    return Boolean(process.env.VOYAGE_API_KEY && vectorEnv());
}

/**
 * Everything answering needs. When this is false the chat entry points stay hidden and the
 * assistant API routes answer 503, so the site works without any of these keys.
 */
export function isAssistantConfigured(): boolean {
    if (process.env.ASSISTANT_DISABLED === '1') return false;
    return Boolean(process.env.ANTHROPIC_API_KEY && isIndexingConfigured() && redisEnv());
}
