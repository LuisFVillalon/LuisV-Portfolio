// Criterion #1 dataset: recruiter-style questions, each with the key facts a correct answer states.
import { isText, readJson, validateItems, type Dataset } from '../../core/dataset';

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

/** Checks the shape of a parsed dataset; throws with every problem found. */
export const validateDataset = (raw: unknown): Dataset<EvalItem> =>
    validateItems<EvalItem>(raw, (item, problem) => {
        if (!isText(item.question)) problem('missing question');
        if (!Array.isArray(item.keyFacts) || item.keyFacts.length === 0 || item.keyFacts.some((f: KeyFact) => !isText(f?.fact) || typeof f.highStakes !== 'boolean'))
            problem('keyFacts must be a non-empty list of { fact, highStakes } with highStakes true or false');
        if (!isText(item.category)) problem('missing category');
    });

export const loadDataset = (file: string) => validateDataset(readJson(file));
