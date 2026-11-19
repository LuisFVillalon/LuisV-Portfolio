// Monthly Anthropic spend (the $5 budget guard) and per-visitor daily question counts, both in
// Upstash Redis. Neither key holds anything about who the visitor is beyond a salted hash.
import { createHash } from 'crypto';
import type Anthropic from '@anthropic-ai/sdk';
import { ASSISTANT, HAIKU_PRICES } from './config';
import { getRedis } from './clients';

const DAY_SECONDS = 60 * 60 * 24;

const monthKey = (d = new Date()) => `assistant:spend:${d.toISOString().slice(0, 7)}`;
const dayKey = (visitor: string, d = new Date()) => `assistant:q:${d.toISOString().slice(0, 10)}:${visitor}`;

/** Cost in USD of one Claude Haiku 5.5 call. */
export function costUsd(usage: Pick<Anthropic.Usage, 'input_tokens' | 'output_tokens' | 'cache_creation_input_tokens' | 'cache_read_input_tokens'>): number {
    const m = 1_000_000;
    return (
        (usage.input_tokens * HAIKU_PRICES.input +
            usage.output_tokens * HAIKU_PRICES.output +
            (usage.cache_creation_input_tokens ?? 0) * HAIKU_PRICES.cacheWrite5m +
            (usage.cache_read_input_tokens ?? 0) * HAIKU_PRICES.cacheRead) /
        m
    );
}

/** Spend so far this calendar month (UTC), in USD. Stored as integer micro-dollars. */
export async function monthSpendUsd(): Promise<number> {
    const redis = getRedis();
    if (!redis) return 0;
    const micro = Number((await redis.get<number>(monthKey())) ?? 0);
    return micro / 1_000_000;
}

export async function recordSpend(usd: number): Promise<void> {
    const redis = getRedis();
    if (!redis || usd <= 0) return;
    const key = monthKey();
    await redis.incrby(key, Math.ceil(usd * 1_000_000));
    await redis.expire(key, 40 * DAY_SECONDS);
}

export async function isOverBudget(): Promise<boolean> {
    return (await monthSpendUsd()) >= ASSISTANT.monthlyBudgetUsd;
}

/** Visitor key: salted hash of IP + user agent, so the raw IP is never stored. */
export function visitorId(req: Request): string {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
    const ua = req.headers.get('user-agent') ?? '';
    const salt = process.env.ASSISTANT_HASH_SALT ?? process.env.CRON_SECRET ?? 'luisv-portfolio';
    return createHash('sha256').update(`${salt}|${ip}|${ua}`).digest('hex').slice(0, 24);
}

export async function questionsUsed(visitor: string): Promise<number> {
    const redis = getRedis();
    if (!redis) return 0;
    return Number((await redis.get<number>(dayKey(visitor))) ?? 0);
}

/** Spends one question. Returns the remaining count, or null when the daily limit is already used. */
export async function spendQuestion(visitor: string): Promise<number | null> {
    const redis = getRedis();
    if (!redis) return null;
    const key = dayKey(visitor);
    const used = await redis.incr(key);
    if (used === 1) await redis.expire(key, 2 * DAY_SECONDS);
    if (used > ASSISTANT.dailyQuestionLimit) {
        await redis.decr(key);
        return null;
    }
    return ASSISTANT.dailyQuestionLimit - used;
}

/** Gives a question back after a failed answer, so errors never count toward the limit. */
export async function refundQuestion(visitor: string): Promise<number> {
    const redis = getRedis();
    if (!redis) return ASSISTANT.dailyQuestionLimit;
    const key = dayKey(visitor);
    const used = await redis.decr(key);
    if (used < 0) await redis.del(key); // the day rolled over mid-answer
    return ASSISTANT.dailyQuestionLimit - Math.max(0, used);
}

/** Simple fixed-window limiter (e.g. chat leads sent through /api/contact). */
export async function underRateLimit(name: string, id: string, max: number, windowSeconds: number): Promise<boolean> {
    const redis = getRedis();
    if (!redis) return true;
    const key = `ratelimit:${name}:${id}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, windowSeconds);
    return n <= max;
}
