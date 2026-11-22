// Criterion #2 dataset: questions only. The reference is whatever the assistant retrieved, not
// hand-written facts.
import { isText, readJson, validateItems, type Dataset } from '../../core/dataset';

export type FaithfulnessItem = {
    id: string;
    question: string;
    category: string;
    /** Reviewer note on why the question is there. Not shown to the grader. */
    note?: string;
};

/** Checks the shape of a parsed faithfulness dataset; throws with every problem found. */
export const validateFaithfulnessDataset = (raw: unknown): Dataset<FaithfulnessItem> =>
    validateItems<FaithfulnessItem>(raw, (item, problem) => {
        if (!isText(item.question)) problem('missing question');
        if (!isText(item.category)) problem('missing category');
    });

export const loadFaithfulnessDataset = (file: string) => validateFaithfulnessDataset(readJson(file));
