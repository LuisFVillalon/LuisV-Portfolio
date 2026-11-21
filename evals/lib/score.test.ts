import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parseArgs } from './args';
import { loadDataset, selectItems, validateDataset, type EvalItem } from './dataset';
import { loadEvalEnv, REDIS_ENV_VARS } from './env';
import type { Grade, Label } from './grader';
import { verdictLine } from './report';
import { hasHighStakesError, summarize } from './score';

const item = (id: string, highStakes = false): EvalItem => ({ id, question: `${id}?`, keyFacts: [{ fact: 'fact', highStakes }], category: 'test' });

const grade = (label: Label, over: Partial<Grade> = {}): Grade => ({
    label,
    facts: [{ fact: 'fact', verdict: label === 'Correct' ? 'present' : label === 'Partial' ? 'missing' : 'contradicted', evidence: '' }],
    wrongStatements: [],
    reason: '',
    ...over,
});

const result = (id: string, label: Label | null, over: { highStakes?: boolean; grade?: Partial<Grade>; error?: string } = {}) => ({
    item: item(id, over.highStakes),
    grade: label ? grade(label, over.grade) : undefined,
    error: over.error ?? (label ? undefined : 'boom'),
    answerCostUsd: 0.001,
    gradeCostUsd: 0.01,
});

const run = (correct: number, partial: number, incorrect: number) => [
    ...Array.from({ length: correct }, (_, i) => result(`c${i}`, 'Correct')),
    ...Array.from({ length: partial }, (_, i) => result(`p${i}`, 'Partial')),
    ...Array.from({ length: incorrect }, (_, i) => result(`i${i}`, 'Incorrect')),
];

describe('summarize: the 27-of-30 line', () => {
    test('27 Correct of 30 passes', () => {
        const s = summarize(run(27, 3, 0));
        assert.equal(s.needed, 27);
        assert.deepEqual(s.counts, { Correct: 27, Partial: 3, Incorrect: 0 });
        assert.equal(s.pass, true);
        assert.equal(s.partial, false);
    });

    test('26 Correct of 30 fails', () => {
        const s = summarize(run(26, 4, 0));
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /26 of 30 Correct; 27 needed/);
    });

    test('a non-high-stakes Incorrect still passes when 27 are Correct', () => {
        assert.equal(summarize(run(27, 2, 1)).pass, true);
    });

    test('30 Correct passes', () => {
        assert.equal(summarize(run(30, 0, 0)).pass, true);
    });

    test('partial runs need ceil(90%) and are flagged partial', () => {
        const s = summarize(run(3, 0, 0));
        assert.equal(s.needed, 3);
        assert.equal(s.partial, true);
        assert.equal(s.pass, true);
        assert.equal(summarize(run(9, 1, 0)).needed, 9);
        assert.equal(summarize(run(1, 0, 0)).needed, 1);
    });

    test('no questions is a failure', () => {
        const s = summarize([]);
        assert.equal(s.pass, false);
        assert.deepEqual(s.failures, ['no questions ran']);
    });

    test('totals the estimated cost', () => {
        const s = summarize(run(30, 0, 0));
        assert.ok(Math.abs(s.costUsd.total - 30 * 0.011) < 1e-9);
    });
});

