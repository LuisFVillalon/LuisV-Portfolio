// Chunks from the public résumé PDF: one chunk per section, and per entry inside the
// Experience / Leadership / Projects sections. PDF extraction is messy, so anything oversized
// falls back to the recursive splitter.
import fs from 'fs';
import path from 'path';
import { extractText } from 'unpdf';
import { resume } from '../../experience';
import { makeChunk, slug, splitRecursive, type Chunk } from './types';

const SECTION = /^[A-Z][A-Z &]{3,}$/;
const MONTH = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\\.?';
const ENTRY_START = new RegExp(`\\s\\|\\s|${MONTH}\\s+\\d{4}\\s*[-–]|Expected\\s+${MONTH}`);
const ENTRY_SECTIONS = new Set(['EXPERIENCE', 'LEADERSHIP', 'PROJECTS']);

/** Removes the phone number and email from the contact line: the assistant shares neither from here. */
function redactContact(text: string): string {
    return text
        .replace(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '')
        .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '')
        .replace(/(\s*\|\s*){2,}/g, ' | ');
}

export async function readResumeText(): Promise<string> {
    const file = path.join(process.cwd(), 'public', resume.replace(/^\//, ''));
    const { text } = await extractText(new Uint8Array(fs.readFileSync(file)), { mergePages: true });
    return redactContact(text);
}

function entries(lines: string[]): string[][] {
    const out: string[][] = [];
    for (const line of lines) {
        const isBullet = /^[•\-*]/.test(line);
        if (!isBullet && ENTRY_START.test(line) && (out.length === 0 || out[out.length - 1].length > 1)) out.push([line]);
        else if (out.length === 0) out.push([line]);
        else out[out.length - 1].push(line);
    }
    return out;
}

export async function resumeChunks(): Promise<Chunk[]> {
    const text = await readResumeText();
    const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

    // The name / links header before the first section heading.
    const sections: { name: string; lines: string[] }[] = [{ name: 'Header', lines: [] }];
    for (const line of lines) {
        if (SECTION.test(line)) sections.push({ name: line, lines: [] });
        else sections[sections.length - 1].lines.push(line);
    }

    const chunks: Chunk[] = [];
    const add = (sectionName: string, entryTitle: string | undefined, body: string, idPart: string) => {
        const pretty = sectionName.charAt(0) + sectionName.slice(1).toLowerCase();
        const pieces = splitRecursive(body, 1500, 200);
        pieces.forEach((piece, i) =>
            chunks.push(
                makeChunk({
                    id: `resume:${idPart}${pieces.length > 1 ? `-${i + 1}` : ''}`,
                    sourceType: 'resume',
                    title: entryTitle ? `Résumé ${pretty}: ${entryTitle}` : `Résumé ${pretty}`,
                    section: pretty,
                    label: 'Résumé',
                    href: resume,
                    text: piece,
                }),
            ),
        );
    };

    for (const section of sections) {
        if (section.lines.length === 0) continue;
        if (ENTRY_SECTIONS.has(section.name)) {
            for (const entry of entries(section.lines)) {
                const role = entry[0].split(/\s\|\s/)[0].replace(new RegExp(`\\s+${MONTH}.*$`), '').trim();
                // Roles read "Title  Dates" then "Organization, City": name both.
                const org = section.name !== 'PROJECTS' && entry[1] && !/^[•\-*]/.test(entry[1]) ? entry[1].split(',')[0] : '';
                const title = org ? `${role}, ${org}` : role;
                add(section.name, title, entry.join('\n'), `${slug(section.name)}:${slug(title)}`);
            }
        } else {
            add(section.name, undefined, section.lines.join('\n'), slug(section.name));
        }
    }
    return chunks;
}
