// What a showcase run prints and writes. All reference text comes from the public site content
// (corpus chunks), so nothing here is private.
import { idCell, itemLines, linkSummaryLines, linkText, listOr, noteLines, reportHeader, table, TIMING_HEADERS, timingCells, yes } from '../../core/markdown';
import type { RunInfo } from '../../core/runner';
import { closingLines } from '../../core/summary';
import type { MatchJudgment } from './grader';
import { answerPasses, SOURCE_CHIPS_COUNT, type MatchCheck, type ShowcaseResult, type ShowcaseSummary } from './score';

export function showcaseSummaryText(s: ShowcaseSummary): string {
    const kinds = Object.entries(s.byKind)
        .map(([k, v]) => `${k} ${v.passed}/${v.total}`)
        .join(', ');
    return [
        `Answers that showcase a best match: ${s.passed} of ${s.total} (${s.needed} needed)${kinds ? ` · ${kinds}` : ''}${s.errors ? ` · Errors ${s.errors}` : ''}`,
        `Checks met (for some match): named ${s.met.named}, concrete detail ${s.met.concrete}, working link ${s.met.workingLink}`,
        `Failed: ${listOr(s.failedIds)}`,
        ...(SOURCE_CHIPS_COUNT ? [`Passed only through a source chip (no working link to the match in the answer text): ${s.passedOnlyViaChip} of ${s.passed}`] : []),
        ...linkSummaryLines(s),
        ...closingLines(s),
    ].join('\n');
}

function checkLines(c: MatchCheck, j: MatchJudgment | undefined): string[] {
    return [
        `- **${c.id} ${c.name}**: ${c.pass ? '✅ showcased' : '❌ not showcased'}`,
        `  - named ${yes(c.named)}${c.named && j?.nameQuote ? ` (“${j.nameQuote}”)` : ''}`,
        `  - detail ${c.detail === 'concrete' ? '✅' : '❌'} ${c.detail}${c.detail === 'concrete' && j?.detailQuote ? ` (“${j.detailQuote}”)` : ''}`,
        `  - working link ${yes(c.workingLink)}${c.links.length ? `: ${c.links.map(linkText).join('; ')}` : ': no link to it in the answer text'}${c.chipLinked ? ' · a working source chip points at it' : ''}`,
        ...(j?.overrides ?? []).map((o) => `  - override: ${o}`),
    ];
}

function gradeLines(r: ShowcaseResult): string[] {
    const lines = [
        `**Links in the answer:** ${listOr(r.links.map(linkText), '; ')}`,
        '',
        `**Source chips:** ${listOr(r.chips.map((s) => `${s.label} (${linkText({ text: s.label, kind: 'site', ...s })})`), '; ')}`,
        '',
    ];
    if (!r.grade || !r.checks) return lines;
    return [
        ...lines,
        `**${answerPasses(r.checks) ? 'Showcases a best match' : 'Does not showcase a best match'}.** ${r.grade.reason}`,
        '',
        ...r.checks.flatMap((c) => checkLines(c, r.grade!.matches.find((m) => m.id === c.id))),
        '',
    ];
}

export function showcaseMarkdownReport(info: RunInfo, summary: ShowcaseSummary, results: ShowcaseResult[]): string {
    const any = (r: ShowcaseResult, f: (c: MatchCheck) => boolean) => (r.checks ? yes(r.checks.some(f)) : '');
    return [
        ...reportHeader('Showcase Quality', info, showcaseSummaryText(summary), results.length),
        ...table(
            ['id', 'kind', 'result', 'named', 'detail', 'link', ...TIMING_HEADERS],
            results.map((r) => [
                idCell(r.item.id),
                r.item.kind,
                r.error ? 'ERROR' : answerPasses(r.checks) ? 'PASS' : 'fail',
                any(r, (c) => c.named),
                any(r, (c) => c.detail === 'concrete'),
                any(r, (c) => c.workingLink),
                ...timingCells(r),
            ]),
        ),
        ...results.flatMap((r) => [...itemLines(r, [r.item.question], { heading: `_${r.item.kind}_`, chipsLabel: false }), ...gradeLines(r), ...noteLines(r.item.note)]),
    ].join('\n');
}

export const showcaseJsonReport = (info: RunInfo, summary: ShowcaseSummary, results: ShowcaseResult[]) => ({ ...info, sourceChipsCount: SOURCE_CHIPS_COUNT, summary, results });
