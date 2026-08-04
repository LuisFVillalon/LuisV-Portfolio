'use client';
import Wrapper from '../Wrapper';
import HeroSection from './HeroSection';
// import TechSection from './TechSection';
import ProjectCardsSection from './ProjectCardsSection';
import ExperienceSection from './ExperienceSection';
import SelfieSection from './SelfieSection';
import BlogSection from './BlogSection';
import LinkedInSection from './LinkedInSection';
import CTASection from '../CTASection';
import { SectionCard } from '../Cards/SectionCard';
import { MarkdownBlogPost } from '@/app/lib/markdownBlogs';

interface HomebodyProps {
    posts: MarkdownBlogPost[];
}

export default function Homebody({ posts }: HomebodyProps) {
    return (
        <Wrapper>
            <section className="flex flex-col gap-6 py-8 md:py-12">

                {/* ── Hero ── */}
                <SectionCard className="flex flex-col md:flex-row items-center gap-6">
                    <HeroSection/>
                    <SelfieSection/>
                </SectionCard>

                {/* ── About & Experience preview ── */}
                <SectionCard>
                    <ExperienceSection/>
                </SectionCard>

                {/* <TechSection/> */}

                {/* ── Featured projects ── */}
                <SectionCard>
                    <ProjectCardsSection/>
                </SectionCard>

                {/* ── Latest blog posts ── */}
                <SectionCard>
                    <BlogSection posts={posts}/>
                </SectionCard>

                {/* ── Latest LinkedIn posts ── */}
                <SectionCard>
                    <LinkedInSection/>
                </SectionCard>

            </section>

            <CTASection
                title={"Let’s Build Something Together"}
                description={"I’m a full-stack developer and computer science undergraduate who enjoys turning ideas into real, scalable products. If you’re working on something interesting, let’s talk."}
            />
        </Wrapper>
    );
}