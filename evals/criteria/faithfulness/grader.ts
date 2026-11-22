// THE FAITHFULNESS GRADER (criterion #2, Source Faithfulness): the sources, the prompt, the output
// schema and the parsing rules that decide whether each claim in an answer is backed by what the
// assistant was given. Everything that decides a verdict lives in this one file.
//
// The sources are exactly what the answering model saw:
//   S1..Sn - the retrieved chunks, in the order they were passed to it, each with the link
//            (href) it was given as the search result's source
//   F      - the Assistant facts (system prompt), when configured
//   C      - the contact and site details the persona injects (résumé, LinkedIn, email, pages)
import { escapeAttr, jsonRequest, parseJsonObject, text } from '../../core/grader';
import { normalizeForQuote } from '../../core/quotes';

/** Answers can hold a dozen claims, each with a quote; leave room. */
export const FAITHFULNESS_MAX_TOKENS = 8192;

/** `url` is the link the answering model got with a retrieved chunk (its search-result `source`). */
export type GraderSource = { id: string; title: string; text: string; url?: string };

export const FACTS_SOURCE_ID = 'F';
export const CONTACT_SOURCE_ID = 'C';

/** The details prompt.ts puts in the persona, as the persona states them. */
export function contactSourceText(d: { resume: string; linkedin: string; email: string; github: string }): string {
    return [
        `Résumé: ${d.resume}`,
        `LinkedIn: ${d.linkedin}`,
        `Email: ${d.email}`,
        `GitHub profile: ${d.github}`,
        'Site pages: / (home), /about, /experience, /projects, /blog, /contact (contact page)',
        'The chat has a "Message Luis" button that opens a short form the visitor fills in and sends themselves.',
        'Salary, offers, start dates and availability are handed to Luis: the assistant may say they are questions for Luis to answer or confirm directly.',
        'When a project or role has no link of its own, the assistant may link /projects or /experience for it.',
    ].join('\n');
}

/** The grader's sources, numbered as the answering model saw them. */
export function buildSources(chunks: { header: string; text: string; href?: string }[], facts: string | null, contact: string): GraderSource[] {
    return [
        ...chunks.map((c, i) => ({ id: `S${i + 1}`, title: c.header, text: c.text, ...(c.href ? { url: c.href } : {}) })),
        ...(facts?.trim() ? [{ id: FACTS_SOURCE_ID, title: 'Assistant facts (written by Luis for the assistant)', text: facts.trim() }] : []),
        { id: CONTACT_SOURCE_ID, title: 'Contact and site details', text: contact },
    ];
}

export const FAITHFULNESS_SYSTEM = `You check whether an AI assistant's answer is faithful to its sources. The assistant is on the portfolio website of a software engineer, Luis Villalón. It must answer visitors' questions using only the sources it was given; you get the same sources, the question and the answer. You do not know anything about Luis beyond these sources, so never use outside knowledge to support a claim.

Step 1: split the answer into claims. A claim is one checkable statement about Luis or his work: his roles, employers, projects, what a project does or is built with, skills, education, awards, dates, numbers, writing, opinions attributed to him, and contact details or links. One claim per distinct fact: "He built X with React and Node at Y" is three claims (built X at Y, X uses React, X uses Node). Every number, date, name, technology, URL and link target is part of some claim.
Do not list as claims: greetings; offers to help or to pass on a message; suggestions to read the résumé or get in touch (but a link or contact detail they give is a claim); the question restated; statements that the assistant doesn't have some information; general statements that say nothing about Luis (what a technology is).
A judgment about Luis (a strength, a good fit for a role, "experienced with") is a claim. It is supported only when the sources hold the concrete evidence the answer bases it on; praise with no such evidence is unsupported.

Step 2: give each claim a verdict.
- "supported": a source states it or directly implies it. Paraphrase is fine, and so is combining two sources.
- "unsupported": no source states it; or it goes beyond its source (more specific, bigger or stronger: "led" where the source says "contributed to", a number, date, metric, user count or technology the source doesn't give, a link that appears in no source); or it conflicts with a source.
A source's url attribute is the link the assistant was given with that source: a link to that url is supported by that source (quote the url as evidence), and so is calling it the page or repository of what the source describes.
When unsure, choose "unsupported".

For a supported claim, list in sourceIds the ids of the sources that back it, and copy into evidence a short exact quote (a few words, character for character) from one of them. For an unsupported claim, list the id of a source it conflicts with if there is one (otherwise leave sourceIds empty) and leave evidence empty or quote the conflicting text.

Finally give a one- or two-sentence reason naming the unsupported claims, or saying every claim is supported. An answer with no claims (for example a polite decline) gets an empty claims list.`;

