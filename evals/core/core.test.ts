// Tests for the shared harness: flags, environment, dataset checks and the shared summary rules.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ANSWER_MODELS, parseArgs } from './args';
import { selectItems, validateItems } from './dataset';
import { loadEvalEnv, REDIS_ENV_VARS } from './env';
import { conversationMessage, parseJsonObject } from './grader';
import { missingQuote, quoteInAnswer } from './quotes';
import { neededFor, runSummary, verdictLine } from './summary';

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
    test('a criterion can set its own default cost cap, and --max-cost overrides it', () => {
        assert.equal(parseArgs([], 1.5).maxCostUsd, 1.5);
        assert.equal(parseArgs(['--max-cost', '0.3'], 1.5).maxCostUsd, 0.3);
        assert.equal(parseArgs([]).maxCostUsd, 1);
    });
});

describe('--model', () => {
    test('is unset by default, so the site model answers', () => assert.equal(parseArgs([]).model, undefined));
    test('accepts a model with a known price', () => assert.equal(parseArgs(['--model', 'claude-sonnet-5-5']).model, 'claude-sonnet-5-5'));
    test('rejects a model it has no price for, so the cost cap stays honest', () => assert.throws(() => parseArgs(['--model', 'gpt-4o']), /--model must be one of/));
    test('needs a value', () => assert.throws(() => parseArgs(['--model']), /needs a value/));
    test('accepts exactly the models the assistant has prices for', async () => {
        const { MODEL_PRICES } = await import('../../src/app/lib/assistant/config');
        assert.deepEqual([...ANSWER_MODELS].sort(), Object.keys(MODEL_PRICES).sort());
    });
    test('costUsd prices each call by the configured model', async () => {
        const usage = { input_tokens: 1_000_000, output_tokens: 1_000_000, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
        const { ASSISTANT } = await import('../../src/app/lib/assistant/config');
        const { costUsd } = await import('../../src/app/lib/assistant/usage');
        const original = ASSISTANT.model;
        try {
            (ASSISTANT as { model: string }).model = 'claude-sonnet-5-5';
            assert.equal(costUsd(usage), 12);
            (ASSISTANT as { model: string }).model = 'claude-haiku-5-5';
            assert.equal(costUsd(usage), 0.6);
            (ASSISTANT as { model: string }).model = 'some-unpriced-model';
            assert.throws(() => costUsd(usage), /No prices for some-unpriced-model/);
        } finally {
            (ASSISTANT as { model: string }).model = original;
        }
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

describe('datasets', () => {
    test('validateItems checks ids and lists every problem at once', () => {
        const check = (item: { question?: string }, problem: (m: string) => void) => {
            if (!item.question) problem('missing question');
        };
        assert.throws(() => validateItems({ items: [{ id: 'a', question: 'q' }, { id: 'a' }, {}] }, check), (e: Error) => {
            for (const p of [/items\[1\] \(a\): duplicate id/, /items\[1\] \(a\): missing question/, /items\[2\]: missing id/]) assert.match(e.message, p);
            return true;
        });
        assert.throws(() => validateItems({}, check), /no "items" array/);
        assert.equal(validateItems({ items: [{ id: 'a', question: 'q' }] }, check).items.length, 1);
    });
    test('selectItems applies --id and --limit', () => {
        const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
        assert.deepEqual(selectItems(items, { limit: 2 }).map((i) => i.id), ['a', 'b']);
        assert.deepEqual(selectItems(items, { id: 'c' }).map((i) => i.id), ['c']);
        assert.equal(selectItems(items, {}).length, 3);
        assert.throws(() => selectItems(items, { id: 'z' }), /No item with id "z"/);
    });
});

describe('grader helpers', () => {
    test('parseJsonObject rejects text and non-objects', () => {
        assert.throws(() => parseJsonObject('Correct!'), /not JSON/);
        assert.throws(() => parseJsonObject('3'), /not an object/);
        assert.deepEqual(parseJsonObject('{"a":1}'), { a: 1 });
    });
    test('conversationMessage puts earlier turns first, only when there are some', () => {
        const two = conversationMessage([
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
        ]).join('\n');
        assert.match(two, /Earlier in the conversation:\n<visitor>Q1<\/visitor>\n<assistant>A1<\/assistant>[\s\S]*Visitor's message: Q2[\s\S]*<answer>\nA2\n<\/answer>/);
        assert.doesNotMatch(conversationMessage([{ question: 'q', answer: 'a' }]).join('\n'), /Earlier/);
    });
    test('quoteInAnswer ignores case, Markdown and link syntax; empty quotes never match', () => {
        assert.ok(quoteInAnswer('built ROSS', 'He **built** [ROSS](https://github.com/x/ross).'));
        assert.ok(!quoteInAnswer('', 'anything'));
        assert.equal(missingQuote(''), 'is empty');
        assert.equal(missingQuote('x'), '"x" is not in the answer');
    });
});

describe('shared summary rules', () => {
    const costed = (n: number) => Array.from({ length: n }, () => ({ answerCostUsd: 0.001, gradeCostUsd: 0.01 }));
    const base = { datasetSize: 30, skippedByCostCap: [], unit: 'question' as const, rule: 'the 27-of-30 line applies', errors: 0, failures: [] };
    test('neededFor rounds up without float error', () => {
        assert.equal(neededFor(0.9, 30), 27);
        assert.equal(neededFor(0.95, 40), 38);
        assert.equal(neededFor(0.85, 20), 17);
        assert.equal(neededFor(0.9, 3), 3);
    });
    test('failures come in order: cost cap, nothing ran, the criterion’s own, errors', () => {
        assert.deepEqual(runSummary([], { ...base, skippedByCostCap: ['a'], failures: ['own'], errors: 2 }).failures, [
            'cut short by the --max-cost cap: 1 question(s) not run',
            'no questions ran',
            'own',
            '2 question(s) could not be answered or graded',
        ]);
    });
    test('the verdict line says when a run is partial or cut short', () => {
        assert.equal(verdictLine(runSummary(costed(30), base)), 'PASS');
        assert.equal(verdictLine(runSummary(costed(3), base)), 'PASS (partial run: 3 questions; the 27-of-30 line applies to the full set)');
        assert.match(verdictLine(runSummary(costed(2), { ...base, skippedByCostCap: ['x'] })), /^FAIL \(cut short by the --max-cost cap: 2 run, 1 not run: x\)/);
    });
    test('costs add up', () => {
        const s = runSummary(costed(10), base);
        assert.ok(Math.abs(s.costUsd.total - 0.11) < 1e-9);
    });
});
