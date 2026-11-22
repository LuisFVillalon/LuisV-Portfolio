import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { EvalItem } from './dataset';
import { graderCostUsd, GRADER_MODEL } from '../../core/grader';
import { graderRequest, highStakesReference, labelFromVerdicts, parseGraderOutput } from './grader';

const facts = ['Expected graduation: May 2027', 'From San Diego State University'];

const output = (over: Record<string, unknown> = {}) =>
    JSON.stringify({
        facts: [
            { fact: facts[0], verdict: 'present', evidence: 'graduates in May 2027' },
            { fact: facts[1], verdict: 'present', evidence: 'SDSU' },
        ],
        wrongStatements: [],
        label: 'Correct',
        reason: 'All facts present.',
        ...over,
    });

describe('labelFromVerdicts', () => {
    test('all present and nothing wrong is Correct', () => {
        assert.equal(labelFromVerdicts([{ verdict: 'present' }, { verdict: 'present' }], []), 'Correct');
    });
    test('a missing fact with nothing wrong is Partial', () => {
        assert.equal(labelFromVerdicts([{ verdict: 'present' }, { verdict: 'missing' }], []), 'Partial');
    });
    test('a contradicted fact is Incorrect, even alongside missing ones', () => {
        assert.equal(labelFromVerdicts([{ verdict: 'missing' }, { verdict: 'contradicted' }], []), 'Incorrect');
    });
    test('a wrong statement is Incorrect even when every key fact is present', () => {
        assert.equal(labelFromVerdicts([{ verdict: 'present' }], [{ statement: 'x', highStakes: false }]), 'Incorrect');
    });
});

describe('parseGraderOutput', () => {
    test('parses a well-formed Correct grade', () => {
        const g = parseGraderOutput(output(), facts);
        assert.equal(g.label, 'Correct');
        assert.equal(g.graderLabel, undefined);
        assert.equal(g.facts.length, 2);
        assert.deepEqual(g.wrongStatements, []);
    });

    test('a lenient label is overridden by the grader’s own fact verdicts', () => {
        const g = parseGraderOutput(
            output({ facts: [{ fact: facts[0], verdict: 'missing', evidence: '' }, { fact: facts[1], verdict: 'present', evidence: 'SDSU' }] }),
            facts,
        );
        assert.equal(g.label, 'Partial');
        assert.equal(g.graderLabel, 'Correct');
    });

    test('wrong statements force Incorrect', () => {
        const g = parseGraderOutput(output({ label: 'Partial', wrongStatements: [{ statement: 'Graduates May 2026', highStakes: true }] }), facts);
        assert.equal(g.label, 'Incorrect');
        assert.equal(g.graderLabel, 'Partial');
        assert.deepEqual(g.wrongStatements, [{ statement: 'Graduates May 2026', highStakes: true }]);
    });

    test('a stricter label than the verdicts imply is kept', () => {
        const g = parseGraderOutput(output({ label: 'Incorrect' }), facts);
        assert.equal(g.label, 'Incorrect');
        assert.equal(g.graderLabel, undefined);
    });

    test('matches key facts ignoring case and surrounding space', () => {
        const g = parseGraderOutput(
            output({ facts: [{ fact: ` ${facts[0].toUpperCase()} `, verdict: 'present', evidence: '' }, { fact: facts[1], verdict: 'present', evidence: '' }] }),
            facts,
        );
        assert.equal(g.label, 'Correct');
    });

    test('rejects output that is not JSON', () => {
        assert.throws(() => parseGraderOutput('Correct!', facts), /not JSON/);
    });

    test('rejects an unknown label', () => {
        assert.throws(() => parseGraderOutput(output({ label: 'Mostly right' }), facts), /label is invalid/);
    });

    test('rejects an unknown fact verdict', () => {
        assert.throws(
            () => parseGraderOutput(output({ facts: [{ fact: facts[0], verdict: 'partly', evidence: '' }, { fact: facts[1], verdict: 'present', evidence: '' }] }), facts),
            /facts\[0\] is invalid/,
        );
    });

    test('rejects a grade that skips a key fact', () => {
        assert.throws(() => parseGraderOutput(output({ facts: [{ fact: facts[0], verdict: 'present', evidence: '' }] }), facts), /0 verdicts for key fact/);
    });

    test('rejects a grade that judges a fact twice', () => {
        const twice = [
            { fact: facts[0], verdict: 'present', evidence: '' },
            { fact: facts[0], verdict: 'missing', evidence: '' },
            { fact: facts[1], verdict: 'present', evidence: '' },
        ];
        assert.throws(() => parseGraderOutput(output({ facts: twice }), facts), /2 verdicts for key fact/);
    });

    test('rejects an extra, unrequested fact', () => {
        const extra = [...JSON.parse(output()).facts, { fact: 'Something else', verdict: 'present', evidence: '' }];
        assert.throws(() => parseGraderOutput(output({ facts: extra }), facts), /3 fact verdicts for 2 key facts/);
    });

    test('rejects a malformed wrong statement', () => {
        assert.throws(() => parseGraderOutput(output({ wrongStatements: [{ statement: 'x' }] }), facts), /wrongStatements\[0\] is invalid/);
    });

    test('rejects missing fields', () => {
        assert.throws(() => parseGraderOutput(JSON.stringify({ label: 'Correct', reason: '', facts: [] }), facts), /wrongStatements are missing/);
        assert.throws(() => parseGraderOutput(JSON.stringify({ label: 'Correct', facts: [], wrongStatements: [] }), facts), /reason is missing/);
    });
});

describe('grader request', () => {
    const item: EvalItem = {
        id: 'edu-graduation',
        question: 'When does Luis graduate?',
        keyFacts: [
            { fact: facts[0], highStakes: true },
            { fact: facts[1], highStakes: false },
        ],
        category: 'education',
        note: 'private reviewer note',
    };

    test('uses the stronger grader model with a JSON schema output format', () => {
        const req = graderRequest(item, 'May 2027.', []);
        assert.equal(req.model, GRADER_MODEL);
        assert.equal(req.output_config?.format?.type, 'json_schema');
    });

    test('includes the question, key facts and answer but not the reviewer note', () => {
        const content = graderRequest(item, 'He graduates in May 2027.', ['Ref fact']).messages[0].content as string;
        assert.match(content, /When does Luis graduate\?/);
        assert.match(content, /- Expected graduation: May 2027/);
        assert.match(content, /- From San Diego State University/);
        assert.match(content, /He graduates in May 2027\./);
        assert.match(content, /- Ref fact/);
        assert.doesNotMatch(content, /private reviewer note/);
    });

    test('the reference lists high-stakes facts only, once each', () => {
        const items: EvalItem[] = [
            item,
            { ...item, id: 'dup' },
            { id: 'skills', question: 'Skills?', keyFacts: [{ fact: 'Python', highStakes: false }], category: 'skills' },
        ];
        assert.deepEqual(highStakesReference(items), ['Expected graduation: May 2027 (re: When does Luis graduate?)']);
    });

    test('grader cost uses Sonnet prices', () => {
        const usd = graderCostUsd({ input_tokens: 1_000_000, output_tokens: 100_000, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 });
        assert.equal(usd, 3);
    });
});
