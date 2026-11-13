'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { resume } from '@/app/lib/experience';
import { primaryButtonClass } from './home/BentoTile';

const NAV_LINKS = [
    { href: '/about', label: 'About' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
] as const;

const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]';

const resumeLinkProps = {
    href: resume,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': 'Résumé (PDF, opens in a new tab)',
} as const;

/** Nested routes mark their section: /blog/3 marks Blog. */
function isActivePath(href: string, path: string) {
    return path === href || path.startsWith(`${href}/`);
}

/** True once the page has scrolled past `threshold` px. */
function useScrolled(threshold = 8) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > threshold);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, [threshold]);
    return scrolled;
}

/**
 * Phone menu as a disclosure (not a modal): the toggle carries aria-expanded/aria-controls,
 * opening moves focus to the first link, Escape closes and returns focus to the toggle, and
 * a link click, a tap outside, tabbing out, a route change, or widening to desktop all close it.
 * While closed the panel is `inert`, so its links are not tabbable.
 */
function useNavMenu(path: string) {
    const [open, setOpen] = useState(false);
    const panelId = useId();
    const rootRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const close = useCallback((restoreFocus = false) => {
        setOpen(false);
        if (restoreFocus) buttonRef.current?.focus();
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [path]);

    useEffect(() => {
        if (!open) return;
        panelRef.current?.querySelector<HTMLElement>('a')?.focus();

        const isOutside = (target: EventTarget | null) =>
            !!rootRef.current && !rootRef.current.contains(target as Node);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close(true);
        };
        const onPointer = (e: PointerEvent) => isOutside(e.target) && close();
        const onFocus = (e: FocusEvent) => isOutside(e.target) && close();
        const desktop = window.matchMedia('(min-width: 768px)');
        const onWide = () => desktop.matches && close();

        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('focusin', onFocus);
        desktop.addEventListener('change', onWide);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointer);
            document.removeEventListener('focusin', onFocus);
            desktop.removeEventListener('change', onWide);
        };
    }, [open, close]);

    const buttonProps = {
        ref: buttonRef,
        type: 'button' as const,
        onClick: () => setOpen((o) => !o),
        'aria-expanded': open,
        'aria-controls': panelId,
        'aria-label': open ? 'Close menu' : 'Open menu',
    };

    const panelProps = {
        ref: panelRef,
        id: panelId,
        inert: !open,
        // Any link click inside the panel closes it, including a link to the current page.
        onClick: (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a')) close();
        },
    };

    return { open, close, rootRef, buttonProps, panelProps };
}

/**
 * Site header: a slim bar aligned to the pages' max-w-6xl tiles. Headshot + name link home,
 * the five page links sit centered with a gradient underline on the current page, and the
 * Résumé button stays visible at every width. Grey like the canvas at the top of the page;
 * white and frosted once scrolled.
 */
export default function Navbar() {
    const path = usePathname();
    const scrolled = useScrolled();
    const { open, close, rootRef, buttonProps, panelProps } = useNavMenu(path);
    const onHome = path === '/';

    return (
        <header
            ref={rootRef}
            className={`sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-200 ${
                // No backdrop-blur while open: it would make the header the containing block of the fixed scrim.
                open
                    ? 'border-[#0A0A23]/10 bg-white'
                    : scrolled
                      ? 'border-[#0A0A23]/10 bg-white/90 shadow-[0_1px_12px_rgba(10,10,35,0.06)] backdrop-blur-md'
                      : 'border-transparent bg-[#F5F5F7]'
            }`}
        >
            <nav
                aria-label="Main"
                className="mx-auto grid h-14 w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 md:grid-cols-[1fr_auto_1fr] md:px-8"
            >
                <Link
                    href="/"
                    aria-current={onHome ? 'page' : undefined}
                    className={`group flex min-w-0 max-w-full items-center gap-2.5 justify-self-start rounded-full pr-1 ${focusRing}`}
                >
                    <Image
                        src="/headshot.jpg"
                        alt=""
                        width={64}
                        height={64}
                        className="h-8 w-8 flex-none rounded-full object-cover"
                    />
                    <span className="truncate font-sans text-[15px] font-extrabold tracking-tight text-[#0A0A23] transition-colors group-hover:text-[#006400]">
                        Luis Villalón
                    </span>
                </Link>

                <ul className="hidden h-14 items-stretch gap-1 md:flex">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = isActivePath(href, path);
                        return (
                            <li key={href} className="flex">
                                <Link
                                    href={href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative flex items-center px-3 font-sans text-sm font-bold transition-colors ${focusRing}
                                        after:absolute after:inset-x-3 after:-bottom-px after:h-[3px] after:rounded-full after:transition-colors ${
                                            active
                                                ? 'text-[#0A0A23] after:bg-[linear-gradient(to_right,#22c55e,#3b82f6)]'
                                                : 'text-[#6e6e78] after:bg-transparent hover:text-[#0A0A23] hover:after:bg-[#0A0A23]/15'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-2 justify-self-end">
                    <a {...resumeLinkProps} className={`${primaryButtonClass} !py-1.5 ${focusRing}`}>
                        ↓ Résumé
                    </a>
                    <button
                        {...buttonProps}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#0A0A23]/15 bg-white text-[#0A0A23] md:hidden ${focusRing}`}
                    >
                        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>
            </nav>

            {/* Phone: the menu slides down under the bar, over the page. */}
            <div
                {...panelProps}
                className={`absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none md:hidden ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <ul className="border-b border-[#0A0A23]/10 bg-white px-4 pb-4 pt-2 shadow-[0_12px_24px_rgba(10,10,35,0.08)]">
                        {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map(({ href, label }) => {
                            const active = href === '/' ? onHome : isActivePath(href, path);
                            return (
                                <li key={href} className="border-b border-[#0A0A23]/5 last:border-0">
                                    <Link
                                        href={href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 rounded-md py-3 font-sans text-base font-bold ${focusRing} ${
                                            active
                                                ? 'text-[#0A0A23] before:h-5 before:w-[3px] before:rounded-full before:bg-[linear-gradient(to_bottom,#22c55e,#3b82f6)]'
                                                : 'text-[#333333] hover:text-[#006400]'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            {open && (
                <div
                    aria-hidden="true"
                    onPointerDown={() => close()}
                    className="fixed inset-x-0 bottom-0 top-14 -z-10 bg-[#0A0A23]/25 md:hidden"
                />
            )}
        </header>
    );
}
