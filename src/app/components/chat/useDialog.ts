'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

/**
 * Modal-dialog behavior for the chat panel:
 * - on open, focus `initialFocus` (the composer) or the first focusable element;
 * - Tab / Shift+Tab cycle inside the dialog (focus trap);
 * - Escape closes;
 * - on close, focus returns to whatever opened the dialog (header button or home tile);
 * - `lockScroll` stops the page behind a full-screen sheet / drawer from scrolling.
 */
export function useDialog({
    open,
    onClose,
    dialogRef,
    initialFocus,
    lockScroll = false,
}: {
    open: boolean;
    onClose: () => void;
    dialogRef: RefObject<HTMLElement | null>;
    initialFocus?: RefObject<HTMLElement | null>;
    lockScroll?: boolean;
}) {
    const returnTo = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;
        returnTo.current = document.activeElement as HTMLElement | null;
        const node = dialogRef.current;
        // React has already removed `inert` by the time effects run, so focus can move synchronously.
        (initialFocus?.current ?? node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE))?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== 'Tab' || !node) return;
            const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && (active === first || !node.contains(active))) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || !node.contains(active))) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        if (lockScroll) document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            if (lockScroll) document.body.style.overflow = prevOverflow;
            // Return focus to the opener (if it is still in the page).
            const back = returnTo.current;
            if (back && document.contains(back)) back.focus();
        };
    }, [open, onClose, dialogRef, initialFocus, lockScroll]);
}

