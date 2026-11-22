// Ask AI eval, criterion #8: Digest Fidelity.
//
//   npm run eval:digest                  every scenario
//   npm run eval:digest -- --id last-7-days-only
//
// The weekly email (Vercel Cron, Mondays: /api/assistant/digest) reports exactly the chats saved in
// the past 7 days, nothing opted out and nothing older, with correct counts and visitor text
// escaped; only Vercel Cron can trigger it. Runs the real digest handler on a fake site
// (evals/core/fakeSite.ts) with the email captured instead of sent: $0, no keys.
import { answerText, FAKE_ENV, SOURCE } from '../../core/fakeSite';
import type { Scenario, SystemCriterion } from '../../core/system';

const DAY = 24 * 60 * 60 * 1000;
const other = (n: number) => ({ ip: `198.51.100.${n}`, ua: `Other/${n}` });

const scenarios: Scenario[] = [
    {
        id: 'cron-secret-required',
        title: 'Only a request with the cron secret runs the digest',
        async run(site, t) {
            await site.ask({ conversationId: 'eval-convo-0001' });
            const none = await site.digest(null);
            const wrong = await site.digest('Bearer not-the-secret');
            t.equal('no Authorization header: 401', none.status, 401);
            t.equal('a wrong secret: 401', wrong.status, 401);
            t.equal('no email sent for either', site.emails.length, 0);
            t.equal('with the secret: sent', (await site.digest()).body, { ok: true, sent: true, conversations: 1 });
            t.equal('to the configured address, from the configured sender', site.emails.map((e) => [e.from, e.to]), [[FAKE_ENV.FROM_EMAIL, [FAKE_ENV.TO_EMAIL]]]);
        },
    },
    {
        id: 'last-7-days-only',
        title: 'Only chats updated in the past 7 days are included',
        async run(site, t) {
            await site.ask({ question: 'Old chat question', conversationId: 'eval-old-0001' });
            site.clock.tick(8 * DAY);
            await site.ask({ question: 'New chat question', conversationId: 'eval-new-0001', visitor: other(1) });
            const r = await site.digest();
            const html = site.emails[0]?.html ?? '';
            t.equal('one conversation reported', r.body, { ok: true, sent: true, conversations: 1 });
            t.ok('the new chat is in the email', html.includes('New chat question'));
            t.ok('the 8-day-old chat is not', !html.includes('Old chat question'));
            t.ok('the old chat is still stored (kept 90 days, just not re-sent)', site.savedChat('eval-old-0001') !== null);
        },
    },
    {
        id: 'old-chat-continued',
        title: 'An older chat the visitor continued this week is included, with all its turns',
        async run(site, t) {
            await site.ask({ question: 'Asked last month', conversationId: 'eval-cont-0001' });
            site.clock.tick(10 * DAY);
            await site.ask({ question: 'Asked this week', conversationId: 'eval-cont-0001' });
            await site.digest();
            const html = site.emails[0]?.html ?? '';
            t.ok('both turns are in the email', html.includes('Asked last month') && html.includes('Asked this week'));
        },
    },
    {
        id: 'excludes-opted-out',
        title: 'Opted-out chats are never in the email',
        async run(site, t) {
            await site.ask({ question: 'Deleted chat question', conversationId: 'eval-del-0001' });
            await site.forget('eval-del-0001');
            await site.ask({ question: 'Unsaved chat question', conversationId: 'eval-off-0001', save: false, visitor: other(2) });
            await site.ask({ question: 'Kept chat question', conversationId: 'eval-keep-0001', visitor: other(3) });
            const r = await site.digest();
            const html = site.emails[0]?.html ?? '';
            t.equal('one conversation reported', r.body, { ok: true, sent: true, conversations: 1 });
            t.ok('the kept chat is in', html.includes('Kept chat question'));
            t.ok('the deleted chat is not', !html.includes('Deleted chat question'));
            t.ok('the never-saved chat is not', !html.includes('Unsaved chat question'));
        },
    },
    {
        id: 'counts-and-content',
        title: 'The subject counts chats and questions; the body has every question and answer in order',
        async run(site, t) {
            const a = ['A1', 'A2'];
            const b = ['B1', 'B2', 'B3'];
            for (const q of a) await site.ask({ question: q, conversationId: 'eval-a-000001', page: '/about' });
            site.clock.tick(60_000);
            for (const q of b) await site.ask({ question: q, conversationId: 'eval-b-000001', visitor: other(4) });
            await site.digest();
            const email = site.emails[0];
            t.equal('subject', email?.subject, 'AI assistant weekly digest: 2 chat(s), 5 question(s)');
            const html = email?.html ?? '';
            const positions = [...a, ...b].map((q) => html.indexOf(`<b>Visitor:</b> ${q}<`));
            t.ok('every question appears, in order', positions.every((p, i) => p >= 0 && (i === 0 || p > positions[i - 1])), `positions ${positions.join(', ')}`);
            t.ok('every answer appears', [...a, ...b].every((q) => html.includes(answerText(q))));
            t.ok('each chat shows its page and question count', html.includes('on /about · 2 question(s)') && html.includes('on / · 3 question(s)'));
        },
    },
    {
        id: 'escapes-visitor-text',
        title: 'Visitor text is HTML-escaped in the email',
        async run(site, t) {
            await site.ask({ question: '<script>alert("x")</script> & <img src=x onerror=y>', conversationId: 'eval-xss-0001', page: '/"><b>page' });
            await site.digest();
            const html = site.emails[0]?.html ?? '';
            t.ok('no raw <script> or <img> from the visitor', !html.includes('<script>') && !html.includes('<img'));
            t.ok('the question is shown escaped', html.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &lt;img src=x onerror=y&gt;'));
            t.ok('the page is shown escaped', html.includes('/&quot;&gt;&lt;b&gt;page'));
        },
    },
    {
        id: 'fallback-and-sources',
        title: 'Fallback answers are marked "(no source)"; sourced answers list their sources',
        async run(site, t) {
            await site.ask({ question: 'Sourced', conversationId: 'eval-src-0001' });
            await site.ask({ question: 'Unsourced', conversationId: 'eval-src-0001', behaviour: 'fallback' });
            await site.digest();
            const html = site.emails[0]?.html ?? '';
            t.ok('the fallback answer is marked', html.includes('<b>Assistant (no source):</b>'));
            t.ok('the sourced answer lists its source', html.includes(`Sources: ${SOURCE.label}`));
            t.equal('only one answer is marked', html.split('(no source)').length - 1, 1);
        },
    },
    {
        id: 'quiet-week',
        title: 'A week with no saved chats sends nothing',
        async run(site, t) {
            await site.ask({ conversationId: 'eval-off-0001', save: false });
            t.equal('reported as not sent', (await site.digest()).body, { ok: true, sent: false, conversations: 0 });
            t.equal('no email', site.emails.length, 0);
        },
    },
    {
        id: 'retention-prune',
        title: 'Chats past 90 days are gone from the store and the index',
        async run(site, t) {
            await site.ask({ conversationId: 'eval-ret-0001' });
            site.clock.tick(91 * DAY);
            t.equal('nothing to send', (await site.digest()).body, { ok: true, sent: false, conversations: 0 });
            t.equal('the chat has expired', site.savedChat('eval-ret-0001'), null);
            t.equal('the digest pruned its index entry', site.indexed('eval-ret-0001'), false);
        },
    },
    {
        id: 'send-failure-reported',
        title: 'A failed send is reported as an error (so Vercel shows the cron failed)',
        async run(site, t) {
            await site.ask({ conversationId: 'eval-fail-0001' });
            site.sendFails = true;
            const r = await site.digest();
            t.equal('500 with ok: false', [r.status, r.body], [500, { ok: false, error: 'digest failed' }]);
        },
    },
    {
        id: 'not-configured-skips',
        title: 'Without the email settings the digest skips quietly',
        async run(site, t) {
            await site.ask({ conversationId: 'eval-cfg-0001' });
            const saved = process.env.RESEND_API_KEY;
            delete process.env.RESEND_API_KEY;
            try {
                t.equal('skipped', (await site.digest()).body, { ok: true, skipped: 'digest is not configured' });
                t.equal('no email', site.emails.length, 0);
            } finally {
                process.env.RESEND_API_KEY = saved;
            }
        },
    },
];

const digest: SystemCriterion = {
    name: 'digest',
    title: 'Criterion #8: Digest Fidelity',
    goal: 'The weekly email reports exactly the chats saved in the past 7 days (nothing opted out, nothing older), with correct counts and escaped visitor text, and only Vercel Cron can trigger it.',
    scenarios,
};

export default digest;
