// Saved conversations: on by default (visitors see a notice and can opt out), kept 90 days,
// and emailed to Luis in a weekly digest. Opted-out chats are never written, and opting out
// mid-chat deletes what was saved so far. No IP, user agent or visitor id is stored here.
import { ASSISTANT } from './config';
import { getRedis } from './clients';

export type SavedTurn = { q: string; a: string; sources: string[]; at: string; fallback?: boolean };
export type SavedConversation = { id: string; page: string; startedAt: string; updatedAt: string; turns: SavedTurn[] };

const TTL_SECONDS = ASSISTANT.conversationTtlDays * 24 * 60 * 60;
/** Sorted set of conversation ids, scored by last update (ms); the digest reads it. */
export const INDEX_KEY = 'assistant:chats';
export const chatKey = (id: string) => `assistant:chat:${id}`;

export const isConversationId = (id: unknown): id is string =>
    typeof id === 'string' && /^[a-zA-Z0-9-]{8,64}$/.test(id);

export async function appendTurn(id: string, page: string, turn: SavedTurn): Promise<void> {
    const redis = getRedis();
    if (!redis) return;
    const now = new Date().toISOString();
    const existing = await redis.get<SavedConversation>(chatKey(id));
    const convo: SavedConversation = existing ?? { id, page, startedAt: now, updatedAt: now, turns: [] };
    convo.turns.push(turn);
    convo.updatedAt = now;
    await redis.set(chatKey(id), convo, { ex: TTL_SECONDS });
    await redis.zadd(INDEX_KEY, { score: Date.now(), member: id });
}

export async function deleteConversation(id: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;
    await redis.del(chatKey(id));
    await redis.zrem(INDEX_KEY, id);
}

/** Conversations updated since `sinceMs`, oldest first. Also prunes index entries past retention. */
export async function conversationsSince(sinceMs: number): Promise<SavedConversation[]> {
    const redis = getRedis();
    if (!redis) return [];
    await redis.zremrangebyscore(INDEX_KEY, 0, Date.now() - TTL_SECONDS * 1000);
    const ids = await redis.zrange<string[]>(INDEX_KEY, sinceMs, '+inf', { byScore: true });
    if (ids.length === 0) return [];
    const convos = await redis.mget<(SavedConversation | null)[]>(...ids.map(chatKey));
    return convos.filter((c): c is SavedConversation => c !== null);
}
