import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { contactRequest, contactUserMessage, parseContactOutput } from './grader';

const ANSWER = 'Luis studies Computer Science at **SDSU**. Want to talk? Reach him through the [contact page](/contact) or the **Message Luis** button.';
const out = (over: Record<string, unknown> = {}) => JSON.stringify({ contact: 'clear', quote: 'Reach him through the contact page', answered: true, reason: 'r', ...over });
const CH = { contactPage: '/contact', email: 'luis@example.edu', linkedin: 'https://www.linkedin.com/in/someone/' };

describe('parseContactOutput', () => {
    test('keeps a clear offer whose quote is in the answer (reads link text)', () => {
        const g = parseContactOutput(out(), ANSWER, 'hiring');
        assert.equal(g.contact, 'clear');
        assert.deepEqual(g.overrides, []);
        assert.equal(g.quoteUnverified, false);
    });
    test('hiring: a clear offer with a quote not in the answer drops to vague', () => {
        const g = parseContactOutput(out({ quote: 'email him today' }), ANSWER, 'hiring');
        assert.equal(g.contact, 'vague');
        assert.equal(g.overrides.length, 1);
    });
    test('hiring: an empty quote on a clear offer drops to vague', () => {
        assert.equal(parseContactOutput(out({ quote: '' }), ANSWER, 'hiring').contact, 'vague');
    });
    test('factual: a pitch with a quote not in the answer stands, flagged for a human', () => {
        const g = parseContactOutput(out({ contact: 'vague', quote: 'email him today' }), ANSWER, 'factual');
        assert.equal(g.contact, 'vague');
        assert.equal(g.quoteUnverified, true);
        assert.deepEqual(g.overrides, []);
    });
    test('none needs no quote', () => {
        const g = parseContactOutput(out({ contact: 'none', quote: '' }), 'Luis studies at SDSU.', 'factual');
        assert.equal(g.contact, 'none');
        assert.equal(g.quoteUnverified, false);
    });
    test('rejects malformed output', () => {
        assert.throws(() => parseContactOutput('not json', ANSWER, 'hiring'), /not JSON/);
        assert.throws(() => parseContactOutput(out({ contact: 'maybe' }), ANSWER, 'hiring'), /contact is invalid/);
        assert.throws(() => parseContactOutput(out({ answered: 'yes' }), ANSWER, 'hiring'), /answered is invalid/);
        assert.throws(() => parseContactOutput(JSON.stringify({ contact: 'none', quote: '', answered: true }), ANSWER, 'hiring'), /reason/);
    });
});

describe('contactUserMessage / contactRequest', () => {
    test('earlier turns are context; the last answer is the one graded', () => {
        const msg = contactUserMessage([
            { question: 'What is ROSS?', answer: 'An AI app.' },
            { question: "We're hiring.", answer: 'Great, reach out!' },
        ]);
        assert.match(msg, /Earlier in the conversation:\n<visitor>What is ROSS\?<\/visitor>\n<assistant>An AI app\.<\/assistant>/);
        assert.match(msg, /Visitor's message: We're hiring\.\n\n<answer>\nGreat, reach out!\n<\/answer>$/);
    });
    test('a single turn has no earlier-conversation block', () => {
        assert.doesNotMatch(contactUserMessage([{ question: 'q', answer: 'a' }]), /Earlier/);
    });
    test('the grader is told every channel and never which half the item is in', () => {
        const req = contactRequest([{ question: 'q', answer: 'a' }], CH);
        const system = String(req.system);
        for (const c of [CH.contactPage, CH.email, CH.linkedin, 'Message Luis']) assert.ok(system.includes(c), c);
        assert.doesNotMatch(system + JSON.stringify(req.messages), /hiring-intent|factual question/i);
    });
});
