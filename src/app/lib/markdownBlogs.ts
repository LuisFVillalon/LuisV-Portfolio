import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MarkdownBlogPost, TocItem, slugifyHeading } from './blogTypes';

export type { MarkdownBlogPost, TocItem };

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog');

function readBlogFile(dirName: string): MarkdownBlogPost | null {
  const dirPath = path.join(BLOG_DIR, dirName);
  if (!fs.statSync(dirPath).isDirectory()) return null;

  const mdFile = fs.readdirSync(dirPath).find((file) => file.endsWith('.md'));
  if (!mdFile) return null;

  const raw = fs.readFileSync(path.join(dirPath, mdFile), 'utf8');
  const { data, content } = matter(raw);

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    date: data.date,
    readTime: data.readTime,
    category: data.category,
    image_card: data.image_card,
    content,
  };
}

export function getAllMarkdownBlogPosts(): MarkdownBlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const posts = fs
    .readdirSync(BLOG_DIR)
    .map((dirName) => readBlogFile(dirName))
    .filter((post): post is MarkdownBlogPost => post !== null);

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getMarkdownBlogPostById(id: number): MarkdownBlogPost | null {
  return getAllMarkdownBlogPosts().find((post) => post.id === id) ?? null;
}

const HEADING_LINE = /^\s*(#{1,6})\s+(.+?)\s*$/;

/**
 * Some posts author a manual "Table of Contents" as a flat list of ## / ###
 * headings, which then repeat verbatim as the real section headings further
 * down. This pulls that list out (so it can be rendered as a collapsible
 * nav instead of literal duplicate headings) and returns the body with the
 * duplicate block removed.
 */
export function extractTableOfContents(content: string): { toc: TocItem[]; content: string } {
  const lines = content.split('\n');
  const tocHeadingIndex = lines.findIndex((line) => {
    const match = line.match(HEADING_LINE);
    return match && match[1] === '#' && /table of contents/i.test(match[2]);
  });

  if (tocHeadingIndex === -1) {
    return { toc: [], content };
  }

  const toc: TocItem[] = [];
  let firstHeadingText: string | null = null;
  let bodyStartIndex = -1;

  for (let i = tocHeadingIndex + 1; i < lines.length; i++) {
    const match = lines[i].match(HEADING_LINE);
    if (!match) continue;

    const [, hashes, rawText] = match;
    if (hashes.length !== 2 && hashes.length !== 3) continue;

    const text = rawText.replace(/[*_`]/g, '');

    if (firstHeadingText === null) {
      firstHeadingText = text;
    } else if (text === firstHeadingText) {
      bodyStartIndex = i;
      break;
    }

    toc.push({
      level: hashes.length as 2 | 3,
      text,
      slug: slugifyHeading(text),
    });
  }

  if (bodyStartIndex === -1) {
    return { toc: [], content };
  }

  const strippedContent = lines.slice(bodyStartIndex).join('\n');
  return { toc, content: strippedContent };
}
