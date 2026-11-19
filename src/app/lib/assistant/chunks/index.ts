import { githubChunks } from './github';
import { linkedinChunks } from './linkedin';
import { resumeChunks } from './resume';
import { siteChunks } from './site';
import type { Chunk } from './types';

export type { Chunk, SourceType } from './types';

/**
 * Builds the whole retrieval corpus. Ids are stable (derived from the record, not the order),
 * and a repeated id gets a numeric suffix so every chunk stays addressable.
 */
export async function buildCorpus({ github = true }: { github?: boolean } = {}): Promise<Chunk[]> {
    const parts: Chunk[][] = [siteChunks(), await resumeChunks(), linkedinChunks()];
    if (github) {
        try {
            parts.push(await githubChunks());
        } catch (err) {
            // GitHub being down shouldn't stop the rest of the corpus from refreshing.
            console.warn('[assistant] GitHub source skipped:', (err as Error).message);
        }
    }
    const seen = new Map<string, number>();
    return parts.flat().map((chunk) => {
        const n = (seen.get(chunk.id) ?? 0) + 1;
        seen.set(chunk.id, n);
        return n === 1 ? chunk : { ...chunk, id: `${chunk.id}~${n}` };
    });
}
