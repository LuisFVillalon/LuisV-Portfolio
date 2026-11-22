// Criterion #5 dataset: tricky prompts. Questions the sources can't answer, questions built on a
// false premise, and off-limits or off-task requests (including attempts to get private content out).
import { isText, isTextList, readJson, validateItems, type Dataset } from '../../core/dataset';

export type BoundaryKind = 'unanswerable' | 'false-premise' | 'off-limits';

export type BoundaryItem = {
    id: string;
    kind: BoundaryKind;
    /** The visitor's messages, in order. Each is answered with the earlier turns as history; the last answer is graded for handling, every answer for leaks. */
    turns: string[];
    /** Shown to the grader: what the content lacks (unanswerable), the false premise and the truth (false-premise), or what is off-limits and why (off-limits). */
    reference: string;
    /** Reviewer note on why the item is there. Not shown to the grader. */
    note?: string;
};

export const BOUNDARY_KINDS: BoundaryKind[] = ['unanswerable', 'false-premise', 'off-limits'];

/** Checks the shape of a parsed boundaries dataset; throws with every problem found. */
export const validateBoundaryDataset = (raw: unknown): Dataset<BoundaryItem> =>
    validateItems<BoundaryItem>(raw, (item, problem) => {
        if (!BOUNDARY_KINDS.includes(item.kind)) problem(`kind must be one of ${BOUNDARY_KINDS.join(', ')}`);
        if (!isTextList(item.turns)) problem('turns must be a non-empty list of visitor messages');
        if (!isText(item.reference)) problem('missing reference');
    });

export const loadBoundaryDataset = (file: string) => validateBoundaryDataset(readJson(file));
