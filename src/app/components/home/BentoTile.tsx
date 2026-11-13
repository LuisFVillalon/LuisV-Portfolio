import Link from 'next/link';
import React from 'react';

export const primaryButtonClass = `inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-sans text-sm font-extrabold text-white
    shadow-md border-b-4 border-r-2 border-green-900 transition-all duration-150
    hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:border-b-2
    bg-[#15803d] bg-[linear-gradient(to_right,#22c55e,#3b82f6)]`;

export const secondaryButtonClass = `inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-sans text-sm font-bold
    border-2 border-[#0A0A23] text-[#0A0A23] bg-white transition-colors
    hover:bg-[#0A0A23] hover:text-white`;

export const inlineLinkClass = `font-bold text-[#006400] underline underline-offset-4 hover:text-[#0A0A23] transition-colors`;

interface BentoTileProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
    /** Optional click-through shown on the right of the label row. */
    more?: { href: string; text: string };
}

export function BentoTile({ children, className = '', label, more }: BentoTileProps) {
    return (
        <div className={`relative min-w-0 overflow-hidden rounded-2xl border border-[#0A0A23]/10 bg-white p-4 md:p-5 text-[#333333] ${className}`}>
            {(label || more) && (
                <div className="mb-3 flex items-baseline justify-between gap-3">
                    {label && (
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]">{label}</p>
                    )}
                    {more && (
                        <Link href={more.href} className={`shrink-0 text-xs ${inlineLinkClass}`}>
                            {more.text}
                        </Link>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
