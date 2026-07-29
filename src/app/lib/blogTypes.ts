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

/**
 * Returns a plain-text preview of a post's body, skipping the table of
 * contents (whose lines are short headings) and starting from the first
 * real paragraph of prose.
 */
export function getPreviewText(content: string, maxLength = 120): string {
  const plainLines = content
    .replace(/[#*_>`[\]()]/g, '')
    .split('\n')
    .map((line) => line.replace(/^[\s\d.-]+/, '').trim())
    .filter(Boolean);

  const paragraph = plainLines.find((line) => line.length > 80) ?? plainLines.join(' ');

  return `${paragraph.slice(0, maxLength).trim()}...`;
}
