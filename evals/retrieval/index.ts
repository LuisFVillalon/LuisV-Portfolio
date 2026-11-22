// Ask AI retrieval check: runs only the search step (retrieve(): hybrid search + Voyage rerank)
// for each showcase question and reports where Luis's best matches rank. No Claude call is made
// for single-turn questions, so a run costs a fraction of a cent (Voyage embed + rerank only).
// Use it to measure an indexing or retrieval change before paying for a full eval.
//
//   npm run eval:retrieval                    all showcase questions
//   npm run eval:retrieval -- --id tech-react one question
//
// Writes evals/results/retrieval-<time>.md and .json. Always exits 0: it measures, it doesn't gate.
import fs from 'fs';
import path from 'path';
import { parseArgs } from '../core/args';
import { readJson, selectItems } from '../core/dataset';
import { loadEvalEnv } from '../core/env';
import { RESULTS_DIR } from '../core/runner';
import showcase from '../criteria/showcase';
import { validateShowcaseDataset } from '../criteria/showcase/dataset';
import { rankMatches, retrievalMarkdownReport, retrievalSummaryText, summarizeRetrieval, type RetrievalItemResult } from './score';

export async function runRetrieval(argv: string[]): Promise<void> {
    const args = parseArgs(argv);
    // Only the search step runs, so Claude's key isn't needed.
    const missing = loadEvalEnv().filter((v) => v !== 'ANTHROPIC_API_KEY');
    if (missing.length) throw new Error(`Missing in .env.local: ${missing.join(', ')}`);

    // Loaded after the environment: config.ts reads some settings at import time.
    const { ASSISTANT } = await import('../../src/app/lib/assistant/config');
    const { retrieve } = await import('../../src/app/lib/assistant/retrieve');
    const { siteChunks } = await import('../../src/app/lib/assistant/chunks/site');

    const dataset = validateShowcaseDataset(readJson(args.dataset ?? showcase.datasetFile), new Set(siteChunks().map((c) => c.id)));
    const items = selectItems(dataset.items, args);
    console.log(`Retrieval check: ${items.length} showcase question(s)\n`);

    const results: RetrievalItemResult[] = [];
    // Whether the index holds contextual-retrieval context (what was indexed, not the current setting).
    let contextual = false;
    for (const item of items) {
        const r = await retrieve(item.question);
        contextual ||= r.shortlist.some((c) => c.context);
        const finalIds = r.chunks.map((c) => c.id);
        const matches = rankMatches(item.matches, finalIds, r.shortlist.map((c) => c.id));
        results.push({ id: item.id, kind: item.kind, question: item.question, finalIds, matches });
        const found = matches.filter((m) => m.finalRank !== null).length;
        console.log(`${found ? '✓' : '✗'} ${item.id}: ${found} of ${matches.length} best matches reach Claude`);
    }

    const summary = summarizeRetrieval(results);
    console.log(`\n${retrievalSummaryText(summary, ASSISTANT.rerankTopK)}`);

    const info = { startedAt: new Date().toISOString(), contextual, topK: ASSISTANT.rerankTopK, shortlistSize: ASSISTANT.shortlistSize };
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const base = path.join(RESULTS_DIR, `retrieval-${info.startedAt.replace(/[:.]/g, '-')}`);
    fs.writeFileSync(`${base}.md`, retrievalMarkdownReport(results, info));
    fs.writeFileSync(`${base}.json`, `${JSON.stringify({ info, summary, results }, null, 2)}\n`);
    console.log(`\nReports: ${base}.md, ${base}.json`);
}
