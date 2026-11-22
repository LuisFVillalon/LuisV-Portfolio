// Criterion #4 pass/fail, Contact Conversion:
//   - at least 9 of the 10 hiring-intent conversations end with a clear way to contact Luis
//     (graded) AND a working contact link the visitor can click (checked in code);
//   - at most 1 of the 10 simple factual questions gets a contact pitch nobody asked for.
// Pure functions, so the rule is unit-tested.
//
// What the visitor sees as a contact link: a link in the answer text to the contact page or
// Luis's LinkedIn profile, or the "Contact Luis →" button the chat shows under a fallback answer
// (one resting on no source, see ChatParts.tsx). A mailto: link renders as plain text in the chat,
// so it isn't a working link, though it still counts as a pitch. Source chips are citations, not an
// offer to get in touch, so they count for neither half (the "LinkedIn posts" chip points at the
// LinkedIn profile, and would otherwise look like a pitch on any answer that cites it). The
// "Message Luis" icon in the chat header is always there, so it doesn't count either.
import { linkIssues, linkMatchesTarget, type CheckedLink, type LinkStatus } from '../../core/links';
import type { LinkIssue } from '../../core/markdown';
import type { BaseResult } from '../../core/runner';
import { neededFor, runSummary, type RunSummary } from '../../core/summary';
import type { ContactItem, ContactKind } from './dataset';
import type { ContactChannels, ContactGrade } from './grader';

export const HIRING_PASS_RATE = 0.9;
export const FACTUAL_MAX_PITCH_RATE = 0.1;
/** Size of the full dataset the 9-of-10 and 1-of-10 lines were agreed for. */
export const CONTACT_RUN_SIZE = 20;

/** Whether a link (rendered or not) goes to one of the ways to contact Luis. */
export function isContactLink(href: string, ch: ContactChannels): boolean {
    if (/^mailto:/i.test(href)) return href.slice(7).split('?')[0].toLowerCase() === ch.email.toLowerCase();
    return linkMatchesTarget(href, ch.contactPage) || linkMatchesTarget(href, ch.linkedin);
}

export type ContactCheck = {
    contact: ContactGrade['contact'];
    /** Links in the answer text that go to a way to contact Luis, each with its status. */
    contactLinks: CheckedLink[];
    /** A fallback answer: the chat shows "Contact Luis →" (to the contact page) and "Message Luis" under it. */
    fallbackButtons: boolean;
    /** The visitor can click a working contact link: in the text, or the fallback button when the contact page works. */
    workingContactLink: boolean;
    /** What code saw that makes the answer a pitch whatever the grader said: contact links, the email address, the fallback buttons. */
    codeSignals: string[];
    /** Any contact offer at all: the grader's "clear" or "vague", or a code signal. */
    pitched: boolean;
    /** hiring: a clear offer and a working contact link; factual: no pitch. */
    pass: boolean;
    /** The grader said "none" but code saw a contact offer. */
    graderMissedPitch: boolean;
};

export function checkContact(
    kind: ContactKind,
    answer: string,
    grade: ContactGrade,
    links: CheckedLink[],
    fallback: boolean,
    contactPageStatus: LinkStatus,
    ch: ContactChannels,
): ContactCheck {
    const contactLinks = links.filter((l) => isContactLink(l.href, ch));
    const fallbackButtons = fallback;
    const workingContactLink = contactLinks.some((l) => l.kind !== 'plain' && l.status.ok) || (fallbackButtons && contactPageStatus.ok);

    const codeSignals: string[] = [];
    for (const l of contactLinks) codeSignals.push(`${l.kind === 'plain' ? 'unrendered contact link' : 'contact link'} ${l.href}`);
    if (answer.toLowerCase().includes(ch.email.toLowerCase()) && !contactLinks.some((l) => /^mailto:/i.test(l.href))) codeSignals.push('email address in the text');
    if (fallbackButtons) codeSignals.push('fallback answer: Contact Luis / Message Luis buttons shown');

    const pitched = grade.contact !== 'none' || codeSignals.length > 0;
    const pass = kind === 'hiring' ? grade.contact === 'clear' && workingContactLink : !pitched;
    return { contact: grade.contact, contactLinks, fallbackButtons, workingContactLink, codeSignals, pitched, pass, graderMissedPitch: grade.contact === 'none' && codeSignals.length > 0 };
}

