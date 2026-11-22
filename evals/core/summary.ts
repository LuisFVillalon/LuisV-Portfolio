// The parts of a run's pass/fail summary every criterion shares: cost totals, partial and
// cost-capped runs, errors, and the PASS/FAIL line. Each criterion's score.ts adds its own counts.

export type Costs = { answerLatencyMs: number; gradeLatencyMs: number; answerCostUsd: number; gradeCostUsd: number };

export type RunSummary = {
    total: number;
    /** Items that could not be answered or graded; any fails the run. */
    errors: number;
    pass: boolean;
    /** Why the run failed, when it did. */
    failures: string[];
    /** True when --limit / --id chose fewer than the full set: the verdict is indicative only. */
    partial: boolean;
    /** Ids of selected items never run because the --max-cost cap was reached; any fails the run. */
    skippedByCostCap: string[];
    costUsd: { answer: number; grade: number; total: number };
    /** "question" or "item", for the messages. */
    unit: string;
    /** The agreed line for a full run, e.g. "the 27-of-30 line applies". */
    rule: string;
};

/** Items needed to reach `rate` of `n`. The epsilon keeps 0.9 × 30 = 27.000000000000004 from rounding up to 28. */
export const neededFor = (rate: number, n: number) => Math.ceil(n * rate - 1e-9);

/**
 * Wraps a criterion's own failures with the shared ones, in order: cut short by the cost cap,
 * nothing ran, the criterion's failures, errors. The run passes when the list is empty.
 */
export function runSummary(
    results: Pick<Costs, 'answerCostUsd' | 'gradeCostUsd'>[],
    o: { datasetSize: number; skippedByCostCap: string[]; unit: 'question' | 'item'; rule: string; errors: number; failures: string[] },
): RunSummary {
    const total = results.length;
    const failures = [
        ...(o.skippedByCostCap.length ? [`cut short by the --max-cost cap: ${o.skippedByCostCap.length} ${o.unit}(s) not run`] : []),
        ...(total === 0 ? [`no ${o.unit}s ran`] : []),
        ...o.failures,
        ...(o.errors ? [`${o.errors} ${o.unit}(s) could not be answered or graded`] : []),
    ];
    const answer = results.reduce((s, r) => s + r.answerCostUsd, 0);
    const grade = results.reduce((s, r) => s + r.gradeCostUsd, 0);
    return {
        total,
        errors: o.errors,
        pass: failures.length === 0,
        failures,
        partial: total + o.skippedByCostCap.length < o.datasetSize,
        skippedByCostCap: o.skippedByCostCap,
        costUsd: { answer, grade, total: answer + grade },
        unit: o.unit,
        rule: o.rule,
    };
}

/** PASS or FAIL, and whether the run was partial or cut short. */
export function verdictLine(s: RunSummary): string {
    const scope = s.skippedByCostCap.length
        ? ` (cut short by the --max-cost cap: ${s.total} run, ${s.skippedByCostCap.length} not run: ${s.skippedByCostCap.join(', ')})`
        : s.partial
          ? ` (partial run: ${s.total} ${s.unit}s; ${s.rule} to the full set)`
          : '';
    return `${s.pass ? 'PASS' : 'FAIL'}${scope}`;
}

const usd = (n: number) => `$${n.toFixed(4)}`;

/** The cost and Result lines that end every summary. */
export const closingLines = (s: RunSummary) => [
    `Estimated cost: ${usd(s.costUsd.total)} (answers ${usd(s.costUsd.answer)}, grading ${usd(s.costUsd.grade)}; Voyage calls not included)`,
    `Result: ${verdictLine(s)}${s.failures.length ? ` (${s.failures.join('; ')})` : ''}`,
];
