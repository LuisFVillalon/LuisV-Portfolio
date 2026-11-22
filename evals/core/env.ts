// Environment for local eval runs. Next.js loads .env.local for the app, but not for tsx
// scripts, so the evals load it themselves.
import fs from 'fs';
import path from 'path';

/** Upstash Redis holds live site state (saved chats, question counters, monthly spend). */
export const REDIS_ENV_VARS = ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN'] as const;

/** What answering a question needs: Claude, Voyage and the vector index. */
export const REQUIRED_ENV_VARS = ['ANTHROPIC_API_KEY', 'VOYAGE_API_KEY', 'UPSTASH_VECTOR_REST_URL', 'UPSTASH_VECTOR_REST_TOKEN'] as const;

/**
 * Loads `.env.local` (variables already set in the shell win), then removes the Redis variables
 * so nothing in this process can reach the live site's Redis: `getRedis()` returns null without
 * them. The eval calls only retrieve() and streamAnswer(), which never use Redis; this makes
 * that guarantee hold even if they change.
 */
export function loadEvalEnv(env: Record<string, string | undefined> = process.env, file = path.join(process.cwd(), '.env.local')): string[] {
    if (fs.existsSync(file)) process.loadEnvFile(file);
    for (const name of REDIS_ENV_VARS) delete env[name];
    return REQUIRED_ENV_VARS.filter((name) => !env[name]);
}
