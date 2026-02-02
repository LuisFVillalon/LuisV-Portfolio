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
        <div className='mt-2 flex flex-col space-y-8'>
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
                        I am a third year computer science undergraduate student at San Diego State University 
                        with experience in full-stack development. I am passionate about serving the public through
                        building digital products that drive community and push productivity.
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
                <div className="flex flex-col ">
                        <select
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            className="font-sans  font-bold text-base bg-[#0A0A23] text-[#EEEEEE] w-full rounded-lg py-1 border-2 border-gray-500"
                        >
                            {SECTIONS.map((section) => (
                                <option key={section.value} value={section.value}>{section.label}</option>
                            ))}
                        </select>
                </div>
                <div className=" text-[#333333]">
                        {ActiveSection && <ActiveSection />}
                </div>    
            </div>
        </div>
    );
}