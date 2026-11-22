// Criterion #3 pass/fail: an answer showcases well when, for at least one of Luis's best matches,
// it (1) names it, (2) gives a concrete detail about it and (3) links to it with a working link.
// The run passes when at least 17 of the 20 answers do. Pure functions, so the rule is unit-tested.
import { linkIssues, type CheckedChip, type CheckedLink } from '../../core/links';
import type { LinkIssue } from '../../core/markdown';
import type { BaseResult } from '../../core/runner';
import { neededFor, runSummary, type RunSummary } from '../../core/summary';
import type { ShowcaseItem } from './dataset';
import type { ShowcaseGrade } from './grader';

export const SHOWCASE_PASS_RATE = 0.85;
/** Size of the full dataset the 17-of-20 line was agreed for. */
export const SHOWCASE_RUN_SIZE = 20;
/**
 * Source chips count as the answer's link: they are clickable links shown under the answer, and a
 * chip from one of the match's own chunks points at it. Its href is still checked like any other
 * link, so a chip to a dead repo doesn't count.
 */
export const SOURCE_CHIPS_COUNT = true;

/** One match's three checks, combined from the grade and the link check. */
export type MatchCheck = {
    id: string;
    name: string;
    named: boolean;
    detail: ShowcaseGrade['matches'][number]['detail'];
    /** Links in the answer text that point at this match, each with its status. */
    links: CheckedLink[];
    /** A source chip under the answer came from one of this match's chunks and its link works. */
    chipLinked: boolean;
    /** A working link to it in the answer text, or (when SOURCE_CHIPS_COUNT) a working chip. */
    workingLink: boolean;
    pass: boolean;
};

export type ShowcaseResult = BaseResult<ShowcaseItem> & {
    /** Every link in the answer text, with its status. */
    links: CheckedLink[];
    /** The source chips under the answer, each with its href checked. */
    chips: CheckedChip[];
    grade?: ShowcaseGrade;
    checks?: MatchCheck[];
};

/**
 * Combines the grader's judgments with the links. `pointsAt(href, id)` says whether a link
 * targets that match; `matches` is the same list the grader saw (ids M1, M2, ... in dataset
 * order) with each one's corpus chunk ids.
 */
export function combineChecks(
    matches: { id: string; name: string; chunks: string[] }[],
    grade: ShowcaseGrade,
    links: CheckedLink[],
    chips: Pick<CheckedChip, 'id' | 'status'>[],
    pointsAt: (href: string, matchId: string) => boolean,
): MatchCheck[] {
    return matches.map((m) => {
        const j = grade.matches.find((g) => g.id === m.id)!;
        const mine = links.filter((l) => l.kind !== 'plain' && pointsAt(l.href, m.id));
        const chipLinked = chips.some((s) => s.id !== undefined && m.chunks.includes(s.id) && s.status.ok);
        const workingLink = mine.some((l) => l.status.ok) || (SOURCE_CHIPS_COUNT && chipLinked);
        return { id: m.id, name: m.name, named: j.named, detail: j.detail, links: mine, chipLinked, workingLink, pass: j.named && j.detail === 'concrete' && workingLink };
    });
}

export const answerPasses = (checks: MatchCheck[] | undefined) => Boolean(checks?.some((c) => c.pass));

export type ShowcaseSummary = RunSummary & {
    passed: number;
    /** Answers needed to pass: ceil(85% of the questions run). */
    needed: number;
    /** How many answers met each check for at least one match (an answer can meet all three for different matches and still fail). */
    met: { named: number; concrete: number; workingLink: number };
    /** Passing answers whose only working link to the match is a source chip, not a link in the text. */
    passedOnlyViaChip: number;
    byKind: Record<string, { total: number; passed: number }>;
    failedIds: string[];
    /** Links in answers (to any target), and source chips when they count, that don't work. */
    brokenLinks: LinkIssue[];
    /** External links that refused the automated check: counted as working, check them by hand. */
    unverifiedLinks: LinkIssue[];
};

export function summarizeShowcase(
    results: (Pick<ShowcaseResult, 'item' | 'checks' | 'links' | 'error' | 'answerCostUsd' | 'gradeCostUsd'> & { chips?: CheckedChip[] })[],
    datasetSize = SHOWCASE_RUN_SIZE,
    skippedByCostCap: string[] = [],
): ShowcaseSummary {
    const graded = results.filter((r) => !r.error && r.checks);
    const passedResults = graded.filter((r) => answerPasses(r.checks));
    const passed = passedResults.length;
    const needed = neededFor(SHOWCASE_PASS_RATE, results.length);
    const some = (f: (c: MatchCheck) => boolean) => graded.filter((r) => r.checks!.some(f)).length;

    const byKind: ShowcaseSummary['byKind'] = {};
    for (const r of results) {
        const k = (byKind[r.item.kind] ??= { total: 0, passed: 0 });
        k.total++;
        if (!r.error && answerPasses(r.checks)) k.passed++;
    }

    return {
        ...runSummary(results, {
            datasetSize,
            skippedByCostCap,
            unit: 'question',
            rule: 'the 17-of-20 line applies',
            errors: results.length - graded.length,
            failures: passed < needed ? [`${passed} of ${results.length} answers showcase a best match; ${needed} needed`] : [],
        }),
        passed,
        needed,
        met: { named: some((c) => c.named), concrete: some((c) => c.detail === 'concrete'), workingLink: some((c) => c.workingLink) },
        passedOnlyViaChip: passedResults.filter((r) => !r.checks!.some((c) => c.pass && c.links.some((l) => l.status.ok))).length,
        byKind,
        failedIds: results.filter((r) => r.error || !answerPasses(r.checks)).map((r) => r.item.id),
        ...linkIssues(results.map((r) => ({ id: r.item.id, links: [...r.links, ...(SOURCE_CHIPS_COUNT ? (r.chips ?? []) : [])] }))),
    };
}

/** What the closest match was missing, for the console line. */
export function failReason(checks: MatchCheck[] | undefined): string {
    const named = checks?.filter((c) => c.named) ?? [];
    if (!named.length) return 'no best match named';
    const best = named.find((c) => c.detail === 'concrete') ?? named[0];
    const missing = [best.detail !== 'concrete' && `detail ${best.detail}`, !best.workingLink && (best.links.length ? 'link broken' : 'no link to it')].filter(Boolean);
    return `${best.id} ${best.name}: ${missing.join(', ')}`;
}
