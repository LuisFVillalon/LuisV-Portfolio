// Monthly Anthropic spend (the $5 budget guard) and the question limits (per visitor, i.e. per
// device, and per IP per day, plus a site-wide per-minute burst limit), all in Upstash Redis. No
// key holds anything about who the visitor is beyond a salted hash.
import { createHash, randomUUID } from 'crypto';
import type Anthropic from '@anthropic-ai/sdk';
import type { Redis } from '@upstash/redis';
import { ASSISTANT, MODEL_PRICES } from './config';
import { getRedis } from './clients';

const DAY_SECONDS = 60 * 60 * 24;

const monthKey = (d = new Date()) => `assistant:spend:${d.toISOString().slice(0, 7)}`;
const dayKey = (visitor: string, d = new Date()) => `assistant:q:${d.toISOString().slice(0, 10)}:${visitor}`;
const ipDayKey = (ip: string, d = new Date()) => `assistant:qip:${d.toISOString().slice(0, 10)}:${ip}`;
const burstKey = (d = new Date()) => `assistant:burst:${d.toISOString().slice(0, 16)}`;

/** Cost in USD of one call, on the answering model (ASSISTANT.model, read at call time) unless another is named. */
export function costUsd(
    usage: Pick<Anthropic.Usage, 'input_tokens' | 'output_tokens' | 'cache_creation_input_tokens' | 'cache_read_input_tokens'>,
    model: string = ASSISTANT.model,
): number {
    const prices = MODEL_PRICES[model as keyof typeof MODEL_PRICES];
    if (!prices) throw new Error(`No prices for ${model}; add it to MODEL_PRICES so the budget guard stays accurate`);
    const m = 1_000_000;
    return (
        (usage.input_tokens * prices.input +
            usage.output_tokens * prices.output +
            (usage.cache_creation_input_tokens ?? 0) * prices.cacheWrite5m +
            (usage.cache_read_input_tokens ?? 0) * prices.cacheRead) /
        m
    );
}

/** Rough input cost of a prompt (~3 characters per token, on the high side), for calls cut off before usage arrives. */
export const estimateInputCostUsd = (prompt: string) => costUsd({ input_tokens: Math.ceil(prompt.length / 3), output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 });

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

const clientIp = (req: Request) =>
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';

const saltedHash = (value: string) => {
    const salt = process.env.ASSISTANT_HASH_SALT ?? process.env.CRON_SECRET ?? 'luisv-portfolio';
    return createHash('sha256').update(`${salt}|${value}`).digest('hex').slice(0, 24);
};

/**
 * Device cookie: a random id the status route sets the first time the chat opens (httpOnly, sent
 * only to /api/assistant), so each device gets its own daily allowance, even two identical
 * browsers on one campus network. It is used only for the limits and is stored only hashed.
 * Clearing it gives a fresh allowance, which is why the per-IP ceiling stays as the backstop.
 */
export const DEVICE_COOKIE = 'assistant_device';
const DEVICE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** The request's device id, or null when it has none (or a malformed one). */
export function deviceIdOf(req: Request): string | null {
    for (const part of (req.headers.get('cookie') ?? '').split(';')) {
        const [name, ...rest] = part.trim().split('=');
        if (name === DEVICE_COOKIE) {
            const value = rest.join('=');
            return DEVICE_ID.test(value) ? value : null;
        }
    }
    return null;
}

export const newDeviceId = (): string => randomUUID();

