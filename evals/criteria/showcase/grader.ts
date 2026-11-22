// THE SHOWCASE GRADER (criterion #3, Showcase Quality): the prompt, the output schema and the
// parsing rules that decide, for each acceptable best match, whether the answer names it and gives
// a concrete detail about it. Whether it links to it is checked in code (core/links.ts), not here.
//
// The grader quotes the answer for every "yes". The quote is looked up in the answer and a "yes"
// whose quote isn't there is downgraded: the answer is right here, so unlike criterion #2's source
// quotes there is no reason to give the grader the benefit of the doubt.
import { escapeAttr, jsonRequest, parseJsonObject, text } from '../../core/grader';
import { missingQuote, quoteInAnswer } from '../../core/quotes';

export const SHOWCASE_MAX_TOKENS = 4096;

/** One acceptable match as the grader sees it: an id (M1, M2, ...), its name and its reference text. */
export type GraderMatch = { id: string; name: string; reference: string };

export const SHOWCASE_SYSTEM = `You grade answers from an AI assistant on the portfolio website of a software engineer, Luis Villalón. A recruiter asked a skill or fit question. Luis has picked the project(s) or experience(s) that best show that skill; you get each one with an id, a name and the reference text the site holds about it. For each, decide two things about the answer.

1. named: does the answer name this project or experience as evidence for the question? It counts when the answer refers to it unmistakably: its title, the employer and role, or an equally clear name ("his internship at Ectron", "the Ask AI chat on this site"). It doesn't count when the answer only describes work that could be anything ("an internship where he used React"), or names a different project or experience.
2. detail: what is the most concrete thing the answer says about it?
   - "concrete": a specific, checkable detail about this item: what it does or how it works, a technology it was built with, a responsibility or action Luis took, a number, an outcome or an award. It must be consistent with the reference text.
   - "vague": only generic praise or labels ("a great project", "showed strong leadership", "a full-stack app").
   - "wrong": the detail it gives conflicts with the reference text.
   - "none": the answer says nothing about this item (always the case when it isn't named).
   A detail must be about this item, not about Luis in general or another item.

For every "named" true, copy into nameQuote the exact words of the answer that name it (a few words, character for character). For a "concrete" detail, copy into detailQuote the exact words of the answer that state it. Leave a quote empty when its answer is no. Judge only these two things: not links, length, tone or the rest of the answer. Give a one- or two-sentence reason.`;

/** JSON schema for structured output (output_config.format). */
export const SHOWCASE_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['matches', 'reason'],
    properties: {
        matches: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'named', 'nameQuote', 'detail', 'detailQuote'],
                properties: {
                    id: { type: 'string' },
                    named: { type: 'boolean' },
                    nameQuote: { type: 'string' },
                    detail: { type: 'string', enum: ['concrete', 'vague', 'wrong', 'none'] },
                    detailQuote: { type: 'string' },
                },
            },
        },
        reason: { type: 'string' },
    },
} as const;

export function showcaseUserMessage(question: string, answer: string, matches: GraderMatch[]): string {
    return [
        `Question: ${question}`,
        '',
        "Luis's best matches:",
        ...matches.map((m) => `<match id="${m.id}" name="${escapeAttr(m.name)}">\n${m.reference}\n</match>`),
        '',
        '<answer>',
        answer,
        '</answer>',
    ].join('\n');
}

export const showcaseRequest = (question: string, answer: string, matches: GraderMatch[]) =>
    jsonRequest({ system: SHOWCASE_SYSTEM, user: showcaseUserMessage(question, answer, matches), schema: SHOWCASE_SCHEMA, maxTokens: SHOWCASE_MAX_TOKENS });

// ── Parsing ────────────────────────────────────────────────────────────────────────────────

export type DetailVerdict = 'concrete' | 'vague' | 'wrong' | 'none';

export type MatchJudgment = {
    id: string;
    named: boolean;
    nameQuote: string;
    detail: DetailVerdict;
    detailQuote: string;
    /** Set when a rule below overrode the grader, saying what it said and why. */
    overrides: string[];
};

export type ShowcaseGrade = { matches: MatchJudgment[]; reason: string };

const DETAILS: DetailVerdict[] = ['concrete', 'vague', 'wrong', 'none'];

/**
 * Parses and checks the grader's JSON: one judgment per match id, no unknown ids. Then:
 * - named with a quote that isn't in the answer -> not named;
 * - not named -> detail "none" (a detail about an unnamed item can't showcase it);
 * - "concrete" with a quote that isn't in the answer -> "vague".
 */
export function parseShowcaseOutput(output: string, matchIds: string[], answer: string): ShowcaseGrade {
    const o = parseJsonObject(output);
    if (typeof o.reason !== 'string') throw new Error('Grader reason is missing');
    if (!Array.isArray(o.matches)) throw new Error('Grader matches are missing');

    const matches: MatchJudgment[] = o.matches.map((m: Record<string, unknown>, i: number) => {
        if (typeof m?.id !== 'string') throw new Error(`Grader matches[${i}] has no id`);
        if (typeof m.named !== 'boolean') throw new Error(`Grader matches[${i}] named is invalid`);
        if (!DETAILS.includes(m.detail as DetailVerdict)) throw new Error(`Grader matches[${i}] detail is invalid`);
        const j: MatchJudgment = { id: m.id.trim(), named: m.named, nameQuote: text(m.nameQuote), detail: m.detail as DetailVerdict, detailQuote: text(m.detailQuote), overrides: [] };
        if (j.named && !quoteInAnswer(j.nameQuote, answer)) {
            j.named = false;
            j.overrides.push(`the grader said named, but its quote ${missingQuote(j.nameQuote)}`);
        }
        if (!j.named && j.detail !== 'none') {
            j.overrides.push(`the grader said detail ${j.detail}, but the item isn't named`);
            j.detail = 'none';
        }
        if (j.detail === 'concrete' && !quoteInAnswer(j.detailQuote, answer)) {
            j.detail = 'vague';
            j.overrides.push(`the grader said concrete, but its quote ${missingQuote(j.detailQuote)}`);
        }
        return j;
    });
    for (const id of matchIds) {
        const n = matches.filter((m) => m.id === id).length;
        if (n !== 1) throw new Error(`Grader gave ${n} judgments for match ${id}`);
    }
    const unknown = matches.filter((m) => !matchIds.includes(m.id)).map((m) => m.id);
    if (unknown.length) throw new Error(`Grader judged unknown matches: ${unknown.join(', ')}`);
    return { matches, reason: o.reason };
}
