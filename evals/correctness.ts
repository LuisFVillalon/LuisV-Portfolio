// Ask AI eval, criterion #1: Factual Correctness.
//
//   npm run eval:correctness                 all 30 questions
//   npm run eval:correctness -- --limit 3    the first 3 questions
//   npm run eval:correctness -- --id edu-graduation
//   npm run eval:correctness -- --max-cost 0.5   stop starting questions past $0.50 (default $1)
//
// Each question runs the real assistant pipeline in-process, single-turn with no history: the
// same retrieve() + streamAnswer() the chat route uses. A stronger model then grades the answer
// against the item's key facts (see lib/grader.ts). Keys come from .env.local.
//
// Live site state is never touched: the chat route's Redis writes (question counters, monthly
// spend, saved conversations) live in the route, not in retrieve()/streamAnswer(), and this
// script removes the Redis variables from its environment before loading the pipeline.
import fs from 'fs';
import path from 'path';
import { parseArgs } from './lib/args';
import { loadDataset, selectItems } from './lib/dataset';
import { loadEvalEnv } from './lib/env';
import { graderCostUsd, graderRequest, highStakesReference, parseGraderOutput } from './lib/grader';
import { jsonReport, markdownReport, summaryText, type RunInfo } from './lib/report';
import { summarize, type ItemResult } from './lib/score';

const DATASET = path.join('evals', 'correctness.json');
const RESULTS_DIR = path.join('evals', 'results');

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const missing = loadEvalEnv();
    if (missing.length) {
        console.error(`Missing in .env.local: ${missing.join(', ')}`);
        process.exit(2);
    }

    // Imported after the environment is loaded: config.ts reads some settings at import time.
    const { ASSISTANT } = await import('../src/app/lib/assistant/config');
    const { getAnthropic } = await import('../src/app/lib/assistant/clients');
    const { retrieve } = await import('../src/app/lib/assistant/retrieve');
    const { streamAnswer } = await import('../src/app/lib/assistant/answer');

    const datasetFile = args.dataset ?? DATASET;
    const dataset = loadDataset(datasetFile);
    const items = selectItems(dataset.items, args);
    const reference = highStakesReference(dataset.items);
    const info: RunInfo = { startedAt: new Date().toISOString(), answerModel: ASSISTANT.model, dataset: datasetFile, datasetSize: dataset.items.length };

    console.log(`Factual correctness: ${items.length} question(s), answering with ${ASSISTANT.model}\n`);
    const results: ItemResult[] = [];
    const skippedByCostCap: string[] = [];
    let spent = 0;
    for (const [n, item] of items.entries()) {
        if (spent >= args.maxCostUsd) {
            skippedByCostCap.push(...items.slice(n).map((i) => i.id));
            console.warn(`Stopping: estimated spend $${spent.toFixed(4)} reached --max-cost $${args.maxCostUsd}; ${skippedByCostCap.length} question(s) not run`);
            break;
        }
        const r: ItemResult = { item, answer: '', sources: [], retrieved: [], answerLatencyMs: 0, gradeLatencyMs: 0, answerCostUsd: 0, gradeCostUsd: 0 };
        const meter = { costUsd: 0, estimateUsd: 0 };
        let rewriteCostUsd = 0;
        let t = performance.now();
        try {
            const retrieval = await retrieve(item.question);
            rewriteCostUsd = retrieval.rewriteCostUsd;
            r.retrieved = retrieval.chunks.map((c) => c.id);
            for await (const event of streamAnswer({ question: item.question, chunks: retrieval.chunks, meter })) {
                if (event.type === 'done') {
                    r.answer = event.text;
                    r.sources = event.sources.map(({ label, href }) => ({ label, href }));
                }
            }
            r.answerCostUsd = meter.costUsd + rewriteCostUsd;
            r.answerLatencyMs = performance.now() - t;

            t = performance.now();
            const res = await getAnthropic().messages.create(graderRequest(item, r.answer, reference));
            r.gradeLatencyMs = performance.now() - t;
            r.gradeCostUsd = graderCostUsd(res.usage);
            if (res.stop_reason !== 'end_turn') throw new Error(`Grader stopped with ${res.stop_reason}`);
            const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
            r.grade = parseGraderOutput(text, item.keyFacts.map((f) => f.fact));
        } catch (err) {
            r.error = err instanceof Error ? err.message : String(err);
            r.answerCostUsd = meter.costUsd + rewriteCostUsd;
            if (!r.answerLatencyMs) r.answerLatencyMs = performance.now() - t;
        }
        spent += r.answerCostUsd + r.gradeCostUsd;
        results.push(r);
        console.log(`[${n + 1}/${items.length}] ${item.id}: ${r.grade?.label ?? `ERROR (${r.error})`}`);
    }

    const summary = summarize(results, dataset.items.length, skippedByCostCap);
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const stamp = info.startedAt.replace(/[:.]/g, '-');
    const base = path.join(RESULTS_DIR, `correctness-${stamp}`);
    fs.writeFileSync(`${base}.md`, markdownReport(info, summary, results));
    fs.writeFileSync(`${base}.json`, `${JSON.stringify(jsonReport(info, summary, results), null, 2)}\n`);

    console.log(`\n${summaryText(summary)}\n\nReports: ${base}.md, ${base}.json`);
    process.exit(summary.pass ? 0 : 1);
}

main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
});
