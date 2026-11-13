import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileDown, FolderGit2, Github, Linkedin, Mail } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { BentoTile, primaryButtonClass } from '../components/home/BentoTile';
import ContactForm, { CopyEmailButton } from '../components/contact/ContactForm';
import { CONTACT_EMAIL } from '../lib/contact';
import { profile, resume } from '../lib/experience';
import { linkedinProfileUrl } from '../lib/linkedinPosts';

const GITHUB_URL = 'https://github.com/LuisFVillalon';

const channelTileClass = `group flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-[#0A0A23]/10 bg-white p-4
    text-[#333333] transition-all hover:-translate-y-0.5 hover:border-[#006400]/40 hover:shadow-md md:p-5`;

interface ChannelTileProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    title: string;
    cta: string;
    /** Site-internal links stay in the tab; everything else opens a new one. */
    internal?: boolean;
}

function ChannelTile({ href, icon, label, title, cta, internal = false }: ChannelTileProps) {
    const body = (
        <>
            <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F5] text-[#0A0A23] transition-colors group-hover:bg-[#0A0A23] group-hover:text-white">
                    {icon}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#6e6e78] group-hover:text-[#006400]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]">{label}</p>
                <p className="truncate font-sans text-base font-extrabold text-[#0A0A23]">{title}</p>
                <p className="text-xs font-bold text-[#006400] group-hover:underline">{cta}</p>
            </div>
        </>
    );

    return internal ? (
        <Link href={href} className={channelTileClass}>
            {body}
        </Link>
    ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={channelTileClass}>
            {body}
        </a>
    );
}

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start bg-[#F5F5F7] font-[Monospace]">
            <Navbar />
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
                {/* DOM order is the phone order: hero, one-click channels, then the form.
                    On lg the form tile is pinned to the right half and the rest flow around it. */}
                <section className="grid grid-cols-2 gap-3 py-4 md:gap-4 md:py-6 lg:grid-cols-4">
                    {/* Same dark gradient as the homepage ContactTile that links here. */}
                    <div className="col-span-2 flex min-w-0 flex-col gap-4 rounded-2xl bg-[#0A0A23] bg-[linear-gradient(to_bottom_right,#0A0A23,#1d2a6b)] p-5 text-white lg:p-6">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/headshot.jpg"
                                alt="Luis Villalon headshot"
                                width={128}
                                height={128}
                                priority
                                className="h-14 w-14 flex-none rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#aab]">Get in touch</p>
                                <p className="font-sans text-sm font-bold text-[#86efac]">Software Engineer · Full-Stack · Agentic AI</p>
                            </div>
                        </div>
                        <h1 className="font-sans text-2xl font-extrabold leading-tight lg:text-3xl">
                            Hiring a new-grad software engineer?
                        </h1>
                        {profile.openTo && (
                            <p className="text-sm text-[#d6d9f0]">
                                <span className="font-sans font-bold text-white">Open to:</span> {profile.openTo}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                            <a href={`mailto:${CONTACT_EMAIL}`} className={primaryButtonClass}>
                                <Mail className="h-4 w-4" aria-hidden="true" /> Email me
                            </a>
                            <CopyEmailButton />
                        </div>
                        <p className="break-all text-xs text-[#aab]">{CONTACT_EMAIL}</p>
                    </div>

                    <ChannelTile href={resume} icon={<FileDown className="h-5 w-5" />} label="Résumé" title="Download PDF" cta="Open résumé →" />
                    <ChannelTile href={linkedinProfileUrl} icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" title="luis-villalon" cta="Connect →" />
                    <ChannelTile href={GITHUB_URL} icon={<Github className="h-5 w-5" />} label="GitHub" title="LuisFVillalon" cta="See the code →" />
                    <ChannelTile href="/projects" icon={<FolderGit2 className="h-5 w-5" />} label="Projects" title="What I've built" cta="Browse projects →" internal />

                    <BentoTile
                        label="Or send a message"
                        className="col-span-2 flex flex-col lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:p-6"
                    >
                        <ContactForm />
                    </BentoTile>
                </section>
            </div>
            <Footer />
        </div>
    );
}
