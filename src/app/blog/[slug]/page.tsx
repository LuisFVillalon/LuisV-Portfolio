import React from 'react';
import Navbar from '../../components/NavBar';
import Wrapper from '../../components/Wrapper';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import { getMarkdownBlogPostById, extractTableOfContents } from '@/app/lib/markdownBlogs';
import { slugifyHeading } from '@/app/lib/blogTypes';
import TableOfContents from '@/app/components/blog/TableOfContents';
import CTASection from '@/app/components/CTASection';
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
        <Wrapper>
   {/* Hero Banner with Overlay */}
      <div className="h-[60vh] max-h-[500px] w-full overflow-hidden">
        {/* Content Overlay */}
        <div className="h-full w-full bg-[#0A0A23] px-6 flex flex-col justify-end pb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
              {selectedPost.category}
            </span>
            <Link className="" href="/blog/">
              <button
                className="
                  text-2xl p-2 m-2 rounded-md
                  text-white shadow-lg
                  transition-all duration-150
                  hover:shadow-xl hover:-translate-y-1
                  border-b-4 border-r-2 border-green-900
                  active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                  font-sans
                "
                style={{
                  background: 'linear-gradient(to right, #FADA5E, #0A0A23)'
                }}
              >
                <i className="ml-[1%] fas fa-arrow-left"></i>
              </button>
            </Link>
          </div>

          {/* Title */}
          <h1 className="font-sans text-2xl md:text-5xl lg:text-6xl font-bold text-[#FADA5E] mb-6 leading-tight">
            {selectedPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <User className="text-[#FADA5E]"  size={18} />
              <span className="font-medium">{selectedPost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-[#FADA5E]" size={18} />
              <span>{selectedPost.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-[#FADA5E]" size={18} />
              <span>{selectedPost.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Body */}
        <TableOfContents items={toc} />
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-sans text-2xl md:text-4xl font-bold text-gray-900 mb-6">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2
                  id={slugifyHeading(getHeadingText(children))}
                  className="font-sans text-xl md:text-3xl font-bold text-gray-900 mt-10 mb-6 border-l-4 border-blue-500 pl-4 scroll-mt-24"
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  id={slugifyHeading(getHeadingText(children))}
                  className="font-sans text-lg md:text-2xl font-semibold text-gray-800 mt-6 mb-4 scroll-mt-24"
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">{children}</p>
              ),
              ul: ({ children }) => <ul className="space-y-3 ml-4 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="space-y-3 ml-6 mb-4 list-decimal">{children}</ol>,
              li: ({ children }) => (
                <li className="text-lg text-gray-700 leading-relaxed relative pl-6 before:content-['→'] before:absolute before:left-0 before:text-blue-500 before:font-bold">
                  {children}
                </li>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg text-gray-800 italic">
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
      </div>
          <CTASection
            title={"Let's Learn and Build Together"}
            description={"Always learning. Always building."}
          />
        </Wrapper>
      <Footer />
    </div>
  );
}
