import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, test } from 'node:test';
import { siteChunks } from '../../../src/app/lib/assistant/chunks/site';
import { loadShowcaseDataset, validateShowcaseDataset } from './dataset';
import type { CheckedLink } from '../../core/links';
import { verdictLine } from '../../core/summary';
import type { ShowcaseGrade } from './grader';
import { combineChecks, summarizeShowcase, type MatchCheck } from './score';

const ok = { ok: true, detail: 'HTTP 200' };
const link = (href: string, status = ok): CheckedLink => ({ text: href, href, kind: href.startsWith('/') ? 'site' : 'https', status });
const grade = (named: boolean, detail: 'concrete' | 'vague' | 'none' = 'concrete'): ShowcaseGrade => ({
    matches: [{ id: 'M1', named, nameQuote: '', detail, detailQuote: '', overrides: [] }],
    reason: '',
});
const pointsAt = (href: string) => href.includes('ross') || href === '/projects';
const M = [{ id: 'M1', name: 'ROSS', chunks: ['site:project:ross'] }];

describe('combineChecks: all three for the same match', () => {
    test('named + concrete + working link to it passes', () => {
        const [c] = combineChecks(M, grade(true), [link('https://github.com/x/ross')], [], pointsAt);
        assert.equal(c.pass, true);
    });
    test('a broken link to it fails', () => {
        const [c] = combineChecks(M, grade(true), [link('https://github.com/x/ross', { ok: false, detail: 'HTTP 404' })], [], pointsAt);
        assert.equal(c.workingLink, false);
        assert.equal(c.pass, false);
    });
    test('a working link to something else fails', () => {
        const [c] = combineChecks(M, grade(true), [link('/contact')], [], pointsAt);
        assert.equal(c.links.length, 0);
        assert.equal(c.pass, false);
    });
    test("a working source chip from the match's own chunk counts as its link", () => {
        const [c] = combineChecks(M, grade(true), [], [{ id: 'site:project:ross', status: ok }], pointsAt);
        assert.equal(c.chipLinked, true);
        assert.equal(c.pass, true);
    });
    test("a chip from another item's chunk, or a broken chip, does not count", () => {
        assert.equal(combineChecks(M, grade(true), [], [{ id: 'site:project:kanso', status: ok }], pointsAt)[0].pass, false);
        const broken = { ok: false, detail: 'HTTP 404' };
        assert.equal(combineChecks(M, grade(true), [], [{ id: 'site:project:ross', status: broken }], pointsAt)[0].pass, false);
    });
    test('a chip does not rescue a vague detail', () => {
        assert.equal(combineChecks(M, grade(true, 'vague'), [], [{ id: 'site:project:ross', status: ok }], pointsAt)[0].pass, false);
    });
    test('a plain-text URL to it does not count', () => {
        const plain: CheckedLink = { text: '', href: 'https://github.com/x/ross', kind: 'plain', status: { ok: false, detail: 'not rendered as a link' } };
        assert.equal(combineChecks(M, grade(true), [plain], [], pointsAt)[0].pass, false);
    });
    test('vague detail or not named fails', () => {
        assert.equal(combineChecks(M, grade(true, 'vague'), [link('/projects')], [], pointsAt)[0].pass, false);
        assert.equal(combineChecks(M, grade(false, 'none'), [link('/projects')], [], pointsAt)[0].pass, false);
    });
});

const check = (pass: boolean, over: Partial<MatchCheck> = {}): MatchCheck => ({
    id: 'M1',
    name: 'x',
    named: pass,
    detail: pass ? 'concrete' : 'vague',
    links: [],
    chipLinked: false,
    workingLink: pass,
    pass,
    ...over,
});
const result = (id: string, pass: boolean, kind: 'technical' | 'soft-skill' = 'technical', extra: Record<string, unknown> = {}) => ({
    item: { id, question: '?', kind, matches: [{ name: 'x', chunks: ['c'] }] },
    checks: [check(pass)],
    links: [] as CheckedLink[],
    answerCostUsd: 0.005,
    gradeCostUsd: 0.01,
    ...extra,
});
const run = (passing: number, failing: number) => [
    ...Array.from({ length: passing }, (_, i) => result(`p${i}`, true, i % 2 ? 'soft-skill' : 'technical')),
    ...Array.from({ length: failing }, (_, i) => result(`f${i}`, false)),
];

