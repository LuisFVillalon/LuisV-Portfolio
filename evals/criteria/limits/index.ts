// Ask AI eval, criterion #6: Fair Usage Limits.
//
//   npm run eval:limits                  every scenario
//   npm run eval:limits -- --id ip-ceiling
//
// Each visitor gets exactly the daily allowance (ASSISTANT.dailyQuestionLimit), an IP can't get
// more than its ceiling by switching browsers, refused questions never reach retrieval or Claude,
// failed answers are refunded only when nothing was billed, and the budget guard and burst limit
// hold. Runs the real chat and status handlers on a fake site (evals/core/fakeSite.ts): $0, no keys.
import { ASSISTANT } from '../../../src/app/lib/assistant/config';
import { COST, deviceId, event, VISITOR, type Reply, type Visitor } from '../../core/fakeSite';
import type { Scenario, SystemCriterion } from '../../core/system';

const L = ASSISTANT.dailyQuestionLimit;
const IP_L = ASSISTANT.dailyIpQuestionLimit;
const countdown = (from: number) => Array.from({ length: from + 1 }, (_, i) => from - i);
const accepted = (r: Reply) => r.status === 200 && event(r, 'start') !== undefined;
/** Device `n` on `ip`, with its device cookie. */
const browser = (ip: string, n: number): Visitor => ({ ip, ua: `EvalBrowser/${n}`, device: deviceId(n) });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const scenarios: Scenario[] = [
    {
        id: 'visitor-daily-allowance',
        title: `A visitor gets exactly ${L} questions a day`,
        async run(site, t) {
            const starts: number[] = [];
            const dones: number[] = [];
            const statuses: number[] = [];
            for (let i = 0; i < L; i++) {
                const r = await site.ask();
                starts.push(event(r, 'start')?.remaining ?? -1);
                dones.push(event(r, 'done')?.remaining ?? -1);
                statuses.push((await site.status()).remaining);
                site.clock.tick(61_000);
            }
            t.equal(`questions 1-${L}: "remaining" counts down to 0 in the start event`, starts, countdown(L - 1));
            t.equal('the done event reports the same remaining', dones, starts);
            t.equal('/status reports the same remaining after every question', statuses, starts);
            const extra = await site.ask();
            t.equal(`question ${L + 1} is refused with 429`, extra.status, 429);
            t.equal(`question ${L + 1}'s body`, extra.body, { code: 'limit', remaining: 0 });
            t.equal('the refused question never reached retrieval or Claude', site.calls, { retrieve: L, answer: L });
            t.equal('/status still reports 0 left', (await site.status()).remaining, 0);
        },
    },
    {
        id: 'device-cookie',
        title: 'Opening the chat gives a new browser its device cookie, once; the chat route never sets one',
        async run(site, t) {
            const fresh = await site.status({ ip: '198.51.100.30', ua: 'EvalBrowser/1.0' });
            t.ok('/status sets a device cookie for a browser without one', UUID.test(fresh.setDevice ?? ''), `set ${String(fresh.setDevice)}`);
            t.equal('and reports the full allowance for it', fresh.remaining, L);
            const me: Visitor = { ip: '198.51.100.30', ua: 'EvalBrowser/1.0', device: fresh.setDevice ?? undefined };
            t.equal('/status leaves an existing cookie alone', (await site.status(me)).setDevice, null);
            const r = await site.ask({ visitor: me });
            t.equal('the question counts against that device', (await site.status(me)).remaining, L - 1);
            const cookieless = await site.ask({ visitor: { ip: '198.51.100.31', ua: 'NoCookies/1.0' } });
            t.equal('the chat route never sets a cookie, with or without one', [r.setDevice, cookieless.setDevice], [null, null]);
            const other = await site.status({ ip: '198.51.100.30', ua: 'EvalBrowser/1.0' });
            t.ok('another new browser gets a different id', other.setDevice !== null && other.setDevice !== fresh.setDevice);
        },
    },
    {
        id: 'shared-network-devices',
        title: `Devices sharing one IP and browser (a campus network) each get ${L}, up to ${IP_L} in all`,
        async run(site, t) {
            const ip = '198.51.100.40';
            const ua = 'Same Browser/1.0';
            const fits = Math.floor(IP_L / L);
            const devices: Visitor[] = [];
            for (let d = 0; d < fits; d++) devices.push(await site.newDevice(ip, ua));
            const perDevice: number[] = [];
            for (const visitor of devices) perDevice.push((await site.askSpread(L, { visitor })).filter(accepted).length);
            t.equal(`${fits} identical browsers on one IP: each gets all ${L}`, perDevice, devices.map(() => L));
            const next = await site.newDevice(ip, ua);
            t.equal(`device ${fits + 1} on that IP is at the ${IP_L} ceiling`, (await site.status(next)).remaining, Math.max(0, IP_L - fits * L));
        },
    },
    {
        id: 'device-follows-networks',
        title: 'A device keeps its count when it changes network (Wi-Fi to cellular)',
        async run(site, t) {
            const wifi: Visitor = { ...VISITOR, ip: '203.0.113.50' };
            await site.askSpread(3, { visitor: wifi });
            const cellular: Visitor = { ...wifi, ip: '192.0.2.77' };
            t.equal('on the new network it has the same remaining', (await site.status(cellular)).remaining, L - 3);
            t.equal('its next question continues the count', event(await site.ask({ visitor: cellular }), 'start')?.remaining, L - 4);
        },
    },
    {
        id: 'ip-ceiling',
        title: `Clearing cookies or switching browsers on one IP can't go past ${IP_L} a day`,
        async run(site, t) {
            const ip = '198.51.100.20';
            const devices = Math.ceil(IP_L / L) + 1;
            let ok = 0;
            const refusals = new Set<string>();
            for (let b = 0; b < devices; b++) {
                // A cleared cookie: the chat opens as a new device each time.
                const visitor = await site.newDevice(ip);
                for (const r of await site.askSpread(L, { visitor })) {
                    if (accepted(r)) ok++;
                    else refusals.add(`${r.status} ${String(r.body?.code)}`);
                }
            }
            t.equal(`${devices} fresh devices × ${L} questions: accepted`, ok, IP_L);
            t.equal('every other question was refused as over the limit', [...refusals], ['429 limit']);
            t.equal('yet another new device on that IP has 0 left', (await site.newDevice(ip).then((v) => site.status(v))).remaining, 0);
            t.equal('another IP is unaffected', (await site.status(browser('198.51.100.99', 98))).remaining, L);
            t.equal('refused questions never reached retrieval or Claude', site.calls, { retrieve: IP_L, answer: IP_L });
        },
    },
    {
        id: 'cookies-blocked-fallback',
        title: `Without the cookie (blocked, or forged) a visitor is IP + browser, still ${L} a day`,
        async run(site, t) {
            const noCookies: Visitor = { ip: '198.51.100.60', ua: 'NoCookies/1.0' };
            const replies = await site.askSpread(L + 1, { visitor: noCookies });
            t.equal(`${L} accepted, then refused`, replies.map(accepted), [...Array(L).fill(true), false]);
            const forged = await site.ask({ visitor: { ...noCookies, device: 'not-a-uuid' } });
            t.equal('a malformed cookie counts as no cookie (same visitor, still refused)', forged.status, 429);
        },
    },
    {
        id: 'refund-before-claude',
        title: 'A question that fails before Claude answers is given back',
        async run(site, t) {
            await site.ask();
            site.clock.tick(61_000);
            const failed = await site.ask({ behaviour: 'retrieval-error' });
            t.equal('the failure is reported as refunded', event(failed, 'error'), { t: 'error', remaining: L - 1, refunded: true });
            t.equal('/status: still one question used', (await site.status()).remaining, L - 1);
            t.equal('Claude was not called for it', site.calls.answer, 1);
            site.clock.tick(61_000);
            const rest = await site.askSpread(L - 1);
            t.ok(`the remaining ${L - 1} questions are all accepted`, rest.every(accepted), `${rest.filter(accepted).length} accepted`);
            t.equal('then the visitor is at 0', (await site.status()).remaining, 0);
            // Each record rounds up to a whole micro-dollar, hence the tolerance.
            t.near('only the answered questions were charged', await site.spendUsd(), L * (COST.rewrite + COST.answer), (L + 1) * 1e-6);
        },
    },
    {
        id: 'billed-error-counts',
        title: 'A question Claude already billed stays counted when the answer fails',
        async run(site, t) {
            const r = await site.ask({ behaviour: 'error-after-billing' });
            t.equal('the failure is reported as not refunded', event(r, 'error'), { t: 'error', remaining: L - 1, refunded: false });
            t.equal('/status: the question is counted', (await site.status()).remaining, L - 1);
            t.near('the billed answer is in the month\'s spend', await site.spendUsd(), COST.rewrite + COST.answer, 2e-6);
        },
    },
    {
        id: 'disconnect-counts',
        title: 'Disconnecting mid-answer still counts (no free questions by aborting)',
        async run(site, t) {
            const r = await site.ask({ behaviour: 'disconnect' });
            t.equal('the question was accepted', event(r, 'start')?.remaining, L - 1);
            t.equal('/status: the question is counted', (await site.status()).remaining, L - 1);
            t.near('the prompt estimate is in the month\'s spend', await site.spendUsd(), COST.rewrite + COST.estimate, 2e-6);
        },
    },
    {
        id: 'burst-limit',
        title: `More than ${ASSISTANT.questionsPerMinute} questions in a minute site-wide get "busy", free of charge`,
        async run(site, t) {
            site.clock.set('2026-11-18T10:00:05.000Z');
            const crowd = [];
            for (let i = 0; i < ASSISTANT.questionsPerMinute; i++) crowd.push(await site.ask({ visitor: browser(`192.0.2.${i + 1}`, i) }));
            t.ok(`${ASSISTANT.questionsPerMinute} different visitors in one minute are all accepted`, crowd.every(accepted), `${crowd.filter(accepted).length} accepted`);
            const late = browser('192.0.2.200', 200);
            const r = await site.ask({ visitor: late });
            t.equal('the next one is refused as busy', [r.status, r.body], [429, { code: 'busy' }]);
            t.equal('it was not charged to that visitor', (await site.status(late)).remaining, L);
            t.equal('it never reached Claude', site.calls.answer, ASSISTANT.questionsPerMinute);
            site.clock.tick(60_000);
            t.ok('a minute later it is accepted', accepted(await site.ask({ visitor: late })));
        },
    },
    {
        id: 'budget-guard',
        title: `At the $${ASSISTANT.monthlyBudgetUsd} monthly budget the assistant stops, charging nothing`,
        async run(site, t) {
            await site.presetSpendUsd(ASSISTANT.monthlyBudgetUsd - 0.01);
            t.ok('just under budget, a question is accepted', accepted(await site.ask()));
            site.clock.tick(61_000);
            await site.presetSpendUsd(0.01);
            const r = await site.ask();
            t.equal('at budget, questions get 503 budget', [r.status, r.body], [503, { code: 'budget' }]);
            const s = await site.status();
            t.equal('/status reports unavailable for budget', [s.available, s.reason], [false, 'budget']);
            t.equal('the refused question was not counted', s.remaining, L - 1);
            t.equal('it never reached retrieval or Claude', site.calls, { retrieve: 1, answer: 1 });
        },
    },
    {
        id: 'next-day-reset',
        title: 'The allowance resets at midnight UTC, not before',
        async run(site, t) {
            await site.askSpread(L);
            site.clock.set('2026-11-18T23:59:30.000Z');
            t.equal('at 23:59:30 the visitor is still refused', (await site.ask()).status, 429);
            site.clock.set('2026-11-19T00:00:30.000Z');
            t.equal('at 00:00:30 the next day the full allowance is back', event(await site.ask(), 'start')?.remaining, L - 1);
        },
    },
    {
        id: 'invalid-requests-free',
        title: 'Empty, too-long and malformed questions are rejected without being counted',
        async run(site, t) {
            const empty = await site.ask({ question: '   ' });
            const long = await site.ask({ question: 'x'.repeat(ASSISTANT.maxQuestionChars + 1) });
            const malformed = await site.post('{not json');
            t.equal('an empty question: 400 bad_request', [empty.status, empty.body], [400, { code: 'bad_request' }]);
            t.equal('a too-long question: 400 too_long', [long.status, long.body], [400, { code: 'too_long', max: ASSISTANT.maxQuestionChars }]);
            t.equal('a malformed body: 400 bad_request', [malformed.status, malformed.body], [400, { code: 'bad_request' }]);
            t.ok(`exactly ${ASSISTANT.maxQuestionChars} characters is accepted`, accepted(await site.ask({ question: 'x'.repeat(ASSISTANT.maxQuestionChars) })));
            t.equal('only the valid question was counted', (await site.status()).remaining, L - 1);
        },
    },
    {
        id: 'spend-recorded',
        title: 'Every answered question is added to the month\'s spend',
        async run(site, t) {
            await site.askSpread(3);
            t.near('3 answers: retrieval + answer cost each', await site.spendUsd(), 3 * (COST.rewrite + COST.answer), 4e-6);
            t.equal('the limits are keyed by hashed ids, never the raw IP', site.redis.dump().includes(VISITOR.ip), false);
        },
    },
];

const limits: SystemCriterion = {
    name: 'limits',
    title: 'Criterion #6: Fair Usage Limits',
    goal: `Each visitor gets exactly ${L} questions a day (${IP_L} per IP), refused and failed questions cost nothing and never reach Claude, and the burst and budget guards hold.`,
    scenarios,
};

export default limits;
