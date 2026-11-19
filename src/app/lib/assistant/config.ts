// Settings and environment checks for "Luis's Personal AI Assistant" (the Ask AI chat).
// Keep this file free of SDK imports: the root layout imports it to decide whether to show
// the chat entry points at all.

export const ASSISTANT = {
    name: "Luis's Personal AI Assistant",
    /** Claude model that answers visitors (and rewrites follow-up questions). */
    model: 'claude-haiku-5-5',
    /** Haiku 5.5 defaults to medium; chat answers do fine at low and cost less. */
    effort: 'low' as const,
    answerMaxTokens: 2048,
    rewriteMaxTokens: 512,

    dailyQuestionLimit: 15,
    /** Ceiling per IP address per day, across every browser behind it. */
    dailyIpQuestionLimit: 45,
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

    conversationTtlDays: 90,
    leadsPerHour: 5,
} as const;

/** Claude Haiku 5.5 prices in USD per million tokens (prompts up to 100K tokens). */
export const HAIKU_PRICES = {
    input: 0.1,
    output: 0.5,
    cacheWrite5m: 0.125,
    cacheRead: 0.01,
} as const;

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
