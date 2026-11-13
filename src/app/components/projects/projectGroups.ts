import { getProjectsByCategory, Project } from '@/app/lib/projects';
import { ProjectFilter } from './projectFilters';

export const isFeatured = (project: Project) => project.categories.includes('top');

/** Featured projects first (award winners leading, as on the homepage), then projects.ts order. */
export const featuredFirst = (projects: Project[]) => [
    ...projects.filter((p) => isFeatured(p) && p.award),
    ...projects.filter((p) => isFeatured(p) && !p.award),
    ...projects.filter((p) => !isFeatured(p)),
];

/** Every project grouped for the Projects page, plus the per-filter counts shown on the chips. */
export function getProjectGroups() {
    const ai = featuredFirst(getProjectsByCategory('ai'));
    const fullstack = featuredFirst(getProjectsByCategory('fullstack'));
    const frontend = getProjectsByCategory('frontend');
    const academic = getProjectsByCategory('academic');
    const total = new Set([...ai, ...fullstack, ...frontend, ...academic].map((p) => p.title)).size;

    // A project in both Full-stack and AI gets its tile under Full-stack and a cross-reference line under AI.
    const fullstackTitles = new Set(fullstack.map((p) => p.title));
    const aiTiles = ai.filter((p) => !fullstackTitles.has(p.title));
    const aiCrossListed = ai.filter((p) => fullstackTitles.has(p.title));

    const counts: Record<ProjectFilter, number> = {
        all: total,
        ai: ai.length,
        fullstack: fullstack.length,
        frontend: frontend.length,
        academic: academic.length,
    };

    return { aiTiles, aiCrossListed, fullstack, frontend, academic, counts };
}
