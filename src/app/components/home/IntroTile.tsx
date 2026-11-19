import Image from 'next/image';
import { getAwardProjects, getProjectsByCategory } from '@/app/lib/projects';
import { professionalExperience, profile, resume } from '@/app/lib/experience';
import { linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import { GITHUB_URL } from '@/app/lib/contact';
import { BentoTile, primaryButtonClass, secondaryButtonClass } from './BentoTile';
import { isLiveApp } from './ProjectTile';

type Fact = { headline: string; detail: string };

// Proof stats are derived from the existing data so they stay in sync with it.
function getProofFacts(): Fact[] {
    const facts: Fact[] = [];
    const topProjects = getProjectsByCategory('top');

    const awards = getAwardProjects().flatMap((p) => (p.award ? [p.award] : []));
    if (awards.length > 1) {
        // Short form so both wins fit the chip: "1st · Swans Applied AI '26".
        const short = ({ title, event }: { title: string; event: string }) =>
            `${title.replace('First Place', '1st').replace(/ Project$/, '')} · ${event
                .replace(/ Hackathon/, '')
                .replace(/ (?:19|20)(\d{2})$/, " '$1")}`;
        facts.push({ headline: `🏆 ${awards.length}x Hackathon Winner`, detail: awards.map(short).join('; ') });
    } else if (awards.length === 1) {
        facts.push({ headline: `🏆 ${awards[0].title}`, detail: awards[0].event });
    }

    const years = professionalExperience.flatMap((role) => (role.time.match(/\d{4}/g) ?? []).map(Number));
    if (professionalExperience.length > 0) {
        facts.push({
            headline: `${professionalExperience.length} roles`,
            detail: years.length ? `industry & research since ${Math.min(...years)}` : 'industry & research',
        });
    }

    const live = topProjects.find(isLiveApp);
    if (live) {
        facts.push({ headline: 'Live app', detail: `${live.title}, in production` });
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
                CS student at <strong>San Diego State University</strong> (B.S., minor in Mathematics, May 2027). I build
                full-stack apps and applied-AI products, from a live productivity app to an agentic system for chip
                design. From Calexico, CA; bilingual EN/ES.
            </p>

            {facts.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {facts.map((fact) => (
                        <div key={fact.headline} className="min-w-0 rounded-xl bg-[#F3F3F5] px-2.5 py-2 lg:py-1.5">
                            <p className="font-sans text-[13px] lg:text-[14px] font-extrabold leading-tight text-[#0A0A23]">
                                {fact.headline}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#6e6e78]">{fact.detail}</p>
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
