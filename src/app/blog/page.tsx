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
        <BlogList posts={posts} />
        <CTASection
          title={"Let’s Learn and Build Together"}
          description={"Always learning. Always building."}
        />
      </Wrapper>
      <Footer />
    </div>
  );
}
