// Retrieval-only check for the showcase questions: does search put Luis's best matches in front
// of the answering model? No model is called, so a run costs only the Voyage embed + rerank calls.
// Pure functions, so the rule is unit-tested.
//
// For each showcase match (a project or role listed with its chunk ids in the showcase dataset):
//   finalRank     - its best position among the chunks that reach Claude (1..rerankTopK), or null
//   shortlistRank - its best position in the hybrid-search shortlist (1..shortlistSize), or null
// A match missing from the shortlist can only be fixed by better indexing (what the chunk says or
// how it's embedded); one in the shortlist but not the final set lost at the rerank step.

/**
 * The showcase dataset names each match by its portfolio-site chunks, but the answering model can also
 * meet the same project or role through its GitHub README, résumé or LinkedIn chunks. These id
 * prefixes (stable, derived from the record) count as the same match. Kept explicit and
 * hand-checked against `npm run assistant:chunks` rather than guessed by fuzzy matching.
 */
export const OTHER_SOURCES: Record<string, string[]> = {
    'site:project:kanso': ['github:kanso-frontend', 'github:kanso-backend', 'github:kanso-landing', 'resume:projects:kanso'],
    'site:now:kanso-building-a-digital-clarity-notebook-tasks-notes-habits-mood': ['github:kanso-frontend', 'github:kanso-backend', 'github:kanso-landing', 'resume:projects:kanso'],
    'site:project:kanso-ai': ['github:kanso-ai'],
    'site:project:agentic-abstraction-for-chip-engineering-aace': ['github:agentic-abstraction-for-chip-engineering', 'resume:projects:agentic-abstraction', 'linkedin:positions-newest-first:agentic-ai-engineering-fellow-nxp'],
    'site:education:nxp-semiconductors-engineering-bootcamp-agentic-ai-in-the-cloud': ['github:agentic-abstraction-for-chip-engineering', 'resume:projects:agentic-abstraction', 'linkedin:positions-newest-first:agentic-ai-engineering-fellow-nxp'],
    'site:project:ross': ['github:ross', 'resume:projects:ross'],
    'site:project:luis-s-personal-ai-assistant': ['github:luisv-portfolio#ai-assistant'],
    'site:project:nutrinav-ai': ['github:nutrinav-ai'],
    'site:project:provenance-guard': ['github:ai201-project4-provenance-guard'],
    'site:project:the-unofficial-guide': ['github:ai201-project1-unofficial-guide'],
    'site:project:takemeter': ['github:ai201-project3-takemeter'],
    'site:project:llm-bible-tutor': ['github:llm-bible-tutor'],
    'site:project:blog-template': ['github:blog-template', 'github:blog-api'],
    'site:project:poke-photo-tag': ['github:back-end-pokemon-photo-tag', 'github:front-end-pokemon-photo-tag'],
    'site:role:ectron-corporation-software-engineer-intern': ['resume:experience:software-engineer-intern-ectron', 'linkedin:positions-newest-first:software-engineer-intern-ectron'],
    'site:role:second-course-full-stack-intern': ['resume:experience:full-stack-intern-second-course', 'linkedin:positions-newest-first:full-stack-intern-second-course'],
    'site:role:sports-excitement-front-end-developer-intern': ['resume:experience:front-end-developer-intern-sports-excitement', 'linkedin:positions-newest-first:front-end-developer-intern-sports-excitement'],
    'site:role:calexico-neighborhood-house-mission-thrift-store-happy-kids--seo-digital-marketing-strategist': ['linkedin:positions-newest-first:seo-digital-marketing-strategist-calexico'],
    'site:role:ai4business-lab-undergraduate-researcher-adversarial-attacks-defenses-in-dee': ['resume:experience:undergraduate-researcher-ai4business', 'linkedin:positions-newest-first:undergraduate-researcher-ai-agents'],
    'site:leadership:colorstack-outreach-chair': ['resume:leadership:outreach-chair-colorstack', 'linkedin:positions-newest-first:outreach-chair-colorstack'],
    'site:now:colorstack-outreach-chair': ['resume:leadership:outreach-chair-colorstack', 'linkedin:positions-newest-first:outreach-chair-colorstack'],
    'site:beyond-tech:after-school-enrichment-tutor': ['linkedin:positions-newest-first:after-school-enrichment-tutor'],
};

/** A retrieved id counts for a match if it is one of the match's chunks or starts with one of their other-source prefixes. */
export function refersTo(id: string, chunks: string[]): boolean {
    return chunks.some((c) => id === c || id.startsWith(`${c}#`) || (OTHER_SOURCES[c] ?? []).some((p) => id.startsWith(p)));
}

