// THE CORRECTNESS GRADER: the prompt, the output schema and the rules that label each answer.
// Everything that decides a verdict lives in this one file so it can be reviewed in one read
// (the grading model and its effort are shared by every criterion: core/grader.ts).
//
// Labels (criterion #1, Factual Correctness):
//   Correct   - every required key fact is present and nothing contradicts them
//   Partial   - nothing is wrong, but at least one required key fact is missing
//   Incorrect - at least one fact is wrong (a key fact is contradicted, or the answer states
//               something that contradicts the reference facts)
import { jsonRequest, parseJsonObject, text } from '../../core/grader';
import type { EvalItem } from './dataset';

export const GRADER_MAX_TOKENS = 4096;

export const GRADER_SYSTEM = `You grade answers from an AI assistant on a software engineer's portfolio website. Recruiters ask it factual questions about the engineer, Luis Villalón. You check one answer against reference key facts written by Luis.

For each required key fact, decide:
- "present": the answer states this fact. Paraphrases, abbreviations and equivalent wording count (for example "B.S." for "Bachelor of Science", "SDSU" for "San Diego State University"). A date is present when it matches at the precision the fact gives: a fact naming months needs the same months and years; a fact naming only a season or year needs only that. When a fact lists several items (for example several technologies), every item must be stated.
- "contradicted": the answer states something that conflicts with this fact (a different title, employer, degree, date, award or result).
- "missing": the answer neither states nor contradicts this fact. An answer that says it doesn't know leaves facts missing, not contradicted.

Then list wrongStatements: claims in the answer that conflict with the required key facts or with the reference facts about Luis given below. Every contradicted key fact must also appear here. Leave out statements that are only extra detail the facts don't mention: extra detail is not wrong. Do not judge tone, length, links or the call to action. For each wrong statement, set highStakes to true when it concerns a degree, a graduation date, an employer, a job title or an award result.

Label:
- "Incorrect" when any key fact is contradicted or wrongStatements is not empty.
- "Partial" when nothing is wrong but at least one key fact is missing.
- "Correct" when every key fact is present and nothing is wrong.

Give a one- or two-sentence reason naming the missing or wrong facts. Copy each key fact's text exactly into "fact".`;

/** JSON schema for structured output (output_config.format). */
export const GRADER_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['facts', 'wrongStatements', 'label', 'reason'],
    properties: {
        facts: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['fact', 'verdict', 'evidence'],
                properties: {
                    fact: { type: 'string' },
                    verdict: { type: 'string', enum: ['present', 'missing', 'contradicted'] },
                    /** The answer's words that state or contradict the fact; empty when missing. */
                    evidence: { type: 'string' },
                },
            },
        },
        wrongStatements: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['statement', 'highStakes'],
                properties: { statement: { type: 'string' }, highStakes: { type: 'boolean' } },
            },
        },
        label: { type: 'string', enum: ['Correct', 'Partial', 'Incorrect'] },
        reason: { type: 'string' },
    },
} as const;

/**
 * The grader's user message. `referenceFacts` are the high-stakes key facts of the whole
 * dataset, so a wrong degree, date, employer, title or award is caught in any answer, not only
 * in the item that asks about it.
 */
export function graderUserMessage(item: EvalItem, answer: string, referenceFacts: string[]): string {
    return [
        `Question: ${item.question}`,
        '',
        'Required key facts:',
        ...item.keyFacts.map((f) => `- ${f.fact}`),
        '',
        'Reference facts about Luis (for spotting wrong statements; not required in this answer):',
        ...referenceFacts.map((f) => `- ${f}`),
        '',
        '<answer>',
        answer,
        '</answer>',
    ].join('\n');
}

/** Every high-stakes key fact in the dataset, de-duplicated, each followed by the question it answers. */
export function highStakesReference(items: EvalItem[]): string[] {
    const out: string[] = [];
    for (const item of items) {
        for (const { fact } of item.keyFacts.filter((f) => f.highStakes)) {
            const line = `${fact} (re: ${item.question})`;
            if (!out.includes(line)) out.push(line);
        }
    }
    return out;
}

