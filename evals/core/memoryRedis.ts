// An in-memory stand-in for the Upstash Redis commands the assistant uses (counters, spend, saved
// chats and their index), with expiry on the eval clock. Values are copied in (as JSON) and out,
// as a real round trip to Redis would, so code that edits what it read can't change what is stored.

type Entry = { value: unknown; expiresAt: number | null };

const bound = (v: number | string) => (v === '+inf' ? Infinity : v === '-inf' ? -Infinity : Number(v));

export class MemoryRedis {
    private data = new Map<string, Entry>();
    private zsets = new Map<string, Map<string, number>>();

    private live(key: string): Entry | undefined {
        const e = this.data.get(key);
        if (e && e.expiresAt !== null && e.expiresAt <= Date.now()) {
            this.data.delete(key);
            return undefined;
        }
        return e;
    }

    async get<T>(key: string): Promise<T | null> {
        const e = this.live(key);
        return e ? (structuredClone(e.value) as T) : null;
    }

    /** Stores a JSON copy, as the Upstash client does (so `undefined` fields are dropped). */
    async set(key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'> {
        this.data.set(key, { value: JSON.parse(JSON.stringify(value)), expiresAt: opts?.ex ? Date.now() + opts.ex * 1000 : null });
        return 'OK';
    }

    /** Like Redis INCRBY: keeps the key's expiry. */
    async incrby(key: string, n: number): Promise<number> {
        const e = this.live(key);
        const v = Number(e?.value ?? 0) + n;
        this.data.set(key, { value: v, expiresAt: e?.expiresAt ?? null });
        return v;
    }

    incr(key: string) {
        return this.incrby(key, 1);
    }

    decr(key: string) {
        return this.incrby(key, -1);
    }

    async expire(key: string, seconds: number): Promise<0 | 1> {
        const e = this.live(key);
        if (!e) return 0;
        e.expiresAt = Date.now() + seconds * 1000;
        return 1;
    }

    async del(...keys: string[]): Promise<number> {
        let n = 0;
        for (const k of keys) {
            if (this.live(k)) {
                this.data.delete(k);
                n++;
            }
            if (this.zsets.delete(k)) n++;
        }
        return n;
    }

    async mget<T extends unknown[]>(...keys: string[]): Promise<T> {
        return keys.map((k) => {
            const e = this.live(k);
            return e ? structuredClone(e.value) : null;
        }) as T;
    }

    async zadd(key: string, { score, member }: { score: number; member: string }): Promise<number> {
        const z = this.zsets.get(key) ?? new Map<string, number>();
        const added = z.has(member) ? 0 : 1;
        z.set(member, score);
        this.zsets.set(key, z);
        return added;
    }

    async zrem(key: string, ...members: string[]): Promise<number> {
        const z = this.zsets.get(key);
        if (!z) return 0;
        return members.filter((m) => z.delete(m)).length;
    }

    async zremrangebyscore(key: string, min: number | string, max: number | string): Promise<number> {
        const z = this.zsets.get(key);
        if (!z) return 0;
        let n = 0;
        for (const [m, s] of z) {
            if (s >= bound(min) && s <= bound(max)) {
                z.delete(m);
                n++;
            }
        }
        return n;
    }

    /** Only the by-score form the assistant uses. */
    async zrange<T extends unknown[]>(key: string, min: number | string, max: number | string, opts?: { byScore?: boolean }): Promise<T> {
        if (!opts?.byScore) throw new Error('MemoryRedis.zrange supports only { byScore: true }');
        const z = this.zsets.get(key) ?? new Map<string, number>();
        return [...z]
            .filter(([, s]) => s >= bound(min) && s <= bound(max))
            .sort((a, b) => a[1] - b[1])
            .map(([m]) => m) as T;
    }

    // Inspection, for the checks (not Redis commands).

    /** The stored value, or null when missing or expired. */
    peek(key: string): unknown {
        const e = this.live(key);
        return e ? structuredClone(e.value) : null;
    }

    /** Seconds until the key expires, null when it has no expiry or doesn't exist. */
    ttlSeconds(key: string): number | null {
        const e = this.live(key);
        return e?.expiresAt ? (e.expiresAt - Date.now()) / 1000 : null;
    }

    /** Live keys, sorted sets included. */
    keys(): string[] {
        return [...[...this.data.keys()].filter((k) => this.live(k)), ...this.zsets.keys()];
    }

    zmembers(key: string): string[] {
        return [...(this.zsets.get(key)?.keys() ?? [])];
    }

    /** Every key and value as one string, for "this never appears anywhere" checks. */
    dump(): string {
        const values = [...this.data.keys()].filter((k) => this.live(k)).map((k) => [k, this.data.get(k)!.value]);
        const sets = [...this.zsets].map(([k, z]) => [k, [...z.keys()]]);
        return JSON.stringify({ values, sets });
    }
}
