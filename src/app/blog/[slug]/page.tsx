"use client";

import React from 'react';
import Navbar from '../../components/NavBar';
import Wrapper from '../../components/Wrapper';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react'; // Added missing imports
import { getPostById } from '@/app/lib/blogs';
import CTASection from '@/app/components/CTASection';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Post({ params }: PageProps): React.ReactElement {
  const { slug } = React.use(params);
  const selectedPost = getPostById(Number(slug));
  
  if (!selectedPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Post not found.</p>
      </div>
    );
  }  
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
          <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold text-[#FADA5E] mb-6 leading-tight">
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
            {/* <Link className="" href="/blog/">
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
            </Link> */}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          {selectedPost.content.map((section, index) => (
            <div key={index} className="mb-10">
              {/* Section Title */}
              {section.subtitle && (
                <h2 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
                  {section.subtitle}
                </h2>
              )}
              
              {/* Section Content Based on Type */}
              {'type' in section && section.type === 'bullets' ? (
                // Bullet Points
                <ul className="space-y-3 ml-4">
                  {section.text.map((bullet, i) => (
                    <li key={i} className="text-lg 8 text-gray-700 leading-relaxed relative pl-6 before:content-['→'] before:absolute before:left-0 before:text-blue-500 before:font-bold">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) :  'type' in section && section.type === 'references' ? (
                // Reference Links
                <ul>                {
                  section.text.map((link, i) => (
                    <Link key={i} href={link}>
                      <li  className="text-lg text-blue-800 underline">
                          {section.text}
                      </li>
                    </Link>
                  ))} 
                </ul>
              ) : 'type' in section && section.type === 'image' ? (
                // Image Section - Text on Left, Image on Right
                <div className="grid md:grid-cols-2 gap-8 items-center my-8 w-full max-w-full">
                  {/* Text/Caption on Left */}
                  <div className="space-y-4 min-w-0">
                    {section.text.map((paragraph, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Image on Right */}
                  <div className="relative rounded-xl overflow-hidden shadow-xl w-full min-w-0">
                    <Image
                      src={section.imageUrl || ''} 
                      alt={section.subtitle}
                      className="w-full h-auto object-contain"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              ) : 'type' in section && section.type === 'quote' ? (
                // Quote Section
                <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
                  {section.text.map((quote, i) => (
                    <p key={i} className="text-gray-800 text-xl italic font-medium leading-relaxed">
                      &quot;{quote}&quot;
                    </p>
                  ))}
                </blockquote>
              ) : (
                // Regular Text
                <div className="space-y-4">
                  {section.text.map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
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