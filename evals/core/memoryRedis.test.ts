// The system criteria (#6-#8) trust the in-memory Redis and the clock to behave like the real
// thing; these pin down the behaviour they rely on.
import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { installClock, type Clock } from './clock';
import { MemoryRedis } from './memoryRedis';

let clock: Clock | undefined;
afterEach(() => clock?.restore());

describe('clock', () => {
    test('new Date() and Date.now() follow the clock; dates from a value do not', () => {
        clock = installClock('2026-11-18T09:00:00.000Z');
        assert.equal(new Date().toISOString(), '2026-11-18T09:00:00.000Z');
        clock.tick(61_000);
        assert.equal(Date.now(), Date.parse('2026-11-18T09:01:01.000Z'));
        assert.equal(new Date(0).toISOString(), '1970-01-01T00:00:00.000Z');
        assert.ok(new Date() instanceof Date);
    });

    test('restore() puts the real Date back', () => {
        clock = installClock('2000-01-01T00:00:00.000Z');
        clock.restore();
        assert.ok(new Date().getUTCFullYear() > 2000);
    });
});

describe('MemoryRedis', () => {
    test('keys expire on the clock, and INCR keeps the expiry', async () => {
        clock = installClock('2026-11-18T09:00:00.000Z');
        const r = new MemoryRedis();
        await r.incr('n');
        await r.expire('n', 60);
        await r.incr('n');
        assert.equal(await r.get('n'), 2);
        clock.tick(60_000);
        assert.equal(await r.get('n'), null);
    });

    test('values are stored as JSON copies', async () => {
        const r = new MemoryRedis();
        const v = { turns: [{ q: 'a', fallback: undefined }] };
        await r.set('k', v);
        v.turns.push({ q: 'b', fallback: undefined });
        const got = await r.get<typeof v>('k');
        assert.deepEqual(got, { turns: [{ q: 'a' }] });
        got!.turns.push({ q: 'c', fallback: undefined });
        assert.equal((await r.get<typeof v>('k'))!.turns.length, 1);
    });

    test('sorted sets: by-score ranges with +inf, removal by score and by member', async () => {
        const r = new MemoryRedis();
        await r.zadd('z', { score: 30, member: 'c' });
        await r.zadd('z', { score: 10, member: 'a' });
        await r.zadd('z', { score: 20, member: 'b' });
        assert.deepEqual(await r.zrange('z', 15, '+inf', { byScore: true }), ['b', 'c']);
        assert.equal(await r.zremrangebyscore('z', 0, 10), 1);
        assert.equal(await r.zrem('z', 'c'), 1);
        assert.deepEqual(r.zmembers('z'), ['b']);
    });

    test('mget returns null for missing keys; del removes values and sets', async () => {
        const r = new MemoryRedis();
        await r.set('a', 1);
        await r.zadd('z', { score: 1, member: 'm' });
        assert.deepEqual(await r.mget('a', 'missing'), [1, null]);
        assert.equal(await r.del('a', 'z'), 2);
        assert.deepEqual(r.keys(), []);
    });
});
