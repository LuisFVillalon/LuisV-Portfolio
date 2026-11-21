// Criterion #1 pass/fail: at least 90% of answers Correct (27 of 30) and no answer states a
// wrong high-stakes fact. Pure functions, so the rule is unit-tested.
import type { EvalItem } from './dataset';
import type { Grade, Label } from './grader';

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
 * True when this answer states a wrong high-stakes fact: the grader flagged a wrong statement as
 * high-stakes, or (as a backstop) a high-stakes item has a contradicted key fact the grader did
 * not list as a wrong statement.
 */
export function hasHighStakesError(r: Pick<ItemResult, 'item' | 'grade'>): boolean {
    const g = r.grade;
    if (!g) return false;
    if (g.wrongStatements.some((w) => w.highStakes)) return true;
    return r.item.highStakes && g.wrongStatements.length === 0 && g.facts.some((f) => f.verdict === 'contradicted');
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
    /** True when fewer than the full 30 questions ran (--limit / --id): the verdict is indicative only. */
    partial: boolean;
    costUsd: { answer: number; grade: number; total: number };
};

export function summarize(
    results: Pick<ItemResult, 'item' | 'grade' | 'error' | 'answerCostUsd' | 'gradeCostUsd'>[],
    datasetSize = FULL_RUN_SIZE,
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
        partial: total < datasetSize,
        costUsd: { answer, grade, total: answer + grade },
    };
}
