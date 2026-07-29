import React from 'react';
import Navbar from '../../components/NavBar';
import Wrapper from '../../components/Wrapper';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import { getMarkdownBlogPostById, extractTableOfContents } from '@/app/lib/markdownBlogs';
import { slugifyHeading } from '@/app/lib/blogTypes';
import TableOfContents from '@/app/components/blog/TableOfContents';
import ScrollToTop from '@/app/components/blog/ScrollToTop';
import CTASection from '@/app/components/CTASection';
import { SectionCard } from '@/app/components/Cards/SectionCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

function getHeadingText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      if (typeof child === 'number') return String(child);
      if (React.isValidElement(child)) {
        const props = child.props as { children?: React.ReactNode };
        return getHeadingText(props.children);
      }
      return '';
    })
    .join('');
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Post({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const selectedPost = getMarkdownBlogPostById(Number(slug));

  if (!selectedPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Post not found.</p>
      </div>
    );
  }

  const { toc, content } = extractTableOfContents(selectedPost.content);

  return (
    <div className="font-[Monospace] flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <ScrollToTop />
      <Wrapper>
        <section className="flex flex-col gap-6 py-8 md:py-12">

          {/* ── Hero ── */}
          <SectionCard className="!p-0 overflow-hidden">
            <div className="bg-[#0A0A23] px-6 md:px-10 py-10 md:py-14 flex flex-col justify-end">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-[#006400] text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                  {selectedPost.category}
                </span>
                <Link href="/blog/">
                  <button
                    className="
                      text-lg p-2 rounded-md
                      text-white shadow-lg
                      transition-all duration-150
                      hover:shadow-xl hover:-translate-y-1
                      border-b-4 border-r-2 border-green-900
                      active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                      font-sans
                    "
                    style={{ background: 'linear-gradient(to right, #22c55e, #3b82f6)' }}
                  >
                    <i className="ml-[1%] fas fa-arrow-left"></i>
                  </button>
                </Link>
              </div>

              {/* Title */}
              <h1 className="font-sans text-2xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-[#B3B3B3]">
                <div className="flex items-center gap-2">
                  <User className="text-[#006400]" size={18} />
                  <span className="font-medium">{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-[#006400]" size={18} />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-[#006400]" size={18} />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Article Content ── */}
          <SectionCard>
            <TableOfContents items={toc} />
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-sans text-2xl md:text-4xl font-bold text-[#0A0A23] mb-6">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      id={slugifyHeading(getHeadingText(children))}
                      className="font-sans text-xl md:text-3xl font-bold text-[#0A0A23] mt-10 mb-6 border-l-4 border-[#006400] pl-4 scroll-mt-24"
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      id={slugifyHeading(getHeadingText(children))}
                      className="font-sans text-lg md:text-2xl font-semibold text-[#0A0A23] mt-6 mb-4 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[#333333] leading-relaxed text-base md:text-lg mb-4">{children}</p>
                  ),
                  ul: ({ children }) => <ul className="space-y-3 ml-4 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="space-y-3 ml-6 mb-4 list-decimal">{children}</ol>,
                  li: ({ children }) => (
                    <li className="text-lg text-[#333333] leading-relaxed relative pl-6 before:content-['→'] before:absolute before:left-0 before:text-[#006400] before:font-bold">
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-[#006400] underline font-bold" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#006400] pl-6 py-4 my-6 bg-[#EEEEEE] rounded-r-lg text-[#0A0A23] italic">
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt }) => (
                    <span className="block relative rounded-xl overflow-hidden shadow-xl w-full my-8">
                      <Image
                        src={typeof src === 'string' ? src : ''}
                        alt={alt || ''}
                        width={800}
                        height={500}
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="w-full h-auto object-contain"
                      />
                    </span>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </SectionCard>

        </section>

        <CTASection
          title={"Let's Learn and Build Together"}
          description={"Always learning. Always building."}
        />
      </Wrapper>
      <Footer />
    </div>
  );
}
