// Date helpers for the About page timeline. Entries in lib/experience.ts store
// time as free text like "Jun 2024 - Aug 2024", "June 2023 - Dec 2024" or "Oct 2022".

type MonthYear = { month: string; year: string };

const parsePart = (part: string): MonthYear => {
    const [month = '', year = ''] = part.trim().split(/\s+/);
    // "June" -> "Jun", "Sept" -> "Sep"
    return { month: month.slice(0, 3), year };
};

const splitRange = (time: string) => time.split(/\s+[-–]\s+/).map(parsePart);

/** "Jun 2024 - Aug 2024" -> "Jun – Aug 2024"; "Jul 2022 - Apr 2024" -> "Jul 2022 – Apr 2024"; "Oct 2022" -> "Oct 2022". */
export function formatRange(time: string): string {
    const [start, end] = splitRange(time);
    if (!end) return `${start.month} ${start.year}`;
    if (start.year === end.year) return `${start.month} – ${end.month} ${end.year}`;
    return `${start.month} ${start.year} – ${end.month} ${end.year}`;
}

/** "Aug 2025 - May 2027" -> "Aug 2025" */
export function formatStart(time: string): string {
    const [start] = splitRange(time);
    return `${start.month} ${start.year}`;
}

/** "Aug 2025 - May 2027" -> "May 2027" */
export function formatEnd(time: string): string {
    const parts = splitRange(time);
    const end = parts[parts.length - 1];
    return `${end.month} ${end.year}`;
}

/** "Jun 2024 - Aug 2024" -> "2024" */
export function startYear(time: string): string {
    return splitRange(time)[0].year;
}

/** Find a required entry in the site data, failing the build loudly if it was renamed or removed. */
export function must<T>(items: T[], predicate: (item: T) => boolean, what: string): T {
    const found = items.find(predicate);
    if (!found) throw new Error(`About page timeline: missing ${what} in src/app/lib data`);
    return found;
}
