// Criterion #1, Factual Correctness: each question is answered single-turn with the real
// pipeline, then a grader checks the answer against the item's key facts (grader.ts).
//
//   npm run eval:correctness                     all 30 questions
//   npm run eval:correctness -- --limit 3        the first 3
//   npm run eval:correctness -- --id edu-graduation
//   npm run eval:correctness -- --max-cost 0.5   stop starting questions past $0.50 (default $1)
import path from 'path';
import { defineCriterion } from '../../core/runner';
import { validateDataset, type EvalItem } from './dataset';
import { graderRequest, highStakesReference, parseGraderOutput } from './grader';
import { jsonReport, markdownReport, summaryText } from './report';
import { summarize, type ItemResult, type Summary } from './score';

export default defineCriterion<EvalItem, ItemResult, Summary>({
    name: 'correctness',
    title: 'Factual correctness',
    datasetFile: path.join('evals', 'criteria', 'correctness', 'dataset.json'),
    maxCostUsd: 1,
    loadItems: (raw) => validateDataset(raw).items,
    async evaluate(r, { ask, grade }, _ctx, dataset) {
        const { answer } = await ask([r.item.question]);
        // The high-stakes facts of the whole dataset, so a wrong degree or title is caught in any answer.
        const reference = highStakesReference(dataset);
        r.grade = parseGraderOutput(await grade(graderRequest(r.item, answer, reference)), r.item.keyFacts.map((f) => f.fact));
    },
    status: (r) => r.grade!.label,
    summarize,
    summaryText,
    markdown: markdownReport,
    json: jsonReport,
});