describe('summarize: high-stakes facts', () => {
    test('one high-stakes wrong statement fails an otherwise perfect run', () => {
        const results = [...run(29, 0, 0), result('hs', 'Incorrect', { grade: { wrongStatements: [{ statement: 'Graduates 2026', highStakes: true }] } })];
        const s = summarize(results);
        assert.equal(s.counts.Correct, 29);
        assert.deepEqual(s.highStakesErrors, ['hs']);
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /wrong high-stakes fact in: hs/);
    });

    test('a high-stakes wrong statement counts on any item, not only high-stakes ones', () => {
        const r = result('skills', 'Incorrect', { highStakes: false, grade: { wrongStatements: [{ statement: 'Worked at Google', highStakes: true }] } });
        assert.equal(hasHighStakesError(r), true);
    });

    test('a low-stakes wrong statement does not count when no high-stakes fact is contradicted', () => {
        const r = result('role', 'Incorrect', {
            highStakes: true,
            grade: { facts: [{ fact: 'fact', verdict: 'present', evidence: '' }], wrongStatements: [{ statement: 'Used Vue', highStakes: false }] },
        });
        assert.equal(hasHighStakesError(r), false);
    });

    const roleItem: EvalItem = {
        id: 'edu-graduation',
        question: 'When does Luis graduate?',
        keyFacts: [
            { fact: 'Expected graduation: May 2027', highStakes: true },
            { fact: 'The app addresses food insecurity', highStakes: false },
        ],
        category: 'test',
    };
    const roleGrade = (gradVerdict: 'present' | 'contradicted', appVerdict: 'present' | 'contradicted', wrongStatements: Grade['wrongStatements']): Grade => ({
        label: 'Incorrect',
        facts: [
            { fact: 'Expected graduation: May 2027', verdict: gradVerdict, evidence: '' },
            { fact: 'the app addresses food insecurity ', verdict: appVerdict, evidence: '' },
        ],
        wrongStatements,
        reason: '',
    });

    test('a contradicted high-stakes fact counts even when the grader lists it as low-stakes', () => {
        const g = roleGrade('contradicted', 'present', [{ statement: 'Graduates May 2026', highStakes: false }]);
        assert.equal(hasHighStakesError({ item: roleItem, grade: g }), true);
    });

    test('a contradicted high-stakes fact counts when the grader lists only another low-stakes statement', () => {
        const g = roleGrade('contradicted', 'present', [{ statement: 'Used Vue', highStakes: false }]);
        assert.equal(hasHighStakesError({ item: roleItem, grade: g }), true);
    });

    test('a contradicted high-stakes fact counts with no wrong statements listed', () => {
        assert.equal(hasHighStakesError({ item: roleItem, grade: roleGrade('contradicted', 'present', []) }), true);
    });

    test('a contradicted descriptive fact on an item with high-stakes facts is Incorrect but not high-stakes', () => {
        const r = { item: roleItem, grade: roleGrade('present', 'contradicted', []), answerCostUsd: 0, gradeCostUsd: 0 };
        assert.equal(hasHighStakesError(r), false);
        const s = summarize([r], 1);
        assert.equal(s.counts.Incorrect, 1);
        assert.deepEqual(s.highStakesErrors, []);
    });
});

