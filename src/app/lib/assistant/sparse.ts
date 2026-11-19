// BM25 sparse vectors for the Upstash Vector hybrid index.
//
// Upstash only generates sparse vectors itself when it also hosts the dense model; this
// assistant brings its own Voyage vectors, so the sparse side is computed here:
// - documents carry the BM25 term-frequency part: tf·(k1+1) / (tf + k1·(1 − b + b·len/avgLen));
// - queries carry 1 per term, and the query uses Upstash's IDF weighting strategy, which keeps
//   inverse document frequencies for the index. Together that is BM25.

const K1 = 1.2;
const B = 0.75;
/** Upstash allows at most 1,000 non-zero dimensions per sparse vector. */
const MAX_TERMS = 1000;

const STOPWORDS = new Set(
    'a an and are as at be but by did do does for from had has have he her his how i if in into is it its me my of on or our she so than that the their them then there these they this to was we were what when where which who why will with you your about can could would should luis luis\'s'.split(
        ' ',
    ),
);

export type SparseVector = { indices: number[]; values: number[] };

/** Lowercased word tokens with light suffix stripping, so "projects" matches "project". */
export function tokenize(text: string): string[] {
    return (text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]/g) ?? [])
        .filter((t) => !STOPWORDS.has(t))
        .map(stem);
}

function stem(t: string): string {
    if (t.length <= 4 || /\d/.test(t)) return t;
    if (t.endsWith('ies')) return `${t.slice(0, -3)}y`;
    if (t.endsWith('ing') && t.length > 6) return t.slice(0, -3);
    if (t.endsWith('ed') && t.length > 5) return t.slice(0, -2);
    if (t.endsWith('es') && /(ss|x|ch|sh)es$/.test(t)) return t.slice(0, -2);
    if (t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
    return t;
}

/** FNV-1a 32-bit hash, as a signed 32-bit integer (what Upstash sparse indices accept). */
export function termId(term: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < term.length; i++) {
        h ^= term.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h | 0;
}

function toVector(weights: Map<number, number>): SparseVector {
    const entries = [...weights.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_TERMS);
    entries.sort((a, b) => a[0] - b[0]);
    return { indices: entries.map((e) => e[0]), values: entries.map((e) => e[1]) };
}

export const documentLength = (text: string) => tokenize(text).length;

export function documentSparseVector(text: string, avgDocLength: number): SparseVector {
    const tokens = tokenize(text);
    const tf = new Map<number, number>();
    for (const t of tokens) tf.set(termId(t), (tf.get(termId(t)) ?? 0) + 1);
    const norm = 1 - B + B * (tokens.length / Math.max(avgDocLength, 1));
    const weights = new Map<number, number>();
    for (const [id, f] of tf) weights.set(id, (f * (K1 + 1)) / (f + K1 * norm));
    return toVector(weights);
}

export function querySparseVector(text: string): SparseVector {
    const weights = new Map<number, number>();
    for (const t of tokenize(text)) weights.set(termId(t), 1);
    return toVector(weights);
}