export type ContactResult = BaseResult<ContactItem> & {
    /** Every link in the last answer's text, with its status. */
    links: CheckedLink[];
    grade?: ContactGrade;
    check?: ContactCheck;
};

export type ContactSummary = RunSummary & {
    hiring: {
        total: number;
        passed: number;
        /** ceil(90% of the hiring items run). */
        needed: number;
        clear: number;
        workingLink: number;
        failedIds: string[];
    };
    factual: {
        total: number;
        pitched: number;
        /** floor(10% of the factual items run). */
        allowed: number;
        pitchedIds: string[];
        /** Pitched answers that didn't answer the question: a retrieval or don't-know problem more than a sales one. */
        pitchedUnanswered: number;
    };
    /** Code saw a contact offer the grader called "none". */
    graderMissed: string[];
    /** Factual pitches whose quote wasn't found in the answer: check by hand. */
    unverifiedQuotes: string[];
    brokenLinks: LinkIssue[];
    unverifiedLinks: LinkIssue[];
};

export function summarizeContact(
    results: Pick<ContactResult, 'item' | 'check' | 'grade' | 'links' | 'error' | 'answerCostUsd' | 'gradeCostUsd'>[],
    datasetSize = CONTACT_RUN_SIZE,
    skippedByCostCap: string[] = [],
): ContactSummary {
    const ok = (r: (typeof results)[number]) => !r.error && Boolean(r.check);
    const graded = results.filter(ok);

    const hiringItems = results.filter((r) => r.item.kind === 'hiring');
    const hiringGraded = hiringItems.filter(ok);
    const hiring = {
        total: hiringItems.length,
        passed: hiringGraded.filter((r) => r.check!.pass).length,
        needed: neededFor(HIRING_PASS_RATE, hiringItems.length),
        clear: hiringGraded.filter((r) => r.check!.contact === 'clear').length,
        workingLink: hiringGraded.filter((r) => r.check!.workingContactLink).length,
        failedIds: hiringItems.filter((r) => !ok(r) || !r.check!.pass).map((r) => r.item.id),
    };

    const factualItems = results.filter((r) => r.item.kind === 'factual');
    const pitchedResults = factualItems.filter((r) => ok(r) && r.check!.pitched);
    const factual = {
        total: factualItems.length,
        pitched: pitchedResults.length,
        allowed: Math.floor(factualItems.length * FACTUAL_MAX_PITCH_RATE + 1e-9),
        pitchedIds: pitchedResults.map((r) => r.item.id),
        pitchedUnanswered: pitchedResults.filter((r) => r.grade && !r.grade.answered).length,
    };

    const failures = [
        ...(hiring.passed < hiring.needed ? [`${hiring.passed} of ${hiring.total} hiring conversations give a clear, working way to contact Luis; ${hiring.needed} needed`] : []),
        ...(factual.pitched > factual.allowed ? [`${factual.pitched} of ${factual.total} factual answers add a contact pitch; at most ${factual.allowed} allowed`] : []),
    ];
    return {
        ...runSummary(results, { datasetSize, skippedByCostCap, unit: 'item', rule: 'the 9-of-10 and 1-of-10 lines apply', errors: results.length - graded.length, failures }),
        hiring,
        factual,
        graderMissed: graded.filter((r) => r.check!.graderMissedPitch).map((r) => r.item.id),
        unverifiedQuotes: graded.filter((r) => r.grade?.quoteUnverified).map((r) => r.item.id),
        ...linkIssues(results.map((r) => ({ id: r.item.id, links: r.links }))),
    };
}

/** The console line for one item. */
export function contactStatus(r: ContactResult): string {
    const c = r.check!;
    const kind = `(${r.item.kind}) `;
    if (r.item.kind === 'factual') return kind + (c.pitched ? `pitched contact (${c.contact}${c.codeSignals.length ? `; ${c.codeSignals.join(', ')}` : ''})` : 'no pitch');
    if (c.pass) return `${kind}clear, working contact`;
    return kind + [c.contact !== 'clear' && `offer ${c.contact}`, !c.workingContactLink && (c.contactLinks.length ? 'contact link broken or not rendered' : 'no contact link')].filter(Boolean).join(', ');
}
