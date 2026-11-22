// Criterion #2 pass/fail: across the answers, at least 95% of all claims are supported by the
// sources, and at least 95% of the answers (38 of 40) contain no unsupported claim.
// Pure functions, so the rule is unit-tested.
import type { BaseResult } from '../../core/runner';
import { neededFor, runSummary, type RunSummary } from '../../core/summary';
import type { FaithfulnessItem } from './dataset';
import type { FaithfulnessGrade } from './grader';

export const CLAIM_PASS_RATE = 0.95;
export const CLEAN_ANSWER_RATE = 0.95;
/** Size of the full dataset the 38-of-40 line was agreed for. */
export const FAITHFULNESS_RUN_SIZE = 40;

/** `retrieved` is numbered for the grader as S1, S2, ... */
export type FaithfulnessResult = BaseResult<FaithfulnessItem> & { grade?: FaithfulnessGrade };

export const unsupportedCount = (g: FaithfulnessGrade) => g.claims.filter((c) => c.verdict === 'unsupported').length;

export type FaithfulnessSummary = RunSummary & {
    claims: { total: number; supported: number; unsupported: number };
    /** supported / total claims; 1 when no answer made a claim. */
    claimRate: number;
    /** Graded answers with no unsupported claim (an answer with no claims at all is clean). */
    cleanAnswers: number;
    /** Clean answers needed to pass: ceil(95% of the questions run). */
    cleanNeeded: number;
    /** Ids of answers with at least one unsupported claim. */
    dirtyAnswers: string[];
};

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export function summarizeFaithfulness(
    results: Pick<FaithfulnessResult, 'item' | 'grade' | 'error' | 'answerCostUsd' | 'gradeCostUsd'>[],
    datasetSize = FAITHFULNESS_RUN_SIZE,
    skippedByCostCap: string[] = [],
): FaithfulnessSummary {
    const graded = results.filter((r) => !r.error && r.grade);
    let totalClaims = 0;
    let unsupported = 0;
    const dirtyAnswers: string[] = [];
    for (const r of graded) {
        const u = unsupportedCount(r.grade!);
        totalClaims += r.grade!.claims.length;
        unsupported += u;
        if (u > 0) dirtyAnswers.push(r.item.id);
    }
    const supported = totalClaims - unsupported;
    const claimRate = totalClaims === 0 ? 1 : supported / totalClaims;
    const cleanAnswers = graded.length - dirtyAnswers.length;
    const cleanNeeded = neededFor(CLEAN_ANSWER_RATE, results.length);
    const failures = [
        ...(claimRate < CLAIM_PASS_RATE - 1e-9 ? [`${pct(claimRate)} of claims supported (${supported} of ${totalClaims}); ${pct(CLAIM_PASS_RATE)} needed`] : []),
        ...(cleanAnswers < cleanNeeded ? [`${cleanAnswers} of ${results.length} answers fully supported; ${cleanNeeded} needed`] : []),
    ];
    return {
        ...runSummary(results, { datasetSize, skippedByCostCap, unit: 'question', rule: 'the 38-of-40 line applies', errors: results.length - graded.length, failures }),
        claims: { total: totalClaims, supported, unsupported },
        claimRate,
        cleanAnswers,
        cleanNeeded,
        dirtyAnswers,
    };
}