export type MatchRank = {
    name: string;
    chunks: string[];
    /** Best position of the match's own site chunks only (as the showcase dataset lists them). */
    finalRankSite: number | null;
    /** Best position of the match through any source (site, GitHub, résumé, LinkedIn): the main measure. */
    finalRank: number | null;
    shortlistRank: number | null;
};

export type RetrievalItemResult = {
    id: string;
    kind: string;
    question: string;
    /** What reached Claude, best first. */
    finalIds: string[];
    matches: MatchRank[];
};

export type RetrievalSummary = {
    items: number;
    /** Items where at least one best match reached Claude (the answer can showcase it). */
    itemsWithMatchInFinal: number;
    matches: number;
    matchesInFinal: number;
    /** Counting only the site chunks the showcase dataset lists. */
    matchesInFinalSiteOnly: number;
    matchesInShortlist: number;
    /** Items where no best match reached Claude. */
    missedItems: string[];
};

/** Best (lowest) 1-based position in `ids` of a chunk that satisfies `hit`, or null. */
function firstRank(ids: string[], hit: (id: string) => boolean): number | null {
    const i = ids.findIndex(hit);
    return i >= 0 ? i + 1 : null;
}

export function rankMatches(matches: { name: string; chunks: string[] }[], finalIds: string[], shortlistIds: string[]): MatchRank[] {
    return matches.map((m) => ({
        name: m.name,
        chunks: m.chunks,
        finalRankSite: firstRank(finalIds, (id) => m.chunks.includes(id)),
        finalRank: firstRank(finalIds, (id) => refersTo(id, m.chunks)),
        shortlistRank: firstRank(shortlistIds, (id) => refersTo(id, m.chunks)),
    }));
}

export function summarizeRetrieval(results: RetrievalItemResult[]): RetrievalSummary {
    const all = results.flatMap((r) => r.matches);
    const missedItems = results.filter((r) => !r.matches.some((m) => m.finalRank !== null)).map((r) => r.id);
    return {
        items: results.length,
        itemsWithMatchInFinal: results.length - missedItems.length,
        matches: all.length,
        matchesInFinal: all.filter((m) => m.finalRank !== null).length,
        matchesInFinalSiteOnly: all.filter((m) => m.finalRankSite !== null).length,
        matchesInShortlist: all.filter((m) => m.shortlistRank !== null).length,
        missedItems,
    };
}

export function retrievalSummaryText(s: RetrievalSummary, topK: number): string {
    return [
        `Questions with a best match reaching Claude: ${s.itemsWithMatchInFinal} of ${s.items}`,
        `Best matches reaching Claude (top ${topK}): ${s.matchesInFinal} of ${s.matches} (site chunk only: ${s.matchesInFinalSiteOnly}) · in the search shortlist: ${s.matchesInShortlist} of ${s.matches}`,
        `No best match reached Claude: ${s.missedItems.length ? s.missedItems.join(', ') : 'none'}`,
    ].join('\n');
}

const rankCell = (r: number | null) => (r === null ? '–' : String(r));

export function retrievalMarkdownReport(results: RetrievalItemResult[], info: { startedAt: string; contextual: boolean; topK: number; shortlistSize: number }): string {
    const s = summarizeRetrieval(results);
    const lines = [
        '# Ask AI retrieval check (showcase questions)',
        '',
        `Run ${info.startedAt} · contextual retrieval ${info.contextual ? 'on' : 'off'} · top ${info.topK} reach Claude, shortlist ${info.shortlistSize}`,
        '',
        '```',
        retrievalSummaryText(s, info.topK),
        '```',
        '',
        `Rank = best position of a chunk about the match, from any source (site, GitHub, résumé, LinkedIn; see OTHER_SOURCES in evals/retrieval/score.ts). "final" is what reaches Claude (1-${info.topK}), "site only" counts only the site chunks the showcase dataset lists, "shortlist" is the hybrid-search shortlist (1-${info.shortlistSize}).`,
        '',
        '| question | kind | best match | final | site only | shortlist |',
        '|---|---|---|---|---|---|',
    ];
    for (const r of results) {
        for (const [i, m] of r.matches.entries()) {
            lines.push(`| ${i === 0 ? r.id : ''} | ${i === 0 ? r.kind : ''} | ${m.name} | ${rankCell(m.finalRank)} | ${rankCell(m.finalRankSite)} | ${rankCell(m.shortlistRank)} |`);
        }
    }
    lines.push('', '## What reached Claude', '');
    for (const r of results) lines.push(`- **${r.id}**: ${r.finalIds.join(', ') || '(nothing cleared the cutoff)'}`);
    return lines.join('\n') + '\n';
}
