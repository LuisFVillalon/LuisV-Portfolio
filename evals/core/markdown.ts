// Building blocks for the Markdown reports, shared by every criterion.
import type { CheckedLink } from './links';
import type { BaseResult, RetrievedRef, RunInfo, Turn } from './runner';

export const usd = (n: number) => `$${n.toFixed(4)}`;
export const sec = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
export const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
export const yes = (b: boolean) => (b ? '✅' : '❌');
/** Text safe for a table cell or a one-line field. */
export const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
export const listOr = (xs: string[], sep = ', ', none = 'none') => (xs.length ? xs.join(sep) : none);

/** The report's title, run line and summary block. `extra` goes at the end of the run line. */
export function reportHeader(title: string, info: RunInfo, summaryText: string, resultsShown: number, extra = ''): string[] {
    return [
        `# Ask AI eval: ${title}`,
        '',
        `Run ${info.startedAt} · answering model ${info.answerModel} · grader ${info.grader} · dataset ${info.dataset} (${resultsShown} of ${info.datasetSize} items)${extra}`,
        '',
        '```',
        summaryText,
        '```',
        '',
    ];
}

/** A Markdown table: the header row, the divider and one row per item. */
export const table = (headers: string[], rows: string[][]) => [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---|').join('')}`, ...rows.map((r) => `| ${r.join(' | ')} |`), ''];

/** The first column of an overview row: the id, linked to its section below. */
export const idCell = (id: string) => `[${id}](#${id})`;

/** The last two columns of an overview row. */
export const timingCells = (r: BaseResult<unknown>) => [`${sec(r.answerLatencyMs)} · ${usd(r.answerCostUsd)}`, `${sec(r.gradeLatencyMs)} · ${usd(r.gradeCostUsd)}`];
export const TIMING_HEADERS = ['answer (latency · cost)', 'grade (latency · cost)'];

const quoted = (text: string) => (text || '(none)').split('\n').map((l) => `> ${l}`);

/**
 * The visitor's messages and the answers. A single question shows as Q and Answer; a
 * conversation shows every turn, marking the graded one, and any turns never reached.
 */
export function conversationLines(turns: Turn[], script: string[]): string[] {
    if (script.length === 1) return [`**Q:** ${script[0]}`, '', '**Answer:**', '', ...quoted(turns[0]?.answer ?? ''), ''];
    const lines: string[] = [];
    turns.forEach((t, i) => lines.push(`**Visitor (turn ${i + 1}${i === turns.length - 1 ? ', graded' : ''}):** ${t.question}`, '', ...quoted(t.answer), ''));
    for (const q of script.slice(turns.length)) lines.push(`**Visitor (not reached):** ${q}`, '');
    return lines;
}

/** The chunks the answering model saw, numbered as graders see them (S1, S2, ...), with rerank scores. */
export const retrievedLine = (retrieved: RetrievedRef[]) =>
    `**Retrieved chunks:** ${listOr(retrieved.map((c, i) => `S${i + 1} ${c.id}${c.rerankScore !== undefined ? ` (${c.rerankScore.toFixed(2)})` : ''}`))}`;

/** The source chips under the last answer. */
export const chipsLine = (r: Pick<BaseResult<unknown>, 'turns'>, label = 'Source chips') =>
    `**${label}:** ${listOr((r.turns[r.turns.length - 1]?.sources ?? []).map((s) => `${s.label} (${s.href})`), '; ')}`;

/**
 * The lines every item section opens with: error, conversation, chips, fallback and retrieved
 * chunks. `chipsLabel: false` leaves the chips out, for a criterion that shows them checked.
 */
export function itemLines(r: BaseResult<{ id: string }>, script: string[], o: { chipsLabel?: string | false; heading?: string } = {}): string[] {
    return [
        `## ${r.item.id}`,
        '',
        ...(o.heading ? [o.heading, ''] : []),
        ...(r.error ? [`**Error:** ${cell(r.error)}`, ''] : []),
        ...conversationLines(r.turns, script),
        ...(o.chipsLabel === false ? [] : [chipsLine(r, o.chipsLabel), '']),
        ...(r.fallback ? ['**Fallback answer:** the chat shows the Contact Luis → and Message Luis buttons under it.', ''] : []),
        retrievedLine(r.retrieved),
        '',
    ];
}

/** A reviewer note from the dataset, at the end of an item section. */
export const noteLines = (note?: string) => (note ? [`_Dataset note: ${note}_`, ''] : []);

/** A link and whether it works. */
export const linkText = (l: CheckedLink) =>
    l.kind === 'plain' ? `${l.href} (plain text, not a link)` : `${l.href} → ${l.status.ok ? (l.status.unverified ? '⚠️' : '✅') : '❌'} ${l.status.detail}`;

/** Broken and blocked links, for a summary. */
export function linkSummaryLines(s: { brokenLinks: LinkIssue[]; unverifiedLinks: LinkIssue[] }): string[] {
    return [
        `Broken links: ${listOr(s.brokenLinks.map((l) => `${l.href} (${l.id}: ${l.detail})`), '; ')}`,
        ...(s.unverifiedLinks.length ? [`Links that blocked the check (counted as working, check by hand): ${s.unverifiedLinks.map((l) => `${l.href} (${l.id})`).join('; ')}`] : []),
    ];
}

export type LinkIssue = { id: string; href: string; detail: string };
