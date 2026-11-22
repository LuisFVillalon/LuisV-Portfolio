import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { normalizeForQuote } from '../../core/quotes';
import { loadFaithfulnessDataset, validateFaithfulnessDataset } from './dataset';
import { buildSources, contactSourceText, faithfulnessUserMessage, parseFaithfulnessOutput, type Claim } from './grader';
import { shownEvidence, WITHHELD } from './report';

const contact = contactSourceText({ resume: '/resumes/r.pdf', linkedin: 'https://linkedin.example/luis', email: 'luis@example.com', github: 'https://github.example/luis' });
const sources = buildSources(
    [
        { header: 'ROSS', text: 'AI tool on Clio Manage. Beat 60+ teams for **first place**.' },
        { header: 'Ectron', text: 'Mentored three interns with no prior HTML or CSS experience.' },
    ],
    'Luis is open to relocating.',
    contact,
);

const out = (claims: unknown[], reason = 'ok') => JSON.stringify({ claims, reason });
const claim = (over: Partial<Record<string, unknown>> = {}) => ({ claim: 'ROSS won first place', verdict: 'supported', sourceIds: ['S1'], evidence: 'first place', ...over });

describe('buildSources', () => {
    test('numbers chunks S1..Sn, then F and C', () => {
        assert.deepEqual(
            sources.map((s) => s.id),
            ['S1', 'S2', 'F', 'C'],
        );
    });
    test('leaves out F when there are no Assistant facts', () => {
        assert.deepEqual(
            buildSources([], null, contact).map((s) => s.id),
            ['C'],
        );
        assert.deepEqual(
            buildSources([], '  ', contact).map((s) => s.id),
            ['C'],
        );
    });
    test('the user message carries every source, the question and the answer', () => {
        const m = faithfulnessUserMessage('Q?', 'An answer.', sources);
        for (const s of sources) assert.match(m, new RegExp(`<source id="${s.id}"`));
        assert.match(m, /Question: Q\?/);
        assert.match(m, /<answer>\nAn answer\.\n<\/answer>/);
    });
    test("a chunk's href reaches the grader as its url, and a quoted url counts as found", () => {
        const withUrl = buildSources([{ header: 'GitHub · ROSS', text: 'Case briefs.', href: 'https://github.com/LuisFVillalon/ROSS' }], null, contact);
        assert.equal(withUrl[0].url, 'https://github.com/LuisFVillalon/ROSS');
        assert.match(faithfulnessUserMessage('Q?', 'A.', withUrl), /<source id="S1" title="GitHub · ROSS" url="https:\/\/github\.com\/LuisFVillalon\/ROSS">/);
        assert.doesNotMatch(faithfulnessUserMessage('Q?', 'A.', sources), /<source id="S1"[^>]*url=/);
        const g = parseFaithfulnessOutput(out([claim({ evidence: 'https://github.com/LuisFVillalon/ROSS' })]), withUrl);
        assert.equal(g.claims[0].evidenceFoundIn, 'S1');
    });
});

