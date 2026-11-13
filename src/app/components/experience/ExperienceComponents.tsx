import React from 'react';
import {
    professionalExperience,
    education,
    certificates,
    techTools,
    currentlyDoing,
    leadership,
    beyondTech,
    profile,
    resume,
} from '@/app/lib/experience';
import { linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import { BentoTile, primaryButtonClass, secondaryButtonClass, inlineLinkClass } from '../home/BentoTile';
import { tidy, shortPosition, shortCompany } from '../home/InfoTiles';
import { splitTech } from '../home/ProjectTile';

const mutedClass = 'text-xs text-[#6e6e78]';
const toggleClass = 'cursor-pointer select-none text-xs font-bold text-[#006400] underline underline-offset-4 hover:text-[#0A0A23]';
const entryLinkClass = 'font-sans font-bold text-[#0A0A23] hover:text-[#006400] hover:underline';

// "Undergraduate Researcher: Adversarial Attacks…" -> "Adversarial Attacks…"
const positionFocus = (position: string) => tidy(position.split(':').slice(1).join(':'));
// "Calexico Neighborhood House – Mission Thrift Store…" -> "Mission Thrift Store…"
const companyDetail = (company: string) => tidy(company.split(' – ').slice(1).join(' – '));

// Engineering skills only; marketing tools stay on the record through the roles themselves.
const HIDDEN_SKILL_SUBJECTS = new Set(['Digital Marketing']);

// SDSU and ColorStack are listed in currentlyDoing as well as education/leadership;
// show each of them only once on this page.
const currentOnly = currentlyDoing.filter(
    (item) =>
        !education.some((e) => e.institution === item.company) &&
        !leadership.some((l) => l.company === item.company && l.position === item.position),
);

type TimelineItem = {
    key: string;
    time: string;
    title: string;
    org: React.ReactNode;
    focus?: string;
    description: string;
    tags: string[];
    tagLabel: string;
};

function Timeline({ items }: { items: TimelineItem[] }) {
    return (
        <ol>
            {items.map((item, i) => (
                <li key={item.key} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-3 pb-5 last:pb-0 md:grid-cols-[136px_18px_minmax(0,1fr)]">
                    <p className={`${mutedClass} hidden whitespace-nowrap pt-0.5 text-right md:block`}>{tidy(item.time)}</p>
                    <div className="relative flex justify-center" aria-hidden="true">
                        {i < items.length - 1 && <span className="absolute bottom-[-20px] top-3 w-px bg-[#0A0A23]/15" />}
                        <span className={`relative mt-1.5 h-3 w-3 rounded-full border-2 ${i === 0 ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[#0A0A23]/40 bg-white'}`} />
                    </div>
                    <div className="min-w-0">
                        <p className={`${mutedClass} md:hidden`}>{tidy(item.time)}</p>
                        <h3 className="font-sans text-base font-extrabold leading-snug text-[#0A0A23]">{item.title}</h3>
                        <p className="text-[13px]">
                            {item.org}
                            {item.focus && <span className="text-[#6e6e78]"> · {item.focus}</span>}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-relaxed">{tidy(item.description)}</p>
                        {item.tags.length > 0 && (
                            <details className="mt-1.5">
                                <summary className={toggleClass}>{item.tagLabel} ({item.tags.length})</summary>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {item.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-[#F3F3F5] px-2 py-0.5 text-xs text-[#0A0A23]">{tag}</span>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

const orgLink = (name: string, href?: string) =>
    href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>{name}</a>
    ) : (
        <span className="font-bold text-[#006400]">{name}</span>
    );

const earliestRoleYear = () => {
    const years = professionalExperience.flatMap((role) => (role.time.match(/\d{4}/g) ?? []).map(Number));
    return years.length ? Math.min(...years) : undefined;
};

export function ExperienceHeader({ className = '' }: { className?: string }) {
    const since = earliestRoleYear();
    return (
        <BentoTile className={className}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]">Experience</p>
            <h1 className="mt-1 font-sans text-2xl font-extrabold leading-tight text-[#0A0A23]">Career timeline</h1>
            <p className="mt-2 text-[13px] leading-relaxed">
                {professionalExperience.length} roles in industry &amp; research{since ? ` since ${since}` : ''}, newest first.
            </p>
            {profile.openTo && (
                <p className="mt-1 text-[13px]">
                    <span className="font-sans font-bold text-[#0A0A23]">Open to:</span> {profile.openTo}
                </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
                <a href={resume} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
                    ↓ Résumé (PDF)
                </a>
                <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
                    LinkedIn
                </a>
            </div>
        </BentoTile>
    );
}

export function ProfessionalTimeline() {
    return (
        <BentoTile label={`Professional experience · ${professionalExperience.length} roles`}>
            <Timeline
                items={professionalExperience.map((role) => ({
                    key: `${role.company}-${role.time}`,
                    time: role.time,
                    title: shortPosition(role.position),
                    org: orgLink(shortCompany(role.company), role.link),
                    focus: positionFocus(role.position) || companyDetail(role.company),
                    description: role.description,
                    tags: splitTech(role.tech),
                    tagLabel: 'Stack',
                }))}
            />
        </BentoTile>
    );
}

export function AlongsideTimeline() {
    const items = [...currentOnly, ...leadership];
    if (items.length === 0) return null;
    return (
        <BentoTile label="Alongside school · leadership & current programs">
            <Timeline
                items={items.map((item) => ({
                    key: `${item.company}-${item.position}`,
                    time: item.time,
                    title: tidy(item.position),
                    org: orgLink(item.company, item.link),
                    description: item.description,
                    tags: splitTech(item.tech),
                    tagLabel: 'Stack',
                }))}
            />
        </BentoTile>
    );
}

export function BeyondTech() {
    if (beyondTech.length === 0) return null;
    return (
        <BentoTile label="Beyond tech">
            <details>
                <summary className={toggleClass}>
                    {beyondTech.length} roles: {beyondTech.map((item) => item.title).join(', ')}
                </summary>
                <div className="mt-3">
                    <Timeline
                        items={beyondTech.map((item) => ({
                            key: item.title,
                            time: item.time,
                            title: item.title,
                            org: (
                                <>
                                    {orgLink(item.org, item.link)}
                                    {item.employers?.map((employer) => (
                                        <React.Fragment key={employer.name}>
                                            {' · '}
                                            <a href={employer.link} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                                                {employer.name}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                </>
                            ),
                            description: item.description,
                            tags: splitTech(item.skills),
                            tagLabel: 'Skills',
                        }))}
                    />
                </div>
            </details>
        </BentoTile>
    );
}

export function EducationTile() {
    return (
        <BentoTile label="Education">
            <ul>
                {education.map((item) => (
                    <li key={item.institution} className="border-b border-[#0A0A23]/10 py-2 text-[13px] first:pt-0 last:border-b-0 last:pb-0">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={entryLinkClass}>
                            {item.institution}
                        </a>
                        <span className="block text-xs">{item.course}</span>
                        <span className={mutedClass}>{tidy(item.time)}</span>
                    </li>
                ))}
            </ul>
        </BentoTile>
    );
}

export function SkillsTile() {
    return (
        <BentoTile label="Skills">
            <div className="flex flex-col gap-2.5">
                {techTools
                    .filter((group) => !HIDDEN_SKILL_SUBJECTS.has(group.subject))
                    .map((group) => (
                        <div key={group.subject}>
                            <p className="mb-1 font-sans text-xs font-bold text-[#0A0A23]">{group.subject}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {group.tools.map(({ tool, link }) => (
                                    <a
                                        key={tool}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-[#F3F3F5] px-2 py-0.5 text-xs text-[#0A0A23] transition-colors hover:bg-[#0A0A23] hover:text-white"
                                    >
                                        {tool}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </BentoTile>
    );
}

export function CertificatesTile() {
    return (
        <BentoTile label={`Certificates · ${certificates.length}`}>
            <ul className="flex flex-col gap-1.5 text-[13px]">
                {certificates.map((item) => (
                    <li key={item.title} className="leading-snug">
                        <a href={item.cert_link} target="_blank" rel="noopener noreferrer" className={entryLinkClass}>
                            {item.title}
                        </a>
                        <span className="text-xs text-[#6e6e78]"> · {item.institution.replace('Anthropic: ', '')}, {item.time}</span>
                    </li>
                ))}
            </ul>
        </BentoTile>
    );
}
