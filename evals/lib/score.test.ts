import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parseArgs } from './args';
import { loadDataset, selectItems, validateDataset, type EvalItem } from './dataset';
import { loadEvalEnv, REDIS_ENV_VARS } from './env';
import type { Grade, Label } from './grader';
import { hasHighStakesError, summarize } from './score';

const item = (id: string, highStakes = false): EvalItem => ({ id, question: `${id}?`, keyFacts: ['fact'], highStakes, category: 'test' });

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

    test('a low-stakes wrong statement on a high-stakes item does not count', () => {
        const r = result('role', 'Incorrect', { highStakes: true, grade: { wrongStatements: [{ statement: 'Used Vue', highStakes: false }] } });
        assert.equal(hasHighStakesError(r), false);
    });

    test('backstop: a contradicted fact on a high-stakes item with no wrong statements listed counts', () => {
        assert.equal(hasHighStakesError(result('role', 'Incorrect', { highStakes: true })), true);
        assert.equal(hasHighStakesError(result('skill', 'Incorrect', { highStakes: false })), false);
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
    });

    test('rejects duplicate ids and empty key facts', () => {
        assert.throws(() => validateDataset({ items: [item('a'), item('a')] }), /duplicate id/);
        assert.throws(() => validateDataset({ items: [{ ...item('a'), keyFacts: [] }] }), /keyFacts/);
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
