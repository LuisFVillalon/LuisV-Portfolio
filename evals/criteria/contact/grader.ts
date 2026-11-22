// THE CONTACT GRADER (criterion #4, Contact Conversion): the prompt, the output schema and the
// parsing rules that decide whether an answer offers the visitor a way to contact Luis, and how
// clearly. Whether a contact link is there and works is checked in code (score.ts).
//
// The same judgment serves both halves of the criterion: a hiring-intent conversation needs a
// "clear" offer; a simple factual question should get "none". The grader isn't told which half an
// item belongs to, so it can't lean either way.
//
// The grader quotes the answer for every offer it finds, and the quote is looked up in the answer.
// What happens to a quote that isn't there depends on the item's kind, always the stricter way:
// a hiring answer's "clear" drops to "vague" (no pass on an offer that may not exist), while a
// factual answer's pitch stands and is flagged for a human (no pass by dropping one that may).
import { conversationMessage, jsonRequest, parseJsonObject, text } from '../../core/grader';
import { missingQuote, quoteInAnswer } from '../../core/quotes';
import type { ContactKind } from './dataset';

export const CONTACT_MAX_TOKENS = 2048;

/** The ways to reach Luis that the assistant knows about (prompt.ts), as the grader is told them. */
export type ContactChannels = { contactPage: string; email: string; linkedin: string };

export const contactSystem = (ch: ContactChannels) => `You grade one answer from an AI assistant on the portfolio website of a software engineer, Luis Villalón. You decide one thing: does the answer offer the visitor a way to contact Luis, and how clearly?

The ways to contact Luis are: the contact page (${ch.contactPage}), his email address (${ch.email}), messaging or connecting with him on LinkedIn (${ch.linkedin}), and the "Message Luis" button in the chat, which opens a short form.

contact:
- "clear": the answer invites the visitor to get in touch with Luis (reach out, talk to him, set up a call or interview, send him a message, connect) AND names at least one of those ways specifically enough to use it: a link to it, the page, the address, LinkedIn, or the button.
- "vague": the answer suggests getting in touch with Luis but doesn't say how ("feel free to reach out to him"), or gives one of those ways only in passing, without inviting the visitor to use it.
- "none": the answer neither invites contact nor gives a way to contact him.

Not contact: a link to the résumé, the projects page, a blog post, GitHub or a live app; pointing to LinkedIn posts as something to read; offering to answer more questions or tell them more. An answer that says it doesn't know and suggests asking Luis is contact ("vague" or "clear" by the rules above).

Judge only the last answer; earlier turns are context. Don't judge accuracy, length or tone. When contact is "clear" or "vague", copy into quote the exact words of the answer that invite contact or give the way (a short phrase, character for character); leave it empty for "none". Set answered to true when the answer gives the information the visitor asked for, false when it doesn't (it declines, says it doesn't know, or only redirects). Give a one-sentence reason.`;

/** JSON schema for structured output (output_config.format). */
export const CONTACT_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['contact', 'quote', 'answered', 'reason'],
    properties: {
        contact: { type: 'string', enum: ['clear', 'vague', 'none'] },
        quote: { type: 'string' },
        answered: { type: 'boolean' },
        reason: { type: 'string' },
    },
} as const;

export type ConversationTurn = { question: string; answer: string };

/** Earlier turns as context, then the last visitor message and the answer being graded. */
export const contactUserMessage = (turns: ConversationTurn[]) => conversationMessage(turns).join('\n');

export const contactRequest = (turns: ConversationTurn[], channels: ContactChannels) =>
    jsonRequest({ system: contactSystem(channels), user: contactUserMessage(turns), schema: CONTACT_SCHEMA, maxTokens: CONTACT_MAX_TOKENS });

// ── Parsing ────────────────────────────────────────────────────────────────────────────────

export type ContactVerdict = 'clear' | 'vague' | 'none';

export type ContactGrade = {
    contact: ContactVerdict;
    quote: string;
    answered: boolean;
    reason: string;
    /** The quote isn't in the answer but the verdict stood (factual items): check it by hand. */
    quoteUnverified: boolean;
    /** Set when a rule overrode the grader, saying what it said and why. */
    overrides: string[];
};

/** Parses and checks the grader's JSON, then applies the quote rule above for this item's kind. */
export function parseContactOutput(output: string, answer: string, kind: ContactKind): ContactGrade {
    const o = parseJsonObject(output);
    if (!['clear', 'vague', 'none'].includes(o.contact as string)) throw new Error('Grader contact is invalid');
    if (typeof o.answered !== 'boolean') throw new Error('Grader answered is invalid');
    if (typeof o.reason !== 'string') throw new Error('Grader reason is missing');

    const g: ContactGrade = {
        contact: o.contact as ContactVerdict,
        quote: text(o.quote),
        answered: o.answered,
        reason: o.reason,
        quoteUnverified: false,
        overrides: [],
    };
    if (g.contact !== 'none' && !quoteInAnswer(g.quote, answer)) {
        if (kind === 'hiring' && g.contact === 'clear') {
            g.contact = 'vague';
            g.overrides.push(`the grader said clear, but its quote ${missingQuote(g.quote)}`);
        } else if (kind === 'factual') g.quoteUnverified = true;
    }
    return g;
}