export const graderRequest = (item: EvalItem, answer: string, referenceFacts: string[]) =>
    jsonRequest({ system: GRADER_SYSTEM, user: graderUserMessage(item, answer, referenceFacts), schema: GRADER_SCHEMA, maxTokens: GRADER_MAX_TOKENS });

// ── Parsing ────────────────────────────────────────────────────────────────────────────────

export type Label = 'Correct' | 'Partial' | 'Incorrect';
export type FactVerdict = { fact: string; verdict: 'present' | 'missing' | 'contradicted'; evidence: string };
export type WrongStatement = { statement: string; highStakes: boolean };

export type Grade = {
    label: Label;
    /** The label the grader itself returned, when the rules below overrode it. */
    graderLabel?: Label;
    facts: FactVerdict[];
    wrongStatements: WrongStatement[];
    reason: string;
};

const LABELS: Label[] = ['Correct', 'Partial', 'Incorrect'];
const VERDICTS = ['present', 'missing', 'contradicted'] as const;

/** The label the rules give for these per-fact verdicts and wrong statements. */
export function labelFromVerdicts(facts: Pick<FactVerdict, 'verdict'>[], wrongStatements: unknown[]): Label {
    if (wrongStatements.length > 0 || facts.some((f) => f.verdict === 'contradicted')) return 'Incorrect';
    if (facts.some((f) => f.verdict === 'missing')) return 'Partial';
    return 'Correct';
}

/** Whether the grader's copy of a key fact names that fact: case and surrounding space are ignored. */
export const sameFact = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const worse = (a: Label, b: Label) => (LABELS.indexOf(a) >= LABELS.indexOf(b) ? a : b);

/**
 * Parses and checks the grader's JSON. The final label is the stricter of the grader's label and
 * the one its own per-fact verdicts imply, so a lenient label can never pass a contradicted or
 * missing fact. Every required key fact must have exactly one verdict.
 */
export function parseGraderOutput(output: string, keyFacts: string[]): Grade {
    const o = parseJsonObject(output);
    if (!LABELS.includes(o.label as Label)) throw new Error(`Grader label is invalid: ${String(o.label)}`);
    if (typeof o.reason !== 'string') throw new Error('Grader reason is missing');
    if (!Array.isArray(o.facts)) throw new Error('Grader facts are missing');
    if (!Array.isArray(o.wrongStatements)) throw new Error('Grader wrongStatements are missing');

    const facts: FactVerdict[] = o.facts.map((f: Record<string, unknown>, i: number) => {
        if (typeof f?.fact !== 'string' || !VERDICTS.includes(f.verdict as FactVerdict['verdict']))
            throw new Error(`Grader facts[${i}] is invalid`);
        return { fact: f.fact, verdict: f.verdict as FactVerdict['verdict'], evidence: text(f.evidence) };
    });
    for (const kf of keyFacts) {
        const n = facts.filter((f) => sameFact(f.fact, kf)).length;
        if (n !== 1) throw new Error(`Grader gave ${n} verdicts for key fact "${kf}"`);
    }
    if (facts.length !== keyFacts.length) throw new Error(`Grader returned ${facts.length} fact verdicts for ${keyFacts.length} key facts`);

    const wrongStatements: WrongStatement[] = o.wrongStatements.map((w: Record<string, unknown>, i: number) => {
        if (typeof w?.statement !== 'string' || typeof w.highStakes !== 'boolean') throw new Error(`Grader wrongStatements[${i}] is invalid`);
        return { statement: w.statement, highStakes: w.highStakes };
    });

    const graderLabel = o.label as Label;
    const label = worse(graderLabel, labelFromVerdicts(facts, wrongStatements));
    return { label, ...(label !== graderLabel ? { graderLabel } : {}), facts, wrongStatements, reason: o.reason };
}
