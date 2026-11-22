// What a contact-conversion run prints and writes. Everything shown is the visitor's messages,
// the answers as the site would show them and public site content: nothing private.
import { idCell, itemLines, linkSummaryLines, linkText, listOr, noteLines, reportHeader, table, TIMING_HEADERS, timingCells, yes } from '../../core/markdown';
import type { RunInfo } from '../../core/runner';
import { closingLines } from '../../core/summary';
import type { ContactResult, ContactSummary } from './score';

export function contactSummaryText(s: ContactSummary): string {
    const h = s.hiring;
    const f = s.factual;
    return [
        `Hiring conversations with a clear, working way to contact Luis: ${h.passed} of ${h.total} (${h.needed} needed) · clear offer ${h.clear}, working contact link ${h.workingLink}${h.failedIds.length ? ` · failed: ${h.failedIds.join(', ')}` : ''}`,
        `Factual answers with a contact pitch nobody asked for: ${f.pitched} of ${f.total} (at most ${f.allowed} allowed)${f.pitchedIds.length ? ` · ${f.pitchedIds.join(', ')}` : ''}${f.pitchedUnanswered ? ` · ${f.pitchedUnanswered} of them didn't answer the question` : ''}`,
        ...(s.errors ? [`Errors: ${s.errors}`] : []),
        ...(s.graderMissed.length ? [`Pitches found in code that the grader called none: ${s.graderMissed.join(', ')}`] : []),
        ...(s.unverifiedQuotes.length ? [`Factual pitches whose quote wasn't found in the answer (check by hand): ${s.unverifiedQuotes.join(', ')}`] : []),
        ...linkSummaryLines(s),
        ...closingLines(s),
    ].join('\n');
}

const resultLabel = (r: ContactResult) => {
    if (r.error) return 'ERROR';
    if (!r.check) return '';
    if (r.item.kind === 'hiring') return r.check.pass ? 'PASS' : 'fail';
    return r.check.pitched ? 'pitched' : 'PASS';
};

function gradeLines(r: ContactResult): string[] {
    const lines = [`**Links in the graded answer:** ${listOr(r.links.map(linkText), '; ')}`, ''];
    const { grade: g, check: c } = r;
    if (!g || !c) return lines;
    return [
        ...lines,
        `**Contact offer: ${c.contact}**${g.quote ? ` (“${g.quote}”${g.quoteUnverified ? ' ⚠️ quote not found in the answer' : ''})` : ''}. ${g.reason}`,
        '',
        `- working contact link ${yes(c.workingContactLink)}${c.contactLinks.length ? `: ${c.contactLinks.map(linkText).join('; ')}` : ''}${c.fallbackButtons ? ' · fallback Contact Luis button' : ''}`,
        ...(c.codeSignals.length ? [`- seen in code: ${c.codeSignals.join('; ')}`] : []),
        ...(c.graderMissedPitch ? ['- override: the grader said none, but code saw a contact offer, so it counts as a pitch'] : []),
        ...g.overrides.map((o) => `- override: ${o}`),
        '',
    ];
}

const EXPECTED = { hiring: 'needs a clear offer and a working contact link', factual: 'should not pitch contact' };

export function contactMarkdownReport(info: RunInfo, summary: ContactSummary, results: ContactResult[]): string {
    return [
        ...reportHeader('Contact Conversion', info, contactSummaryText(summary), results.length),
        ...table(
            ['id', 'kind', 'turns', 'result', 'contact offer', 'working contact link', 'answered', ...TIMING_HEADERS],
            results.map((r) => [
                idCell(r.item.id),
                r.item.kind,
                String(r.item.turns.length),
                resultLabel(r),
                r.check?.contact ?? '',
                r.check ? yes(r.check.workingContactLink) : '',
                r.grade ? yes(r.grade.answered) : '',
                ...timingCells(r),
            ]),
        ),
        ...results.flatMap((r) => [
            ...itemLines(r, r.item.turns, { heading: `_${r.item.kind}: ${EXPECTED[r.item.kind]}_`, chipsLabel: 'Source chips (not counted)' }),
            ...gradeLines(r),
            ...noteLines(r.item.note),
        ]),
    ].join('\n');
}