describe('summarizeShowcase: the 17-of-20 line', () => {
    test('17 of 20 passes', () => {
        const s = summarizeShowcase(run(17, 3));
        assert.equal(s.needed, 17);
        assert.equal(s.pass, true);
        assert.deepEqual(s.failedIds, ['f0', 'f1', 'f2']);
        assert.equal(s.byKind.technical.passed + s.byKind['soft-skill'].passed, 17);
    });
    test('16 of 20 fails', () => {
        const s = summarizeShowcase(run(16, 4));
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /16 of 20 answers showcase a best match; 17 needed/);
    });
    test('checks met for different matches do not add up to a pass', () => {
        const split = result('split', false, 'technical', {
            checks: [check(false, { named: true, detail: 'concrete' }), check(false, { id: 'M2', workingLink: true })],
        });
        const s = summarizeShowcase([split], 1);
        assert.equal(s.met.named, 1);
        assert.equal(s.met.workingLink, 1);
        assert.equal(s.passed, 0);
    });
    test('counts passes that rest only on a source chip', () => {
        const viaChip = result('chip', true, 'technical', { checks: [check(true, { chipLinked: true })] });
        const viaText = result('text', true, 'technical', { checks: [check(true, { links: [link('/projects')] })] });
        const s = summarizeShowcase([viaChip, viaText], 2);
        assert.equal(s.passed, 2);
        assert.equal(s.passedOnlyViaChip, 1);
    });
    test('a broken source chip is listed as a broken link', () => {
        const r = result('a', false, 'technical', { chips: [{ id: 'x', label: 'GitHub · x', href: 'https://github.com/x', status: { ok: false, detail: 'HTTP 404' } }] });
        assert.deepEqual(summarizeShowcase([r], 1).brokenLinks, [{ id: 'a', href: 'https://github.com/x', detail: 'HTTP 404' }]);
    });
    test('lists broken and unverified links', () => {
        const r = result('a', true, 'technical', {
            links: [link('https://gone', { ok: false, detail: 'HTTP 404' }), link('https://li', { ok: true, unverified: true, detail: 'HTTP 999' } as never)],
        });
        const s = summarizeShowcase([r], 1);
        assert.deepEqual(s.brokenLinks, [{ id: 'a', href: 'https://gone', detail: 'HTTP 404' }]);
        assert.equal(s.unverifiedLinks.length, 1);
    });
});

describe('summarizeShowcase: errors, cost cap and partial runs', () => {
    test('any error fails the run', () => {
        const s = summarizeShowcase([...run(19, 0), result('e', true, 'technical', { error: 'boom' })]);
        assert.equal(s.errors, 1);
        assert.equal(s.passed, 19);
        assert.equal(s.pass, false);
    });
    test('a cost-capped run always fails', () => {
        const s = summarizeShowcase(run(5, 0), 20, ['x']);
        assert.equal(s.pass, false);
        assert.match(verdictLine(s), /cut short by the --max-cost cap: 5 run, 1 not run: x/);
    });
    test('a --limit run applies 85% to the questions run and is marked partial', () => {
        const s = summarizeShowcase(run(3, 0));
        assert.equal(s.needed, 3);
        assert.equal(s.partial, true);
        assert.match(verdictLine(s), /^PASS \(partial run: 3 questions/);
    });
    test('no questions run fails', () => assert.equal(summarizeShowcase([]).pass, false));
});

describe('the showcase dataset', () => {
    test('validation catches bad items and unknown chunk ids', () => {
        const bad = { items: [{ id: 'a', question: 'q', kind: 'other', matches: [{ name: 'x', chunks: ['site:nope'] }] }, { id: 'a', question: '', kind: 'technical', matches: [] }] };
        assert.throws(() => validateShowcaseDataset(bad, new Set(['site:ok'])), (e: Error) => {
            for (const p of [/kind must be/, /unknown chunk "site:nope"/, /duplicate id/, /missing question/, /matches must be a non-empty list/]) assert.match(e.message, p);
            return true;
        });
    });
    test('the dataset: 20 questions, both kinds, every chunk id exists in the corpus', () => {
        const ids = new Set(siteChunks().map((c) => c.id));
        const d = loadShowcaseDataset(path.join('evals', 'criteria', 'showcase', 'dataset.json'), ids);
        assert.equal(d.items.length, 20);
        const kinds = new Set(d.items.map((i) => i.kind));
        assert.ok(kinds.has('technical') && kinds.has('soft-skill'));
    });
});
