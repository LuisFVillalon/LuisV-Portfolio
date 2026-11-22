import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, test } from 'node:test';
import { extractLinks, type CheckedLink } from '../../core/links';
import { verdictLine } from '../../core/summary';
import type { ContactGrade } from './grader';
import { checkContact, isContactLink, summarizeContact, type ContactCheck } from './score';
import { loadContactDataset, validateContactDataset, type ContactItem } from './dataset';

const CH = { contactPage: '/contact', email: 'luis@example.edu', linkedin: 'https://www.linkedin.com/in/someone/' };
const OK = { ok: true, detail: 'page' };
const BROKEN = { ok: false, detail: 'no such page or file' };
const grade = (contact: ContactGrade['contact'], answered = true): ContactGrade => ({ contact, quote: '', answered, reason: '', quoteUnverified: false, overrides: [] });
const checked = (answer: string, status = OK): CheckedLink[] => extractLinks(answer).map((l) => ({ ...l, status: l.kind === 'plain' ? { ok: false, detail: 'not rendered as a link' } : status }));
const check = (kind: 'hiring' | 'factual', answer: string, contact: ContactGrade['contact'], { fallback = false, status = OK, contactPage = OK } = {}) =>
    checkContact(kind, answer, grade(contact), checked(answer, status), fallback, contactPage, CH);

describe('isContactLink', () => {
    test('the contact page, the LinkedIn profile and a mailto to the address', () => {
        assert.ok(isContactLink('/contact', CH));
        assert.ok(isContactLink('/contact/', CH));
        assert.ok(isContactLink('https://linkedin.com/in/someone', CH));
        assert.ok(isContactLink('mailto:LUIS@example.edu', CH));
    });
    test('not the résumé, other pages, GitHub or another mailbox', () => {
        for (const h of ['/resumes/r.pdf', '/projects', '/', 'https://github.com/someone', 'mailto:other@example.edu', 'https://www.linkedin.com/in/someone-else'])
            assert.ok(!isContactLink(h, CH), h);
    });
});

describe('checkContact: hiring needs a clear offer AND a working contact link', () => {
    test('clear + working /contact link passes', () => {
        assert.equal(check('hiring', 'Reach out via the [contact page](/contact).', 'clear').pass, true);
    });
    test('clear + working LinkedIn link passes', () => {
        assert.equal(check('hiring', 'Message him on [LinkedIn](https://www.linkedin.com/in/someone/).', 'clear').pass, true);
    });
    test('clear but no link (only the button or a plain email) fails', () => {
        const c = check('hiring', 'Use the Message Luis button or email luis@example.edu.', 'clear');
        assert.equal(c.workingContactLink, false);
        assert.equal(c.pass, false);
    });
    test('a mailto link renders as plain text, so it is not a working link', () => {
        assert.equal(check('hiring', 'Email [Luis](mailto:luis@example.edu).', 'clear').pass, false);
    });
    test('a broken contact link fails', () => {
        assert.equal(check('hiring', 'See the [contact page](/contact).', 'clear', { status: BROKEN }).pass, false);
    });
    test('a working link but only a vague offer fails', () => {
        assert.equal(check('hiring', 'See the [contact page](/contact).', 'vague').pass, false);
    });
    test('a link to the résumé is not a contact link', () => {
        assert.equal(check('hiring', 'Get in touch! Here is his [résumé](/resumes/r.pdf).', 'clear').workingContactLink, false);
    });
    test("a fallback answer's Contact Luis button counts when the contact page works", () => {
        assert.equal(check('hiring', 'Use the Message Luis button below.', 'clear', { fallback: true }).pass, true);
        assert.equal(check('hiring', 'Use the Message Luis button below.', 'clear', { fallback: true, contactPage: BROKEN }).pass, false);
    });
});

describe('checkContact: factual must not pitch', () => {
    test('no offer and no contact link passes', () => {
        const c = check('factual', 'He studies at SDSU. See his [résumé](/resumes/r.pdf) or [projects](/projects).', 'none');
        assert.equal(c.pitched, false);
        assert.equal(c.pass, true);
    });
    test('any offer the grader finds is a pitch, vague included', () => {
        assert.equal(check('factual', 'He studies at SDSU. Feel free to reach out!', 'vague').pass, false);
    });
    test('code overrides a lenient grader: contact link, email in text, fallback buttons', () => {
        for (const [answer, fallback] of [
            ['SDSU. [Contact](/contact)', false],
            ['SDSU. [LinkedIn](https://linkedin.com/in/someone)', false],
            ['SDSU. luis@example.edu', false],
            ['SDSU. [mail](mailto:luis@example.edu)', false],
            ['I am not sure.', true],
        ] as const) {
            const c = check('factual', answer, 'none', { fallback });
            assert.equal(c.pitched, true, answer);
            assert.equal(c.graderMissedPitch, true, answer);
            assert.equal(c.codeSignals.length, 1, answer);
        }
    });
});

