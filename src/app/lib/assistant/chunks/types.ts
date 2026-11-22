import { createHash } from 'crypto';

/** Where a chunk came from. Lower `priority` wins when sources disagree (facts > site > résumé > LinkedIn > GitHub). */
export type SourceType = 'site' | 'resume' | 'linkedin' | 'github';

export const SOURCE_PRIORITY: Record<SourceType, number> = { site: 1, resume: 2, linkedin: 3, github: 4 };

const SOURCE_NAMES: Record<SourceType, string> = {
    site: 'Portfolio site',
    resume: 'Résumé',
    linkedin: 'LinkedIn profile',
    github: 'GitHub',
};

/** One retrievable piece of Luis's content. `id` is stable across runs so evaluations can refer to it. */
export type Chunk = {
    id: string;
    sourceType: SourceType;
    /** The record the chunk belongs to, e.g. a project title or blog post title. */
    title: string;
    /** Heading or part within the record, when the record was split. */
    section?: string;
    /** Short text for the source chip, e.g. "Projects · ROSS". */
    label: string;
    /** Where the source chip links to. */
    href: string;
    priority: number;
    /** Code-generated context line that is embedded and shown to Claude with the text. */
    header: string;
    text: string;
    /** sha256 of header + text; the indexing job re-embeds a chunk only when this changes. */
    hash: string;
    /**
     * Contextual retrieval: a sentence or two Claude writes at indexing time situating the chunk
     * in its source document. Embedded, BM25-indexed and reranked with the chunk, but never shown
     * to the answering model (it's model-written, not Luis's content). Set by the indexer.
     */
    context?: string;
    /** Hash of what the context was written from (document + chunk + prompt version); a change regenerates it. */
    contextHash?: string;
};

export type ChunkInput = Omit<Chunk, 'priority' | 'header' | 'hash' | 'context' | 'contextHash'>;

export function makeChunk(input: ChunkInput): Chunk {
    const header = `[${SOURCE_NAMES[input.sourceType]}] ${input.title}${input.section ? ` · ${input.section}` : ''}`;
    const text = input.text.trim();
    const hash = createHash('sha256').update(`${header}\n${text}`).digest('hex').slice(0, 32);
    return { ...input, text, header, priority: SOURCE_PRIORITY[input.sourceType], hash };
}

/** The text that gets embedded, sparse-indexed and reranked: header, contextual-retrieval context (if any), body. */
export const indexText = (chunk: Pick<Chunk, 'header' | 'text' | 'context'>) =>
    chunk.context ? `${chunk.header}\n${chunk.context}\n${chunk.text}` : `${chunk.header}\n${chunk.text}`;

/** URL-safe id fragment. */
export function slug(value: string): string {
    return (
        value
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60) || 'x'
    );
}

/**
 * Fallback splitter for oversized sections and messy text: splits on paragraphs, then lines,
 * then sentences, then words, and packs the pieces back up to `maxChars` with a small
 * character overlap between consecutive pieces.
 */
export function splitRecursive(text: string, maxChars = 1800, overlapChars = 200, separators = ['\n\n', '\n', '. ', ' ']): string[] {
    const clean = text.trim();
    if (clean.length <= maxChars) return clean ? [clean] : [];
    const [sep, ...finer] = separators;
    if (sep === undefined) {
        // A single unbroken run of characters: hard-cut it.
        const pieces: string[] = [];
        for (let i = 0; i < clean.length; i += maxChars - overlapChars) pieces.push(clean.slice(i, i + maxChars));
        return pieces;
    }
    const parts = clean.split(sep);
    if (parts.length < 2) return splitRecursive(clean, maxChars, overlapChars, finer);
    // Break oversized parts with the finer separators first, then pack.
    const units = parts.flatMap((p) => (p.length > maxChars ? splitRecursive(p, maxChars, overlapChars, finer) : [p]));
    const pieces: string[] = [];
    let current = '';
    for (const unit of units) {
        const next = current ? `${current}${sep}${unit}` : unit;
        if (next.length > maxChars && current) {
            pieces.push(current);
            const tail = current.slice(-overlapChars);
            current = tail.length + sep.length + unit.length <= maxChars ? `${tail}${sep}${unit}` : unit;
        } else {
            current = next;
        }
    }
    if (current) pieces.push(current);
    return pieces.map((p) => p.trim()).filter(Boolean);
}

/** Splits Markdown at `##`/`###` headings. Text before the first heading becomes an untitled section. */
export function splitMarkdownSections(markdown: string): { heading?: string; body: string }[] {
    const sections: { heading?: string; body: string }[] = [];
    let heading: string | undefined;
    let lines: string[] = [];
    let inFence = false;
    const flush = () => {
        const body = lines.join('\n').trim();
        if (body) sections.push({ heading, body });
        lines = [];
    };
    for (const line of markdown.split('\n')) {
        if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
        const match = !inFence && line.match(/^#{1,3}\s+(.+?)\s*#*\s*$/);
        if (match) {
            flush();
            heading = match[1].replace(/[*_`]/g, '').trim();
        } else {
            lines.push(line);
        }
    }
    flush();
    return sections;
}
