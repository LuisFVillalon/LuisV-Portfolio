// Criterion #4, Contact Conversion: each visitor turn is answered with the real pipeline, with the
// earlier turns as history. A grader judges whether the last answer offers a way to contact Luis,
// and how clearly (grader.ts); code finds the contact links, checks they work and applies the
// pass rule (score.ts).
//
//   npm run eval:contact                        all 20 items (10 hiring, 10 factual)
//   npm run eval:contact -- --limit 4           the first 4 (the dataset alternates kinds)
//   npm run eval:contact -- --max-cost 0.2      stop starting items past $0.20 (default $0.50)
import path from 'path';
import { checkAnswerLinks, checkSiteLink, linkChecker } from '../../core/links';
import { defineCriterion } from '../../core/runner';
import { loadSiteMap } from '../../core/site';
import { validateContactDataset, type ContactItem } from './dataset';
import { contactRequest, parseContactOutput, type ContactChannels } from './grader';
import { contactMarkdownReport, contactSummaryText } from './report';
import { checkContact, contactStatus, summarizeContact, type ContactResult, type ContactSummary } from './score';

/** The ways to reach Luis the assistant knows about, and the link checker. */
async function setup() {
    const { CONTACT_EMAIL } = await import('../../../src/app/lib/contact');
    const { linkedinProfileUrl } = await import('../../../src/app/lib/linkedinPosts');
    const channels: ContactChannels = { contactPage: '/contact', email: CONTACT_EMAIL, linkedin: linkedinProfileUrl };
    const site = await loadSiteMap();
    // The fallback answer's "Contact Luis →" button goes to the contact page.
    return { channels, checkLink: linkChecker(site), contactPageStatus: checkSiteLink(channels.contactPage, site) };
}

export default defineCriterion<ContactItem, ContactResult, ContactSummary, Awaited<ReturnType<typeof setup>>>({
    name: 'contact',
    title: 'Contact conversion',
    datasetFile: path.join('evals', 'criteria', 'contact', 'dataset.json'),
    /** 20 items, a few of them multi-turn, plus short grader prompts: about $0.01-0.02 per item. */
    maxCostUsd: 0.5,
    setup,
    loadItems: (raw) => validateContactDataset(raw).items,
    newResult: () => ({ links: [] }),
    async evaluate(r, { ask, grade }, { channels, checkLink, contactPageStatus }) {
        const { answer } = await ask(r.item.turns);
        r.links = await checkAnswerLinks(answer, checkLink);
        r.grade = parseContactOutput(await grade(contactRequest(r.turns, channels)), answer, r.item.kind);
        r.check = checkContact(r.item.kind, answer, r.grade, r.links, r.fallback, contactPageStatus, channels);
    },
    status: contactStatus,
    summarize: summarizeContact,
    summaryText: contactSummaryText,
    markdown: contactMarkdownReport,
});
