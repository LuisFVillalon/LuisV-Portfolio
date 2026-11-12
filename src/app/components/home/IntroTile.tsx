import Image from 'next/image';
import { getProjectsByCategory } from '@/app/lib/projects';
import { professionalExperience, profile, resume } from '@/app/lib/experience';
import { linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import { BentoTile, primaryButtonClass, secondaryButtonClass } from './BentoTile';
import { isLiveApp } from './ProjectTile';

const GITHUB_URL = 'https://github.com/LuisFVillalon';

type Fact = { headline: string; detail: string };

// Proof stats are derived from the existing data so they stay in sync with it.
function getProofFacts(): Fact[] {
    const facts: Fact[] = [];
    const topProjects = getProjectsByCategory('top');

    const awarded = topProjects.find((p) => p.award);
    if (awarded?.award) {
        facts.push({ headline: `🏆 ${awarded.award.title}`, detail: awarded.award.event });
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
        <BentoTile className="md:col-span-2 lg:row-span-2 flex flex-col justify-center gap-4 lg:p-7">
            <div className="flex items-center gap-4">
                <Image
                    src="/selfie.JPG"
                    alt="Luis Villalon headshot"
                    width={208}
                    height={208}
                    priority
                    className="h-[76px] w-[76px] lg:h-[104px] lg:w-[104px] flex-none rounded-2xl object-cover"
                />
                <div className="min-w-0">
                    <h1 className="font-sans text-2xl lg:text-4xl font-extrabold leading-tight text-[#0A0A23]">
                        Luis Fernando Villalón
                    </h1>
                    <p className="mt-1 font-sans text-sm font-bold text-[#006400]">
                        Software Engineer · Full-Stack · Agentic AI
                    </p>
                </div>
            </div>

            <p className="text-sm leading-relaxed">
                CS student at <strong>San Diego State University</strong> (B.S., May 2027). I build full-stack
                web apps and agentic AI systems, from a live productivity app to a first-place legal-AI
                hackathon project. From Calexico, CA; bilingual EN/ES.
            </p>

            {facts.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {facts.map((fact) => (
                        <div key={fact.headline} className="min-w-0 rounded-xl bg-[#F3F3F5] px-2.5 py-2">
                            <p className="font-sans text-[13px] lg:text-[15px] font-extrabold leading-tight text-[#0A0A23]">
                                {fact.headline}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#6e6e78]">{fact.detail}</p>
                        </div>
                    ))}
                </div>
            )}

            {profile.openTo && (
                <p className="text-sm">
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
