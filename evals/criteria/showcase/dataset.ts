// Criterion #3 dataset: skill and fit questions, each with the project(s) or experience(s) Luis
// picks as the best match.
import { isText, readJson, validateItems, type Dataset } from '../../core/dataset';

export type ShowcaseMatch = {
    /** How the match is named to the grader, e.g. "ROSS" or "Software Engineer Intern at Ectron". */
    name: string;
    /** Corpus chunk ids (as `npm run assistant:chunks` prints them) that describe it: they give the grader its reference text and the link check its targets. */
    chunks: string[];
};

export type ShowcaseItem = {
    id: string;
    question: string;
    /** "technical" or "soft-skill": the 20 questions mix both. */
    kind: 'technical' | 'soft-skill';
    /** Acceptable best matches, Luis's first pick first. Naming any one of them, with a detail and a link, passes. */
    matches: ShowcaseMatch[];
    /** Reviewer note. Not shown to the grader. */
    note?: string;
};

const KINDS = ['technical', 'soft-skill'];

/**
 * Checks the shape of a parsed showcase dataset; throws with every problem found. With
 * `knownChunkIds`, also checks that every chunk id still exists in the corpus.
 */
export const validateShowcaseDataset = (raw: unknown, knownChunkIds?: Set<string>): Dataset<ShowcaseItem> =>
    validateItems<ShowcaseItem>(raw, (item, problem) => {
        if (!isText(item.question)) problem('missing question');
        if (!KINDS.includes(item.kind)) problem('kind must be "technical" or "soft-skill"');
        if (!Array.isArray(item.matches) || item.matches.length === 0) return problem('matches must be a non-empty list of { name, chunks }');
        item.matches.forEach((m: ShowcaseMatch, j: number) => {
            if (!isText(m?.name)) problem(`matches[${j}] has no name`);
            if (!Array.isArray(m?.chunks) || m.chunks.length === 0 || m.chunks.some((c) => typeof c !== 'string' || !c)) problem(`matches[${j}] chunks must be a non-empty list of chunk ids`);
            else if (knownChunkIds) for (const c of m.chunks) if (!knownChunkIds.has(c)) problem(`matches[${j}] (${m.name}) names unknown chunk "${c}"`);
        });
    });

export const loadShowcaseDataset = (file: string, knownChunkIds?: Set<string>) => validateShowcaseDataset(readJson(file), knownChunkIds);
