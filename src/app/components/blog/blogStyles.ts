// Server-safe class constants shared by the blog index and post page.
// Kept out of the 'use client' modules: a plain export from a client module reaches
// server components as a client reference, not as the string.
export const chipClass = 'inline-flex items-center rounded-full bg-[#F3F3F5] px-2.5 py-0.5 text-xs font-bold text-[#0A0A23]';
export const tileLabelClass = 'text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]';
export const backLinkClass = 'inline-flex items-center gap-1 text-sm font-bold text-[#006400] hover:text-[#0A0A23]';
