// The fake site the system criteria (#6 limits, #7 logging, #8 digest) run against: the real chat,
// status and digest handlers, wired to an in-memory Redis (memoryRedis.ts), a controllable clock
// (clock.ts), a stand-in for retrieval and Claude, and a captured email sender. No key is needed
// and nothing reaches the network: useFakeSiteEnv() replaces every secret with a placeholder and
// fetch is blocked for the whole run, so the site's Redis, Claude, Voyage and Resend are never called.
import type { Redis } from '@upstash/redis';
import { GET as statusGET } from '../../src/app/api/assistant/status/route';
import type { AnswerEvent } from '../../src/app/lib/assistant/answer';
import { chatHandlers, type ChatDeps } from '../../src/app/lib/assistant/chatHandlers';
import { setRedisForEvals } from '../../src/app/lib/assistant/clients';
import { chatKey, INDEX_KEY, type SavedConversation } from '../../src/app/lib/assistant/conversations';
import { digestHandler, type DigestEmail } from '../../src/app/lib/assistant/digest';
import { DEVICE_COOKIE, ipId, monthSpendUsd, recordSpend, visitorId } from '../../src/app/lib/assistant/usage';
import { installClock, type Clock } from './clock';
import { MemoryRedis } from './memoryRedis';

/** A Wednesday morning (UTC), so a run never starts near a day or month boundary. */
export const START = '2026-11-18T09:00:00.000Z';
const BASE = 'https://eval.invalid';

/** What the stand-in pipeline charges, in USD, so spend checks know what to expect. */
export const COST = { rewrite: 0.0002, answer: 0.004, estimate: 0.003 } as const;
export const SOURCE = { id: 'eval:project-x', label: 'Project X', href: '/projects' } as const;
export const DECLINE_TEXT = 'Replacement shown to the visitor after Claude declined.';
export const WITHDRAWN_TEXT = 'STREAMED-THEN-WITHDRAWN';
export const FALLBACK_TEXT = "I don't have that in Luis's sources.";
export const answerText = (question: string) => `Answer to: ${question}`;

/** Placeholders for every variable the handlers check; real values from the shell are overwritten. */
export const FAKE_ENV = {
    ANTHROPIC_API_KEY: 'eval-placeholder',
    VOYAGE_API_KEY: 'eval-placeholder',
    UPSTASH_VECTOR_REST_URL: `${BASE}/vector`,
    UPSTASH_VECTOR_REST_TOKEN: 'eval-placeholder',
    UPSTASH_REDIS_REST_URL: `${BASE}/redis`,
    UPSTASH_REDIS_REST_TOKEN: 'eval-placeholder',
    CRON_SECRET: 'eval-cron-secret',
    ASSISTANT_HASH_SALT: 'eval-salt',
    RESEND_API_KEY: 'eval-placeholder',
    FROM_EMAIL: 'assistant@eval.invalid',
    TO_EMAIL: 'luis@eval.invalid',
} as const;

/** Sets the placeholder environment and blocks fetch. Never loads .env.local. */
export function useFakeSiteEnv(): void {
    for (const name of ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'ASSISTANT_DISABLED']) delete process.env[name];
    Object.assign(process.env, FAKE_ENV);
    globalThis.fetch = async (input: string | URL | Request) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        throw new Error(`Network blocked in system evals (tried ${url})`);
    };
}

/** How the stand-in pipeline handles the next question. */
export type Behaviour =
    /** Streams an answer citing SOURCE. */
    | 'answer'
    /** Streams an answer citing nothing (the chat shows its contact buttons). */
    | 'fallback'
    /** Streams text, then Claude declines: the streamed text is replaced. */
    | 'declined'
    /** Retrieval fails before Claude is called: nothing billed, so the question is refunded. */
    | 'retrieval-error'
    /** Claude bills the answer, then the stream fails: the question stays counted. */
    | 'error-after-billing'
    /** The visitor disconnects mid-answer: billed at the prompt estimate, the question stays counted. */
    | 'disconnect';

/** Who is asking. `device` is the device cookie the browser sends back (none when undefined). */
export type Visitor = { ip: string; ua: string; device?: string };
/** A fixed, valid device id per number, for scenarios that need several devices. */
export const deviceId = (n: number) => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
/** The default visitor: a browser that already has its device cookie, as after opening the chat. */
export const VISITOR: Visitor = { ip: '203.0.113.7', ua: 'EvalBrowser/1.0', device: deviceId(1) };

export type ChatEvent =
    | { t: 'start'; remaining: number }
    | { t: 'text'; v: string }
    | { t: 'replace'; v: string }
    | { t: 'done'; sources: { label: string; href: string }[]; fallback: boolean; remaining: number }
    | { t: 'error'; remaining: number; refunded: boolean };

