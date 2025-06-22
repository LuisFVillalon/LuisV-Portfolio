"use client";

import React from 'react';
import Navbar from '../../components/NavBar';
import Wrapper from '../../components/Wrapper';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react'; // Added missing imports
import { getPostById } from '@/app/lib/blogs';

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
        <div className="max-w-4xl mx-auto p-6">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Image
              src={selectedPost.image_banner}
              alt={selectedPost.title}
              className="w-full h-64 object-cover"
              width={800}
              height={256}
            />
            
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
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
        </div>
      </Wrapper>
      <Footer />
    </div>
  );
}