// ── summarizeContact ───────────────────────────────────────────────────────────────────────

const item = (id: string, kind: 'hiring' | 'factual'): ContactItem => ({ id, kind, turns: ['q'] });
const pass: Partial<ContactCheck> = { pass: true, pitched: false, contact: 'clear', workingContactLink: true, graderMissedPitch: false };
const r = (id: string, kind: 'hiring' | 'factual', c: Partial<ContactCheck> | null, extra: Record<string, unknown> = {}) => ({
    item: item(id, kind),
    check: c ? ({ ...pass, ...c } as ContactCheck) : undefined,
    grade: grade(c?.contact ?? 'none'),
    links: [] as CheckedLink[],
    answerCostUsd: 0.01,
    gradeCostUsd: 0.01,
    ...extra,
});
const hiring = (n: number, failing: number) => Array.from({ length: n }, (_, i) => r(`h${i}`, 'hiring', i < failing ? { pass: false, contact: 'vague' } : {}));
const factual = (n: number, pitched: number) =>
    Array.from({ length: n }, (_, i) => r(`f${i}`, 'factual', i < pitched ? { pass: false, pitched: true, contact: 'vague' } : { contact: 'none' }));

describe('summarizeContact: 9 of 10 hiring, at most 1 of 10 factual pitches', () => {
    test('9 hiring passes and 1 factual pitch pass', () => {
        const s = summarizeContact([...hiring(10, 1), ...factual(10, 1)]);
        assert.equal(s.hiring.needed, 9);
        assert.equal(s.factual.allowed, 1);
        assert.equal(s.pass, true, s.failures.join('; '));
        assert.equal(verdictLine(s), 'PASS');
    });
    test('8 hiring passes fail', () => {
        const s = summarizeContact([...hiring(10, 2), ...factual(10, 0)]);
        assert.equal(s.pass, false);
        assert.deepEqual(s.hiring.failedIds, ['h0', 'h1']);
    });
    test('2 factual pitches fail', () => {
        const s = summarizeContact([...hiring(10, 0), ...factual(10, 2)]);
        assert.equal(s.pass, false);
        assert.deepEqual(s.factual.pitchedIds, ['f0', 'f1']);
    });
    test('an error fails the run and counts as a hiring failure, not a factual pitch', () => {
        const s = summarizeContact([...hiring(9, 0), r('hx', 'hiring', null, { error: 'boom' }), ...factual(9, 0), r('fx', 'factual', null, { error: 'boom' })]);
        assert.equal(s.errors, 2);
        assert.equal(s.hiring.passed, 9);
        assert.equal(s.factual.pitched, 0);
        assert.equal(s.pass, false);
    });
    test('a partial run scales both lines; a cost-capped run always fails', () => {
        const s = summarizeContact([...hiring(2, 0), ...factual(2, 0)], 20);
        assert.equal(s.hiring.needed, 2);
        assert.equal(s.factual.allowed, 0);
        assert.equal(s.partial, true);
        assert.equal(s.pass, true);
        assert.match(verdictLine(s), /partial run/);
        assert.equal(summarizeContact([...hiring(2, 0)], 20, ['f0']).pass, false);
    });
    test('pitches on unanswered questions and grader misses are reported', () => {
        const s = summarizeContact([
            { ...r('f0', 'factual', { pass: false, pitched: true, contact: 'none', graderMissedPitch: true }), grade: grade('none', false) },
        ]);
        assert.equal(s.factual.pitchedUnanswered, 1);
        assert.deepEqual(s.graderMissed, ['f0']);
    });
    test('no items ran fails', () => {
        assert.equal(summarizeContact([]).pass, false);
    });
});

describe('contact dataset', () => {
    test('evals/criteria/contact/dataset.json is valid: 10 hiring and 10 factual, kinds alternating', () => {
        const d = loadContactDataset(path.join('evals', 'criteria', 'contact', 'dataset.json'));
        assert.equal(d.items.filter((i) => i.kind === 'hiring').length, 10);
        assert.equal(d.items.filter((i) => i.kind === 'factual').length, 10);
        d.items.forEach((it, i) => assert.equal(it.kind, i % 2 ? 'factual' : 'hiring', it.id));
    });
    test('rejects bad items', () => {
        assert.throws(
            () => validateContactDataset({ items: [{ id: 'a', kind: 'sales', turns: ['q'] }, { id: 'a', kind: 'hiring', turns: [] }, { kind: 'factual', turns: [' '] }] }),
            (e: Error) => /kind must be/.test(e.message) && /duplicate id/.test(e.message) && /turns must be/.test(e.message) && /missing id/.test(e.message),
        );
    });
});