export type Reply = {
    status: number;
    /** The device id the response set, when it set one (the chat route never should). */
    setDevice: string | null;
    /** The streamed events (empty for a JSON reply). */
    events: ChatEvent[];
    /** The JSON body of a refused or non-streamed reply. */
    body: Record<string, unknown> | null;
    /** The answer as the visitor ended up seeing it (streamed text, or what replaced it). */
    text: string;
};

export type AskOptions = {
    visitor?: Visitor;
    question?: string;
    conversationId?: string;
    /** Left out of the request when undefined (the server then saves, as on by default). */
    save?: boolean;
    page?: string;
    behaviour?: Behaviour;
};

export type Status = {
    available: boolean;
    reason?: string;
    remaining: number;
    limit: number;
    /** The device id the response set, when it set one. */
    setDevice: string | null;
};

/** The device id a Set-Cookie header sets, or null. */
export function deviceFromSetCookie(header: string | null): string | null {
    const m = header?.match(new RegExp(`(?:^|,\\s*)${DEVICE_COOKIE}=([^;]+)`));
    return m ? m[1] : null;
}

export function event<T extends ChatEvent['t']>(r: Reply, t: T): Extract<ChatEvent, { t: T }> | undefined {
    return r.events.find((e) => e.t === t) as Extract<ChatEvent, { t: T }> | undefined;
}

const headersFor = (v: Visitor): Record<string, string> => ({
    'content-type': 'application/json',
    'x-forwarded-for': v.ip,
    'user-agent': v.ua,
    ...(v.device !== undefined ? { cookie: `${DEVICE_COOKIE}=${v.device}` } : {}),
});

async function readReply(res: Response): Promise<Reply> {
    const raw = await res.text();
    const setDevice = deviceFromSetCookie(res.headers.get('set-cookie'));
    if ((res.headers.get('content-type') ?? '').includes('ndjson')) {
        const events = raw
            .split('\n')
            .filter(Boolean)
            .map((line) => JSON.parse(line) as ChatEvent);
        let text = '';
        for (const e of events) {
            if (e.t === 'text') text += e.v;
            else if (e.t === 'replace') text = e.v;
        }
        return { status: res.status, setDevice, events, body: null, text };
    }
    return { status: res.status, setDevice, events: [], body: raw ? (JSON.parse(raw) as Record<string, unknown>) : null, text: '' };
}

/** One scenario's site: fresh Redis, clock at START, stand-in pipeline. Call dispose() after. */
export class FakeSite {
    readonly redis = new MemoryRedis();
    readonly clock: Clock;
    /** How many times retrieval and Claude were called. */
    readonly calls = { retrieve: 0, answer: 0 };
    /** Digest emails "sent". */
    readonly emails: DigestEmail[] = [];
    /** When true, the email sender reports a failure. */
    sendFails = false;

    private behaviour: Behaviour = 'answer';
    private abort: AbortController | null = null;
    private chat: ReturnType<typeof chatHandlers>;
    private digestGET: ReturnType<typeof digestHandler>;

    constructor() {
        this.clock = installClock(START);
        setRedisForEvals(this.redis as unknown as Redis);
        this.chat = chatHandlers(this.pipeline());
        this.digestGET = digestHandler(async (email) => {
            if (this.sendFails) return { error: { message: 'stand-in send failure' } };
            this.emails.push(email);
            return { error: null };
        });
    }

    dispose(): void {
        this.clock.restore();
        setRedisForEvals(undefined);
    }

    private pipeline(): ChatDeps {
        const site = this;
        return {
            retrieve: async (question: string) => {
                site.calls.retrieve++;
                if (site.behaviour === 'retrieval-error') throw new Error('stand-in retrieval failure');
                return { query: question, shortlist: [], chunks: [], rewriteCostUsd: COST.rewrite };
            },
            streamAnswer: async function* ({ question, meter }): AsyncGenerator<AnswerEvent> {
                site.calls.answer++;
                if (meter) meter.estimateUsd = COST.estimate;
                const b = site.behaviour;
                if (b === 'disconnect') {
                    yield { type: 'text', text: 'partial ' };
                    site.abort?.abort();
                    throw new Error('Request was aborted.');
                }
                if (meter) meter.costUsd = COST.answer;
                if (b === 'error-after-billing') {
                    yield { type: 'text', text: 'partial ' };
                    throw new Error('stand-in stream failure');
                }
                if (b === 'declined') {
                    yield { type: 'text', text: WITHDRAWN_TEXT };
                    yield { type: 'replace', text: DECLINE_TEXT };
                    yield { type: 'done', text: DECLINE_TEXT, sources: [], fallback: true, stopReason: 'refusal', costUsd: COST.answer };
                    return;
                }
                if (b === 'fallback') {
                    yield { type: 'text', text: FALLBACK_TEXT };
                    yield { type: 'done', text: FALLBACK_TEXT, sources: [], fallback: true, stopReason: 'end_turn', costUsd: COST.answer };
                    return;
                }
                const text = answerText(question);
                yield { type: 'text', text };
                yield { type: 'done', text, sources: [{ ...SOURCE }], fallback: false, stopReason: 'end_turn', costUsd: COST.answer };
            },
        };
    }

