import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { refersTo, rankMatches, summarizeRetrieval, type RetrievalItemResult } from './score';

const kanso = { name: 'kanso', chunks: ['site:project:kanso'] };
const ectron = { name: 'Ectron', chunks: ['site:role:ectron-corporation-software-engineer-intern'] };

describe('refersTo', () => {
    test('the match’s own site chunk, and its sections', () => {
        assert.ok(refersTo('site:project:kanso', kanso.chunks));
        assert.ok(refersTo('site:project:kanso#stack', kanso.chunks));
    });
    test('the same project through GitHub or the résumé', () => {
        assert.ok(refersTo('github:kanso-backend#highlights.1', kanso.chunks));
        assert.ok(refersTo('resume:projects:kanso', kanso.chunks));
        assert.ok(refersTo('linkedin:positions-newest-first:software-engineer-intern-ectron-corporation', ectron.chunks));
    });
    test('not a different project whose id merely shares a prefix', () => {
        assert.ok(!refersTo('site:project:kanso-ai', kanso.chunks));
        assert.ok(!refersTo('github:kanso-ai', kanso.chunks));
    });
});

describe('rankMatches', () => {
    const finalIds = ['github:blog-template#summary', 'github:kanso-frontend#intro', 'site:project:kanso'];
    const shortlist = [...finalIds, 'site:role:ectron-corporation-software-engineer-intern'];
    const [k, e] = rankMatches([kanso, ectron], finalIds, shortlist);
    test('ranks a match by its best chunk from any source', () => {
        assert.equal(k.finalRank, 2);
        assert.equal(k.finalRankSite, 3);
    });
    test('a match in the shortlist but not the final set', () => {
        assert.equal(e.finalRank, null);
        assert.equal(e.shortlistRank, 4);
    });
});

describe('summarizeRetrieval', () => {
    const item = (id: string, finalRanks: (number | null)[]): RetrievalItemResult => ({
        id,
        kind: 'technical',
        question: '?',
        finalIds: [],
        matches: finalRanks.map((r, i) => ({ name: `M${i}`, chunks: [], finalRank: r, finalRankSite: null, shortlistRank: r })),
    });
    test('an item counts when any best match reaches Claude; misses are listed', () => {
        const s = summarizeRetrieval([item('a', [null, 2]), item('b', [null, null])]);
        assert.equal(s.itemsWithMatchInFinal, 1);
        assert.deepEqual(s.missedItems, ['b']);
        assert.equal(s.matchesInFinal, 1);
        assert.equal(s.matches, 4);
    });
});
