// Loading and checking the hand-written datasets (each criterion's dataset.json). Every dataset is
// `{ items: [...] }` with a unique `id` per item; each criterion adds its own field checks.
import fs from 'fs';
import path from 'path';

export type Dataset<Item> = { criterion?: string; status?: string; items: Item[] };

/** Reports one problem with the item being checked; all problems are listed together at the end. */
export type Problem = (message: string) => void;

export const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
export const isTextList = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(isText);

/**
 * Checks a parsed dataset: an `items` array, every item with a unique id, plus whatever `check`
 * reports for each item. Throws once, listing every problem found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- items are unchecked JSON until `check` has run
export function validateItems<Item>(raw: unknown, check: (item: any, problem: Problem) => void): Dataset<Item> {
    const items = (raw as { items?: unknown } | null)?.items;
    if (!Array.isArray(items)) throw new Error('Dataset has no "items" array');
    const problems: string[] = [];
    const seen = new Set<string>();
    items.forEach((item, i) => {
        const problem: Problem = (m) => problems.push(`items[${i}]${item?.id ? ` (${item.id})` : ''}: ${m}`);
        if (!isText(item?.id)) problem('missing id');
        else if (seen.has(item.id)) problem('duplicate id');
        else seen.add(item.id);
        check(item ?? {}, problem);
    });
    if (problems.length) throw new Error(`Invalid dataset:\n  ${problems.join('\n  ')}`);
    return raw as Dataset<Item>;
}

export const readJson = (file: string): unknown => JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));

/** Applies --id / --limit: one item by id, or the first N items. */
export function selectItems<T extends { id: string }>(items: T[], opts: { id?: string; limit?: number }): T[] {
    if (opts.id) {
        const match = items.filter((i) => i.id === opts.id);
        if (match.length === 0) throw new Error(`No item with id "${opts.id}"`);
        return match;
    }
    return opts.limit !== undefined ? items.slice(0, opts.limit) : items;
}
