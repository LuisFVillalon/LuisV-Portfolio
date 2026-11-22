// Contextual retrieval (Anthropic's technique): before a chunk is embedded, Claude reads the
// chunk's whole source document and writes a sentence or two situating the chunk in it, e.g.
// "From the README of kanso-backend, the FastAPI service behind Luis's kanso app; describes its
// per-user data isolation". The context is prepended to the chunk for the embedding, the BM25
// index and the reranker (indexText), so a chunk that doesn't say what it belongs to can still be
// found. It is never shown to the answering model: it's model-written, not Luis's content.
//
// Runs only at indexing time, and only for chunks whose context is missing or out of date (the
// chunk, its document, the model or the prompt changed); everything else reuses the stored context.
import { createHash } from 'crypto';
import type Anthropic from '@anthropic-ai/sdk';
import type { Chunk } from './chunks';
import { getAnthropic } from './clients';
import { ASSISTANT } from './config';
import { costUsd } from './usage';

/** Bump to regenerate every context (e.g. after editing the prompt below). */
export const CONTEXT_PROMPT_VERSION = 1;
/** A source document is cut to this many characters before it goes in the prompt. */
export const MAX_DOCUMENT_CHARS = 40_000;

const SYSTEM = `You write short search context for chunks of Luis Villalón's software-engineering portfolio content: his portfolio website, résumé, LinkedIn profile and GitHub READMEs. The context is added to the chunk so a search engine can find it; nobody reads it as an answer.`;

const instruction = (chunk: Pick<Chunk, 'header' | 'text'>) => `Here is the chunk to situate within the document above:
<chunk>
${chunk.header}
${chunk.text}
</chunk>

Write one or two sentences that situate this chunk for search retrieval. Say what it is part of (which project, role, course, certificate or section, and what kind it is: professional internship, research, personal project, coursework, hackathon project, certificate, leadership role, non-engineering job, profile) and what it shows about Luis's work (technologies, responsibilities, skills such as teamwork or leadership), using only what the document states. Answer with only the context.`;

/**
 * Which source document a chunk belongs to: one GitHub repository's README, one kind of site
 * record (all projects, all roles, ...), the whole résumé, or the whole LinkedIn profile.
 */
export function documentKey(id: string): string {
    const [source, rest = ''] = id.split(':', 2);
    if (source === 'github') return `github:${rest.split('#')[0]}`;
    if (source === 'site') return `site:${rest}`;
    return source;
}

/** Each document's text: its chunks in corpus order (header + body), cut to MAX_DOCUMENT_CHARS. */
export function buildDocuments(chunks: Pick<Chunk, 'id' | 'header' | 'text'>[]): Map<string, string> {
    const parts = new Map<string, string[]>();
    for (const c of chunks) {
        const key = documentKey(c.id);
        parts.set(key, [...(parts.get(key) ?? []), `${c.header}\n${c.text}`]);
    }
    return new Map([...parts].map(([k, p]) => [k, p.join('\n\n').slice(0, MAX_DOCUMENT_CHARS)]));
}

/** What a context is written from: if any of it changes, the context is regenerated. */
export function contextHashFor(document: string, chunk: Pick<Chunk, 'header' | 'text'>, model = ASSISTANT.contextModel): string {
    return createHash('sha256')
        .update(`${CONTEXT_PROMPT_VERSION}\n${model}\n${document}\n---\n${chunk.header}\n${chunk.text}`)
        .digest('hex')
        .slice(0, 32);
}

export function contextRequest(document: string, chunk: Pick<Chunk, 'header' | 'text'>): Anthropic.MessageCreateParamsNonStreaming {
    return {
        model: ASSISTANT.contextModel,
        max_tokens: ASSISTANT.contextMaxTokens,
        output_config: { effort: 'low' },
        system: SYSTEM,
        messages: [
            {
                role: 'user',
                content: [
                    // Cached: the other chunks of this document reuse it.
                    { type: 'text', text: `<document>\n${document}\n</document>`, cache_control: { type: 'ephemeral' } },
                    { type: 'text', text: instruction(chunk) },
                ],
            },
        ],
    };
}

async function generateContext(document: string, chunk: Chunk): Promise<{ context: string; costUsd: number }> {
    const res = await getAnthropic().messages.create(contextRequest(document, chunk));
    const context = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (res.stop_reason === 'refusal' || !context) throw new Error(`no context (${res.stop_reason})`);
    return { context: context.slice(0, 600), costUsd: costUsd(res.usage, ASSISTANT.contextModel) };
}

export type ContextReport = { generated: number; reused: number; failed: number; skipped: number; costUsd: number };

/**
 * Sets `context` and `contextHash` on each chunk: reused from `stored` when its hash still
 * matches, otherwise generated. A chunk whose generation fails gets no context this run (it's
 * indexed without one and retried next run); a failure never stops the sync. Without an
 * Anthropic key nothing is generated, and only up-to-date stored contexts are kept.
 */
export async function contextualize(chunks: Chunk[], stored: Map<string, { context?: string; contextHash?: string }>): Promise<ContextReport> {
    const report: ContextReport = { generated: 0, reused: 0, failed: 0, skipped: 0, costUsd: 0 };
    const documents = buildDocuments(chunks);
    const canGenerate = Boolean(process.env.ANTHROPIC_API_KEY);
    const todo = new Map<string, Chunk[]>();

    for (const c of chunks) {
        const key = documentKey(c.id);
        const hash = contextHashFor(documents.get(key)!, c);
        const s = stored.get(c.id);
        if (s?.context && s.contextHash === hash) {
            c.context = s.context;
            c.contextHash = hash;
            report.reused++;
        } else if (canGenerate) {
            todo.set(key, [...(todo.get(key) ?? []), c]);
        } else {
            report.skipped++;
        }
    }
    if (!canGenerate && report.skipped) console.warn(`[assistant] ANTHROPIC_API_KEY not set: ${report.skipped} chunk(s) indexed without context`);

    // Documents in parallel, each document's chunks in order so its cached prompt is reused.
    const queue = [...todo];
    const worker = async () => {
        for (let next = queue.shift(); next; next = queue.shift()) {
            const [key, docChunks] = next;
            const document = documents.get(key)!;
            for (const c of docChunks) {
                try {
                    const { context, costUsd: cost } = await generateContext(document, c);
                    c.context = context;
                    c.contextHash = contextHashFor(document, c);
                    report.generated++;
                    report.costUsd += cost;
                } catch (err) {
                    report.failed++;
                    console.warn(`[assistant] context for ${c.id} failed (indexed without one; retried next run):`, (err as Error).message);
                }
            }
        }
    };
    await Promise.all(Array.from({ length: Math.max(1, ASSISTANT.contextConcurrency) }, worker));
    return report;
}
