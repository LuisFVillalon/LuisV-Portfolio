import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { verdictLine } from '../../core/summary';
import type { Claim, FaithfulnessGrade } from './grader';
import { summarizeFaithfulness } from './score';

const claims = (supported: number, unsupported = 0): Claim[] => [
    ...Array.from({ length: supported }, (_, i): Claim => ({ claim: `s${i}`, verdict: 'supported', sourceIds: ['S1'], evidence: '' })),
    ...Array.from({ length: unsupported }, (_, i): Claim => ({ claim: `u${i}`, verdict: 'unsupported', sourceIds: [], evidence: '' })),
];

const result = (id: string, grade: FaithfulnessGrade | null, error?: string) => ({
    item: { id, question: `${id}?`, category: 'test' },
    grade: grade ?? undefined,
    error: error ?? (grade ? undefined : 'boom'),
    answerCostUsd: 0.001,
    gradeCostUsd: 0.02,
});

/** n answers of `perAnswer` supported claims, then `dirty` answers with one unsupported claim each. */
const run = (clean: number, dirty: number, perAnswer = 10) => [
    ...Array.from({ length: clean }, (_, i) => result(`c${i}`, { claims: claims(perAnswer), reason: '' })),
    ...Array.from({ length: dirty }, (_, i) => result(`d${i}`, { claims: claims(perAnswer - 1, 1), reason: '' })),
];

describe('summarizeFaithfulness: the 38-of-40 line', () => {
    test('38 clean answers of 40 passes', () => {
        const s = summarizeFaithfulness(run(38, 2));
        assert.equal(s.cleanNeeded, 38);
        assert.equal(s.cleanAnswers, 38);
        assert.deepEqual(s.dirtyAnswers, ['d0', 'd1']);
        assert.equal(s.pass, true);
        assert.equal(s.partial, false);
    });
    test('37 clean answers of 40 fails, even with a high claim rate', () => {
        const s = summarizeFaithfulness(run(37, 3));
        assert.ok(s.claimRate > 0.99);
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /37 of 40 answers fully supported; 38 needed/);
    });
    test('an answer with no claims (a polite decline) is clean', () => {
        const s = summarizeFaithfulness([...run(39, 0), result('decline', { claims: [], reason: '' })]);
        assert.equal(s.cleanAnswers, 40);
        assert.equal(s.pass, true);
    });
});

describe('summarizeFaithfulness: the 95% claim line', () => {
    test('exactly 95% of claims supported passes', () => {
        // 38 answers × 10 supported, 2 answers × (0 supported + 10 unsupported): 380 of 400 = 95%.
        const rs = [...run(38, 0), result('d0', { claims: claims(0, 10), reason: '' }), result('d1', { claims: claims(0, 10), reason: '' })];
        const s = summarizeFaithfulness(rs);
        assert.equal(s.claims.total, 400);
        assert.equal(s.claims.unsupported, 20);
        assert.equal(s.claimRate, 0.95);
        assert.equal(s.pass, true);
    });
    test('below 95% fails, even with 38 clean answers', () => {
        const rs = [...run(38, 0), result('d0', { claims: claims(0, 11), reason: '' }), result('d1', { claims: claims(0, 11), reason: '' })];
        const s = summarizeFaithfulness(rs);
        assert.equal(s.cleanAnswers, 38);
        assert.ok(s.claimRate < 0.95);
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /of claims supported/);
    });
    test('no claims at all counts as a 100% claim rate', () => {
        const s = summarizeFaithfulness([result('a', { claims: [], reason: '' })], 1);
        assert.equal(s.claimRate, 1);
        assert.equal(s.pass, true);
    });
});

describe('summarizeFaithfulness: errors, cost cap and partial runs', () => {
    test('any error fails the run and the errored answer is not clean', () => {
        const s = summarizeFaithfulness([...run(39, 0), result('e', null)]);
        assert.equal(s.errors, 1);
        assert.equal(s.cleanAnswers, 39);
        assert.equal(s.pass, false);
        assert.match(s.failures.join(), /could not be answered or graded/);
    });
    test('an error with a grade still counts as an error', () => {
        const s = summarizeFaithfulness([result('e', { claims: claims(3), reason: '' }, 'grader stopped')], 1);
        assert.equal(s.errors, 1);
        assert.equal(s.claims.total, 0);
        assert.equal(s.pass, false);
    });
    test('a cost-capped run always fails and lists what did not run', () => {
        const s = summarizeFaithfulness(run(10, 0), 40, ['x', 'y']);
        assert.equal(s.pass, false);
        assert.match(verdictLine(s), /cut short by the --max-cost cap: 10 run, 2 not run: x, y/);
    });
    test('no questions run fails', () => assert.equal(summarizeFaithfulness([]).pass, false));
    test('a --limit run applies the 95% rule to the questions run and is marked partial', () => {
        const s = summarizeFaithfulness(run(3, 0));
        assert.equal(s.cleanNeeded, 3);
        assert.equal(s.partial, true);
        assert.equal(s.pass, true);
        assert.match(verdictLine(s), /^PASS \(partial run: 3 questions/);
    });
    test('costs add up', () => {
        const s = summarizeFaithfulness(run(2, 0));
        assert.equal(s.costUsd.total.toFixed(3), '0.042');
    });
});
