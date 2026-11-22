// THE RUN LOOP, shared by every criterion. A criterion (criteria/<name>/index.ts) only says how to
// grade one item and how to report; this file does the rest, the same way for all of them:
//
//   1. parse the flags and load .env.local (without the site's Redis, see env.ts)
//   2. load the pipeline, the criterion's setup and its dataset
//   3. for each item: answer its turns with the real assistant, then let the criterion grade it,
//      stopping once the estimated spend reaches --max-cost
//   4. print the summary and write evals/results/<name>-<time>.md and .json
//   5. exit 0 on PASS, 1 on FAIL, 2 on a setup error
import fs from 'fs';
import path from 'path';
import type Anthropic from '@anthropic-ai/sdk';
import { parseArgs } from './args';
import { readJson, selectItems } from './dataset';
import { loadEvalEnv } from './env';
import { graderCostUsd, GRADER_MODEL } from './grader';
import { answerQuestion, loadPipeline, partialAnswer, type Answered, type HistoryTurn, type Pipeline } from './pipeline';
import type { Costs, RunSummary } from './summary';

export const RESULTS_DIR = path.join('evals', 'results');

/** One visitor message and the answer the site gave, with its source chips. */
export type Turn = { question: string; answer: string; sources: Answered['sources'] };
/** A chunk retrieval passed to the answering model (the last turn's), best first. */
export type RetrievedRef = { id: string; label: string; rerankScore?: number };

/** What every criterion's result holds; each adds its grade and checks. */
export type BaseResult<Item> = Costs & {
    item: Item;
    /** Every turn as answered; the last is the one graded. Fewer than the item's turns when one failed. */
    turns: Turn[];
    retrieved: RetrievedRef[];
    /** The last answer rests on no cited source: the chat shows its Contact Luis / Message Luis buttons. */
    fallback: boolean;
    /** Set when answering or grading failed; the item then fails the run. */
    error?: string;
};

export const lastAnswer = (r: Pick<BaseResult<unknown>, 'turns'>) => r.turns[r.turns.length - 1]?.answer ?? '';

/** Shown at the top of every report. */
export type RunInfo = { startedAt: string; answerModel: string; grader: string; dataset: string; datasetSize: number; [extra: string]: unknown };

/** What a criterion gets to grade one item with. */
export type Tools = {
    /**
     * Answers the visitor's messages in order, each with the earlier turns as history, as the chat
     * sends them. Records every turn, the cost and the last turn's chunks on the result, even when
     * a turn fails (then rethrows). Returns the last answer, with its full chunks.
     */
    ask(questions: string[]): Promise<Answered>;
    /** Sends a grader request, records its cost and latency, and returns the text of its answer. */
    grade(request: Anthropic.MessageCreateParamsNonStreaming): Promise<string>;
};

export type Criterion<Item extends { id: string }, Result extends BaseResult<Item>, Summary extends RunSummary, Ctx = unknown> = {
    /** Used in the command line, the report file names and the console. */
    name: string;
    title: string;
    datasetFile: string;
    /** --max-cost default: a little above what a full run costs. */
    maxCostUsd: number;
    /** Anything the criterion needs besides the pipeline (site modules, facts, the site map). Runs after the env is loaded. */
    setup?(pipeline: Pipeline): Promise<Ctx>;
    /** Extra report header fields, e.g. whether the Assistant facts were loaded. */
    info?(ctx: Ctx): Record<string, unknown>;
    loadItems(raw: unknown, ctx: Ctx): Item[];
    /** The fields a criterion's result starts with besides the shared ones. */
    newResult?(item: Item): Omit<Result, keyof BaseResult<Item>>;
    /** Answers and grades one item, filling in `r`. Throwing marks the item as an error. `dataset` is every item, not only the ones selected. */
    evaluate(r: Result, tools: Tools, ctx: Ctx, dataset: Item[]): Promise<void>;
    /** The console line for one item. */
    status(r: Result): string;
    summarize(results: Result[], datasetSize: number, skippedByCostCap: string[]): Summary;
    summaryText(s: Summary): string;
    markdown(info: RunInfo, s: Summary, results: Result[]): string;
    /** The JSON report; defaults to the run info, summary and results as they are. */
    json?(info: RunInfo, s: Summary, results: Result[]): unknown;
};

/** Identity function that lets TypeScript infer a criterion's types from its definition. */
export const defineCriterion = <Item extends { id: string }, Result extends BaseResult<Item>, Summary extends RunSummary, Ctx = unknown>(
    c: Criterion<Item, Result, Summary, Ctx>,
) => c;

