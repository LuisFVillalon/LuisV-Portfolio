'use client';
import Wrapper from '../Wrapper';
import HeroSection from './HeroSection';
import TechSection from './TechSection';
import ProjectCardsSection from './ProjectCardsSection';
import ExperienceSection from './ExperienceSection';
// import TestimonialSection from './TestimonialSection';
import SelfieSection from './SelfieSection';
import BlogSection from './BlogSection';
import CTASection from '../CTASection';

export default function Homebody() {
    return (
        <Wrapper>
            <div className="flex flex-col md:flex-row">
                <HeroSection/>
                <SelfieSection/>
            </div>
            <ExperienceSection/>
            {/* <TestimonialSection/> */}
            <TechSection/>
            <ProjectCardsSection/>
            <BlogSection/>
            <CTASection
                title={"Let’s Build Something Together"}
                description={"I’m a full-stack developer and computer science undergraduate who enjoys turning ideas into real, scalable products. If you’re working on something interesting, let’s talk."}
            />
        </Wrapper>
    );
}