/** The Set-Cookie value for a new device id (a year; Secure outside local development). */
export function deviceCookie(id: string): string {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return `${DEVICE_COOKIE}=${id}; Path=/api/assistant; Max-Age=${365 * DAY_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

/**
 * Visitor key, never the raw value: a salted hash of the device id, or, for a request without the
 * cookie (cookies blocked, or a first question racing the status call), of IP + user agent.
 * The chat route never sets the cookie itself, so blocking cookies can't mint a fresh allowance
 * per question. `device` overrides the cookie (the status route passes the id it just set).
 */
export function visitorId(req: Request, device: string | null = deviceIdOf(req)): string {
    if (device) return saltedHash(`device|${device}`);
    return saltedHash(`${clientIp(req)}|${req.headers.get('user-agent') ?? ''}`);
}

/** Network key: salted hash of the IP alone, for limits a changed user agent must not reset. */
export function ipId(req: Request): string {
    return saltedHash(clientIp(req));
}

/** Who is asking: the per-visitor allowance and the per-IP ceiling are both charged. */
export type Asker = { visitor: string; ip: string };

/** The Redis commands the limits use, so tests can pass an in-memory stand-in. */
export type CounterStore = Pick<Redis, 'get' | 'incr' | 'decr' | 'expire' | 'del'>;

export type SpendResult = { ok: true; remaining: number } | { ok: false; reason: 'limit' | 'busy' };

/** Counts one use under `key`; returns the new count, or null (and undoes it) when over `max`. */
async function take(redis: CounterStore, key: string, max: number, ttlSeconds: number): Promise<number | null> {
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, ttlSeconds);
    if (n > max) {
        await redis.decr(key);
        return null;
    }
    return n;
}

const remainingOf = (visitorUsed: number, ipUsed: number) =>
    Math.max(0, Math.min(ASSISTANT.dailyQuestionLimit - visitorUsed, ASSISTANT.dailyIpQuestionLimit - ipUsed));

/** Questions this visitor can still ask today (the smaller of its own and its IP's allowance). */
export async function questionsRemaining(asker: Asker, redis: CounterStore | null = getRedis()): Promise<number> {
    if (!redis) return ASSISTANT.dailyQuestionLimit;
    const [v, i] = await Promise.all([redis.get<number>(dayKey(asker.visitor)), redis.get<number>(ipDayKey(asker.ip))]);
    return remainingOf(Number(v ?? 0), Number(i ?? 0));
}

/**
 * Spends one question against the visitor's daily allowance, the IP's daily ceiling and the
 * site-wide per-minute burst limit. Nothing is charged when any of them is already used up.
 */
export async function spendQuestion(asker: Asker, redis: CounterStore | null = getRedis()): Promise<SpendResult> {
    if (!redis) return { ok: false, reason: 'limit' };
    const now = new Date();
    const vKey = dayKey(asker.visitor, now);
    const iKey = ipDayKey(asker.ip, now);
    const visitorUsed = await take(redis, vKey, ASSISTANT.dailyQuestionLimit, 2 * DAY_SECONDS);
    if (visitorUsed === null) return { ok: false, reason: 'limit' };
    const ipUsed = await take(redis, iKey, ASSISTANT.dailyIpQuestionLimit, 2 * DAY_SECONDS);
    if (ipUsed === null) {
        await redis.decr(vKey);
        return { ok: false, reason: 'limit' };
    }
    if ((await take(redis, burstKey(now), ASSISTANT.questionsPerMinute, 2 * 60)) === null) {
        await redis.decr(vKey);
        await redis.decr(iKey);
        return { ok: false, reason: 'busy' };
    }
    return { ok: true, remaining: remainingOf(visitorUsed, ipUsed) };
}

/** Gives a question back to the visitor and its IP after a failed answer, so errors never count. */
export async function refundQuestion(asker: Asker, redis: CounterStore | null = getRedis()): Promise<number> {
    if (!redis) return ASSISTANT.dailyQuestionLimit;
    const giveBack = async (key: string) => {
        const used = await redis.decr(key);
        if (used < 0) await redis.del(key); // the day rolled over mid-answer
        return Math.max(0, used);
    };
    const visitorUsed = await giveBack(dayKey(asker.visitor));
    const ipUsed = await giveBack(ipDayKey(asker.ip));
    return remainingOf(visitorUsed, ipUsed);
}

/** Simple fixed-window limiter (e.g. chat leads sent through /api/contact). */
export async function underRateLimit(
    name: string,
    id: string,
    max: number,
    windowSeconds: number,
    redis: CounterStore | null = getRedis(),
): Promise<boolean> {
    if (!redis) return true;
    const key = `ratelimit:${name}:${id}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
    return (await take(redis, key, max, windowSeconds)) !== null;
}
