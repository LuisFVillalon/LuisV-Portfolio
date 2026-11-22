// What a correctness run prints and writes.
import { idCell, itemLines, noteLines, reportHeader, table, TIMING_HEADERS, timingCells } from '../../core/markdown';
import type { RunInfo } from '../../core/runner';
import { closingLines } from '../../core/summary';
import { sameFact } from './grader';
import { hasHighStakesError, type ItemResult, type Summary } from './score';

export function summaryText(s: Summary): string {
    return [
        `Correct ${s.counts.Correct} · Partial ${s.counts.Partial} · Incorrect ${s.counts.Incorrect}${s.errors ? ` · Errors ${s.errors}` : ''}  (of ${s.total}; ${s.needed} Correct needed)`,
        `High-stakes wrong facts: ${s.highStakesErrors.length ? s.highStakesErrors.join(', ') : 'none'}`,
        ...closingLines(s),
    ].join('\n');
}

const MARK = { present: '✅', missing: '⬜', contradicted: '❌' } as const;

function gradeLines(r: ItemResult): string[] {
    const g = r.grade;
    if (!g) return [];
    const adjusted = g.graderLabel ? ` (the grader said ${g.graderLabel}; its own fact verdicts imply ${g.label})` : '';
    return [
        `**Verdict: ${g.label}**${adjusted}. ${g.reason}`,
        '',
        ...g.facts.map((f) => {
            const hs = r.item.keyFacts.some((k) => k.highStakes && sameFact(k.fact, f.fact)) ? ' (high-stakes)' : '';
            return `- ${MARK[f.verdict]} ${f.verdict}${hs}: ${f.fact}${f.evidence ? ` (answer: “${f.evidence}”)` : ''}`;
        }),
        ...g.wrongStatements.map((w) => `- ❌ wrong${w.highStakes ? ' (high-stakes)' : ''}: ${w.statement}`),
        '',
    ];
}

export function markdownReport(info: RunInfo, summary: Summary, results: ItemResult[]): string {
    return [
        ...reportHeader('Factual Correctness', info, summaryText(summary), results.length),
        ...table(
            ['id', 'label', 'high-stakes wrong', ...TIMING_HEADERS],
            results.map((r) => [idCell(r.item.id), r.grade?.label ?? 'ERROR', hasHighStakesError(r) ? 'yes' : '', ...timingCells(r)]),
        ),
        ...results.flatMap((r) => [...itemLines(r, [r.item.question]), ...gradeLines(r), ...noteLines(r.item.note)]),
    ].join('\n');
}

export const jsonReport = (info: RunInfo, summary: Summary, results: ItemResult[]) => ({
    ...info,
    summary,
    results: results.map((r) => ({ ...r, highStakesError: hasHighStakesError(r) })),
});