/** JSON schema for structured output (output_config.format). */
export const FAITHFULNESS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['claims', 'reason'],
    properties: {
        claims: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['claim', 'verdict', 'sourceIds', 'evidence'],
                properties: {
                    claim: { type: 'string' },
                    verdict: { type: 'string', enum: ['supported', 'unsupported'] },
                    sourceIds: { type: 'array', items: { type: 'string' } },
                    evidence: { type: 'string' },
                },
            },
        },
        reason: { type: 'string' },
    },
} as const;

export function faithfulnessUserMessage(question: string, answer: string, sources: GraderSource[]): string {
    return [
        `Question: ${question}`,
        '',
        'Sources:',
        ...sources.map((s) => `<source id="${s.id}" title="${escapeAttr(s.title)}"${s.url ? ` url="${escapeAttr(s.url)}"` : ''}>\n${s.text}\n</source>`),
        '',
        '<answer>',
        answer,
        '</answer>',
    ].join('\n');
}

export const faithfulnessRequest = (question: string, answer: string, sources: GraderSource[]) =>
    jsonRequest({ system: FAITHFULNESS_SYSTEM, user: faithfulnessUserMessage(question, answer, sources), schema: FAITHFULNESS_SCHEMA, maxTokens: FAITHFULNESS_MAX_TOKENS });

// ── Parsing ────────────────────────────────────────────────────────────────────────────────

export type ClaimVerdict = 'supported' | 'unsupported';

export type Claim = {
    claim: string;
    verdict: ClaimVerdict;
    /** The grader's verdict, when the rules below overrode it. */
    graderVerdict?: ClaimVerdict;
    /** Why the verdict was overridden. */
    overrideReason?: string;
    /** Cited source ids that exist in this item's source list. */
    sourceIds: string[];
    evidence: string;
    /**
     * For a supported claim: the id of the cited source that contains the evidence quote, or null
     * when the quote isn't found in any cited source (shown in the report, does not change the verdict).
     */
    evidenceFoundIn?: string | null;
};

export type FaithfulnessGrade = { claims: Claim[]; reason: string };

/**
 * Parses and checks the grader's JSON. A "supported" claim that cites no source from this item's
 * list is downgraded to "unsupported": the grader must point at what backs it. Unknown ids are
 * dropped. The evidence quote is looked up in the cited sources and the result recorded.
 */
export function parseFaithfulnessOutput(output: string, sources: GraderSource[]): FaithfulnessGrade {
    const o = parseJsonObject(output);
    if (typeof o.reason !== 'string') throw new Error('Grader reason is missing');
    if (!Array.isArray(o.claims)) throw new Error('Grader claims are missing');

    const byId = new Map(sources.map((s) => [s.id, s]));
    const claims: Claim[] = o.claims.map((c: Record<string, unknown>, i: number) => {
        if (typeof c?.claim !== 'string' || !c.claim.trim()) throw new Error(`Grader claims[${i}] has no claim text`);
        if (c.verdict !== 'supported' && c.verdict !== 'unsupported') throw new Error(`Grader claims[${i}] verdict is invalid`);
        if (!Array.isArray(c.sourceIds) || c.sourceIds.some((id) => typeof id !== 'string')) throw new Error(`Grader claims[${i}] sourceIds are invalid`);
        const evidence = text(c.evidence);
        const cited = [...new Set((c.sourceIds as string[]).map((id) => id.trim()))];
        const sourceIds = cited.filter((id) => byId.has(id));
        const claim: Claim = { claim: c.claim, verdict: c.verdict, sourceIds, evidence };
        if (c.verdict === 'supported') {
            if (sourceIds.length === 0) {
                claim.verdict = 'unsupported';
                claim.graderVerdict = 'supported';
                claim.overrideReason = cited.length ? `cites no source in the list (${cited.join(', ')})` : 'cites no source';
            } else {
                const quote = normalizeForQuote(evidence);
                const inSource = (id: string) => {
                    const s = byId.get(id)!;
                    return normalizeForQuote(`${s.title}\n${s.url ?? ''}\n${s.text}`).includes(quote);
                };
                claim.evidenceFoundIn = quote ? (sourceIds.find(inSource) ?? null) : null;
            }
        }
        return claim;
    });
    return { claims, reason: o.reason };
}
