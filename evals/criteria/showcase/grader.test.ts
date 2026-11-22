import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { quoteInAnswer } from '../../core/quotes';
import { parseShowcaseOutput, showcaseRequest, showcaseUserMessage } from './grader';

const ANSWER =
    'Yes. At **Ectron Corporation** Luis mentored three interns while building an asset tracker with [Azure Maps](https://azure.microsoft.com). He also co-launched a ColorStack chapter.';

const judgment = (over: Record<string, unknown> = {}) => ({
    id: 'M1',
    named: true,
    nameQuote: 'Ectron Corporation',
    detail: 'concrete',
    detailQuote: 'mentored three interns',
    ...over,
});
const output = (...matches: Record<string, unknown>[]) => JSON.stringify({ matches, reason: 'r' });

describe('quoteInAnswer', () => {
    test('ignores case, bold and spacing, and reads link text', () => {
        assert.ok(quoteInAnswer('at ectron corporation', ANSWER));
        assert.ok(quoteInAnswer('asset tracker with Azure Maps', ANSWER));
        assert.ok(!quoteInAnswer('mentored five interns', ANSWER));
        assert.ok(!quoteInAnswer('', ANSWER));
    });
});

describe('parseShowcaseOutput', () => {
    test('keeps a named, concrete judgment whose quotes are in the answer', () => {
        const g = parseShowcaseOutput(output(judgment(), judgment({ id: 'M2', nameQuote: 'ColorStack', detail: 'vague', detailQuote: '' })), ['M1', 'M2'], ANSWER);
        assert.equal(g.matches[0].named, true);
        assert.equal(g.matches[0].detail, 'concrete');
        assert.deepEqual(g.matches[0].overrides, []);
        assert.equal(g.matches[1].detail, 'vague');
    });
    test('a name quote not in the answer means not named, and then no detail', () => {
        const g = parseShowcaseOutput(output(judgment({ nameQuote: 'his Ectron internship' })), ['M1'], ANSWER);
        assert.equal(g.matches[0].named, false);
        assert.equal(g.matches[0].detail, 'none');
        assert.equal(g.matches[0].overrides.length, 2);
    });
    test('a concrete detail whose quote is not in the answer is vague', () => {
        const g = parseShowcaseOutput(output(judgment({ detailQuote: 'mentored five interns' })), ['M1'], ANSWER);
        assert.equal(g.matches[0].named, true);
        assert.equal(g.matches[0].detail, 'vague');
        assert.match(g.matches[0].overrides[0], /not in the answer/);
    });
    test('not named forces detail none', () => {
        const g = parseShowcaseOutput(output(judgment({ named: false, nameQuote: '' })), ['M1'], ANSWER);
        assert.equal(g.matches[0].detail, 'none');
    });
    test('every match needs exactly one judgment, and no unknown ids', () => {
        assert.throws(() => parseShowcaseOutput(output(judgment()), ['M1', 'M2'], ANSWER), /0 judgments for match M2/);
        assert.throws(() => parseShowcaseOutput(output(judgment(), judgment()), ['M1'], ANSWER), /2 judgments for match M1/);
        assert.throws(() => parseShowcaseOutput(output(judgment(), judgment({ id: 'M9' })), ['M1'], ANSWER), /unknown matches: M9/);
    });
    test('bad output throws', () => {
        assert.throws(() => parseShowcaseOutput('nope', ['M1'], ANSWER), /not JSON/);
        assert.throws(() => parseShowcaseOutput(output(judgment({ detail: 'great' })), ['M1'], ANSWER), /detail is invalid/);
        assert.throws(() => parseShowcaseOutput(JSON.stringify({ matches: [] }), ['M1'], ANSWER), /reason is missing/);
    });
});

describe('showcaseRequest', () => {
    test('sends every match with its reference, and uses structured output', () => {
        const matches = [{ id: 'M1', name: 'Ectron "intern"', reference: 'Mentored three interns' }];
        const msg = showcaseUserMessage('Leadership?', ANSWER, matches);
        assert.match(msg, /<match id="M1" name="Ectron &quot;intern&quot;">\nMentored three interns\n<\/match>/);
        assert.match(msg, /<answer>\n[\s\S]*Ectron Corporation[\s\S]*<\/answer>/);
        const req = showcaseRequest('Leadership?', ANSWER, matches);
        assert.equal(req.output_config?.format?.type, 'json_schema');
    });
});
