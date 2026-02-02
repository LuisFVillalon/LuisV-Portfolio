import {
    currentlyDoing,
    leadership,
    professionalExperience,
    education,
    certificates,
    techTools,
} from '../../lib/experience'; // adjust path if needed


// ─── SHARED ENTRY CARD ───────────────────────────────────────────────────────

function EntryCard({
    title,
    titleLink,
    subtitle,
    time,
    description,
    footerLabel,
    footerContent,
}: {
    title: string;
    titleLink?: string;
    subtitle: string;
    time: string;
    description: string;
    footerLabel: string;
    footerContent: React.ReactNode;
}) {
    return (
        <div>
            {titleLink ? (
                <a
                    className="font-sans text-[#006400] underline mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold"
                    href={titleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {title}
                </a>
            ) : (
                <p className="font-sans mb-[5%] md:mb-[0%] text-lg md:text-xl font-bold">{title}</p>
            )}

            <div className="text-base md:text-lg flex justify-between mb-[2%] md:mb-[1%]">
                <p className="text-[#0A0A23] w-[60%] dm-serif-text-regular-italic font-semibold">{subtitle}</p>
                <p className="text-end w-[40%]">{time}</p>
            </div>

            {description && <p className="text-base">{description}</p>}

            <p className="text-base mt-[3%] md:mt-[1%]">
                <strong>{footerLabel}:</strong> {footerContent}
            </p>

            <div className="my-[5%] md:my-[2%] border-b border-gray-250"></div>
        </div>
    );
}


// ─── EXPERIENCE SECTIONS (currentlyDoing, leadership, professionalExperience) ─
// All three share the same shape: { company, position, time, description, tech, link }

type ExperienceItem = {
    company: string;
    position: string;
    time: string;
    description: string;
    tech: string;
    link: string;
};

function ExperienceSection({ items }: { items: ExperienceItem[] }) {
    return (
        <div>
            {items.map((item, index) => (
                <EntryCard
                    key={index}
                    title={item.company}
                    titleLink={item.link}
                    subtitle={item.position}
                    time={item.time}
                    description={item.description}
                    footerLabel="Tech"
                    footerContent={item.tech}
                />
            ))}
        </div>
    );
}

export function CurrentlyDoing() {
    return <ExperienceSection items={currentlyDoing} />;
}

export function Leadership() {
    return <ExperienceSection items={leadership} />;
}

export function ProfessionalExperience() {
    return <ExperienceSection items={professionalExperience} />;
}


// ─── EDUCATION ───────────────────────────────────────────────────────────────

export function Education() {
    return (
        <div>
            {education.map((item, index) => (
                <EntryCard
                    key={index}
                    title={item.institution}
                    titleLink={item.link}
                    subtitle={item.course}
                    time={item.time}
                    description={item.description}
                    footerLabel="Tech"
                    footerContent={item.tech}
                />
            ))}
        </div>
    );
}


// ─── CERTIFICATES ────────────────────────────────────────────────────────────

export function Certificates() {
    return (
        <div>
            {certificates.map((item, index) => (
                <EntryCard
                    key={index}
                    title={item.title}
                    titleLink={item.cert_link}
                    subtitle={item.institution}
                    time={item.time}
                    description={item.description}
                    footerLabel="Tech"
                    footerContent={item.tech}
                />
            ))}
        </div>
    );
}


// ─── TECH TOOLS ──────────────────────────────────────────────────────────────

export function TechTools() {
    return (
        <div>
            {techTools.map((item, index) => (
                <div key={index}>
                    <div className="grid grid-cols-2">
                        <p className="font-sans mb-[0%] text-lg md:text-xl font-bold">{item.subject}:</p>
                        <div className="flex flex-wrap">
                            {item.tools.map((tech_item, i) => (
                                <p key={i} className="text-base mt-[3%] md:mt-[1%] text-[#006400]">
                                    <a href={tech_item.link} className="underline" target="_blank" rel="noopener noreferrer">
                                        {tech_item.tool}
                                    </a>
                                    {i < item.tools.length - 1 && ',\u00A0'}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="my-[5%] md:my-[1%] border-b border-gray-250"></div>
                </div>
            ))}
        </div>
    );
}


// ─── EXPERIENCE BEYOND TECH ─────────────────────────────────────────────────

export function ExperienceBeyondTech() {
    return (
        <div>
            <EntryCard
                title="After School Enrichment Tutor"
                titleLink="https://www.cusdk12.org/departments/educational-services/after-school-program/index.html"
                subtitle="SPARKS, Calexico Unified School District"
                time="Dec 2023 - May 2024"
                description="Led engaging after-school enrichment classes on science, technology, engineering, art, and math (STEAM), fostering curiosity and hands-on learning for students."
                footerLabel="Skills"
                footerContent="Leadership, Creativity, Adaptability, Communication, Problem-Solving, Organization, Engagement, Mentorship, Collaboration"
            />

            <EntryCard
                title="Sales"
                subtitle="Retail Industry"
                time="1+ year"
                description="Tracked sales performance and consistently met daily goals by engaging customers, driving purchases, and optimizing retail sales strategies."
                footerLabel="Employers"
                footerContent={
                    <>
                        <a href="https://www.garlans.com" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">Garlan&apos;s</a>
                        {', '}
                        <a href="https://www.aeropostale.com" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">Aeropostale</a>
                    </>
                }
            />

            <EntryCard
                title="Emergency Medical Technician"
                titleLink="https://www.amr.net/"
                subtitle="American Medical Response"
                time="Feb 2022 - Sept 2022"
                description="Provided emergency medical care and basic life support during 911 calls and interfacility transports, ensuring patient stability and safety."
                footerLabel="Skills"
                footerContent="Emergency Response, Patient Care, First Aid, Critical Thinking, Teamwork, Stress Management, Assessment"
            />

            <EntryCard
                title="Customer Service"
                subtitle="Food Service Industry"
                time="3+ years"
                description="Gained hands-on experience in fast-paced food service environments, providing customer service, preparing food, and working efficiently as part of a team."
                footerLabel="Employers"
                footerContent={
                    <>
                        <a href="https://aftersicecream.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">After&apos;s</a>
                        {', '}
                        <a href="https://www.elfogonmexgrill.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">El Fogon</a>
                        {', '}
                        <a href="https://www.kfc.com" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">KFC</a>
                        {', '}
                        <a href="https://www.habitburger.com" target="_blank" rel="noopener noreferrer" className="underline text-[#006400]">The Habit</a>
                    </>
                }
            />
        </div>
    );
}
