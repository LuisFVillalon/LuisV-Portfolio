export type MarkdownBlogPost = {
  id: number;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image_card: string;
  content: string;
};

export type TocItem = {
  level: 2 | 3;
  text: string;
  slug: string;
};

/**
 * Turns heading text (possibly with Markdown emphasis markers) into a
 * URL-safe anchor id, e.g. "**2. Using AI**" -> "2-using-ai".
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** A published post plus fields derived from its Markdown body (nothing here is authored separately). */
export type BlogPost = MarkdownBlogPost & {
  /** Markdown body with the authored duplicate "Table of Contents" block removed. */
  body: string;
  /** The body's real h2/h3 headings, in order. */
  toc: TocItem[];
  /** First prose paragraph of the body, trimmed at a word boundary. */
  excerpt: string;
};

export type BlogTopic = { name: string; count: number };

const BODY_HEADING = /^\s{0,3}(#{2,3})\s+(.+?)\s*#*\s*$/;

/** Strips Markdown links, images, emphasis markers and escapes down to plain text. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Builds the table of contents from the body's own ## and ### headings. */
export function getBodyToc(body: string): TocItem[] {
  return body
    .split('\n')
    .map((line) => line.match(BODY_HEADING))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => {
      const text = toPlainText(match[2]);
      return { level: match[1].length as 2 | 3, text, slug: slugifyHeading(text) };
    });
}

/** Returns the first real prose paragraph (not a heading, image or list), trimmed to maxLength. */
export function getExcerpt(body: string, maxLength = 210): string {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 80 && !/^(#|!\[|[-*] |\d+\.\s|\*\*!\[)/.test(block));
  const text = toPlainText(paragraph ?? '');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, text.lastIndexOf(' ', maxLength)).replace(/[,;:—–-]+$/, '')}…`;
}

/** Topics are the posts' frontmatter categories, in first-seen (newest-first) order. */
export function getBlogTopics(posts: MarkdownBlogPost[]): BlogTopic[] {
  const counts = new Map<string, number>();
  posts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));
  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}

export function getBlogStats(posts: MarkdownBlogPost[]) {
  const dates = posts.map((post) => post.date).sort();
  return {
    count: posts.length,
    minutes: posts.reduce((sum, post) => sum + (Number.parseInt(post.readTime, 10) || 0), 0),
    first: dates[0],
    latest: dates[dates.length - 1],
  };
}

/** "2026-07-28" -> "Jul 28, 2026" (long) or "Jul 2026" (month). */
export function formatPostDate(date: string, style: 'long' | 'month' = 'long'): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return style === 'month'
    ? parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