    /** POSTs one question to the chat handler, as the chat panel does. */
    ask(o: AskOptions = {}): Promise<Reply> {
        this.behaviour = o.behaviour ?? 'answer';
        const body = {
            question: o.question ?? 'What has Luis built?',
            history: [],
            page: o.page ?? '/',
            ...(o.conversationId !== undefined ? { conversationId: o.conversationId } : {}),
            ...(o.save !== undefined ? { save: o.save } : {}),
        };
        return this.post(JSON.stringify(body), o.visitor);
    }

    /** POSTs a raw body (for malformed requests). */
    async post(raw: string, visitor: Visitor = VISITOR): Promise<Reply> {
        this.abort = new AbortController();
        const req = new Request(`${BASE}/api/assistant/chat`, { method: 'POST', headers: headersFor(visitor), body: raw, signal: this.abort.signal });
        return readReply(await this.chat.POST(req));
    }

    /** Asks `n` questions a minute apart, so the site-wide burst limit stays out of the way. */
    async askSpread(n: number, o: AskOptions = {}): Promise<Reply[]> {
        const replies: Reply[] = [];
        for (let i = 0; i < n; i++) {
            replies.push(await this.ask(o));
            this.clock.tick(61_000);
        }
        return replies;
    }

    /** The visitor's opt-out: DELETE with the conversation id. */
    forget(conversationId: string, visitor: Visitor = VISITOR): Promise<Reply> {
        const req = new Request(`${BASE}/api/assistant/chat`, { method: 'DELETE', headers: headersFor(visitor), body: JSON.stringify({ conversationId }) });
        return this.chat.DELETE(req).then(readReply);
    }

    async status(visitor: Visitor = VISITOR): Promise<Status> {
        const res = await statusGET(new Request(`${BASE}/api/assistant/status`, { headers: headersFor(visitor) }));
        const body = (await res.json()) as Omit<Status, 'setDevice'>;
        return { ...body, setDevice: deviceFromSetCookie(res.headers.get('set-cookie')) };
    }

    /** Opens the chat as a new browser would: calls /status and keeps the device cookie it sets. */
    async newDevice(ip: string, ua = 'EvalBrowser/1.0'): Promise<Visitor> {
        const s = await this.status({ ip, ua });
        if (!s.setDevice) throw new Error('/status did not set a device cookie for a new browser');
        return { ip, ua, device: s.setDevice };
    }

    /** Runs the weekly digest as Vercel Cron would (pass null for no Authorization header). */
    async digest(authorization: string | null = `Bearer ${FAKE_ENV.CRON_SECRET}`): Promise<{ status: number; body: Record<string, unknown> }> {
        const headers: Record<string, string> = authorization === null ? {} : { authorization };
        const res = await this.digestGET(new Request(`${BASE}/api/assistant/digest`, { headers }));
        return { status: res.status, body: (await res.json()) as Record<string, unknown> };
    }

    spendUsd(): Promise<number> {
        return monthSpendUsd();
    }

    /** Records spend this month as if earlier answers had cost `usd`. */
    presetSpendUsd(usd: number): Promise<void> {
        return recordSpend(usd);
    }

    savedChat(id: string): SavedConversation | null {
        return this.redis.peek(chatKey(id)) as SavedConversation | null;
    }

    chatTtlSeconds(id: string): number | null {
        return this.redis.ttlSeconds(chatKey(id));
    }

    indexed(id: string): boolean {
        return this.redis.zmembers(INDEX_KEY).includes(id);
    }

    /** Every saved-chat key in the store. */
    chatKeys(): string[] {
        return this.redis.keys().filter((k) => k.startsWith(chatKey('')));
    }

    /** The hashed ids the limits key this visitor by. */
    idsOf(visitor: Visitor = VISITOR): { visitor: string; ip: string } {
        const req = new Request(BASE, { headers: headersFor(visitor) });
        return { visitor: visitorId(req), ip: ipId(req) };
    }
}
