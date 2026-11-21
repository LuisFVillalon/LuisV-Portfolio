// The eval datasets: hand-written questions with short lists of reference key facts.
import fs from 'fs';
import path from 'path';

export type KeyFact = {
    fact: string;
    /** True when the fact is a degree, graduation date, employer, job title or award result. */
    highStakes: boolean;
};

export type EvalItem = {
    id: string;
    question: string;
    /** Facts a fully correct answer must state. Drafted from the site, corrected by the site owner. */
    keyFacts: KeyFact[];
    category: string;
    /** Reviewer note on a fact the draft was unsure of. Not shown to the grader. */
    note?: string;
};

export type Dataset = { criterion?: string; status?: string; items: EvalItem[] };

/** Checks the shape of a parsed dataset; throws with every problem found. */
export function validateDataset(raw: unknown): Dataset {
    const problems: string[] = [];
    const items = (raw as Dataset | null)?.items;
    if (!Array.isArray(items)) throw new Error('Dataset has no "items" array');
    const seen = new Set<string>();
    items.forEach((item, i) => {
        const where = `items[${i}]${item?.id ? ` (${item.id})` : ''}`;
        if (typeof item?.id !== 'string' || !item.id) problems.push(`${where}: missing id`);
        else if (seen.has(item.id)) problems.push(`${where}: duplicate id`);
        else seen.add(item.id);
        if (typeof item?.question !== 'string' || !item.question.trim()) problems.push(`${where}: missing question`);
        if (
            !Array.isArray(item?.keyFacts) ||
            item.keyFacts.length === 0 ||
            item.keyFacts.some((f) => typeof f?.fact !== 'string' || !f.fact.trim() || typeof f.highStakes !== 'boolean')
        )
            problems.push(`${where}: keyFacts must be a non-empty list of { fact, highStakes } with highStakes true or false`);
        if (typeof item?.category !== 'string' || !item.category) problems.push(`${where}: missing category`);
    });
    if (problems.length) throw new Error(`Invalid dataset:\n  ${problems.join('\n  ')}`);
    return raw as Dataset;
}

export function loadDataset(file: string): Dataset {
    return validateDataset(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')));
}

/** Applies --id / --limit: one item by id, or the first N items. */
export function selectItems(items: EvalItem[], opts: { id?: string; limit?: number }): EvalItem[] {
    if (opts.id) {
        const match = items.filter((i) => i.id === opts.id);
        if (match.length === 0) throw new Error(`No item with id "${opts.id}"`);
        return match;
    }
    return opts.limit !== undefined ? items.slice(0, opts.limit) : items;
}
