// Ask AI eval, criterion #7: Consented Logging.
//
//   npm run eval:logging                  every scenario
//   npm run eval:logging -- --id opt-out-delete
//
// A chat is saved only while saving is allowed (on by default; the visitor can opt out), the saved
// copy is what the visitor actually saw, opting out deletes what was saved, failed answers and
// invalid ids save nothing, and nothing saved identifies the visitor. Runs the real chat handler on
// a fake site (evals/core/fakeSite.ts): $0, no keys.
import { ASSISTANT } from '../../../src/app/lib/assistant/config';
import { answerText, DECLINE_TEXT, event, FALLBACK_TEXT, SOURCE, WITHDRAWN_TEXT, type Visitor } from '../../core/fakeSite';
import type { Scenario, SystemCriterion } from '../../core/system';

const TTL = ASSISTANT.conversationTtlDays * 24 * 60 * 60;
const ID = 'eval-convo-0001';
const OTHER = 'eval-convo-0002';
const RECORD_KEYS = ['id', 'page', 'startedAt', 'turns', 'updatedAt'];
const TURN_KEYS = new Set(['q', 'a', 'sources', 'at', 'fallback']);

const scenarios: Scenario[] = [
    {
        id: 'saves-every-turn',
        title: 'With saving on, every answered turn is saved in order, as the visitor saw it',
        async run(site, t) {
            const questions = ['What has Luis built?', 'Which one used AI?', 'Is it live?'];
            const seen: string[] = [];
            for (const q of questions) {
                seen.push((await site.ask({ question: q, conversationId: ID, save: true, page: '/projects' })).text);
                site.clock.tick(30_000);
            }
            const c = site.savedChat(ID);
            t.ok('the conversation is saved', c !== null);
            t.equal('its questions, in order', c?.turns.map((x) => x.q), questions);
            t.equal('its answers are what the visitor saw', c?.turns.map((x) => x.a), seen);
            t.equal('the answers are the full answers', seen, questions.map(answerText));
            t.equal('each turn keeps its source labels', c?.turns.map((x) => x.sources), questions.map(() => [SOURCE.label]));
            t.equal('the page it started on', c?.page, '/projects');
            const at = c?.turns.map((x) => Date.parse(x.at)) ?? [];
            t.ok('turn times are in order, startedAt ≤ updatedAt', at.every((v, i) => i === 0 || v > at[i - 1]) && Date.parse(c?.startedAt ?? '') <= Date.parse(c?.updatedAt ?? ''));
            t.ok('it is in the digest index', site.indexed(ID));
            const ttl = site.chatTtlSeconds(ID) ?? 0;
            t.ok(`it expires after ${ASSISTANT.conversationTtlDays} days`, Math.abs(ttl - TTL) < 120, `TTL ${Math.round(ttl)}s, expected ${TTL}s`);
        },
    },
    {
        id: 'on-by-default',
        title: 'A request that doesn\'t say is saved (on by default, as the chat notice says)',
        async run(site, t) {
            await site.ask({ conversationId: ID });
            t.equal('one turn is saved', site.savedChat(ID)?.turns.length, 1);
        },
    },
    {
        id: 'save-off-writes-nothing',
        title: 'With saving off, nothing is written',
        async run(site, t) {
            for (let i = 0; i < 3; i++) {
                const r = await site.ask({ question: `Question ${i + 1}`, conversationId: ID, save: false });
                t.ok(`question ${i + 1} is still answered`, event(r, 'done') !== undefined);
            }
            t.equal('no saved chat in the store', site.chatKeys(), []);
            t.equal('not in the digest index', site.indexed(ID), false);
        },
    },
    {
        id: 'opt-out-delete',
        title: 'Opting out mid-chat (the toggle\'s DELETE) removes what was saved; later turns aren\'t written',
        async run(site, t) {
            await site.ask({ question: 'First', conversationId: ID, save: true });
            await site.ask({ question: 'Second', conversationId: ID, save: true });
            t.equal('two turns saved before opting out', site.savedChat(ID)?.turns.length, 2);
            const del = await site.forget(ID);
            t.equal('DELETE answers ok', [del.status, del.body], [200, { ok: true }]);
            t.equal('the saved chat is gone', site.savedChat(ID), null);
            t.equal('it is out of the digest index', site.indexed(ID), false);
            const r = await site.ask({ question: 'Third', conversationId: ID, save: false });
            t.ok('the next question is still answered', event(r, 'done') !== undefined);
            t.equal('and nothing is written for it', site.chatKeys(), []);
        },
    },
    {
        id: 'opt-out-next-question',
        title: 'Opting out takes effect on the next question even if the DELETE never arrived',
        async run(site, t) {
            await site.ask({ question: 'First', conversationId: ID, save: true });
            await site.ask({ question: 'Second', conversationId: ID, save: true });
            await site.ask({ question: 'Third', conversationId: ID, save: false });
            t.equal('the saved chat is gone', site.savedChat(ID), null);
            t.equal('it is out of the digest index', site.indexed(ID), false);
        },
    },
    {
        id: 'opt-back-in',
        title: 'Opting back in saves only the turns from then on',
        async run(site, t) {
            await site.ask({ question: 'Before opting out', conversationId: ID, save: true });
            await site.forget(ID);
            await site.ask({ question: 'While opted out', conversationId: ID, save: false });
            await site.ask({ question: 'After opting back in', conversationId: ID, save: true });
            t.equal('only the turn after opting back in is saved', site.savedChat(ID)?.turns.map((x) => x.q), ['After opting back in']);
        },
    },
    {
        id: 'fallback-flagged',
        title: 'An answer resting on no source is saved and flagged as fallback',
        async run(site, t) {
            await site.ask({ conversationId: ID, behaviour: 'fallback' });
            const turn = site.savedChat(ID)?.turns[0];
            t.equal('saved with fallback: true and no sources', [turn?.a, turn?.fallback, turn?.sources], [FALLBACK_TEXT, true, []]);
            await site.ask({ conversationId: ID });
            t.equal('a sourced answer has no fallback flag', site.savedChat(ID)?.turns[1]?.fallback, undefined);
        },
    },
    {
        id: 'declined-saves-what-visitor-saw',
        title: 'When Claude declines, the saved answer is the replacement the visitor saw, not the withdrawn text',
        async run(site, t) {
            const r = await site.ask({ conversationId: ID, behaviour: 'declined' });
            t.equal('the visitor saw the replacement', r.text, DECLINE_TEXT);
            const turn = site.savedChat(ID)?.turns[0];
            t.equal('the saved answer is the replacement', turn?.a, DECLINE_TEXT);
            t.ok('the withdrawn text is nowhere in the store', !site.redis.dump().includes(WITHDRAWN_TEXT));
        },
    },
    {
        id: 'failed-answers-not-saved',
        title: 'A failed or abandoned answer saves nothing',
        async run(site, t) {
            for (const behaviour of ['retrieval-error', 'error-after-billing', 'disconnect'] as const) {
                const r = await site.ask({ question: `Fails: ${behaviour}`, conversationId: ID, save: true, behaviour });
                t.ok(`${behaviour}: the visitor got an error event`, event(r, 'error') !== undefined);
                t.equal(`${behaviour}: nothing saved`, site.chatKeys(), []);
            }
            t.equal('not in the digest index', site.indexed(ID), false);
        },
    },
    {
        id: 'invalid-id-not-saved',
        title: 'A missing or malformed conversation id is answered but never saved',
        async run(site, t) {
            for (const conversationId of [undefined, 'short', 'has spaces in it', `x${'a'.repeat(64)}`, '../../etc/passwd']) {
                const r = await site.ask({ conversationId, save: true });
                t.ok(`id ${JSON.stringify(conversationId)}: answered`, event(r, 'done') !== undefined);
            }
            t.equal('nothing saved for any of them', site.chatKeys(), []);
            t.equal('a malformed id is refused by DELETE', (await site.forget('has spaces in it')).status, 400);
        },
    },
    {
        id: 'no-identifiers-stored',
        title: 'A saved chat holds nothing that identifies the visitor',
        async run(site, t) {
            const visitor: Visitor = await site.newDevice('203.0.113.77', 'Mozilla/5.0 EvalUA-unique-1234');
            await site.ask({ visitor, conversationId: ID, save: true });
            const c = site.savedChat(ID);
            const saved = JSON.stringify(c);
            const ids = site.idsOf(visitor);
            t.ok('no raw IP in the saved chat', !saved.includes(visitor.ip));
            t.ok('no user agent in the saved chat', !saved.includes(visitor.ua));
            t.ok('no device id in the saved chat', !saved.includes(visitor.device ?? '<none>'));
            t.ok('no visitor or IP hash in the saved chat', !saved.includes(ids.visitor) && !saved.includes(ids.ip));
            t.equal('the record holds only id, page, times and turns', Object.keys(c ?? {}).sort(), RECORD_KEYS);
            const extra = (c?.turns ?? []).flatMap((x) => Object.keys(x).filter((k) => !TURN_KEYS.has(k)));
            t.equal('each turn holds only question, answer, sources, time, fallback', extra, []);
            const dump = site.redis.dump();
            t.ok('the raw IP, user agent and device id appear nowhere in the store', !dump.includes(visitor.ip) && !dump.includes(visitor.ua) && !dump.includes(visitor.device ?? '<none>'));
        },
    },
    {
        id: 'conversations-isolated',
        title: 'Opting out of one chat leaves other chats alone',
        async run(site, t) {
            await site.ask({ question: 'In A', conversationId: ID, save: true });
            await site.ask({ question: 'In B', conversationId: OTHER, save: true, visitor: { ip: '198.51.100.5', ua: 'Other/1.0' } });
            await site.forget(ID);
            t.equal('chat A is gone', site.savedChat(ID), null);
            t.equal('chat B is intact', site.savedChat(OTHER)?.turns.map((x) => x.q), ['In B']);
            t.equal('only B is in the digest index', [site.indexed(ID), site.indexed(OTHER)], [false, true]);
        },
    },
];

const logging: SystemCriterion = {
    name: 'logging',
    title: 'Criterion #7: Consented Logging',
    goal: 'Chats are saved only while saving is allowed, exactly as the visitor saw them, are deleted on opt-out, and never hold anything that identifies the visitor.',
    scenarios,
};

export default logging;
