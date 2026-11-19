// Chunks from all of Luis's public GitHub repositories: a summary chunk per repo plus its README
// split at headings, with badges, images, HTML and setup boilerplate stripped.
//
// Inside Next.js (the daily cron route) the fetches go through the Vercel Data Cache with a
// one-day revalidate; the build-time script simply fetches.
import { GITHUB_URL } from '../../contact';
import { makeChunk, slug, splitMarkdownSections, splitRecursive, type Chunk } from './types';

const USER = process.env.GITHUB_USERNAME ?? GITHUB_URL.split('/').pop()!;
const DAY = 60 * 60 * 24;
/** Each repo's README contributes at most this many characters. */
const README_BUDGET = 6000;
const BOILERPLATE = /^(install|run it|how to run|local development|installation|setup|set ?up|getting started|quick ?start|usage|running|run locally|prerequisites|requirements|license|contributing|contributors|acknowledg|credits|deploy|deployment|scripts|available scripts|environment|env|table of contents|contents|learn more)/i;

type Repo = {
    name: string;
    html_url: string;
    description: string | null;
    fork: boolean;
    size: number;
    archived: boolean;
    language: string | null;
    topics?: string[];
    homepage: string | null;
    default_branch: string;
    pushed_at: string;
};

function headers(): HeadersInit {
    const h: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-assistant-indexer' };
    if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return h;
}

async function getJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: headers(), next: { revalidate: DAY } } as RequestInit);
    if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
    return (await res.json()) as T;
}

async function getReadme(repo: Repo): Promise<string | null> {
    for (const name of ['README.md', 'readme.md', 'Readme.md', 'README.MD']) {
        const url = `https://raw.githubusercontent.com/${USER}/${repo.name}/${repo.default_branch}/${name}`;
        const res = await fetch(url, { next: { revalidate: DAY } } as RequestInit);
        if (res.ok) return res.text();
        if (res.status !== 404) throw new Error(`GitHub ${res.status} for ${url}`);
    }
    return null;
}

/** Strips what doesn't describe the work: badges, images, HTML, code blocks, link targets. */
export function cleanReadme(markdown: string): string {
    return markdown
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/~~~[\s\S]*?~~~/g, '')
        .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<\/?[a-z][^>]*>/gi, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/^\s*[-*_]{3,}\s*$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

async function repoChunks(repo: Repo): Promise<Chunk[]> {
    let parent: string | undefined;
    if (repo.fork) {
        try {
            parent = (await getJson<{ parent?: { full_name: string } }>(`https://api.github.com/repos/${USER}/${repo.name}`))
                .parent?.full_name;
        } catch {
            parent = undefined;
        }
    }
    const forkNote = repo.fork
        ? `This is a fork${parent ? ` of ${parent}` : ''}: the code may be team or upstream work, not only Luis's.`
        : 'Repository owned by Luis.';

    const base = {
        sourceType: 'github' as const,
        label: `GitHub · ${repo.name}`,
        href: repo.html_url,
        title: `GitHub repository ${repo.name}`,
    };
    const chunks: Chunk[] = [
        makeChunk({
            ...base,
            id: `github:${slug(repo.name)}`,
            section: 'Summary',
            text: [
                repo.description && `Description: ${repo.description}`,
                forkNote,
                repo.language && `Main language: ${repo.language}`,
                repo.topics?.length && `Topics: ${repo.topics.join(', ')}`,
                repo.homepage && `Homepage: ${repo.homepage}`,
                `Last pushed: ${repo.pushed_at.slice(0, 10)}`,
            ]
                .filter(Boolean)
                .join('\n'),
        }),
    ];

    const readme = await getReadme(repo);
    if (!readme) return chunks;
    let budget = README_BUDGET;
    const seen = new Map<string, number>();
    for (const { heading, body } of splitMarkdownSections(cleanReadme(readme))) {
        if (heading && BOILERPLATE.test(heading)) continue;
        if (budget <= 0) break;
        const text = body.slice(0, budget);
        budget -= text.length;
        const key = slug(heading ?? 'intro');
        const n = (seen.get(key) ?? 0) + 1;
        seen.set(key, n);
        splitRecursive(text, 1500, 150).forEach((piece, i, all) =>
            chunks.push(
                makeChunk({
                    ...base,
                    id: `github:${slug(repo.name)}#${key}${n > 1 ? `-${n}` : ''}${all.length > 1 ? `.${i + 1}` : ''}`,
                    section: heading ? `README · ${heading}` : 'README',
                    text: `${forkNote}\n${piece}`,
                }),
            ),
        );
    }
    return chunks;
}

/**
 * All public, non-empty repositories. Failures on one repo don't stop the rest; the failed
 * repos' id prefixes come back in `failed` so the indexer keeps their stored chunks.
 */
export async function githubChunks(): Promise<{ chunks: Chunk[]; failed: string[] }> {
    const repos = await getJson<Repo[]>(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);
    const chunks: Chunk[] = [];
    const failed: string[] = [];
    for (const repo of repos.filter((r) => r.size > 0)) {
        try {
            chunks.push(...(await repoChunks(repo)));
        } catch (err) {
            failed.push(`github:${slug(repo.name)}`);
            console.warn(`[assistant] skipped GitHub repo ${repo.name}:`, (err as Error).message);
        }
    }
    return { chunks, failed };
}
