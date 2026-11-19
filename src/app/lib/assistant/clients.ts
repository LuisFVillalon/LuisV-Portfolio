import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';
import { redisEnv, vectorEnv } from './config';
import type { Chunk } from './chunks';

/** Metadata stored with each vector: everything Claude and the source chips need. */
export type ChunkMetadata = Omit<Chunk, 'id'> & { avgDocLength: number };

let anthropic: Anthropic | null = null;
let redis: Redis | null = null;
let index: Index<ChunkMetadata> | null = null;

export function getAnthropic(): Anthropic {
    anthropic ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 60_000 });
    return anthropic;
}

/** Upstash Redis (counters, monthly spend, saved conversations), or null when not configured. */
export function getRedis(): Redis | null {
    const env = redisEnv();
    if (!env) return null;
    redis ??= new Redis({ url: env.url, token: env.token });
    return redis;
}

export function getVectorIndex(): Index<ChunkMetadata> {
    const env = vectorEnv();
    if (!env) throw new Error('UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN are not set');
    index ??= new Index<ChunkMetadata>({ url: env.url, token: env.token });
    return index;
}
