// Criterion #4 dataset: hiring-intent conversations, which should end with a clear, working way to
// contact Luis, and simple factual questions, which should not get a contact pitch nobody asked for.
import { isTextList, readJson, validateItems, type Dataset } from '../../core/dataset';

export type ContactKind = 'hiring' | 'factual';

export type ContactItem = {
    id: string;
    kind: ContactKind;
    /** The visitor's messages, in order. Each is answered with the earlier turns as history; only the answer to the last is graded. */
    turns: string[];
    /** Reviewer note on why the item is there. Not shown to the grader. */
    note?: string;
};

const KINDS: ContactKind[] = ['hiring', 'factual'];

/** Checks the shape of a parsed contact dataset; throws with every problem found. */
export const validateContactDataset = (raw: unknown): Dataset<ContactItem> =>
    validateItems<ContactItem>(raw, (item, problem) => {
        if (!KINDS.includes(item.kind)) problem('kind must be "hiring" or "factual"');
        if (!isTextList(item.turns)) problem('turns must be a non-empty list of visitor messages');
    });

export const loadContactDataset = (file: string) => validateContactDataset(readJson(file));
