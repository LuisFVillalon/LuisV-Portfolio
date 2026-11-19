import Image from 'next/image';
import React from 'react';
import { BentoTile } from '../home/BentoTile';
import { ExternalLink, LogoBadge, LivePill, ProjectThumb, awardPillClass, tileLabelClass } from './AboutParts';
import { formatEnd, formatRange, formatStart, must, startYear } from './timelineDates';
import { certificates, education, professionalExperience, profile } from '@/app/lib/experience';
import { getAwardProjects, getProjectsByCategory } from '@/app/lib/projects';

type Milestone = {
    when: string;
    title: string;
    body: React.ReactNode;
    extra?: React.ReactNode;
    /** The current, still-open milestone gets a dashed outline. */
    current?: boolean;
};

// Dates, the award, the live apps and the What's Poppin' screenshot are read from lib/experience.ts and lib/projects.ts.
function getMilestones(): Milestone[] {
    const odin = must(education, (e) => e.institution === 'The Odin Project', 'The Odin Project');
    const ivc = must(education, (e) => e.institution === 'Imperial Valley College', 'Imperial Valley College');
    const sdsu = must(education, (e) => e.institution === 'San Diego State University', 'San Diego State University');
    const freeCodeCamp = must(certificates, (c) => c.institution === 'freeCodeCamp', 'freeCodeCamp certificate');
    const role = (company: string) => must(professionalExperience, (r) => r.company === company, company);
    const ectron = role('Ectron Corporation');
    const sportsExcitement = role('Sports Excitement');
    const secondCourse = role('Second Course');
    const neighborhoodHouse = must(professionalExperience, (r) => r.company.startsWith('Calexico Neighborhood House'), 'Calexico Neighborhood House');
    const ai4Business = role('AI4Business Lab');
    const codePath = must(certificates, (c) => c.institution === 'CodePath' && c.title.startsWith('AI201'), 'CodePath AI201');
    const topProjects = getProjectsByCategory('top');
    const ross = must(topProjects, (p) => p.title === 'ROSS' && Boolean(p.award), 'ROSS award');
    const aace = must(topProjects, (p) => p.title.endsWith('(AACE)'), 'AACE');
    const nxp = must(education, (e) => e.institution === 'NXP Semiconductors', 'NXP Semiconductors');
    const kanso = must(topProjects, (p) => p.title === 'kanso', 'kanso');
    const whatsPoppin = must(getProjectsByCategory('fullstack'), (p) => p.title === 'Whats Poppin?', "What's Poppin'");
    const crashApp = must(getAwardProjects(), (p) => p.title === 'The Crash App', 'The Crash App award');

    return [
        {
            when: startYear(odin.time),
            title: 'Taught myself to code',
            body: (
                <>
                    Front-end, back-end and SEO through free resources:{' '}
                    <ExternalLink href="https://www.theodinproject.com/">The Odin Project</ExternalLink> (Full Stack JavaScript,{' '}
                    {formatRange(odin.time)}), <ExternalLink href="https://www.freecodecamp.org/">freeCodeCamp</ExternalLink>{' '}
                    certifications ({formatRange(freeCodeCamp.time)}) and{' '}
                    <ExternalLink href="https://academy.hubspot.com/">HubSpot Academy</ExternalLink>.
                </>
            ),
            extra: (
                <div className="flex flex-wrap gap-2">
                    <LogoBadge src="/about/TOP_Logo.png" alt="The Odin Project logo" />
                    <LogoBadge src="/about/FreeCodeCamp_logo.svg.png" alt="freeCodeCamp logo" />
                    <LogoBadge src="/about/HubSpot_Logo.png" alt="HubSpot Academy logo" />
                </div>
            ),
        },
        {
            when: startYear(ivc.time),
            title: 'Imperial Valley College',
            body: (
                <>
                    A.S. in Computer Science ({formatRange(ivc.time)}): data structures, OOP, Java, assembly. Finished my final
                    project for The Odin Project&apos;s JavaScript curriculum with{' '}
                    <ExternalLink href="https://github.com/LuisFVillalon/WhatsPoppin">What&apos;s Poppin&apos;</ExternalLink>, live{' '}
                    <ExternalLink href="https://luisfvillalon.github.io/WhatsPoppin/">here</ExternalLink>.
                </>
            ),
            extra: (
                <div className="flex flex-wrap gap-2">
                    <LogoBadge src="/about/IVC_Logo.png" alt="Imperial Valley College logo" />
                    {whatsPoppin.live_app && (
                        <ProjectThumb
                            href={whatsPoppin.live_app}
                            src={whatsPoppin.image}
                            alt="What's Poppin' screenshot (opens the live app)"
                        />
                    )}
                </div>
            ),
        },
        {
            when: startYear(ectron.time),
            title: 'First internships',
            body: (
                <>
                    <ExternalLink href={ectron.link}>Ectron Corporation</ExternalLink>, Software Engineer Intern ({formatRange(ectron.time)}), then{' '}
                    <ExternalLink href={sportsExcitement.link}>Sports Excitement</ExternalLink>, Front-End Developer Intern ({formatRange(sportsExcitement.time)}).
                </>
            ),
            extra: (
                <div className="flex flex-wrap gap-2">
                    <LogoBadge src="/about/Ectron_Logo.png" alt="Ectron Corporation logo" />
                    {/* Sports Excitement logo goes here once provided: <LogoBadge src="/about/…" alt="Sports Excitement logo" /> */}
                </div>
            ),
        },
        {
            when: startYear(sdsu.time),
            title: 'Transferred to San Diego State',
            body: (
                <>
                    Started the <strong>B.S. in Computer Science</strong> with a <strong>Minor in Mathematics</strong> at{' '}
                    <ExternalLink href="https://cs.sdsu.edu/">SDSU</ExternalLink> ({formatStart(sdsu.time)}), after SEO &amp;
                    digital-marketing work for{' '}
                    <ExternalLink href={neighborhoodHouse.link}>Calexico Neighborhood House</ExternalLink> (
                    {formatRange(neighborhoodHouse.time)}). Worked full time the summer before transferring. Full-stack
                    intern at the startup <ExternalLink href={secondCourse.link}>Second Course</ExternalLink> (
                    {formatRange(secondCourse.time)}).
                    {crashApp.award && (
                        <>
                            {' '}Won {crashApp.award.title} at the {crashApp.award.event} with{' '}
                            <ExternalLink href={crashApp.github_repo}>{crashApp.title}</ExternalLink>.
                        </>
                    )}
                </>
            ),
            extra: (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <LogoBadge src="/about/San_Diego_State_Aztecs_logo.svg.png" alt="SDSU logo" />
                        <LogoBadge src="/about/CNH_Logo.png" alt="Calexico Neighborhood House logo" />
                        <LogoBadge src="/about/SecondCourse_Logo.png" alt="Second Course logo" />
                    </div>
                    <Image
                        src="/blog/blog_06/4.png"
                        alt="Luis and teammates receiving awards at a hackathon"
                        width={2048}
                        height={1361}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="h-64 w-full rounded-xl object-cover sm:w-1/2"
                    />
                </div>
            ),
        },
        {
            when: startYear(ai4Business.time),
            title: 'Applied AI',
            body: (
                <>
                    Undergraduate researcher at <ExternalLink href={ai4Business.link}>AI4Business Lab</ExternalLink>, studying AI agent
                    safety and adversarial robustness. Built <ExternalLink href={aace.github_repo}>AACE</ExternalLink> in{' '}
                    <ExternalLink href={nxp.link}>NXP Semiconductors</ExternalLink>&apos; Agentic AI in the Cloud bootcamp, and won first
                    place at the Swans Applied AI Hackathon by building <ExternalLink href={ross.github_repo}>ROSS</ExternalLink>, beating
                    60+ teams.
                </>
            ),
            extra: (
                <div className="flex flex-col gap-3">
                    {ross.award && (
                        <span className={`${awardPillClass} self-start`}>
                            🏆 {ross.award.title} · {ross.award.event}
                        </span>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Image
                            src="/about/ross-hackathon-stage.jpg"
                            alt="Luis and the ROSS team accepting first place at the Swans Applied AI Hackathon 2026"
                            width={377}
                            height={439}
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="h-64 w-full rounded-xl object-cover"
                        />
                        <Image
                            src="/about/applied-ai-team.jpg"
                            alt="Luis with his team"
                            width={718}
                            height={433}
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="h-64 w-full rounded-xl object-cover"
                        />
                    </div>
                </div>
            ),
        },
        {
            when: 'Now',
            title: 'Building, leading, and job hunting',
            body: (
                <>
                    <strong>kanso</strong>, my full-stack tasks/notes/habits app, is live. Completed CodePath&apos;s AI201 (
                    {formatRange(codePath.time)}), and I&apos;m serving as ColorStack Outreach Chair. I am currently exploring careers in{' '}
                    <strong>Full-Stack</strong> and <strong>Applied AI</strong> development and <strong>Cybersecurity</strong>.
                    I graduate in{' '}
                    <strong>{formatEnd(sdsu.time)}</strong>
                    {profile.openTo ? (
                        <>
                            {' '}and I&apos;m looking for <strong>{profile.openTo}</strong>.
                        </>
                    ) : (
                        '.'
                    )}
                </>
            ),
            extra: kanso.live_app && (
                <a href={kanso.live_app} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <LivePill>{kanso.title} · Live</LivePill>
                </a>
            ),
            current: true,
        },
    ];
}

export default function StoryTimeline() {
    const milestones = getMilestones();

    return (
        <section aria-labelledby="how-i-got-here">
            <h2 id="how-i-got-here" className={`mb-3 mt-8 px-1 ${tileLabelClass}`}>
                How I got here
            </h2>
            <ol className="relative ml-3 border-l-2 border-[#0A0A23]/10 md:ml-[5.5rem]">
                {milestones.map((m) => (
                    <li key={m.title} className="relative mb-4 pl-6 last:mb-0">
                        <span
                            className={`absolute -left-[9px] top-5 h-4 w-4 rounded-full border-2 ${
                                m.current
                                    ? 'border-dashed border-[#22c55e] bg-white'
                                    : 'border-white bg-[linear-gradient(to_right,#22c55e,#3b82f6)]'
                            }`}
                            aria-hidden="true"
                        />
                        <p className="mb-1 font-sans text-xs font-extrabold text-[#006400] md:absolute md:-left-[5.5rem] md:top-[18px] md:w-[4.5rem] md:text-right">
                            {m.when}
                        </p>
                        <BentoTile className={m.current ? 'border-dashed border-[#22c55e] bg-[#f4fbf6]' : ''}>
                            <h3 className="font-sans text-base font-extrabold text-[#0A0A23]">{m.title}</h3>
                            <p className="mt-1 text-[13px] leading-relaxed">{m.body}</p>
                            {m.extra && <div className="mt-3">{m.extra}</div>}
                        </BentoTile>
                    </li>
                ))}
            </ol>
        </section>
    );
}
