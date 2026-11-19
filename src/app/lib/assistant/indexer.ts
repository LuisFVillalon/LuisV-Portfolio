// Keeps the Upstash Vector hybrid index in step with the corpus. Runs at build time
// (scripts/assistant-index.ts) and daily (/api/assistant/reindex).
//
// Only chunks whose content hash changed are re-embedded with Voyage. Unchanged chunks keep
// their stored dense vector; their BM25 sparse vector is rewritten only when the corpus's
// average chunk length moved (BM25 length normalization depends on it).
import { buildCorpus, type Chunk, type Corpus } from './chunks';
import { indexText } from './chunks/types';
import type { RangeResult } from '@upstash/vector';
import { getVectorIndex, type ChunkMetadata } from './clients';
import { documentLength, documentSparseVector } from './sparse';
import { embed } from './voyage';

export type SyncReport = {
    chunks: number;
    embedded: number;
    resparsed: number;
    unchanged: number;
    deleted: number;
    avgDocLength: number;
};

type Stored = { hash: string; avgDocLength: number; vector?: number[] };

async function readStored(): Promise<Map<string, Stored>> {
    const index = getVectorIndex();
    const stored = new Map<string, Stored>();
    let cursor: string | number = 0;
    do {
        const page: RangeResult<ChunkMetadata> = await index.range({ cursor, limit: 500, includeMetadata: true, includeVectors: true });
        for (const v of page.vectors) {
            if (v.metadata) stored.set(String(v.id), { hash: v.metadata.hash, avgDocLength: v.metadata.avgDocLength, vector: v.vector });
        }
        cursor = page.nextCursor;
    } while (cursor && cursor !== '0');
    return stored;
}

const toMetadata = (chunk: Chunk, avgDocLength: number): ChunkMetadata => {
    const { id: _id, ...rest } = chunk;
    void _id;
    return { ...rest, avgDocLength };
};

export async function syncIndex(input?: Corpus): Promise<SyncReport> {
    const { chunks: corpus, keep } = input ?? (await buildCorpus());
    if (corpus.length === 0) throw new Error('Corpus is empty; refusing to wipe the index');

    const lengths = corpus.map((c) => documentLength(indexText(c)));
    // Rounded so tiny content edits don't force a full sparse rewrite.
    const avgDocLength = Math.round(lengths.reduce((a, b) => a + b, 0) / corpus.length);
    const stored = await readStored();

    const changed = corpus.filter((c) => stored.get(c.id)?.hash !== c.hash);
    const unchanged = corpus.filter((c) => stored.get(c.id)?.hash === c.hash);
    const needsResparse = unchanged.filter((c) => {
        const s = stored.get(c.id)!;
        return s.avgDocLength !== avgDocLength && s.vector?.length;
    });

    const index = getVectorIndex();
    const vectors = changed.length ? await embed(changed.map(indexText), 'document') : [];
    const upserts = [
        ...changed.map((c, i) => ({
            id: c.id,
            vector: vectors[i],
            sparseVector: documentSparseVector(indexText(c), avgDocLength),
            metadata: toMetadata(c, avgDocLength),
        })),
        ...needsResparse.map((c) => ({
            id: c.id,
            vector: stored.get(c.id)!.vector!,
            sparseVector: documentSparseVector(indexText(c), avgDocLength),
            metadata: toMetadata(c, avgDocLength),
        })),
    ];
    for (let i = 0; i < upserts.length; i += 100) await index.upsert(upserts.slice(i, i + 100));

    // Delete chunks that no longer exist, but only for sources that produced chunks this run and
    // not for kept prefixes: a GitHub outage, one repo failing, or a missing private file must not
    // wipe that content from the index.
    const live = new Set(corpus.map((c) => c.id));
    const sourcesThisRun = new Set(corpus.map((c) => c.id.split(':')[0]));
    const kept = (id: string) => keep.some((p) => id === p || id.startsWith(`${p}#`) || id.startsWith(`${p}~`));
    const stale = [...stored.keys()].filter((id) => !live.has(id) && sourcesThisRun.has(id.split(':')[0]) && !kept(id));
    if (stale.length) await index.delete(stale);

    return {
        chunks: corpus.length,
        embedded: changed.length,
        resparsed: needsResparse.length,
        unchanged: unchanged.length - needsResparse.length,
        deleted: stale.length,
        avgDocLength,
    };
}
