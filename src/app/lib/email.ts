// Helpers for putting visitor-supplied text into emails safely.

/** Escapes visitor text before it is placed into email HTML. */
export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Removes CR/LF so visitor text can't inject extra lines into a subject or header. */
export function stripLineBreaks(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim();
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
