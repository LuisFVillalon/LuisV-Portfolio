import Image from 'next/image';
import React from 'react';
import { BentoTile } from '../home/BentoTile';
import { ExternalLink, LogoBadge, LivePill, awardPillClass, tileLabelClass } from './AboutParts';
import { formatEnd, formatRange, formatStart, must, startYear } from './timelineDates';
import { certificates, education, leadership, professionalExperience, profile } from '@/app/lib/experience';
import { getAwardProjects, getProjectsByCategory } from '@/app/lib/projects';

type Milestone = {
    when: string;
    title: string;
    /** One milestone per bullet; dates go at the end of each line. */
    body: React.ReactNode[];
    extra?: React.ReactNode;
    /** The current, still-open milestone gets a dashed outline. */
    current?: boolean;
};

// Dates, the award, the live apps and the What's Poppin' live link are read from lib/experience.ts and lib/projects.ts.
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
    const colorStack = must(leadership, (l) => l.company === 'ColorStack', 'ColorStack');
    const kanso = must(topProjects, (p) => p.title === 'kanso', 'kanso');
    const whatsPoppin = must(getProjectsByCategory('fullstack'), (p) => p.title === 'Whats Poppin?', "What's Poppin'");
    const crashApp = must(getAwardProjects(), (p) => p.title === 'The Crash App', 'The Crash App award');

    return [
        {
            when: startYear(odin.time),
            title: 'Taught myself to code',
            body: [
                <>Front-end, back-end and SEO through free resources</>,
                <>
                    <ExternalLink href="https://www.theodinproject.com/">The Odin Project</ExternalLink>, Full Stack JavaScript ({formatRange(odin.time)})
                </>,
                <>
                    <ExternalLink href="https://www.freecodecamp.org/">freeCodeCamp</ExternalLink> certifications ({formatRange(freeCodeCamp.time)})
                </>,
                <>
                    <ExternalLink href="https://academy.hubspot.com/">HubSpot Academy</ExternalLink>
                </>,
            ],
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
            body: [
                <>A.S. in Computer Science: data structures, OOP, Java, assembly ({formatRange(ivc.time)})</>,
                <>
                    Built <ExternalLink href="https://github.com/LuisFVillalon/WhatsPoppin">What&apos;s Poppin&apos;</ExternalLink> (a Reddit-like
                    clone) as the final project for The Odin Project&apos;s JavaScript curriculum, live{' '}
                    <ExternalLink href="https://luisfvillalon.github.io/WhatsPoppin/">here</ExternalLink>
                </>,
            ],
            extra: (
                <div className="flex flex-col gap-3">
                    {whatsPoppin.live_app && (
                        <a href={whatsPoppin.live_app} target="_blank" rel="noopener noreferrer" className="self-start">
                            <LivePill>What&apos;s Poppin&apos; · Live</LivePill>
                        </a>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <LogoBadge src="/about/IVC_Logo.png" alt="Imperial Valley College logo" />
                        {whatsPoppin.live_app && (
                            <a
                                href={whatsPoppin.live_app}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl transition-opacity hover:opacity-80"
                            >
                                <LogoBadge src="/about/WhatsPoppin_Icon.png" alt="What's Poppin' logo" />
                            </a>
                        )}
                    </div>
                </div>
            ),
        },
        {
            when: startYear(ectron.time),
            title: 'First internships',
            body: [
                <>
                    <ExternalLink href={ectron.link}>Ectron Corporation</ExternalLink>, Software Engineer Intern ({formatRange(ectron.time)})
                </>,
                <>
                    <ExternalLink href={sportsExcitement.link}>Sports Excitement</ExternalLink>, Front-End Developer Intern (
                    {formatRange(sportsExcitement.time)})
                </>,
            ],
            extra: (
                <div className="flex flex-wrap gap-2">
                    <LogoBadge src="/about/Ectron_Logo.png" alt="Ectron Corporation logo" />
                    <LogoBadge src="/about/SportsExcitement_Logo.png" alt="Sports Excitement logo" />
                </div>
            ),
        },
        {
            when: startYear(sdsu.time),
            title: 'Transferred to San Diego State',
            body: [
                <>
                    SEO &amp; digital marketer, full time at{' '}
                    <ExternalLink href={neighborhoodHouse.link}>Calexico Neighborhood House</ExternalLink> ({formatRange(neighborhoodHouse.time)})
                </>,
                <>
                    Started a <strong>B.S. in Computer Science</strong> with a <strong>Minor in Mathematics</strong> at{' '}
                    <ExternalLink href="https://cs.sdsu.edu/">SDSU</ExternalLink> ({formatStart(sdsu.time)})
                </>,
                <>
                    Full-stack developer intern at the startup <ExternalLink href={secondCourse.link}>Second Course</ExternalLink> (
                    {formatRange(secondCourse.time)})
                </>,
                ...(crashApp.award
                    ? [
                          <>
                              {crashApp.award.title}, {crashApp.award.event}, with{' '}
                              <ExternalLink href={crashApp.github_repo}>{crashApp.title}</ExternalLink>
                          </>,
                      ]
                    : []),
            ],
            extra: (
                <div className="flex flex-col gap-3">
                    {crashApp.award && (
                        <span className={`${awardPillClass} self-start`}>
                            🏆 {crashApp.award.title} · {crashApp.award.event}
                        </span>
                    )}
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
                        sizes="240px"
                        className="h-36 w-auto self-start rounded-lg"
                    />
                </div>
            ),
        },
        {
            when: startYear(ai4Business.time),
            title: 'Applied AI',
            body: [
                <>
                    Undergraduate researcher at <ExternalLink href={ai4Business.link}>AI4Business Lab</ExternalLink>, studying AI agent safety
                    and adversarial robustness ({formatRange(ai4Business.time)})
                </>,
                <>
                    Mentored by <ExternalLink href={nxp.link}>NXP Semiconductors</ExternalLink>&apos; Design Automation team, helped build{' '}
                    <ExternalLink href={aace.github_repo}>AACE</ExternalLink>, an agentic system that fast-tracks semantic understanding of chip
                    designs ({formatRange(nxp.time)})
                </>,
                <>
                    Won first place at the Swans Applied AI Hackathon by building <ExternalLink href={ross.github_repo}>ROSS</ExternalLink>,
                    beating 60+ teams
                </>,
                <>
                    Completed <ExternalLink href={codePath.institution_link}>CodePath</ExternalLink>&apos;s AI201: Applications of AI Engineering ({formatRange(codePath.time)})
                </>,
            ],
            extra: (
                <div className="flex flex-col gap-3">
                    {ross.award && (
                        <span className={`${awardPillClass} self-start`}>
                            🏆 {ross.award.title} · {ross.award.event}
                        </span>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <Image
                            src="/about/ross-hackathon-stage.jpg"
                            alt="Luis and the ROSS team accepting first place at the Swans Applied AI Hackathon 2026"
                            width={377}
                            height={439}
                            sizes="240px"
                            className="h-36 w-auto rounded-lg"
                        />
                        <Image
                            src="/about/applied-ai-team.jpg"
                            alt="Luis with his team"
                            width={718}
                            height={433}
                            sizes="240px"
                            className="h-36 w-auto rounded-lg"
                        />
                    </div>
                </div>
            ),
        },
        {
            when: 'Now',
            title: 'Building, leading, and job hunting',
            body: [
                <>
                    Developing {kanso.live_app ? <ExternalLink href={kanso.live_app}>kanso</ExternalLink> : <strong>kanso</strong>}, a digital
                    clarity notebook
                </>,
                <>
                    Serving as <ExternalLink href={colorStack.link}>ColorStack</ExternalLink> SDSU chapter Outreach Chair (
                    {formatStart(colorStack.time)} – Present)
                </>,
                <>
                    Graduating <strong>{formatEnd(sdsu.time)}</strong>
                    {profile.openTo && (
                        <>
                            {' '}and seeking <strong>{profile.openTo}</strong>
                        </>
                    )}
                </>,
            ],
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
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] leading-relaxed marker:text-[#22c55e]">
                                {m.body.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            {m.extra && <div className="mt-3">{m.extra}</div>}
                        </BentoTile>
                    </li>
                ))}
            </ol>
        </section>
    );
}