describe('summarize: the --max-cost cap', () => {
    test('a full run cut short by the cost cap fails even when every question run is Correct', () => {
        const skipped = ['s0', 's1', 's2', 's3', 's4'];
        const s = summarize(run(25, 0, 0), 30, skipped);
        assert.equal(s.counts.Correct, 25);
        assert.equal(s.pass, false);
        assert.equal(s.partial, false);
        assert.deepEqual(s.skippedByCostCap, skipped);
        assert.match(s.failures.join(), /cut short by the --max-cost cap: 5 question\(s\) not run/);
        assert.match(verdictLine(s), /^FAIL \(cut short by the --max-cost cap: 25 run, 5 not run: s0, s1, s2, s3, s4\)/);
    });

    test('a deliberate --limit run is partial, not cost-capped, and can pass', () => {
        const s = summarize(run(3, 0, 0), 30);
        assert.equal(s.pass, true);
        assert.equal(s.partial, true);
        assert.deepEqual(s.skippedByCostCap, []);
        assert.match(verdictLine(s), /^PASS \(partial run: 3 questions/);
    });

    test('a --limit run cut short by the cost cap still fails', () => {
        const s = summarize(run(2, 0, 0), 30, ['s0']);
        assert.equal(s.pass, false);
        assert.equal(s.partial, true);
        assert.match(verdictLine(s), /^FAIL \(cut short by the --max-cost cap/);
    });
});

describe('summarize: errors', () => {
    test('an answer or grading error counts as not Correct and fails the run', () => {
        const s = summarize([...run(29, 0, 0), result('e', null)]);
        assert.equal(s.errors, 1);
        assert.equal(s.counts.Correct, 29);
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /1 question\(s\) could not be answered or graded/);
    });
});

describe('dataset', () => {
    test('the shipped correctness dataset is valid: 30 unique items', () => {
        const d = loadDataset(path.join(process.cwd(), 'evals', 'correctness.json'));
        assert.equal(d.items.length, 30);
        assert.equal(new Set(d.items.map((i) => i.id)).size, 30);
        const grad = d.items.find((i) => i.id === 'edu-graduation');
        assert.ok(grad?.keyFacts.some((f) => f.fact === 'Expected graduation: May 2027' && f.highStakes));
        const secondCourse = d.items.find((i) => i.id === 'role-second-course');
        assert.equal(secondCourse?.keyFacts.find((f) => f.fact.startsWith('The app addresses food insecurity'))?.highStakes, false);
    });

    test('rejects duplicate ids and empty key facts', () => {
        assert.throws(() => validateDataset({ items: [item('a'), item('a')] }), /duplicate id/);
        assert.throws(() => validateDataset({ items: [{ ...item('a'), keyFacts: [] }] }), /keyFacts/);
        assert.throws(() => validateDataset({ items: [{ ...item('a'), keyFacts: ['plain string'] }] }), /keyFacts/);
        assert.throws(() => validateDataset({ items: [{ ...item('a'), keyFacts: [{ fact: 'x' }] }] }), /highStakes true or false/);
        assert.throws(() => validateDataset({}), /no "items"/);
    });

    test('selectItems applies --id and --limit', () => {
        const items = [item('a'), item('b'), item('c')];
        assert.deepEqual(selectItems(items, { limit: 2 }).map((i) => i.id), ['a', 'b']);
        assert.deepEqual(selectItems(items, { id: 'c' }).map((i) => i.id), ['c']);
        assert.equal(selectItems(items, {}).length, 3);
        assert.throws(() => selectItems(items, { id: 'z' }), /No item with id "z"/);
    });
});

describe('flags', () => {
    test('parses --limit, --id and --max-cost', () => {
        assert.deepEqual(parseArgs(['--limit', '3']), { limit: 3, maxCostUsd: 1 });
        assert.deepEqual(parseArgs(['--id', 'edu-graduation', '--max-cost', '0.25']), { id: 'edu-graduation', maxCostUsd: 0.25 });
    });

    test('rejects bad values and unknown flags', () => {
        assert.throws(() => parseArgs(['--limit', '0']), /positive whole number/);
        assert.throws(() => parseArgs(['--limit']), /needs a value/);
        assert.throws(() => parseArgs(['--limit', '2', '--id', 'x']), /not both/);
        assert.throws(() => parseArgs(['--fast']), /Unknown flag/);
    });
});

describe('environment', () => {
    test('removes the Redis variables and reports missing keys', () => {
        const env: Record<string, string | undefined> = { ANTHROPIC_API_KEY: 'k', UPSTASH_REDIS_REST_URL: 'u', UPSTASH_REDIS_REST_TOKEN: 't', KV_REST_API_URL: 'u', KV_REST_API_TOKEN: 't' };
        const missing = loadEvalEnv(env, path.join(os.tmpdir(), 'no-such-env-file'));
        for (const name of REDIS_ENV_VARS) assert.equal(env[name], undefined);
        assert.deepEqual(missing, ['VOYAGE_API_KEY', 'UPSTASH_VECTOR_REST_URL', 'UPSTASH_VECTOR_REST_TOKEN']);
        assert.equal(fs.existsSync(path.join(os.tmpdir(), 'no-such-env-file')), false);
    });
});
