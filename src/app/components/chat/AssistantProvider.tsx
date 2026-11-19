'use client';

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useAssistantChat } from './useAssistantChat';

// Loaded only when the assistant is enabled, so the site ships no chat code without it.
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

type AssistantContextValue = {
    /** False when the assistant isn't configured: every entry point renders nothing. */
    enabled: boolean;
    open: boolean;
    /** Opens the chat panel, optionally asking `question` right away. */
    openWith: (question?: string) => void;
    starterPath: string;
};

const AssistantContext = createContext<AssistantContextValue>({
    enabled: false,
    open: false,
    openWith: () => undefined,
    starterPath: '/',
});

export const useAssistant = () => useContext(AssistantContext);

/**
 * Mounted once in the root layout. Holds the chat state so a conversation survives page
 * navigation, renders the single chat panel, and lets the header "Ask AI" button and the home
 * "Ask about Luis" tile open it.
 */
export default function AssistantProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
    const pathname = usePathname() ?? '/';
    const chat = useAssistantChat(pathname);
    const [open, setOpen] = useState(false);
    const pending = useRef<string | null>(null);
    const { send, loadStatus } = chat;

    const openWith = useCallback(
        (question?: string) => {
            if (!enabled) return;
            void loadStatus();
            if (open) {
                if (question?.trim()) send(question);
                return;
            }
            if (question?.trim()) pending.current = question;
            setOpen(true);
        },
        [enabled, loadStatus, open, send],
    );

    // Ask a question handed over by the home tile once the panel is open.
    useEffect(() => {
        if (open && pending.current) {
            const q = pending.current;
            pending.current = null;
            send(q);
        }
    }, [open, send]);

    const close = useCallback(() => setOpen(false), []);
    const value = useMemo(() => ({ enabled, open, openWith, starterPath: pathname }), [enabled, open, openWith, pathname]);

    return (
        <AssistantContext.Provider value={value}>
            {children}
            {enabled && <ChatPanel open={open} onClose={close} chat={chat} starterPath={pathname} />}
        </AssistantContext.Provider>
    );
}
