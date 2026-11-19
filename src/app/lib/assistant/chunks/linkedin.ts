// Chunks from the private, curated LinkedIn profile file: headline + about as one chunk, then
// one chunk per position and per education entry; other sections stay whole.
import { linkedinProfileUrl } from '../../linkedinPosts';
import { loadLinkedInProfile } from '../private';
import { makeChunk, slug, splitMarkdownSections, splitRecursive, type Chunk } from './types';

const PER_ITEM = /^(positions|education)/i;

export function linkedinChunks(markdown = loadLinkedInProfile()): Chunk[] {
    if (!markdown) return [];
    const chunks: Chunk[] = [];
    const base = { sourceType: 'linkedin' as const, label: 'LinkedIn', href: linkedinProfileUrl };

    for (const { heading, body } of splitMarkdownSections(markdown)) {
        if (!heading) continue; // file title / provenance notes before the first section
        if (PER_ITEM.test(heading)) {
            const items = body.split(/\n(?=- )/).map((s) => s.replace(/^- /, '').trim()).filter(Boolean);
            for (const item of items) {
                const name = item.match(/\*\*(.+?)\*\*/)?.[1] ?? item.slice(0, 60);
                chunks.push(
                    makeChunk({
                        ...base,
                        id: `linkedin:${slug(heading)}:${slug(name)}`,
                        title: `LinkedIn ${heading.replace(/\s*\(.*\)$/, '')}: ${name}`,
                        section: heading,
                        text: item.replace(/\*\*/g, ''),
                    }),
                );
            }
        } else {
            splitRecursive(body.replace(/\*\*/g, ''), 1500, 200).forEach((piece, i, all) =>
                chunks.push(
                    makeChunk({
                        ...base,
                        id: `linkedin:${slug(heading)}${all.length > 1 ? `-${i + 1}` : ''}`,
                        title: `LinkedIn ${heading}`,
                        section: heading,
                        text: piece,
                    }),
                ),
            );
        }
    }
    return chunks;
}
