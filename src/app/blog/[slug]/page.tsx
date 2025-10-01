"use client";

import React from 'react';
import Navbar from '../../components/NavBar';
import Wrapper from '../../components/Wrapper';
import Footer from '../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react'; // Added missing imports
import { getPostById } from '@/app/lib/blogs';
import CTASection from '@/app/components/home/CTASection';

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
          <article className=" bg-white  overflow-hidden">
            <Image
              src={selectedPost.image_banner}
              alt={selectedPost.title}
              className="w-full"
              width={800}
              height={400}
            />
            
            <div className="">
              <div className="grid grid-cols-5 place-items-center gap-2 text-center text-xs text-gray-600 my-4">
                <span className="flex items-center justify-center bg-blue-100 text-blue-800  p-1 rounded-lg">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {selectedPost.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {selectedPost.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {selectedPost.author}
                </div>
                <Link className="" href="/blog/">
                  <button
                    className="
                      text-2xl p-2 m-2 rounded-md
                      text-white shadow-lg
                      transition-all duration-150
                      hover:shadow-xl hover:-translate-y-1
                      border-b-4 border-r-2 border-green-900
                      active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                      dm-serif-text-regular
                    "
                    style={{ 
                      background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                    }}
                  >
                    <i className="ml-[1%] fas fa-arrow-left"></i>
                  </button>
                </Link>
              </div>
              
              <h1 className="dm-serif-text-regular text-3xl font-bold text-gray-900 mb-6">
                {selectedPost.title}
              </h1>
              
              {/* Uncomment and modify as needed */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {selectedPost.content.map((item, index) => (
                <div key={index}>
                    <h2 className="dm-serif-text-regular text-xl font-semibold mb-2">{item.subtitle}</h2>
                    {item.text.map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                    ))}
                    <br />
                </div>
                ))}
              </div>
            </div>
          </article>
          <CTASection/>
        </Wrapper>
      <Footer />
    </div>
  );
}