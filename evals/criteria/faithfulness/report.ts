// What a faithfulness run prints and writes. The Assistant facts are private (the repo is
// public), so their text never goes into a report: a claim backed by them shows the source id F
// and its evidence quote is withheld.
import { idCell, itemLines, noteLines, pct, reportHeader, table, TIMING_HEADERS, timingCells } from '../../core/markdown';
import type { RunInfo } from '../../core/runner';
import { closingLines } from '../../core/summary';
import { FACTS_SOURCE_ID, type Claim } from './grader';
import { CLAIM_PASS_RATE, unsupportedCount, type FaithfulnessResult, type FaithfulnessSummary } from './score';

export const WITHHELD = '(quote from the Assistant facts withheld)';

/** The evidence to show for a claim: withheld when it may be quoted from the Assistant facts. */
export function shownEvidence(c: Claim): string {
    if (!c.evidence) return '';
    const fromFacts = c.evidenceFoundIn === FACTS_SOURCE_ID || (c.sourceIds.includes(FACTS_SOURCE_ID) && !c.evidenceFoundIn);
    return fromFacts ? WITHHELD : c.evidence;
}

export function faithfulnessSummaryText(s: FaithfulnessSummary): string {
    return [
        `Claims supported: ${s.claims.supported} of ${s.claims.total} (${pct(s.claimRate)}; ${pct(CLAIM_PASS_RATE)} needed)`,
        `Fully supported answers: ${s.cleanAnswers} of ${s.total} (${s.cleanNeeded} needed)${s.errors ? ` · Errors ${s.errors}` : ''}`,
        `Answers with unsupported claims: ${s.dirtyAnswers.length ? s.dirtyAnswers.join(', ') : 'none'}`,
        ...closingLines(s),
    ].join('\n');
}

function claimLine(c: Claim): string {
    const ids = c.sourceIds.length ? ` [${c.sourceIds.join(', ')}]` : '';
    const evidence = shownEvidence(c);
    const quote = evidence ? ` (source: “${evidence}”)` : '';
    const quoteFlag = c.verdict === 'supported' && c.evidenceFoundIn === null ? ' ⚠️ quote not found in the cited source' : '';
    const override = c.graderVerdict ? ` (the grader said ${c.graderVerdict}; ${c.overrideReason})` : '';
    return `- ${c.verdict === 'supported' ? '✅' : '❌'} ${c.verdict}${ids}: ${c.claim}${quote}${quoteFlag}${override}`;
}

function gradeLines(r: FaithfulnessResult): string[] {
    if (!r.grade) return [];
    const u = unsupportedCount(r.grade);
    const n = r.grade.claims.length;
    return [`**${u ? `${u} unsupported of ${n} claims` : `All ${n} claims supported`}.** ${r.grade.reason}`, '', ...r.grade.claims.map(claimLine), ''];
}

export function faithfulnessMarkdownReport(info: RunInfo, summary: FaithfulnessSummary, results: FaithfulnessResult[]): string {
    return [
        ...reportHeader('Source Faithfulness', info, faithfulnessSummaryText(summary), results.length, ` · Assistant facts ${info.factsLoaded ? 'loaded (source F)' : 'not configured'}`),
        ...table(
            ['id', 'claims', 'unsupported', ...TIMING_HEADERS],
            results.map((r) => [idCell(r.item.id), r.grade ? String(r.grade.claims.length) : 'ERROR', r.grade ? String(unsupportedCount(r.grade) || '') : '', ...timingCells(r)]),
        ),
        ...results.flatMap((r) => [...itemLines(r, [r.item.question], { chipsLabel: 'Sources cited' }), ...gradeLines(r), ...noteLines(r.item.note)]),
    ].join('\n');
}

export const faithfulnessJsonReport = (info: RunInfo, summary: FaithfulnessSummary, results: FaithfulnessResult[]) => ({
    ...info,
    summary,
    results: results.map((r) => ({ ...r, grade: r.grade && { ...r.grade, claims: r.grade.claims.map((c) => ({ ...c, evidence: shownEvidence(c) })) } })),
});
