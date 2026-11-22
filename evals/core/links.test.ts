import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { checkExternalLink, checkSiteLink, extractLinks, linkChecker, linkMatchesTarget, linkTargets, normalizeHref, type Fetcher, type SiteMap } from './links';

describe('extractLinks: only what the chat renders as a link counts', () => {
    test('Markdown links to site pages and https URLs', () => {
        const links = extractLinks('See [ROSS](https://github.com/LuisFVillalon/ROSS) and [his projects](/projects?type=ai).');
        assert.deepEqual(
            links.map((l) => [l.text, l.href, l.kind]),
            [
                ['ROSS', 'https://github.com/LuisFVillalon/ROSS', 'https'],
                ['his projects', '/projects?type=ai', 'site'],
            ],
        );
    });
    test('a bare URL and an http:// link are plain text', () => {
        const links = extractLinks('Code at https://github.com/x/y. Old [site](http://example.com).');
        assert.deepEqual(
            links.map((l) => [l.href, l.kind]),
            [
                ['http://example.com', 'plain'],
                ['https://github.com/x/y', 'plain'],
            ],
        );
    });
    test('angle-bracket autolinks count; a URL inside a Markdown link is not listed twice', () => {
        const links = extractLinks('<https://kanso-landing.vercel.app/> and [repo](https://github.com/a/b)');
        assert.deepEqual(
            links.map((l) => l.href),
            ['https://github.com/a/b', 'https://kanso-landing.vercel.app/'],
        );
    });
    test('protocol-relative and relative links are plain', () => {
        assert.deepEqual(
            extractLinks('[a](//evil.com) [b](projects)').map((l) => l.kind),
            ['plain', 'plain'],
        );
    });
    test('parentheses inside a URL and a link title', () => {
        const [l] = extractLinks('[wiki](https://en.wikipedia.org/wiki/Foo_(bar) "title")');
        assert.equal(l.href, 'https://en.wikipedia.org/wiki/Foo_(bar)');
    });
});

describe('linkMatchesTarget', () => {
    test('site pages match on path; a ?type= filter must be one that shows the item', () => {
        assert.ok(linkMatchesTarget('/projects', '/projects?type=awards'));
        assert.ok(linkMatchesTarget('/projects?type=all', '/projects?type=awards'));
        assert.ok(linkMatchesTarget('/projects?type=awards#x', '/projects?type=awards'));
        assert.ok(!linkMatchesTarget('/projects?type=ai', '/projects?type=awards'));
        assert.ok(!linkMatchesTarget('/experience', '/projects?type=awards'));
        assert.ok(linkMatchesTarget('/experience#skills', '/experience'));
    });
    test('external URLs match after normalizing, and pages under them match', () => {
        assert.ok(linkMatchesTarget('https://www.GitHub.com/LuisFVillalon/ROSS/', 'https://github.com/LuisFVillalon/ROSS'));
        assert.ok(linkMatchesTarget('https://github.com/LuisFVillalon/ROSS/blob/main/README.md', 'https://github.com/LuisFVillalon/ROSS'));
        assert.ok(!linkMatchesTarget('https://github.com/LuisFVillalon/ROSS-2', 'https://github.com/LuisFVillalon/ROSS'));
        assert.ok(!linkMatchesTarget('/projects', 'https://github.com/LuisFVillalon/ROSS'));
    });
    test('normalizeHref', () => {
        assert.equal(normalizeHref('/blog/x/#y'), '/blog/x');
        assert.equal(normalizeHref('/'), '/');
        assert.equal(normalizeHref('https://WWW.Example.com/a/?q=1#h'), 'https://example.com/a?q=1');
    });
});

describe('linkTargets', () => {
    test("the chunk's page and the URLs in its text, but not the employer's site", () => {
        const targets = linkTargets([
            { href: '/experience', text: 'Intern at Ectron (2024)\nOrganization link: https://ectron.com/' },
            { href: '/projects?type=ai', text: 'Project: X\nCode: https://github.com/a/x\nLive app: https://x.vercel.app' },
        ]);
        assert.deepEqual(targets, ['/experience', '/projects?type=ai', 'https://github.com/a/x', 'https://x.vercel.app']);
    });
});

const site: SiteMap = {
    pages: ['/', '/about', '/projects', '/experience', '/blog', '/contact'],
    blogIds: ['my-post'],
    legacyProjectCategories: ['ai', 'frontend'],
    publicFileExists: (p) => p === '/resumes/Luis_Villalon_Resume.pdf',
};

describe('checkSiteLink', () => {
    test('pages, blog posts, legacy redirects and public files work', () => {
        for (const href of ['/', '/projects?type=nonsense', '/experience#skills', '/blog/my-post', '/projects/ai', '/resumes/Luis_Villalon_Resume.pdf'])
            assert.equal(checkSiteLink(href, site).ok, true, href);
    });
    test('unknown pages, posts, categories and files are broken', () => {
        for (const href of ['/testimonials', '/blog/nope', '/projects/top', '/resumes/old.pdf', '/projects/ross'])
            assert.equal(checkSiteLink(href, site).ok, false, href);
    });
});

const fakeFetch =
    (status: number | 'throw', calls: string[] = []): Fetcher =>
    async (url) => {
        calls.push(url);
        if (status === 'throw') throw new Error('ENOTFOUND');
        return { status, body: null };
    };

describe('checkExternalLink', () => {
    test('2xx and 3xx work', async () => {
        assert.deepEqual(await checkExternalLink('https://a.b', fakeFetch(200)), { ok: true, detail: 'HTTP 200' });
        assert.equal((await checkExternalLink('https://a.b', fakeFetch(301))).ok, true);
    });
    test('404 and network errors are broken', async () => {
        assert.deepEqual(await checkExternalLink('https://a.b', fakeFetch(404)), { ok: false, detail: 'HTTP 404' });
        assert.match((await checkExternalLink('https://a.b', fakeFetch('throw'))).detail, /request failed \(ENOTFOUND\)/);
    });
    test('a site that blocks the checker counts as working but unverified', async () => {
        const s = await checkExternalLink('https://linkedin.com/in/x', fakeFetch(999));
        assert.equal(s.ok, true);
        assert.equal(s.unverified, true);
    });
});

describe('linkChecker', () => {
    test('fetches each external URL once per run, ignoring the fragment', async () => {
        const calls: string[] = [];
        const check = linkChecker(site, fakeFetch(200, calls));
        await check({ text: '', href: 'https://github.com/a/b', kind: 'https' });
        await check({ text: '', href: 'https://github.com/a/b/#readme', kind: 'https' });
        assert.deepEqual(calls, ['https://github.com/a/b']);
    });
    test('plain text never works and is never fetched', async () => {
        const calls: string[] = [];
        const s = await linkChecker(site, fakeFetch(200, calls))({ text: '', href: 'https://x.y', kind: 'plain' });
        assert.equal(s.ok, false);
        assert.equal(calls.length, 0);
    });
});
