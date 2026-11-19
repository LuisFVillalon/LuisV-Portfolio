'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, RotateCcw, X } from 'lucide-react';
import {
    AssistantAvatar,
    BlockedNotice,
    Composer,
    Disclosure,
    focusRing,
    LiveAnnouncer,
    MessageList,
    SaveNotice,
    StarterChips,
} from './ChatParts';
import LeadCard from './LeadCard';
import { startersFor } from './starters';
import { useDialog } from './useDialog';
import type { AssistantChat } from './useAssistantChat';

function useIsPhone() {
    const [phone, setPhone] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)');
        const update = () => setPhone(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);
    return phone;
}

const iconButton = `flex h-8 w-8 items-center justify-center rounded-lg text-[#6e6e78] hover:bg-[#F3F3F5] hover:text-[#0A0A23] ${focusRing}`;

/**
 * The chat panel: chat bubbles in a compact 380px panel that drops from the top right, under
 * the header (where the "Ask AI" button lives); a full-screen sheet on phones. Every answer
 * carries its source chips; answers without a source offer Contact / Message Luis instead.
 */
export default function ChatPanel({
    open,
    onClose,
    chat,
    starterPath,
}: {
    open: boolean;
    onClose: () => void;
    chat: AssistantChat;
    starterPath: string;
}) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const phone = useIsPhone();
    const [leadOpen, setLeadOpen] = useState(false);
    useDialog({ open, onClose, dialogRef, initialFocus: inputRef, lockScroll: phone });

    const busy = chat.phase !== 'idle';
    const blocked = chat.unavailable ?? (chat.limited ? 'limit' : null);
    const openLead = () => setLeadOpen(true);
    const closeLead = () => {
        setLeadOpen(false);
        inputRef.current?.focus();
    };

    // A new lead card should be visible: scroll it into view.
    const leadRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (leadOpen) leadRef.current?.scrollIntoView({ block: 'nearest' });
    }, [leadOpen]);

    return (
        <>
            <LiveAnnouncer text={open ? chat.announcement : ''} />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="assistant-chat-title"
                aria-describedby="assistant-chat-subtitle"
                inert={!open}
                className={`fixed z-[60] flex flex-col overflow-hidden bg-white font-[Monospace] text-[#333333] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none
                    inset-0 sm:inset-auto sm:right-4 sm:top-[4.25rem] sm:h-[min(640px,calc(100dvh-5.5rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:border-[#0A0A23]/10 sm:shadow-[0_18px_50px_rgba(10,10,35,0.22)] md:right-8 xl:right-[max(2rem,calc((100vw-72rem)/2+2rem))]
                    origin-top-right ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
            >
                <header className="flex items-center gap-2.5 border-b border-[#0A0A23]/10 px-4 py-3">
                    <AssistantAvatar size={36} />
                    <div className="min-w-0 flex-1">
                        <h2 id="assistant-chat-title" className="font-sans text-[15px] font-extrabold leading-tight text-[#0A0A23]">
                            Ask about Luis
                        </h2>
                        <p id="assistant-chat-subtitle" className="truncate text-[11px] text-[#6e6e78]">
                            Luis&apos;s AI assistant · answers from his own content
                        </p>
                    </div>
                    <button type="button" onClick={openLead} aria-label="Message Luis" title="Message Luis" className={iconButton}>
                        <Mail className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {chat.messages.length > 0 && (
                        <button type="button" onClick={chat.clear} aria-label="Start a new chat" title="New chat" className={iconButton}>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                    <button type="button" onClick={onClose} aria-label="Close chat" className={iconButton}>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
                    <MessageList
                        messages={chat.messages}
                        phase={chat.phase}
                        onRetry={chat.retry}
                        onMessage={openLead}
                        empty={
                            <div className="flex flex-col gap-4">
                                <div className="flex items-end gap-2">
                                    <AssistantAvatar size={24} />
                                    <p className="max-w-[88%] rounded-2xl rounded-tl-md bg-[#F3F3F5] px-3.5 py-2.5 text-[13px] leading-relaxed">
                                        Hi! I&apos;m Luis&apos;s AI assistant. Ask me about his projects, experience, skills or writing.
                                    </p>
                                </div>
                                {!blocked && (
                                    <div>
                                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]">Try asking</p>
                                        <StarterChips items={startersFor(starterPath)} onPick={chat.send} disabled={busy} />
                                    </div>
                                )}
                            </div>
                        }
                    />
                    {leadOpen && (
                        <div ref={leadRef} className="mt-4">
                            <LeadCard questions={chat.questions} onClose={closeLead} />
                        </div>
                    )}
                </div>

                <div className="border-t border-[#0A0A23]/10 bg-white px-3 pb-3 pt-3">
                    {blocked ? (
                        <BlockedNotice reason={blocked} limit={chat.limit} onMessage={openLead} />
                    ) : (
                        <Composer
                            onSend={chat.send}
                            busy={busy}
                            remaining={chat.remaining}
                            limit={chat.limit}
                            maxChars={chat.maxChars}
                            inputRef={inputRef}
                        />
                    )}
                    <Disclosure className="mt-2 px-1" />
                    <SaveNotice save={chat.save} onChange={chat.setSave} disabled={busy} className="mt-1 px-1 pl-[1.375rem]" />
                </div>
            </div>
        </>
    );
}
