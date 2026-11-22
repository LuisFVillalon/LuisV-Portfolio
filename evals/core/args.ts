// Command-line flags shared by the eval scripts.

export type EvalArgs = {
    /** Run only the first N items. */
    limit?: number;
    /** Run only the item with this id. */
    id?: string;
    /** Stop starting new questions once the estimated spend reaches this many USD. */
    maxCostUsd: number;
    dataset?: string;
    /** Answer with this Claude model instead of ASSISTANT.model (an experiment; the site is unchanged). */
    model?: string;
};

export const DEFAULT_MAX_COST_USD = 1;

/**
 * Models --model accepts: the ones the assistant has prices for (MODEL_PRICES in config.ts, which
 * prices every call by its model, so reported costs and the --max-cost cap stay honest). Listed
 * here rather than imported because config.ts reads env vars at import time and must load after
 * loadEvalEnv(); a test keeps the two lists equal.
 */
export const ANSWER_MODELS = ['claude-haiku-5-5', 'claude-sonnet-5-5'] as const;

/** `defaultMaxCostUsd` lets each runner set the cap that fits its full run. */
export function parseArgs(argv: string[], defaultMaxCostUsd = DEFAULT_MAX_COST_USD): EvalArgs {
    const args: EvalArgs = { maxCostUsd: defaultMaxCostUsd };
    for (let i = 0; i < argv.length; i++) {
        const flag = argv[i];
        const value = () => {
            const v = argv[++i];
            if (v === undefined || v.startsWith('--')) throw new Error(`${flag} needs a value`);
            return v;
        };
        if (flag === '--limit') {
            const n = Number(value());
            if (!Number.isInteger(n) || n < 1) throw new Error('--limit must be a positive whole number');
            args.limit = n;
        } else if (flag === '--id') args.id = value();
        else if (flag === '--max-cost') {
            const n = Number(value());
            if (!(n > 0)) throw new Error('--max-cost must be a positive number of USD');
            args.maxCostUsd = n;
        } else if (flag === '--dataset') args.dataset = value();
        else if (flag === '--model') {
            const m = value();
            if (!(ANSWER_MODELS as readonly string[]).includes(m)) throw new Error(`--model must be one of: ${ANSWER_MODELS.join(', ')}`);
            args.model = m;
        }
        else throw new Error(`Unknown flag ${flag}`);
    }
    if (args.limit !== undefined && args.id) throw new Error('Use --limit or --id, not both');
    return args;
}
