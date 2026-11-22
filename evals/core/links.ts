// THE LINK CHECK, used by Showcase Quality and Contact Conversion: which links an answer really
// shows, which of them point at a given target, and whether each one works. No model involved.
//
// What counts as a link mirrors the chat's renderer (components/chat/ChatParts.tsx): a Markdown
// link or <autolink> whose target starts with "/" (a site page or file) or "https://". Anything
// else, including a bare URL in the text and an http:// link, renders as plain text, so it is
// reported but never counts. Source chips under the answer are not part of the answer text; each
// criterion decides whether they count (see SOURCE_CHIPS_COUNT in criteria/showcase/score.ts).

export type AnswerLink = {
    text: string;
    href: string;
    /** "site" (starts with "/"), "https", or "plain" (shown as text by the chat, so not a link). */
    kind: 'site' | 'https' | 'plain';
};

// [text](href) or [text](<href> "title"), allowing one level of parentheses in the href.
const MD_LINK = /\[([^\]]*)\]\(\s*<?((?:[^()\s<>]|\([^()\s]*\))+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
const AUTOLINK = /<(https?:\/\/[^\s<>]+)>/g;
const BARE_URL = /\bhttps?:\/\/[^\s<>()\[\]]+[^\s<>()\[\].,;:!?'"*_]/g;

const kindOf = (href: string): AnswerLink['kind'] =>
    href.startsWith('/') && !href.startsWith('//') ? 'site' : href.startsWith('https://') ? 'https' : 'plain';

/** The links in an answer's Markdown, in order. Bare URLs are listed as "plain". */
export function extractLinks(markdown: string): AnswerLink[] {
    const out: AnswerLink[] = [];
    let rest = markdown;
    for (const m of markdown.matchAll(MD_LINK)) {
        out.push({ text: m[1], href: m[2], kind: kindOf(m[2]) });
        rest = rest.replace(m[0], ' ');
    }
    for (const m of rest.matchAll(AUTOLINK)) {
        out.push({ text: m[1], href: m[1], kind: kindOf(m[1]) });
        rest = rest.replace(m[0], ' ');
    }
    for (const m of rest.matchAll(BARE_URL)) out.push({ text: m[0], href: m[0], kind: 'plain' });
    return out;
}

/** Comparable form of a link target: no fragment, no trailing slash, lowercase host, "www." dropped. */
export function normalizeHref(href: string): string {
    const noHash = href.split('#')[0];
    if (noHash.startsWith('/')) {
        const [p, q] = noHash.split('?');
        return `${p.replace(/\/+$/, '') || '/'}${q ? `?${q}` : ''}`;
    }
    try {
        const u = new URL(noHash);
        const host = u.host.toLowerCase().replace(/^www\./, '');
        return `${u.protocol}//${host}${u.pathname.replace(/\/+$/, '')}${u.search}`;
    } catch {
        return noHash;
    }
}

const sitePath = (href: string) => normalizeHref(href).split('?')[0];
const typeParam = (href: string) => new URLSearchParams(normalizeHref(href).split('?')[1] ?? '').get('type');

/**
 * Whether a link points at a target. A site page matches on its path; a link with ?type= (the
 * Projects page filter) matches only a target with the same ?type=, so list every filter that
 * shows a project as its own target. ?type=all is the same as no filter. An external URL matches
 * exactly after normalizeHref, or as a page under it (a repo's /blob/... file).
 */
export function linkMatchesTarget(href: string, target: string): boolean {
    if (target.startsWith('/')) {
        if (!href.startsWith('/') || sitePath(href) !== sitePath(target)) return false;
        const type = typeParam(href);
        return !type || type === 'all' || type === typeParam(target);
    }
    const h = normalizeHref(href);
    const t = normalizeHref(target);
    return h === t || h.startsWith(`${t}/`);
}

/**
 * A match's link targets, from its corpus chunks: each chunk's page (its source-chip href) and
 * every URL in its text except the "Organization link:" line, which is the employer's own site.
 */
export function linkTargets(chunks: { href: string; text: string }[]): string[] {
    const targets = new Set<string>();
    for (const c of chunks) {
        targets.add(c.href);
        for (const line of c.text.split('\n')) {
            if (/^Organization link:/i.test(line)) continue;
            for (const m of line.matchAll(BARE_URL)) targets.add(m[0]);
        }
    }
    return [...targets];
}

// ── Does the link work? ────────────────────────────────────────────────────────────────────

export type LinkStatus = {
    ok: boolean;
    /** Shown in the report: "page", "file", "HTTP 200", "HTTP 404", "timeout", ... */
    detail: string;
    /** True when the site refused an automated check (401/403/429/999): counted as working, flagged for a human. */
    unverified?: boolean;
};

/** What the site serves, for checking "/..." links without running it. */
export type SiteMap = {
    /** Static page routes, e.g. "/", "/about", "/projects". */
    pages: string[];
    /** Blog post ids, served at /blog/<id>. */
    blogIds: string[];
    /** Categories the legacy /projects/<category> route redirects. */
    legacyProjectCategories: string[];
    /** Whether a file exists under public/ at this path. */
    publicFileExists: (path: string) => boolean;
};

export function checkSiteLink(href: string, site: SiteMap): LinkStatus {
    let path = sitePath(href);
    try {
        path = decodeURI(path);
    } catch {
        return { ok: false, detail: 'malformed path' };
    }
    if (site.pages.includes(path)) return { ok: true, detail: 'page' };
    const blog = path.match(/^\/blog\/([^/]+)$/);
    if (blog) return site.blogIds.includes(blog[1]) ? { ok: true, detail: 'blog post' } : { ok: false, detail: 'no such blog post' };
    const legacy = path.match(/^\/projects\/([^/]+)$/);
    if (legacy && site.legacyProjectCategories.includes(legacy[1])) return { ok: true, detail: 'redirect to /projects' };
    if (site.publicFileExists(path)) return { ok: true, detail: 'file' };
    return { ok: false, detail: 'no such page or file' };
}

/** Statuses that mean "the site turned the checker away", not "the page is gone". */
const BLOCKED = new Set([401, 403, 429, 999]);
export const LINK_TIMEOUT_MS = 10_000;

export type Fetcher = (url: string, init: RequestInit) => Promise<{ status: number; body?: { cancel(): Promise<void> } | null }>;

export async function checkExternalLink(url: string, fetcher: Fetcher = fetch): Promise<LinkStatus> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), LINK_TIMEOUT_MS);
    try {
        const res = await fetcher(url, {
            method: 'GET',
            redirect: 'follow',
            signal: ctrl.signal,
            headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-eval-link-check)' },
        });
        await res.body?.cancel().catch(() => {});
        if (res.status >= 200 && res.status < 400) return { ok: true, detail: `HTTP ${res.status}` };
        if (BLOCKED.has(res.status)) return { ok: true, unverified: true, detail: `HTTP ${res.status} (blocked the check)` };
        return { ok: false, detail: `HTTP ${res.status}` };
    } catch (err) {
        return { ok: false, detail: ctrl.signal.aborted ? 'timeout' : `request failed (${err instanceof Error ? err.message : String(err)})` };
    } finally {
        clearTimeout(timer);
    }
}

