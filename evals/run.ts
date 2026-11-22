// The one command for every Ask AI eval:
//
//   npx tsx evals/run.ts <criterion> [--limit N | --id ID] [--max-cost USD] [--model MODEL] [--dataset FILE]
//
// <criterion> is one of the criteria below, or "retrieval" for the search-only check. The npm
// scripts (`npm run eval:correctness`, ...) call this. See evals/README.md.
import { runCriterion } from './core/runner';
import { runSystemCriterion } from './core/system';
import boundaries from './criteria/boundaries';
import contact from './criteria/contact';
import correctness from './criteria/correctness';
import digest from './criteria/digest';
import faithfulness from './criteria/faithfulness';
import limits from './criteria/limits';
import logging from './criteria/logging';
import showcase from './criteria/showcase';
import { runRetrieval } from './retrieval';

/** Criteria #1 to #5, in order: answers graded by a model. Add a new one here once it has a folder under criteria/. */
export const CRITERIA = { correctness, faithfulness, showcase, contact, boundaries } as const;

/** Criteria #6 to #8: system behaviour checked by code on a fake site (core/system.ts), no model calls. */
export const SYSTEM_CRITERIA = { limits, logging, digest } as const;

async function main([name, ...argv]: string[]) {
    if (name === 'retrieval') return runRetrieval(argv);
    const system = SYSTEM_CRITERIA[name as keyof typeof SYSTEM_CRITERIA];
    if (system) return runSystemCriterion(system, argv);
    const criterion = CRITERIA[name as keyof typeof CRITERIA];
    if (!criterion) throw new Error(`Usage: tsx evals/run.ts <${[...Object.keys(CRITERIA), ...Object.keys(SYSTEM_CRITERIA), 'retrieval'].join(' | ')}> [flags]`);
    // Each criterion has its own item and result types; the runner only needs them to agree with each other.
    return runCriterion(criterion as Parameters<typeof runCriterion>[0], argv);
}

main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
});
