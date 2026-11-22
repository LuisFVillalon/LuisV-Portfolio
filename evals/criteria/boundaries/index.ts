// Criterion #5, Honest Boundaries: each visitor turn is answered with the real pipeline, with the
// earlier turns as history. Code scans every answer for leaks of the system prompt and the
// Assistant facts (score.ts); a grader then judges whether the last answer handled the tricky
// prompt correctly, and reports any leak it sees (grader.ts).
//
//   npm run eval:boundaries                     all 20 items (10 unanswerable, 5 false premise, 5 off-limits)
//   npm run eval:boundaries -- --limit 4        the first 4 (every kind)
//   npm run eval:boundaries -- --max-cost 0.3   stop starting items past $0.30 (default $1)
import path from 'path';
import { defineCriterion } from '../../core/runner';
import type { RetrievedChunk } from '../../../src/app/lib/assistant/retrieve';
import { validateBoundaryDataset, type BoundaryItem } from './dataset';
import { boundariesRequest, parseBoundariesOutput } from './grader';
import { boundariesJsonReport, boundariesMarkdownReport, boundariesSummaryText } from './report';
import { boundaryStatus, checkBoundary, detectLeaks, summarizeBoundaries, type BoundariesSummary, type BoundaryResult } from './score';

/** The exact system prompt the answering model gets, and the Assistant facts inside it. */
async function setup() {
    const { systemBlocks } = await import('../../../src/app/lib/assistant/prompt');
    const { loadAssistantFacts } = await import('../../../src/app/lib/assistant/private');
    const facts = loadAssistantFacts();
    if (!facts?.trim()) console.warn('No Assistant facts found (ASSISTANT_FACTS or .private/): the schedule and private-fact checks have nothing to protect.');
    return { systemPrompt: systemBlocks().map((b) => b.text).join('\n\n'), facts };
}

export default defineCriterion<BoundaryItem, BoundaryResult, BoundariesSummary, Awaited<ReturnType<typeof setup>>>({
    name: 'boundaries',
    title: 'Honest boundaries',
    datasetFile: path.join('evals', 'criteria', 'boundaries', 'dataset.json'),
    /** 20 items; the grader prompt carries the system prompt and the chunk text: about $0.02-0.04 per item. */
    maxCostUsd: 1,
    setup,
    info: ({ facts }) => ({ factsLoaded: Boolean(facts?.trim()) }),
    loadItems: (raw) => validateBoundaryDataset(raw).items,
    newResult: () => ({ signals: [] }),
    async evaluate(r, { ask, grade }, { systemPrompt, facts }) {
        let chunks: RetrievedChunk[];
        try {
            ({ chunks } = await ask(r.item.turns));
        } finally {
            // Scan whatever was answered, even if a later turn failed: a leak counts either way.
            r.signals = detectLeaks(r.turns.map((t) => t.answer), systemPrompt, facts);
        }
        const request = boundariesRequest({ kind: r.item.kind, reference: r.item.reference, turns: r.turns, chunks, systemPrompt });
        r.grade = parseBoundariesOutput(await grade(request), r.turns.map((t) => t.answer));
        r.check = checkBoundary(r.grade, r.signals);
    },
    status: boundaryStatus,
    summarize: summarizeBoundaries,
    summaryText: boundariesSummaryText,
    markdown: boundariesMarkdownReport,
    json: boundariesJsonReport,
});
