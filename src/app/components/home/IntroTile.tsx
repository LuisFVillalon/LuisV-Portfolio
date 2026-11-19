import Image from 'next/image';
import { getAwardProjects, getProjectByTitle } from '@/app/lib/projects';
import { professionalExperience, profile, resume } from '@/app/lib/experience';
import { linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import { GITHUB_URL } from '@/app/lib/contact';
import { BentoTile, inlineLinkClass, primaryButtonClass, secondaryButtonClass } from './BentoTile';
import { isLiveApp } from './ProjectTile';

type Fact = { headline: string; detail: string[]; links?: { label: string; href: string }[] };

// Live deployments named in the intro, by their projects.ts title; the URL comes from there.
const LIVE_APPS = [
    { title: 'kanso', label: 'kanso' },
    { title: 'Poke-Photo Tag', label: 'Where\u2019s That Pokémon' },
    { title: 'Whats Poppin?', label: 'What\u2019s Poppin\u2019' },
];

// Proof stats are derived from the existing data so they stay in sync with it.
function getProofFacts(): Fact[] {
    const facts: Fact[] = [];

    const awards = getAwardProjects().flatMap((p) => (p.award ? [p.award] : []));
    if (awards.length > 1) {
        // One win per line: "1st · Swans Applied AI 2026".
        const short = ({ title, event }: { title: string; event: string }) =>
            `${title.replace('First Place', '1st').replace(/ Project$/, '')} · ${event.replace(/ Hackathon/, '')}`;
        facts.push({ headline: `🏆 ${awards.length}× Hackathon Winner`, detail: awards.map(short) });
    } else if (awards.length === 1) {
        facts.push({ headline: `🏆 ${awards[0].title}`, detail: [awards[0].event] });
    }

    // One role type per line, counted from the titles: "3 industry internships" / "1 research role" / "1 full-time role".
    const kinds = [
        { test: (pos: string) => /\bIntern\b/.test(pos), one: 'industry internship', many: 'industry internships' },
        { test: (pos: string) => /Research/.test(pos), one: 'research role', many: 'research roles' },
    ];
    const counts = [0, 0, 0];
    for (const { position } of professionalExperience) {
        const i = kinds.findIndex((k) => k.test(position));
        counts[i === -1 ? 2 : i]++;
    }
    const labels = [...kinds, { one: 'full-time role', many: 'full-time roles' }];
    if (professionalExperience.length > 0) {
        facts.push({
            headline: `${professionalExperience.length} roles`,
            detail: labels.flatMap((l, i) => (counts[i] ? [`${counts[i]} ${counts[i] === 1 ? l.one : l.many}`] : [])),
        });
    }

    const live = LIVE_APPS.flatMap(({ title, label }) => {
        const project = getProjectByTitle(title);
        return project && isLiveApp(project) ? [{ label, href: project.live_app as string }] : [];
    });
    if (live.length > 1) {
        facts.push({ headline: 'Live apps', detail: [], links: live });
    } else if (live.length === 1) {
        facts.push({ headline: 'Live app', detail: [], links: live });
    }

    return facts;
}

export default function IntroTile() {
    const facts = getProofFacts();

    return (
        <BentoTile className="flex flex-col justify-center gap-4 lg:gap-3">
            <div className="flex items-center gap-4 lg:gap-5">
                <Image
                    src="/headshot.jpg"
                    alt="Luis Villalon headshot"
                    width={320}
                    height={320}
                    priority
                    className="h-[76px] w-[76px] lg:h-[104px] lg:w-[104px] flex-none rounded-2xl object-cover"
                />
                <div className="min-w-0">
                    <h1 className="font-sans text-2xl lg:text-3xl font-extrabold leading-tight text-[#0A0A23]">
                        Luis Fernando Villalón
                    </h1>
                    <p className="mt-1 font-sans text-sm font-bold text-[#006400]">
                        Software Engineer · Full-Stack · Applied AI
                    </p>
                </div>
            </div>

            <p className="text-sm leading-relaxed lg:text-[13px] lg:leading-normal">
                Comp. Sci. student at <strong>San Diego State University</strong> (B.S., minor in Math., May 2027). I build
                full-stack and applied-AI products, from a live productivity app to an agentic system for chip
                design. From Calexico, CA; bilingual EN/ES.
            </p>

            {facts.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {facts.map((fact) => (
                        <div key={fact.headline} className="min-w-0 rounded-xl bg-[#F3F3F5] px-2.5 py-2 lg:py-1.5">
                            <p className="font-sans text-[13px] lg:whitespace-nowrap font-extrabold leading-tight text-[#0A0A23]">
                                {fact.headline}
                            </p>
                            {fact.detail.map((line) => (
                                <p key={line} className="mt-0.5 text-xs leading-snug text-[#3f3f4a]">
                                    {line}
                                </p>
                            ))}
                            {fact.links && (
                                <ul className="mt-0.5 text-xs leading-snug">
                                    {fact.links.map((link) => (
                                        <li key={link.href} className="lg:truncate">
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`${inlineLinkClass} underline-offset-2`}
                                            >
                                                {link.label} ↗
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {profile.openTo && (
                <p className="text-sm lg:text-[13px]">
                    <span className="font-sans font-bold text-[#0A0A23]">Open to:</span> {profile.openTo}
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                <a href={resume} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
                    ↓ Résumé
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
                    GitHub
                </a>
                <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
                    LinkedIn
                </a>
            </div>
        </BentoTile>
    );
}
