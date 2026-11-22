// Graders back every "yes" with a quote; code then checks the quote is really there.

/** Lowercase, Markdown emphasis and code marks removed, typographic quotes and dashes flattened, whitespace collapsed. */
export function normalizeForQuote(s: string): string {
    return s
        .toLowerCase()
        .replace(/[*_`]/g, '')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[–—]/g, '-')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Strips Markdown link syntax so a quote of the visible text ("built ROSS") is found in
 * "built [ROSS](https://...)" too, then normalizes.
 */
const visibleText = (s: string) => normalizeForQuote(s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[<>]/g, ''));

/** Whether the quote occurs in the answer, ignoring case, Markdown and spacing. Empty quotes never do. */
export function quoteInAnswer(quote: string, answer: string): boolean {
    const q = visibleText(quote);
    return q.length > 0 && visibleText(answer).includes(q);
}

/** How an override names a quote that failed the check. */
export const missingQuote = (quote: string) => (quote ? `"${quote}" is not in the answer` : 'is empty');
