import React from 'react';
import { BentoTile } from '../home/BentoTile';
import { ExternalLink, LogoBadge, LivePill, awardPillClass, tileLabelClass } from './AboutParts';
import { formatEnd, formatRange, formatStart, must, startYear } from './timelineDates';
import { certificates, currentlyDoing, education, professionalExperience, profile } from '@/app/lib/experience';
import { getProjectsByCategory } from '@/app/lib/projects';

type Milestone = {
    when: string;
    title: string;
    body: React.ReactNode;
    extra?: React.ReactNode;
    /** The current, still-open milestone gets a dashed outline. */
    current?: boolean;
};

// Dates, the award and the live app are read from lib/experience.ts and lib/projects.ts.
function getMilestones(): Milestone[] {
    const odin = must(education, (e) => e.institution === 'The Odin Project', 'The Odin Project');
    const ivc = must(education, (e) => e.institution === 'Imperial Valley College', 'Imperial Valley College');
    const sdsu = must(education, (e) => e.institution === 'San Diego State University', 'San Diego State University');
    const freeCodeCamp = must(certificates, (c) => c.institution === 'freeCodeCamp', 'freeCodeCamp certificate');
    const role = (company: string) => must(professionalExperience, (r) => r.company === company, company);
    const ectron = role('Ectron Corporation');
    const sportsExcitement = role('Sports Excitement');
    const secondCourse = role('Second Course');
    const ai4Business = role('AI4Business Lab');
    const codePath = must(currentlyDoing, (c) => c.company === 'CodePath', 'CodePath');
    const topProjects = getProjectsByCategory('top');
    const ross = must(topProjects, (p) => p.title === 'ROSS' && Boolean(p.award), 'ROSS award');
    const kanso = must(topProjects, (p) => p.title === 'kanso', 'kanso');

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
            body: <>A.S. in Computer Science ({formatRange(ivc.time)}): data structures, OOP, Java, assembly.</>,
            extra: <LogoBadge src="/about/IVC_Logo.png" alt="Imperial Valley College logo" />,
        },
        {
            when: startYear(ectron.time),
            title: 'First internships',
            body: (
                <>
                    <strong>Ectron Corporation</strong>, Software Engineer Intern ({formatRange(ectron.time)}), then{' '}
                    <strong>Sports Excitement</strong>, Front-End Developer Intern ({formatRange(sportsExcitement.time)}).
                </>
            ),
        },
        {
            when: startYear(sdsu.time),
            title: 'Transferred to San Diego State',
            body: (
                <>
                    Started the <strong>B.S. in Computer Science</strong> at{' '}
                    <ExternalLink href="https://cs.sdsu.edu/">SDSU</ExternalLink> ({formatStart(sdsu.time)}), after SEO &amp;
                    digital-marketing work for Calexico Neighborhood House. Full-stack intern at <strong>Second Course</strong>{' '}
                    ({formatRange(secondCourse.time)}).
                </>
            ),
            extra: <LogoBadge src="/about/San_Diego_State_Aztecs_logo.svg.png" alt="SDSU logo" />,
        },
        {
            when: startYear(ai4Business.time),
            title: 'Agentic AI',
            body: (
                <>
                    Undergraduate researcher at <strong>AI4Business Lab</strong>, NXP&apos;s Agentic AI in the Cloud bootcamp, and{' '}
                    <strong>ROSS</strong>, which won first place at the Swans Applied AI Hackathon, beating 60+ teams.
                </>
            ),
            extra: ross.award && (
                <span className={awardPillClass}>
                    🏆 {ross.award.title} · {ross.award.event}
                </span>
            ),
        },
        {
            when: 'Now',
            title: 'Building, leading, and job hunting',
            body: (
                <>
                    <strong>kanso</strong>, my full-stack tasks/notes/habits app, is live. Taking CodePath&apos;s AI201 (
                    {formatRange(codePath.time)}) and serving as ColorStack Outreach Chair. I am currently exploring careers in{' '}
                    <strong>Full-Stack</strong> and <strong>Agentic Systems</strong> development and <strong>Cybersecurity</strong>.
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