/** Checks links once per run: the same repo linked from ten answers is fetched once. */
export function linkChecker(site: SiteMap, fetcher: Fetcher = fetch) {
    const cache = new Map<string, Promise<LinkStatus>>();
    return (link: AnswerLink): Promise<LinkStatus> => {
        if (link.kind === 'plain') return Promise.resolve({ ok: false, detail: 'not rendered as a link' });
        if (link.kind === 'site') return Promise.resolve(checkSiteLink(link.href, site));
        const key = normalizeHref(link.href);
        if (!cache.has(key)) cache.set(key, checkExternalLink(link.href.split('#')[0], fetcher));
        return cache.get(key)!;
    };
}

export type LinkCheck = ReturnType<typeof linkChecker>;
export type CheckedLink = AnswerLink & { status: LinkStatus };

/** Every link in an answer's text, with its status. */
export const checkAnswerLinks = (answer: string, check: LinkCheck): Promise<CheckedLink[]> =>
    Promise.all(extractLinks(answer).map(async (l) => ({ ...l, status: await check(l) })));

/** A source chip under the answer: the chunk it came from, and its href checked like any link. */
export type CheckedChip = { id?: string; label: string; href: string; status: LinkStatus };

export const checkChips = (chips: { id?: string; label: string; href: string }[], check: LinkCheck): Promise<CheckedChip[]> =>
    Promise.all(chips.map(async (s) => ({ ...s, status: await check({ text: s.label, href: s.href, kind: kindOf(s.href) }) })));

/**
 * Broken links, and links whose site turned the checker away (counted as working, to check by
 * hand), across a run's items. Plain-text links are left out: they never counted as links.
 */
export function linkIssues(results: { id: string; links: (Pick<AnswerLink, 'href'> & Partial<Pick<AnswerLink, 'kind'>> & { status: LinkStatus })[] }[]) {
    const brokenLinks: { id: string; href: string; detail: string }[] = [];
    const unverifiedLinks: { id: string; href: string; detail: string }[] = [];
    for (const { id, links } of results)
        for (const l of links.filter((x) => x.kind !== 'plain')) {
            if (!l.status.ok) brokenLinks.push({ id, href: l.href, detail: l.status.detail });
            else if (l.status.unverified && !unverifiedLinks.some((u) => u.href === l.href && u.id === id)) unverifiedLinks.push({ id, href: l.href, detail: l.status.detail });
        }
    return { brokenLinks, unverifiedLinks };
}
