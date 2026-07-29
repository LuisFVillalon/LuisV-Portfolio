'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  CurrentlyDoing, 
  Education, 
  ProfessionalExperience, 
  Certificates, 
  TechTools, 
  Leadership,
  ExperienceBeyondTech
} from '../experience/ExperienceComponents';

const SECTIONS = [
    { value: "currently doing",         label: "Currently Doing",          Component: CurrentlyDoing },
    { value: "education",               label: "Education",                Component: Education },
    { value: "tech tools",              label: "Tech Tools",               Component: TechTools },
    { value: "professional experience", label: "Professional Experience",  Component: ProfessionalExperience },
    { value: "leadership",              label: "Leadership",               Component: Leadership },
    { value: "certificates",            label: "Certificates",             Component: Certificates },
    { value: "experience beyond tech",  label: "Experience Beyond Tech",   Component: ExperienceBeyondTech },
];


export default function ExperienceSection() {
    const [selectedValue, setSelectedValue] = useState("currently doing");
    const ActiveSection = SECTIONS.find(s => s.value === selectedValue)?.Component;    
    return (
        <div className='flex flex-col space-y-8'>
            <div className='flex flex-col space-y-2'>
                <Link href="/about">
                        <p className="text-[#0A0A23] text-center font-sans font-bold
                            hover:font-black
                            hover:cursor-pointer
                            hover:underline
                            hover:text-[#006400] transition-colors
                            text-xl
                        ">
                            About Me
                        </p>
                </Link>
                <p className="text-center text-base text-[#333333]">
                    I am a fourth-year Computer Science undergraduate student at San Diego State University
                    with experience in full-stack development and a growing focus on DevOps and agentic AI systems.
                    I am passionate about serving the public through building digital applications that strengthen
                    communities and improve productivity.
                </p>
            </div>
            <div className='flex flex-col space-y-4'>
                <Link href="/experience">
                        <p className="text-[#0A0A23] text-center font-sans font-bold
                            hover:font-black
                            hover:cursor-pointer
                            hover:underline
                            hover:text-[#006400] transition-colors
                            text-xl
                        ">
                            Experience
                        </p>
                </Link>
                <div className="flex flex-wrap justify-center gap-2">
                    {SECTIONS.map((section) => {
                        const isActive = selectedValue === section.value;
                        return (
                            <button
                                key={section.value}
                                onClick={() => setSelectedValue(section.value)}
                                className={`font-sans text-sm font-bold rounded-full px-4 py-2 transition-all duration-150 ${
                                    isActive
                                        ? "bg-[#0A0A23] text-[#EEEEEE]"
                                        : "bg-white text-[#0A0A23] border-2 border-[#0A0A23]/20 hover:border-[#0A0A23]/60"
                                }`}
                            >
                                {section.label}
                            </button>
                        );
                    })}
                </div>
                <div className=" text-[#333333]">
                        {ActiveSection && <ActiveSection />}
                </div>
            </div>
        </div>
    );
}