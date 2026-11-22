// Retrieval: (rewrite follow-ups) → hybrid dense + BM25 search → light source-priority boost →
// Voyage rerank → relevance cutoff. Callable on its own so an evaluation can score retrieval
// separately from answering.
import type Anthropic from '@anthropic-ai/sdk';
import { FusionAlgorithm, WeightingStrategy } from '@upstash/vector';
import { ASSISTANT } from './config';
import { indexText } from './chunks/types';
import { getAnthropic, getVectorIndex } from './clients';
import type { HistoryTurn } from './prompt';
import { trimHistory } from './prompt';
import { querySparseVector } from './sparse';
import { costUsd } from './usage';
import { embed, rerank } from './voyage';

export type RetrievedChunk = {
    id: string;
    sourceType: string;
    label: string;
    href: string;
    header: string;
    text: string;
    /** Contextual-retrieval context (search only: used to rerank, never shown to Claude). */
    context?: string;
    priority: number;
    /** Hybrid (RRF) score, after the source-priority boost. */
    searchScore: number;
    /** rerank-2.5 relevance score (0-1), when reranked. */
    rerankScore?: number;
};

export type RetrievalResult = {
    /** The query actually searched (the rewritten standalone question for follow-ups). */
    query: string;
    /** Hybrid-search shortlist, best first. */
    shortlist: RetrievedChunk[];
    /** What reaches Claude: top reranked chunks that cleared the cutoff. */
    chunks: RetrievedChunk[];
    /** Anthropic spend of the rewrite call, in USD (0 when no rewrite was needed). */
    rewriteCostUsd: number;
};

/**
 * Nudges higher-priority sources without hard filtering: applied to RRF scores (~1/60 per list)
 * to pick the shortlist, and to rerank scores so priority breaks near-ties.
 */
const PRIORITY_BOOST: Record<number, number> = { 1: 1.06, 2: 1.04, 3: 1.02, 4: 1 };

const REWRITE_SYSTEM = `You turn a visitor's latest message in a chat about Luis Villalón (a software engineer) into one standalone search query.
Resolve pronouns and references using the earlier turns ("it", "that project", "he") so the query makes sense on its own.
Reply with only the query text: no quotes, no explanation. If the message is already standalone, repeat it unchanged.`;

/** Rewrites a follow-up into a standalone query. Only called when earlier turns exist. */
export async function rewriteQuery(question: string, history: HistoryTurn[]): Promise<{ query: string; costUsd: number }> {
    const turns = trimHistory(history);
    if (turns.length === 0) return { query: question, costUsd: 0 };
    const transcript = turns.map((t) => `${t.role === 'user' ? 'Visitor' : 'Assistant'}: ${t.text}`).join('\n');
    const res = await getAnthropic().messages.create({
        model: ASSISTANT.model,
        max_tokens: ASSISTANT.rewriteMaxTokens,
        output_config: { effort: 'low' },
        system: REWRITE_SYSTEM,
        messages: [{ role: 'user', content: `Earlier turns:\n${transcript}\n\nLatest message: ${question}` }],
    });
    const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join(' ')
        .trim();
    const query = res.stop_reason === 'refusal' || !text ? question : text.slice(0, ASSISTANT.maxQuestionChars * 2);
    return { query, costUsd: costUsd(res.usage) };
}

const boost = (priority: number) => PRIORITY_BOOST[priority] ?? 1;

/**
 * Hybrid search over the index: Voyage query embedding + BM25 query terms, fused with RRF.
 * Fetches extra candidates so the source-priority boost decides which `topK` make the shortlist.
 */
export async function hybridSearch(query: string, topK = ASSISTANT.shortlistSize): Promise<RetrievedChunk[]> {
    const [vector] = await embed([query], 'query');
    const sparse = querySparseVector(query);
    const index = getVectorIndex();
    const results = await index.query({
        vector,
        ...(sparse.indices.length ? { sparseVector: sparse, weightingStrategy: WeightingStrategy.IDF } : {}),
        fusionAlgorithm: FusionAlgorithm.RRF,
        topK: topK * ASSISTANT.candidateMultiplier,
        includeMetadata: true,
    });
    return results
        .filter((r) => r.metadata)
        .map((r) => {
            const m = r.metadata!;
            return {
                id: String(r.id),
                sourceType: m.sourceType,
                label: m.label,
                href: m.href,
                header: m.header,
                text: m.text,
                ...(m.context ? { context: m.context } : {}),
                priority: m.priority,
                searchScore: r.score * boost(m.priority),
            };
        })
        .sort((a, b) => b.searchScore - a.searchScore)
        .slice(0, topK);
}

export async function retrieve(question: string, history: HistoryTurn[] = []): Promise<RetrievalResult> {
    const { query, costUsd: rewriteCostUsd } = await rewriteQuery(question, history);
    const shortlist = await hybridSearch(query);
    // The reranker sees the same text that was embedded (header, context, body), so contextual
    // retrieval helps this step too; Claude later gets only header + body.
    const ranked = await rerank(
        query,
        shortlist.map((c) => indexText(c)),
        shortlist.length,
    );
    const chunks = ranked
        .filter((r) => r.score >= ASSISTANT.rerankMinScore)
        .map((r) => ({ ...shortlist[r.index], rerankScore: r.score }))
        .sort((a, b) => b.rerankScore * boost(b.priority) - a.rerankScore * boost(a.priority))
        .slice(0, ASSISTANT.rerankTopK);
    return { query, shortlist, chunks, rewriteCostUsd };
}
