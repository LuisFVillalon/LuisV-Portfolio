// A controllable clock for the system criteria: replaces the global Date so `new Date()` and
// `Date.now()` (which the limits, saved chats and digest all read) return the eval's time.
// Dates built from a value (`new Date(ms)`, `Date.parse`) behave as usual.

export type Clock = {
    now(): number;
    tick(ms: number): void;
    set(iso: string): void;
    restore(): void;
};

export function installClock(startIso: string): Clock {
    const RealDate = globalThis.Date;
    let now = RealDate.parse(startIso);

    class ClockDate extends RealDate {
        constructor(...args: unknown[]) {
            if (args.length === 0) super(now);
            else super(...(args as [number]));
        }

        static now() {
            return now;
        }
    }

    globalThis.Date = ClockDate as DateConstructor;
    return {
        now: () => now,
        tick: (ms) => {
            now += ms;
        },
        set: (iso) => {
            now = RealDate.parse(iso);
        },
        restore: () => {
            globalThis.Date = RealDate;
        },
    };
}
