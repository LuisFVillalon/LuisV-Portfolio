// Voyage AI embeddings and reranking over its REST API.
import { ASSISTANT } from './config';

const API = process.env.VOYAGE_BASE_URL ?? 'https://api.voyageai.com/v1';
/** Voyage accepts up to 1,000 inputs per embeddings request; stay well under the token cap too. */
const EMBED_BATCH = 64;

async function post<T>(pathName: string, body: unknown): Promise<T> {
    const key = process.env.VOYAGE_API_KEY;
    if (!key) throw new Error('VOYAGE_API_KEY is not set');
    const res = await fetch(`${API}/${pathName}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Voyage ${pathName} failed: ${res.status} ${await res.text().catch(() => '')}`);
    return (await res.json()) as T;
}

/** Embeds texts with input_type "document" (indexing) or "query" (visitor questions). */
export async function embed(texts: string[], inputType: 'document' | 'query'): Promise<number[][]> {
    const out: number[][] = [];
    for (let i = 0; i < texts.length; i += EMBED_BATCH) {
        const batch = texts.slice(i, i + EMBED_BATCH);
        const res = await post<{ data: { index: number; embedding: number[] }[] }>('embeddings', {
            input: batch,
            model: ASSISTANT.embeddingModel,
            input_type: inputType,
            output_dimension: ASSISTANT.embeddingDimension,
        });
        const ordered = [...res.data].sort((a, b) => a.index - b.index).map((d) => d.embedding);
        out.push(...ordered);
    }
    return out;
}

export type RerankResult = { index: number; score: number };

/** Re-scores `documents` against `query`; results come back highest relevance first. */
export async function rerank(query: string, documents: string[], topK: number): Promise<RerankResult[]> {
    if (documents.length === 0) return [];
    const res = await post<{ data?: { index: number; relevance_score: number }[]; results?: { index: number; relevance_score: number }[] }>(
        'rerank',
        { query, documents, model: ASSISTANT.rerankModel, top_k: Math.min(topK, documents.length), truncation: true },
    );
    return (res.data ?? res.results ?? [])
        .map((r) => ({ index: r.index, score: r.relevance_score }))
        .sort((a, b) => b.score - a.score);
}
