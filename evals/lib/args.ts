// Command-line flags shared by the eval scripts.

export type EvalArgs = {
    /** Run only the first N items. */
    limit?: number;
    /** Run only the item with this id. */
    id?: string;
    /** Stop starting new questions once the estimated spend reaches this many USD. */
    maxCostUsd: number;
    dataset?: string;
};

export const DEFAULT_MAX_COST_USD = 1;

export function parseArgs(argv: string[]): EvalArgs {
    const args: EvalArgs = { maxCostUsd: DEFAULT_MAX_COST_USD };
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
        else throw new Error(`Unknown flag ${flag}`);
    }
    if (args.limit !== undefined && args.id) throw new Error('Use --limit or --id, not both');
    return args;
}