describe('parseFaithfulnessOutput', () => {
    test('keeps a supported claim with a valid source and finds its quote', () => {
        const g = parseFaithfulnessOutput(out([claim()]), sources);
        assert.equal(g.claims[0].verdict, 'supported');
        assert.equal(g.claims[0].graderVerdict, undefined);
        assert.equal(g.claims[0].evidenceFoundIn, 'S1');
    });

    test('quote matching ignores case, Markdown emphasis, typographic marks and spacing', () => {
        assert.equal(normalizeForQuote('Beat  60+ teams for **First   Place**'), 'beat 60+ teams for first place');
        const g = parseFaithfulnessOutput(out([claim({ evidence: 'Beat 60+ teams for First Place' })]), sources);
        assert.equal(g.claims[0].evidenceFoundIn, 'S1');
    });

    test('a quote not in the cited source is flagged but the verdict stands', () => {
        const g = parseFaithfulnessOutput(out([claim({ evidence: 'won the grand prize' })]), sources);
        assert.equal(g.claims[0].verdict, 'supported');
        assert.equal(g.claims[0].evidenceFoundIn, null);
    });

    test('a supported claim citing no source is downgraded to unsupported', () => {
        const g = parseFaithfulnessOutput(out([claim({ sourceIds: [] })]), sources);
        assert.equal(g.claims[0].verdict, 'unsupported');
        assert.equal(g.claims[0].graderVerdict, 'supported');
        assert.match(g.claims[0].overrideReason!, /cites no source/);
    });

    test('a supported claim citing only unknown ids is downgraded; unknown ids are dropped', () => {
        const g = parseFaithfulnessOutput(out([claim({ sourceIds: ['S9'] })]), sources);
        assert.equal(g.claims[0].verdict, 'unsupported');
        assert.deepEqual(g.claims[0].sourceIds, []);
        assert.match(g.claims[0].overrideReason!, /S9/);

        const mixed = parseFaithfulnessOutput(out([claim({ sourceIds: ['S9', 'S1', 'S1'] })]), sources);
        assert.equal(mixed.claims[0].verdict, 'supported');
        assert.deepEqual(mixed.claims[0].sourceIds, ['S1']);
    });

    test('an unsupported claim stays unsupported and gets no quote check', () => {
        const g = parseFaithfulnessOutput(out([claim({ verdict: 'unsupported', sourceIds: [], evidence: '' })]), sources);
        assert.equal(g.claims[0].verdict, 'unsupported');
        assert.equal(g.claims[0].graderVerdict, undefined);
        assert.equal(g.claims[0].evidenceFoundIn, undefined);
    });

    test('an answer with no claims parses to an empty list', () => {
        assert.deepEqual(parseFaithfulnessOutput(out([]), sources).claims, []);
    });

    test('malformed output throws', () => {
        assert.throws(() => parseFaithfulnessOutput('not json', sources), /not JSON/);
        assert.throws(() => parseFaithfulnessOutput(JSON.stringify({ reason: 'x' }), sources), /claims are missing/);
        assert.throws(() => parseFaithfulnessOutput(JSON.stringify({ claims: [] }), sources), /reason is missing/);
        assert.throws(() => parseFaithfulnessOutput(out([claim({ verdict: 'maybe' })]), sources), /verdict is invalid/);
        assert.throws(() => parseFaithfulnessOutput(out([claim({ claim: ' ' })]), sources), /no claim text/);
        assert.throws(() => parseFaithfulnessOutput(out([claim({ sourceIds: 'S1' })]), sources), /sourceIds are invalid/);
    });
});

describe('report redaction of the Assistant facts', () => {
    const c = (over: Partial<Claim>): Claim => ({ claim: 'x', verdict: 'supported', sourceIds: ['S1'], evidence: 'quote', evidenceFoundIn: 'S1', ...over });
    test('a quote found in a chunk is shown', () => assert.equal(shownEvidence(c({})), 'quote'));
    test('a quote found in F is withheld', () => assert.equal(shownEvidence(c({ sourceIds: ['F'], evidenceFoundIn: 'F' })), WITHHELD));
    test('an unlocated quote from a claim citing F is withheld', () => assert.equal(shownEvidence(c({ sourceIds: ['S1', 'F'], evidenceFoundIn: null })), WITHHELD));
    test('a conflict quote on an unsupported claim citing F is withheld', () =>
        assert.equal(shownEvidence(c({ verdict: 'unsupported', sourceIds: ['F'], evidenceFoundIn: undefined })), WITHHELD));
    test('a quote found in a chunk is shown even when F is also cited', () => assert.equal(shownEvidence(c({ sourceIds: ['S1', 'F'] })), 'quote'));
});

describe('faithfulness dataset', () => {
    test('the committed dataset is valid: 40 questions, unique ids', () => {
        const d = loadFaithfulnessDataset('evals/criteria/faithfulness/dataset.json');
        assert.equal(d.items.length, 40);
    });
    test('rejects missing fields and duplicate ids', () => {
        assert.throws(
            () => validateFaithfulnessDataset({ items: [{ id: 'a', question: 'q', category: 'c' }, { id: 'a', question: '', category: '' }] }),
            /duplicate id[\s\S]*missing question[\s\S]*missing category/,
        );
        assert.throws(() => validateFaithfulnessDataset({}), /no "items" array/);
    });
});
