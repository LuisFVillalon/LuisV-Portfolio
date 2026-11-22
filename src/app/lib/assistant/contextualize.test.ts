import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { makeChunk, indexText, type Chunk } from './chunks/types';
import { buildDocuments, contextHashFor, contextRequest, contextualize, documentKey, MAX_DOCUMENT_CHARS } from './contextualize';

const chunk = (id: string, text: string): Chunk =>
    makeChunk({ id, sourceType: id.startsWith('github') ? 'github' : 'site', title: id, label: id, href: '/', text });

describe('documentKey', () => {
    test('a GitHub chunk belongs to its repository README', () => {
        assert.equal(documentKey('github:kanso-backend#highlights.1'), 'github:kanso-backend');
        assert.equal(documentKey('github:kanso-backend'), 'github:kanso-backend');
    });
    test('a site chunk belongs to its kind of record; résumé and LinkedIn are one document each', () => {
        assert.equal(documentKey('site:role:ectron-corporation-software-engineer-intern'), 'site:role');
        assert.equal(documentKey('site:profile'), 'site:profile');
        assert.equal(documentKey('resume:experience:x'), 'resume');
        assert.equal(documentKey('linkedin:skills'), 'linkedin');
    });
});

describe('buildDocuments', () => {
    test('joins a document’s chunks in order and caps its length', () => {
        const docs = buildDocuments([chunk('github:a#one', 'first'), chunk('site:role:x', 'role'), chunk('github:a#two', 'second'), chunk('github:b', 'x'.repeat(MAX_DOCUMENT_CHARS + 50))]);
        assert.match(docs.get('github:a')!, /first[\s\S]*second/);
        assert.equal(docs.get('github:b')!.length, MAX_DOCUMENT_CHARS);
    });
});

describe('contextHashFor', () => {
    const c = chunk('github:a#one', 'first');
    test('changes when the document, the chunk or the model changes', () => {
        const base = contextHashFor('doc', c);
        assert.notEqual(contextHashFor('doc 2', c), base);
        assert.notEqual(contextHashFor('doc', chunk('github:a#one', 'edited')), base);
        assert.notEqual(contextHashFor('doc', c, 'claude-sonnet-5-5'), base);
        assert.equal(contextHashFor('doc', c), base);
    });
});

describe('contextRequest', () => {
    test('caches the document and sends the chunk after it', () => {
        const req = contextRequest('THE DOC', chunk('github:a#one', 'THE CHUNK'));
        const [doc, ask] = req.messages[0].content as { text: string; cache_control?: unknown }[];
        assert.match(doc.text, /THE DOC/);
        assert.deepEqual(doc.cache_control, { type: 'ephemeral' });
        assert.match(ask.text, /THE CHUNK/);
    });
});

describe('indexText', () => {
    test('puts the context between header and body, and is unchanged without one', () => {
        const c = chunk('github:a#one', 'body');
        assert.equal(indexText(c), `${c.header}\nbody`);
        assert.equal(indexText({ ...c, context: 'CTX' }), `${c.header}\nCTX\nbody`);
    });
});

describe('contextualize without an Anthropic key', () => {
    test('reuses an up-to-date stored context and skips the rest (no network)', async () => {
        const saved = process.env.ANTHROPIC_API_KEY;
        delete process.env.ANTHROPIC_API_KEY;
        try {
            const a = chunk('github:a#one', 'first');
            const b = chunk('github:a#two', 'second');
            const doc = buildDocuments([a, b]).get('github:a')!;
            const stored = new Map([
                [a.id, { context: 'stored context', contextHash: contextHashFor(doc, a) }],
                [b.id, { context: 'old context', contextHash: 'out-of-date' }],
            ]);
            const report = await contextualize([a, b], stored);
            assert.equal(a.context, 'stored context');
            assert.equal(b.context, undefined);
            assert.deepEqual({ reused: report.reused, skipped: report.skipped, generated: report.generated }, { reused: 1, skipped: 1, generated: 0 });
        } finally {
            if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
        }
    });
});
