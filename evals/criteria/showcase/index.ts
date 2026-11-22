// Criterion #3, Showcase Quality: each question is answered with the real pipeline. A grader
// judges, for each of Luis's best matches, whether the answer names it and gives a concrete detail
// (grader.ts); code checks that the answer links to it and that the link works (core/links.ts).
//
//   npm run eval:showcase                       all 20 questions
//   npm run eval:showcase -- --id soft-leadership
//   npm run eval:showcase -- --max-cost 0.3     stop starting questions past $0.30 (default $0.75)
import path from 'path';
import { checkAnswerLinks, checkChips, linkChecker, linkMatchesTarget, linkTargets, type LinkCheck } from '../../core/links';
import { defineCriterion } from '../../core/runner';
import { loadSiteMap } from '../../core/site';
import type { Project } from '../../../src/app/lib/projects';
import { validateShowcaseDataset, type ShowcaseItem } from './dataset';
import { parseShowcaseOutput, showcaseRequest, type GraderMatch } from './grader';
import { showcaseJsonReport, showcaseMarkdownReport, showcaseSummaryText } from './report';
import { answerPasses, combineChecks, failReason, summarizeShowcase, type ShowcaseResult, type ShowcaseSummary } from './score';

type CorpusChunk = { id: string; title: string; href: string; header: string; text: string };
type Ctx = { chunkById: Map<string, CorpusChunk>; projectByTitle: (title: string) => Project | undefined; checkLink: LinkCheck };

/**
 * Every Projects-page filter that lists a project, as a link target: its categories, Awards when
 * it has an award, and Live when it has a live deployment (the rules in projectGroups.ts).
 */
function projectFilterTargets(project: Project | undefined): string[] {
    if (!project) return [];
    const filters = project.categories.filter((c) => c !== 'top') as string[];
    if (project.award) filters.push('awards');
    if (project.live_app && !project.live_app.includes('github.com')) filters.push('live');
    return filters.map((f) => `/projects?type=${f}`);
}

/** The item's matches as the grader sees them (M1, M2, ...), with their chunk ids and link targets. */
function graderMatches(item: ShowcaseItem, { chunkById, projectByTitle }: Ctx): (GraderMatch & { chunks: string[]; targets: string[] })[] {
    return item.matches.map((m, i) => {
        const chunks = m.chunks.map((id) => chunkById.get(id)!);
        const filters = chunks.filter((c) => c.id.startsWith('site:project:')).flatMap((c) => projectFilterTargets(projectByTitle(c.title)));
        return {
            id: `M${i + 1}`,
            name: m.name,
            chunks: m.chunks,
            reference: chunks.map((c) => `${c.header}\n${c.text}`).join('\n\n'),
            targets: [...new Set([...linkTargets(chunks), ...filters])],
        };
    });
}

export default defineCriterion<ShowcaseItem, ShowcaseResult, ShowcaseSummary, Ctx>({
    name: 'showcase',
    title: 'Showcase quality',
    datasetFile: path.join('evals', 'criteria', 'showcase', 'dataset.json'),
    /** 20 answers plus short grader prompts: about $0.015-0.025 per question. */
    maxCostUsd: 0.75,
    async setup(): Promise<Ctx> {
        const { siteChunks } = await import('../../../src/app/lib/assistant/chunks/site');
        const { getProjectByTitle } = await import('../../../src/app/lib/projects');
        return { chunkById: new Map(siteChunks().map((c) => [c.id, c])), projectByTitle: getProjectByTitle, checkLink: linkChecker(await loadSiteMap()) };
    },
    // Every chunk id the dataset names must still exist in the corpus.
    loadItems: (raw, { chunkById }) => validateShowcaseDataset(raw, new Set(chunkById.keys())).items,
    newResult: () => ({ links: [], chips: [] }),
    async evaluate(r, { ask, grade }, ctx) {
        const { answer, sources } = await ask([r.item.question]);
        r.links = await checkAnswerLinks(answer, ctx.checkLink);
        // Source chips are links too: each href is checked the same way.
        r.chips = await checkChips(sources, ctx.checkLink);

        const matches = graderMatches(r.item, ctx);
        const targets = new Map(matches.map((m) => [m.id, m.targets]));
        const pointsAt = (href: string, id: string) => targets.get(id)!.some((t) => linkMatchesTarget(href, t));
        r.grade = parseShowcaseOutput(await grade(showcaseRequest(r.item.question, answer, matches)), matches.map((m) => m.id), answer);
        r.checks = combineChecks(matches, r.grade, r.links, r.chips, pointsAt);
    },
    status: (r) => (answerPasses(r.checks) ? 'showcased' : `not showcased (${failReason(r.checks)})`),
    summarize: summarizeShowcase,
    summaryText: showcaseSummaryText,
    markdown: showcaseMarkdownReport,
    json: showcaseJsonReport,
});
