import React from 'react';
import Navbar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
import Footer from '../components/Footer';
import BlogList from '../components/blog/BlogList';
import CTASection from '../components/CTASection';
import { getAllMarkdownBlogPosts } from '../lib/markdownBlogs';

export default function Contact(): React.ReactElement {
  const posts = getAllMarkdownBlogPosts();

  return (
    <div className="font-[Monospace] flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <Wrapper>
        <section className="flex flex-col gap-6 py-8 md:py-12">

          {/* ── Title ── */}
          <div className="text-center md:text-left">
            <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-[#0A0A23]">Professional Developer Blog</h1>
            <p className="mt-2 text-base md:text-lg text-[#B3B3B3] font-sans font-bold">
              Insights, tutorials, and tips on web development, design, and technology
            </p>
          </div>

          <BlogList posts={posts} />

        </section>

        <CTASection
          title={"Let’s Learn and Build Together"}
          description={"Always learning. Always building."}
        />
      </Wrapper>
      <Footer />
    </div>
  );
}
