import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, mock, test } from 'node:test';
import { ASSISTANT } from './config';
import {
    DEVICE_COOKIE,
    deviceCookie,
    deviceIdOf,
    ipId,
    newDeviceId,
    questionsRemaining,
    refundQuestion,
    spendQuestion,
    underRateLimit,
    visitorId,
    type CounterStore,
} from './usage';

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

describe('device cookie', () => {
    const DEVICE_A = '0b6f1c8e-3d2a-4f5b-9c7d-1e2f3a4b5c6d';
    const DEVICE_B = '9f8e7d6c-5b4a-4321-8fed-cba987654321';
    const withCookie = (ip: string, ua: string, cookie: string) =>
        new Request('https://example.test/', { headers: { 'x-forwarded-for': ip, 'user-agent': ua, cookie } });

    test('two devices with the same IP and browser are different visitors', () => {
        const a = withCookie('203.0.113.7', 'Same Browser', `${DEVICE_COOKIE}=${DEVICE_A}`);
        const b = withCookie('203.0.113.7', 'Same Browser', `${DEVICE_COOKIE}=${DEVICE_B}`);
        assert.notEqual(visitorId(a), visitorId(b));
        assert.equal(ipId(a), ipId(b));
    });

    test('one device keeps its id across networks and browser updates', () => {
        const home = withCookie('203.0.113.7', 'Browser 1', `other=1; ${DEVICE_COOKIE}=${DEVICE_A}`);
        const phone = withCookie('198.51.100.1', 'Browser 2', `${DEVICE_COOKIE}=${DEVICE_A}`);
        assert.equal(deviceIdOf(home), DEVICE_A);
        assert.equal(visitorId(home), visitorId(phone));
    });

    test('a missing or malformed cookie falls back to IP + user agent', () => {
        const plain = request('203.0.113.7', 'Browser A');
        assert.equal(deviceIdOf(plain), null);
        const forged = withCookie('203.0.113.7', 'Browser A', `${DEVICE_COOKIE}=not-a-uuid`);
        assert.equal(deviceIdOf(forged), null);
        assert.equal(visitorId(forged), visitorId(plain));
    });

    test('new ids are valid, unique, and never appear in the visitor key', () => {
        const id = newDeviceId();
        assert.notEqual(id, newDeviceId());
        const req = withCookie('203.0.113.7', 'x', `${DEVICE_COOKIE}=${id}`);
        assert.equal(deviceIdOf(req), id);
        assert.ok(!visitorId(req).includes(id));
    });

    test('the cookie is httpOnly and scoped to the assistant routes', () => {
        const c = deviceCookie(DEVICE_A);
        assert.ok(c.startsWith(`${DEVICE_COOKIE}=${DEVICE_A};`));
        assert.match(c, /; HttpOnly/);
        assert.match(c, /; Path=\/api\/assistant/);
        assert.match(c, /; SameSite=Lax/);
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
        const visitors = Math.ceil(ASSISTANT.dailyIpQuestionLimit / ASSISTANT.dailyQuestionLimit);
        for (let v = 0; v < visitors; v++) await askSpread(store, { visitor: `ua-${v}`, ip: 'shared' }, ASSISTANT.dailyQuestionLimit);
        const fresh = { visitor: 'fresh', ip: 'shared' };
        assert.deepEqual(await spendQuestion(fresh, store), { ok: false, reason: 'limit' });
        assert.equal(await questionsRemaining({ visitor: 'fresh', ip: 'other' }, store), ASSISTANT.dailyQuestionLimit);
    });

    test('remaining reflects the IP ceiling and refunds give the IP its question back', async () => {
        const store = memoryStore();
        // Use all but one of the IP's ceiling across full visitors, then a partial one.
        const used = ASSISTANT.dailyIpQuestionLimit - 1;
        const full = Math.floor(used / ASSISTANT.dailyQuestionLimit);
        for (let v = 0; v < full; v++) await askSpread(store, { visitor: `full-${v}`, ip: 'shared' }, ASSISTANT.dailyQuestionLimit);
        await askSpread(store, { visitor: 'partial', ip: 'shared' }, used % ASSISTANT.dailyQuestionLimit);
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
