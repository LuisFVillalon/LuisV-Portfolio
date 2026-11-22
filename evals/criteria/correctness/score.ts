// Criterion #1 pass/fail: at least 90% of answers Correct (27 of 30) and no answer states a
// wrong high-stakes fact. Pure functions, so the rule is unit-tested.
import type { BaseResult } from '../../core/runner';
import { neededFor, runSummary, type RunSummary } from '../../core/summary';
import type { EvalItem } from './dataset';
import { sameFact, type Grade, type Label } from './grader';

export const PASS_RATE = 0.9;
/** Size of the full dataset the 27-of-30 line was agreed for. */
export const FULL_RUN_SIZE = 30;

export type ItemResult = BaseResult<EvalItem> & { grade?: Grade };

/**
 * True when this answer states a wrong high-stakes fact: a key fact marked high-stakes is graded
 * contradicted, or the grader flagged a wrong statement as high-stakes, whatever else it listed.
 */
export function hasHighStakesError(r: Pick<ItemResult, 'item' | 'grade'>): boolean {
    const g = r.grade;
    if (!g) return false;
    if (g.wrongStatements.some((w) => w.highStakes)) return true;
    return g.facts.some((f) => f.verdict === 'contradicted' && r.item.keyFacts.some((k) => k.highStakes && sameFact(k.fact, f.fact)));
}

export type Summary = RunSummary & {
    counts: Record<Label, number>;
    /** Correct answers needed to pass: ceil(90% of the questions run). */
    needed: number;
    highStakesErrors: string[];
};

export function summarize(
    results: Pick<ItemResult, 'item' | 'grade' | 'error' | 'answerCostUsd' | 'gradeCostUsd'>[],
    datasetSize = FULL_RUN_SIZE,
    skippedByCostCap: string[] = [],
): Summary {
    const counts: Record<Label, number> = { Correct: 0, Partial: 0, Incorrect: 0 };
    let errors = 0;
    for (const r of results) {
        if (r.error || !r.grade) errors++;
        else counts[r.grade.label]++;
    }
    const needed = neededFor(PASS_RATE, results.length);
    const highStakesErrors = results.filter(hasHighStakesError).map((r) => r.item.id);
    const failures = [
        ...(counts.Correct < needed ? [`${counts.Correct} of ${results.length} Correct; ${needed} needed`] : []),
        ...(highStakesErrors.length ? [`wrong high-stakes fact in: ${highStakesErrors.join(', ')}`] : []),
    ];
    return {
        ...runSummary(results, { datasetSize, skippedByCostCap, unit: 'question', rule: 'the 27-of-30 line applies', errors, failures }),
        counts,
        needed,
        highStakesErrors,
    };
}
