// Criterion #2, Source Faithfulness: each question is answered with the real pipeline, then a
// grader splits the answer into claims and checks each one against exactly what the assistant was
// given: the retrieved chunks, the Assistant facts and the contact details (grader.ts).
//
//   npm run eval:faithfulness                    all 40 questions
//   npm run eval:faithfulness -- --id fit-backend
//   npm run eval:faithfulness -- --max-cost 1    stop starting questions past $1 (default $1.50)
import path from 'path';
import { defineCriterion } from '../../core/runner';
import { validateFaithfulnessDataset, type FaithfulnessItem } from './dataset';
import { buildSources, contactSourceText, faithfulnessRequest, parseFaithfulnessOutput } from './grader';
import { faithfulnessJsonReport, faithfulnessMarkdownReport, faithfulnessSummaryText } from './report';
import { summarizeFaithfulness, unsupportedCount, type FaithfulnessResult, type FaithfulnessSummary } from './score';

/** The same Assistant facts and contact details the answering model gets in its system prompt. */
async function setup() {
    const { loadAssistantFacts } = await import('../../../src/app/lib/assistant/private');
    const { CONTACT_EMAIL, GITHUB_URL } = await import('../../../src/app/lib/contact');
    const { linkedinProfileUrl } = await import('../../../src/app/lib/linkedinPosts');
    const { resume } = await import('../../../src/app/lib/experience');
    const facts = loadAssistantFacts();
    if (!facts?.trim()) console.warn('No Assistant facts found (ASSISTANT_FACTS or .private/): grading against chunks and contact details only.');
    return { facts, contact: contactSourceText({ resume, linkedin: linkedinProfileUrl, email: CONTACT_EMAIL, github: GITHUB_URL }) };
}

export default defineCriterion<FaithfulnessItem, FaithfulnessResult, FaithfulnessSummary, Awaited<ReturnType<typeof setup>>>({
    name: 'faithfulness',
    title: 'Source faithfulness',
    datasetFile: path.join('evals', 'criteria', 'faithfulness', 'dataset.json'),
    /** 40 answers plus grader prompts that carry the chunk text: about $0.02-0.035 per question. */
    maxCostUsd: 1.5,
    setup,
    info: ({ facts }) => ({ factsLoaded: Boolean(facts?.trim()) }),
    loadItems: (raw) => validateFaithfulnessDataset(raw).items,
    async evaluate(r, { ask, grade }, { facts, contact }) {
        const { answer, chunks } = await ask([r.item.question]);
        const sources = buildSources(chunks, facts, contact);
        r.grade = parseFaithfulnessOutput(await grade(faithfulnessRequest(r.item.question, answer, sources)), sources);
    },
    status: ({ grade: g }) => `${g!.claims.length - unsupportedCount(g!)}/${g!.claims.length} claims supported`,
    summarize: summarizeFaithfulness,
    summaryText: faithfulnessSummaryText,
    markdown: faithfulnessMarkdownReport,
    json: faithfulnessJsonReport,
});
