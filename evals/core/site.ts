// What the site serves, read from the repo, for checking "/..." links without running it (see
// SiteMap in links.ts). Shared by the criteria that check links: showcase and contact.
import fs from 'fs';
import path from 'path';
import type { SiteMap } from './links';

/** Static page routes: every src/app folder holding a page.tsx, outside dynamic [segments]. */
export function staticPages(appDir = path.join('src', 'app')): string[] {
    const pages: string[] = [];
    const walk = (dir: string, route: string) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.isFile() && e.name === 'page.tsx') pages.push(route || '/');
            else if (e.isDirectory() && !e.name.startsWith('[') && !e.name.startsWith('(') && e.name !== 'api' && e.name !== 'components' && e.name !== 'lib')
                walk(path.join(dir, e.name), `${route}/${e.name}`);
        }
    };
    walk(appDir, '');
    return pages;
}

/** Call after loadEvalEnv(), like loadPipeline(): the site modules are imported here. */
export async function loadSiteMap(): Promise<SiteMap> {
    const { getAllMarkdownBlogPosts } = await import('../../src/app/lib/markdownBlogs');
    const { PROJECT_FILTERS } = await import('../../src/app/components/projects/projectFilters');
    return {
        pages: staticPages(),
        blogIds: getAllMarkdownBlogPosts().map((p) => String(p.id)),
        legacyProjectCategories: PROJECT_FILTERS.filter((f) => !['all', 'awards', 'live'].includes(f)),
        publicFileExists: (p) => {
            const file = path.join('public', p);
            return path.resolve(file).startsWith(path.resolve('public')) && fs.existsSync(file) && fs.statSync(file).isFile();
        },
    };
}