/** The tools for one result: answers and grades are recorded on `r` as they happen. */
function toolsFor(r: BaseResult<unknown>, pipeline: Pipeline): Tools {
    const keep = (question: string, a: Answered) => {
        r.turns.push({ question, answer: a.answer, sources: a.sources });
        r.fallback = a.fallback;
        r.retrieved = a.chunks.map(({ id, label, rerankScore }) => ({ id, label, rerankScore }));
        r.answerCostUsd += a.answerCostUsd;
        r.answerLatencyMs += a.answerLatencyMs;
    };
    return {
        async ask(questions) {
            const history: HistoryTurn[] = [];
            let last: Answered | undefined;
            for (const question of questions) {
                try {
                    last = await answerQuestion(pipeline, question, history);
                } catch (err) {
                    const partial = partialAnswer(err);
                    if (partial) keep(question, partial);
                    throw err;
                }
                keep(question, last);
                history.push({ role: 'user', text: question }, { role: 'assistant', text: last.answer });
            }
            return last!;
        },
        async grade(request) {
            const t = performance.now();
            const res = await pipeline.getAnthropic().messages.create(request);
            r.gradeLatencyMs += performance.now() - t;
            r.gradeCostUsd += graderCostUsd(res.usage);
            if (res.stop_reason !== 'end_turn') throw new Error(`Grader stopped with ${res.stop_reason}`);
            return res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
        },
    };
}

export async function runCriterion<Item extends { id: string }, Result extends BaseResult<Item>, Summary extends RunSummary, Ctx>(
    c: Criterion<Item, Result, Summary, Ctx>,
    argv: string[],
): Promise<never> {
    const args = parseArgs(argv, c.maxCostUsd);
    const missing = loadEvalEnv();
    if (missing.length) throw new Error(`Missing in .env.local: ${missing.join(', ')}`);

    // Loaded after the environment: config.ts reads some settings at import time.
    const pipeline = await loadPipeline(args.model);
    const ctx = (c.setup ? await c.setup(pipeline) : undefined) as Ctx;
    const datasetFile = args.dataset ?? c.datasetFile;
    const all = c.loadItems(readJson(datasetFile), ctx);
    const items = selectItems(all, args);
    const info: RunInfo = {
        startedAt: new Date().toISOString(),
        answerModel: pipeline.ASSISTANT.model,
        grader: GRADER_MODEL,
        dataset: datasetFile,
        datasetSize: all.length,
        ...c.info?.(ctx),
    };
    console.log(`${c.title}: ${items.length} item(s), answering with ${info.answerModel}\n`);

    const results: Result[] = [];
    const skippedByCostCap: string[] = [];
    let spent = 0;
    for (const [n, item] of items.entries()) {
        if (spent >= args.maxCostUsd) {
            skippedByCostCap.push(...items.slice(n).map((i) => i.id));
            console.warn(`Stopping: estimated spend $${spent.toFixed(4)} reached --max-cost $${args.maxCostUsd}; ${skippedByCostCap.length} item(s) not run`);
            break;
        }
        const r = {
            item,
            turns: [],
            retrieved: [],
            fallback: false,
            answerLatencyMs: 0,
            gradeLatencyMs: 0,
            answerCostUsd: 0,
            gradeCostUsd: 0,
            ...c.newResult?.(item),
        } as unknown as Result;
        try {
            await c.evaluate(r, toolsFor(r, pipeline), ctx, all);
        } catch (err) {
            r.error = err instanceof Error ? err.message : String(err);
        }
        spent += r.answerCostUsd + r.gradeCostUsd;
        results.push(r);
        console.log(`[${n + 1}/${items.length}] ${item.id}: ${r.error ? `ERROR (${r.error})` : c.status(r)}`);
    }

    const summary = c.summarize(results, all.length, skippedByCostCap);
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const base = path.join(RESULTS_DIR, `${c.name}-${info.startedAt.replace(/[:.]/g, '-')}`);
    fs.writeFileSync(`${base}.md`, c.markdown(info, summary, results));
    fs.writeFileSync(`${base}.json`, `${JSON.stringify(c.json ? c.json(info, summary, results) : { ...info, summary, results }, null, 2)}\n`);

    console.log(`\n${c.summaryText(summary)}\n\nReports: ${base}.md, ${base}.json`);
    process.exit(summary.pass ? 0 : 1);
}
