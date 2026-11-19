import Image from 'next/image';
import React from 'react';
import { inlineLinkClass } from '../home/BentoTile';

export const ExternalLink = ({ href, children, italic = false }: { href: string; children: React.ReactNode; italic?: boolean }) => (
    <a className={`${inlineLinkClass} ${italic ? 'italic' : ''}`} href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

export const LogoBadge = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-[#F3F3F5] p-2">
        <Image src={src} alt={alt} width={64} height={64} className="max-h-full max-w-full object-contain" />
    </div>
);

export const awardPillClass = 'inline-flex items-center gap-1.5 rounded-full border border-[#f1d27a] bg-[#fff6d6] px-2.5 py-1 font-sans text-xs font-bold text-[#7a4b00]';

export const LivePill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9edbb5] bg-[#e6f6ec] px-2.5 py-1 font-sans text-xs font-bold text-[#0c6b33]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#16a34a]" aria-hidden="true" />
        {children}
    </span>
);

export const tileLabelClass = 'text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]';
