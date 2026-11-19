import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, mock, test } from 'node:test';
import { ASSISTANT } from './config';
import { ipId, questionsRemaining, refundQuestion, spendQuestion, underRateLimit, visitorId, type CounterStore } from './usage';

/** In-memory stand-in for the Upstash Redis commands the limits use. */
function memoryStore(): CounterStore {
    const data = new Map<string, number>();
    const store = {
        get: async (key: string) => (data.has(key) ? data.get(key)! : null),
        incr: async (key: string) => {
            const n = (data.get(key) ?? 0) + 1;
            data.set(key, n);
            return n;
        },
        decr: async (key: string) => {
            const n = (data.get(key) ?? 0) - 1;
            data.set(key, n);
            return n;
        },
        expire: async () => 1,
        del: async (...keys: string[]) => keys.filter((k) => data.delete(k)).length,
    };
    return store as unknown as CounterStore;
}

const request = (ip: string, ua: string) => new Request('https://example.test/', { headers: { 'x-forwarded-for': ip, 'user-agent': ua } });

/** Asks questions spread over separate minutes so the burst limit stays out of the way. */
async function askSpread(store: CounterStore, asker: { visitor: string; ip: string }, times: number) {
    const results = [];
    for (let i = 0; i < times; i++) {
        results.push(await spendQuestion(asker, store));
        mock.timers.tick(61_000);
    }
    return results;
}

beforeEach(() => mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-18T09:00:00Z') }));
afterEach(() => mock.timers.reset());

describe('visitor and IP ids', () => {
    test('the visitor id changes with the user agent but the IP id does not', () => {
        const a = request('203.0.113.7', 'Browser A');
        const b = request('203.0.113.7', 'Browser B');
        assert.notEqual(visitorId(a), visitorId(b));
        assert.equal(ipId(a), ipId(b));
        assert.notEqual(ipId(a), ipId(request('198.51.100.1', 'Browser A')));
    });

    test('ids never contain the raw IP', () => {
        assert.ok(!ipId(request('203.0.113.7', 'x')).includes('203.0.113.7'));
    });
});

describe('per-visitor daily limit', () => {
    test(`allows ${ASSISTANT.dailyQuestionLimit} questions a day, then refuses`, async () => {
        const store = memoryStore();
        const asker = { visitor: 'v1', ip: 'ip1' };
        const results = await askSpread(store, asker, ASSISTANT.dailyQuestionLimit + 1);
        assert.deepEqual(results.at(-2), { ok: true, remaining: 0 });
        assert.deepEqual(results.at(-1), { ok: false, reason: 'limit' });
        assert.equal(await questionsRemaining(asker, store), 0);
    });

    test('a refunded question can be asked again', async () => {
        const store = memoryStore();
        const asker = { visitor: 'v1', ip: 'ip1' };
        await askSpread(store, asker, ASSISTANT.dailyQuestionLimit);
        assert.equal(await refundQuestion(asker, store), 1);
        assert.deepEqual(await spendQuestion(asker, store), { ok: true, remaining: 0 });
    });

    test('resets the next day', async () => {
        const store = memoryStore();
        const asker = { visitor: 'v1', ip: 'ip1' };
        await askSpread(store, asker, ASSISTANT.dailyQuestionLimit);
        mock.timers.tick(24 * 60 * 60 * 1000);
        assert.deepEqual(await spendQuestion(asker, store), { ok: true, remaining: ASSISTANT.dailyQuestionLimit - 1 });
    });
});

describe('per-IP daily ceiling', () => {
    test(`caps an IP at ${ASSISTANT.dailyIpQuestionLimit} questions however many user agents it uses`, async () => {
        const store = memoryStore();
        let accepted = 0;
        for (let v = 0; v < 10; v++) {
            for (const r of await askSpread(store, { visitor: `ua-${v}`, ip: 'shared' }, ASSISTANT.dailyQuestionLimit)) {
                if (r.ok) accepted++;
                else assert.equal(r.reason, 'limit');
            }
        }
        assert.equal(accepted, ASSISTANT.dailyIpQuestionLimit);
    });

    test('a refused question does not use up the visitor allowance', async () => {
        const store = memoryStore();
        for (let v = 0; v < 3; v++) await askSpread(store, { visitor: `ua-${v}`, ip: 'shared' }, ASSISTANT.dailyQuestionLimit);
        const fresh = { visitor: 'fresh', ip: 'shared' };
        assert.deepEqual(await spendQuestion(fresh, store), { ok: false, reason: 'limit' });
        assert.equal(await questionsRemaining({ visitor: 'fresh', ip: 'other' }, store), ASSISTANT.dailyQuestionLimit);
    });

    test('remaining reflects the IP ceiling and refunds give the IP its question back', async () => {
        const store = memoryStore();
        await askSpread(store, { visitor: 'a', ip: 'shared' }, ASSISTANT.dailyQuestionLimit);
        await askSpread(store, { visitor: 'b', ip: 'shared' }, ASSISTANT.dailyQuestionLimit);
        await askSpread(store, { visitor: 'c', ip: 'shared' }, ASSISTANT.dailyQuestionLimit - 1);
        const d = { visitor: 'd', ip: 'shared' };
        assert.equal(await questionsRemaining(d, store), 1);
        assert.deepEqual(await spendQuestion(d, store), { ok: true, remaining: 0 });
        assert.equal(await refundQuestion(d, store), 1);
        assert.equal(await questionsRemaining(d, store), 1);
    });
});

describe('site-wide burst limit', () => {
    test(`allows ${ASSISTANT.questionsPerMinute} questions a minute across all visitors, then reports busy`, async () => {
        const store = memoryStore();
        for (let i = 0; i < ASSISTANT.questionsPerMinute; i++) {
            assert.equal((await spendQuestion({ visitor: `v${i}`, ip: `ip${i}` }, store)).ok, true);
        }
        const late = { visitor: 'late', ip: 'late-ip' };
        assert.deepEqual(await spendQuestion(late, store), { ok: false, reason: 'busy' });
        assert.equal(await questionsRemaining(late, store), ASSISTANT.dailyQuestionLimit);
        mock.timers.tick(60_000);
        assert.equal((await spendQuestion(late, store)).ok, true);
    });
});

describe('contact lead rate limit', () => {
    test(`allows ${ASSISTANT.leadsPerHour} messages an hour per IP, even with a new user agent each time`, async () => {
        const store = memoryStore();
        const results = [];
        for (let i = 0; i <= ASSISTANT.leadsPerHour; i++) {
            results.push(await underRateLimit('contact', ipId(request('203.0.113.7', `ua-${i}`)), ASSISTANT.leadsPerHour, 3600, store));
        }
        assert.deepEqual(results, [...Array(ASSISTANT.leadsPerHour).fill(true), false]);
        mock.timers.tick(3600 * 1000);
        assert.equal(await underRateLimit('contact', ipId(request('203.0.113.7', 'ua')), ASSISTANT.leadsPerHour, 3600, store), true);
    });
});
