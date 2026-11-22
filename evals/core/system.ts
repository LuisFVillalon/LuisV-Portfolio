// THE RUN LOOP for the system criteria (#6 limits, #7 logging, #8 digest). Unlike criteria #1-#5,
// these check behaviour code can decide exactly, so no model answers or grades: each scenario
// drives the real handlers on a fresh FakeSite (fakeSite.ts) and records named checks. A scenario
// passes when every check does; the criterion passes when every scenario does. A run costs $0.
//
//   1. set the placeholder environment and block the network (never loads .env.local)
//   2. for each scenario: fresh site, run it, record its checks
//   3. print the summary and write evals/results/<name>-<time>.md and .json
//   4. exit 0 on PASS, 1 on FAIL, 2 on a setup error
import fs from 'fs';
import path from 'path';
import { isDeepStrictEqual } from 'util';
import { parseArgs } from './args';
import { selectItems } from './dataset';
import { FakeSite, useFakeSiteEnv } from './fakeSite';

const RESULTS_DIR = path.join('evals', 'results');

export type Check = { label: string; pass: boolean; detail?: string };

const show = (v: unknown) => (v === undefined ? 'undefined' : JSON.stringify(v));

/** What a scenario records its checks with. */
export class Checks {
    readonly list: Check[] = [];

    ok(label: string, pass: boolean, detail?: string): void {
        this.list.push({ label, pass, ...(pass || !detail ? {} : { detail }) });
    }

    equal(label: string, actual: unknown, expected: unknown): void {
        const pass = isDeepStrictEqual(actual, expected);
        this.list.push({ label, pass, ...(pass ? {} : { detail: `expected ${show(expected)}, got ${show(actual)}` }) });
    }

    /** Equal within `tolerance` (money: spend is stored in whole micro-dollars, rounded up). */
    near(label: string, actual: number, expected: number, tolerance: number): void {
        const pass = Math.abs(actual - expected) <= tolerance;
        this.list.push({ label, pass, ...(pass ? {} : { detail: `expected ${expected} ± ${tolerance}, got ${actual}` }) });
    }
}

export type Scenario = {
    id: string;
    title: string;
    run(site: FakeSite, t: Checks): Promise<void>;
};

export type SystemCriterion = {
    /** Used in the command line, the report file names and the console. */
    name: string;
    title: string;
    /** One sentence: what the criterion guarantees. */
    goal: string;
    scenarios: Scenario[];
};

export type ScenarioResult = { id: string; title: string; pass: boolean; checks: Check[]; error?: string };

export type SystemSummary = { total: number; passed: number; checks: number; failedChecks: number; partial: boolean; pass: boolean; failed: string[] };

export function summarizeSystem(results: ScenarioResult[], scenarioCount: number): SystemSummary {
    const failed = results.filter((r) => !r.pass).map((r) => r.id);
    const checks = results.reduce((n, r) => n + r.checks.length, 0);
    const failedChecks = results.reduce((n, r) => n + r.checks.filter((c) => !c.pass).length, 0);
    return {
        total: results.length,
        passed: results.length - failed.length,
        checks,
        failedChecks,
        partial: results.length < scenarioCount,
        pass: results.length > 0 && failed.length === 0,
        failed,
    };
}

export function systemSummaryText(c: SystemCriterion, s: SystemSummary): string {
    return [
        `${c.title}: ${s.passed} of ${s.total} scenario(s) pass (${s.checks - s.failedChecks} of ${s.checks} checks)`,
        `Rule: every scenario must pass (100%)${s.partial ? '; partial run, indicative only' : ''}`,
        `Cost: $0 (no model calls; the network is blocked)`,
        `Result: ${s.pass ? 'PASS' : 'FAIL'}${s.failed.length ? ` (failed: ${s.failed.join(', ')})` : ''}`,
    ].join('\n');
}

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function systemMarkdown(c: SystemCriterion, startedAt: string, s: SystemSummary, results: ScenarioResult[]): string {
    const lines = [
        `# ${c.title}`,
        '',
        `${c.goal}`,
        '',
        `- Run: ${startedAt}`,
        `- Scenarios: ${s.passed} of ${s.total} pass; checks: ${s.checks - s.failedChecks} of ${s.checks} pass`,
        `- Rule: every scenario must pass${s.partial ? ' (partial run, indicative only)' : ''}`,
        `- Result: **${s.pass ? 'PASS' : 'FAIL'}**`,
        '',
        '| Scenario | Result | Checks |',
        '|---|---|---|',
        ...results.map((r) => `| \`${r.id}\` ${cell(r.title)} | ${r.pass ? 'pass' : r.error ? 'ERROR' : '**FAIL**'} | ${r.checks.filter((x) => x.pass).length}/${r.checks.length} |`),
        '',
    ];
    for (const r of results) {
        lines.push(`## ${r.pass ? '✓' : '✗'} ${r.id}: ${r.title}`, '');
        if (r.error) lines.push(`**Error:** ${r.error}`, '');
        for (const x of r.checks) lines.push(`- ${x.pass ? '✓' : '✗'} ${x.label}${x.detail ? `: ${x.detail}` : ''}`);
        lines.push('');
    }
    return lines.join('\n');
}

export async function runSystemCriterion(c: SystemCriterion, argv: string[]): Promise<never> {
    const args = parseArgs(argv);
    if (args.model || args.dataset) throw new Error('--model and --dataset do not apply: this criterion makes no model calls and its scenarios live in code');
    useFakeSiteEnv();
    const startedAt = new Date().toISOString();
    const scenarios = selectItems(c.scenarios, args);
    console.log(`${c.title}: ${scenarios.length} scenario(s), no model calls\n`);

    // The handlers log their expected failures (refunds, aborted answers); keep the console to the results.
    const consoleError = console.error;
    const results: ScenarioResult[] = [];
    for (const s of scenarios) {
        const site = new FakeSite();
        const t = new Checks();
        let error: string | undefined;
        console.error = () => undefined;
        try {
            await s.run(site, t);
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            console.error = consoleError;
            site.dispose();
        }
        const pass = !error && t.list.length > 0 && t.list.every((x) => x.pass);
        results.push({ id: s.id, title: s.title, pass, checks: t.list, ...(error ? { error } : {}) });
        console.log(`${pass ? '✓' : '✗'} ${s.id}: ${error ? `ERROR (${error})` : `${t.list.filter((x) => x.pass).length}/${t.list.length} checks`}`);
        for (const x of t.list.filter((x) => !x.pass)) console.log(`    ✗ ${x.label}${x.detail ? `: ${x.detail}` : ''}`);
    }

    const summary = summarizeSystem(results, c.scenarios.length);
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const base = path.join(RESULTS_DIR, `${c.name}-${startedAt.replace(/[:.]/g, '-')}`);
    fs.writeFileSync(`${base}.md`, systemMarkdown(c, startedAt, summary, results));
    fs.writeFileSync(`${base}.json`, `${JSON.stringify({ criterion: c.name, startedAt, summary, results }, null, 2)}\n`);

    console.log(`\n${systemSummaryText(c, summary)}\n\nReports: ${base}.md, ${base}.json`);
    process.exit(summary.pass ? 0 : 1);
}
