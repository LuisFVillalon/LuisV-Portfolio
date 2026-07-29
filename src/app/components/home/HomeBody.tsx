'use client';
import Wrapper from '../Wrapper';
import HeroSection from './HeroSection';
// import TechSection from './TechSection';
import ProjectCardsSection from './ProjectCardsSection';
import ExperienceSection from './ExperienceSection';
import SelfieSection from './SelfieSection';
import BlogSection from './BlogSection';
import CTASection from '../CTASection';
import { MarkdownBlogPost } from '@/app/lib/markdownBlogs';

interface HomebodyProps {
    posts: MarkdownBlogPost[];
}

export default function Homebody({ posts }: HomebodyProps) {
    return (
        <Wrapper>
            <div className="flex flex-col md:flex-row">
                <HeroSection/>
                <SelfieSection/>
            </div>
            <ExperienceSection/>
            {/* <TechSection/> */}
            <ProjectCardsSection/>
            <BlogSection posts={posts}/>
            <CTASection
                title={"Let’s Build Something Together"}
                description={"I’m a full-stack developer and computer science undergraduate who enjoys turning ideas into real, scalable products. If you’re working on something interesting, let’s talk."}
            />
        </Wrapper>
    );
}