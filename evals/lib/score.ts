// Criterion #1 pass/fail: at least 90% of answers Correct (27 of 30) and no answer states a
// wrong high-stakes fact. Pure functions, so the rule is unit-tested.
import type { EvalItem } from './dataset';
import { sameFact, type Grade, type Label } from './grader';

export const PASS_RATE = 0.9;
/** Size of the full dataset the 27-of-30 line was agreed for. */
export const FULL_RUN_SIZE = 30;

export type ItemResult = {
    item: EvalItem;
    answer: string;
    sources: { label: string; href: string }[];
    /** Chunk ids retrieval passed to the answering model, best first. */
    retrieved: string[];
    /** Set when answering or grading failed; the item then counts as not Correct. */
    error?: string;
    grade?: Grade;
    answerLatencyMs: number;
    gradeLatencyMs: number;
    answerCostUsd: number;
    gradeCostUsd: number;
};

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

export type Summary = {
    total: number;
    counts: Record<Label, number>;
    errors: number;
    /** Correct answers needed to pass: ceil(90% of the questions run). */
    needed: number;
    highStakesErrors: string[];
    pass: boolean;
    /** Why the run failed, when it did. */
    failures: string[];
    /** True when --limit / --id chose fewer than the full 30 questions: the verdict is indicative only. */
    partial: boolean;
    /** Ids of selected questions never run because the --max-cost cap was reached; any fails the run. */
    skippedByCostCap: string[];
    costUsd: { answer: number; grade: number; total: number };
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
    const total = results.length;
    // The epsilon keeps 0.9 × 30 = 27.000000000000004 from rounding up to 28.
    const needed = Math.ceil(total * PASS_RATE - 1e-9);
    const highStakesErrors = results.filter(hasHighStakesError).map((r) => r.item.id);
    const failures: string[] = [];
    if (skippedByCostCap.length) failures.push(`cut short by the --max-cost cap: ${skippedByCostCap.length} question(s) not run`);
    if (total === 0) failures.push('no questions ran');
    if (counts.Correct < needed) failures.push(`${counts.Correct} of ${total} Correct; ${needed} needed`);
    if (highStakesErrors.length) failures.push(`wrong high-stakes fact in: ${highStakesErrors.join(', ')}`);
    if (errors) failures.push(`${errors} question(s) could not be answered or graded`);
    const answer = results.reduce((s, r) => s + r.answerCostUsd, 0);
    const grade = results.reduce((s, r) => s + r.gradeCostUsd, 0);
    return {
        total,
        counts,
        errors,
        needed,
        highStakesErrors,
        pass: failures.length === 0,
        failures,
        partial: total + skippedByCostCap.length < datasetSize,
        skippedByCostCap,
        costUsd: { answer, grade, total: answer + grade },
    };
}
