// Markdown and JSON reports for a correctness run.
import { GRADER_MODEL, sameFact } from './grader';
import { hasHighStakesError, type ItemResult, type Summary } from './score';

export type RunInfo = { startedAt: string; answerModel: string; dataset: string; datasetSize: number };

const usd = (n: number) => `$${n.toFixed(4)}`;
const sec = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function verdictLine(s: Summary): string {
    const scope = s.skippedByCostCap.length
        ? ` (cut short by the --max-cost cap: ${s.total} run, ${s.skippedByCostCap.length} not run: ${s.skippedByCostCap.join(', ')})`
        : s.partial
          ? ` (partial run: ${s.total} questions; the 27-of-30 line applies to the full set)`
          : '';
    return `${s.pass ? 'PASS' : 'FAIL'}${scope}`;
}

export function summaryText(s: Summary): string {
    return [
        `Correct ${s.counts.Correct} · Partial ${s.counts.Partial} · Incorrect ${s.counts.Incorrect}${s.errors ? ` · Errors ${s.errors}` : ''}  (of ${s.total}; ${s.needed} Correct needed)`,
        `High-stakes wrong facts: ${s.highStakesErrors.length ? s.highStakesErrors.join(', ') : 'none'}`,
        `Estimated cost: ${usd(s.costUsd.total)} (answers ${usd(s.costUsd.answer)}, grading ${usd(s.costUsd.grade)}; Voyage calls not included)`,
        `Result: ${verdictLine(s)}${s.failures.length ? ` (${s.failures.join('; ')})` : ''}`,
    ].join('\n');
}

export function markdownReport(info: RunInfo, summary: Summary, results: ItemResult[]): string {
    const lines = [
        '# Ask AI eval: Factual Correctness',
        '',
        `Run ${info.startedAt} · answering model ${info.answerModel} · grader ${GRADER_MODEL} · dataset ${info.dataset} (${results.length} of ${info.datasetSize} items)`,
        '',
        '```',
        summaryText(summary),
        '```',
        '',
        '| id | label | high-stakes wrong | answer (latency · cost) | grade (latency · cost) |',
        '|---|---|---|---|---|',
        ...results.map(
            (r) =>
                `| [${r.item.id}](#${r.item.id}) | ${r.grade ? r.grade.label : 'ERROR'} | ${hasHighStakesError(r) ? 'yes' : ''} | ${sec(r.answerLatencyMs)} · ${usd(r.answerCostUsd)} | ${sec(r.gradeLatencyMs)} · ${usd(r.gradeCostUsd)} |`,
        ),
        '',
    ];
    for (const r of results) {
        lines.push(`## ${r.item.id}`, '', `**Q:** ${r.item.question}`, '');
        if (r.error) lines.push(`**Error:** ${cell(r.error)}`, '');
        lines.push('**Answer:**', '', ...(r.answer || '(none)').split('\n').map((l) => `> ${l}`), '');
        lines.push(`**Sources cited:** ${r.sources.length ? r.sources.map((s) => `${s.label} (${s.href})`).join('; ') : 'none'}`, '');
        lines.push(`**Retrieved chunks:** ${r.retrieved.length ? r.retrieved.join(', ') : 'none'}`, '');
        if (r.grade) {
            const g = r.grade;
            const adjusted = g.graderLabel ? ` (the grader said ${g.graderLabel}; its own fact verdicts imply ${g.label})` : '';
            lines.push(`**Verdict: ${g.label}**${adjusted}. ${g.reason}`, '');
            for (const f of g.facts) {
                const mark = f.verdict === 'present' ? '✅' : f.verdict === 'missing' ? '⬜' : '❌';
                const hs = r.item.keyFacts.some((k) => k.highStakes && sameFact(k.fact, f.fact)) ? ' (high-stakes)' : '';
                lines.push(`- ${mark} ${f.verdict}${hs}: ${f.fact}${f.evidence ? ` (answer: “${f.evidence}”)` : ''}`);
            }
            for (const w of g.wrongStatements) lines.push(`- ❌ wrong${w.highStakes ? ' (high-stakes)' : ''}: ${w.statement}`);
            lines.push('');
        }
        if (r.item.note) lines.push(`_Dataset note: ${r.item.note}_`, '');
    }
    return lines.join('\n');
}

export function jsonReport(info: RunInfo, summary: Summary, results: ItemResult[]) {
    return {
        ...info,
        grader: GRADER_MODEL,
        summary,
        results: results.map((r) => ({ ...r, highStakesError: hasHighStakesError(r) })),
    };
}
