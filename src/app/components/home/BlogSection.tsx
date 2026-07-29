'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MarkdownBlogPost, getPreviewText } from '@/app/lib/blogTypes';

interface BlogSectionProps {
  posts: MarkdownBlogPost[];
}

const VISIBLE_COUNT = 3;

export default function BlogSection({ posts }: BlogSectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const canScroll = posts.length > VISIBLE_COUNT;

  const goPrev = () => {
    setStartIndex((i) => (i - 1 + posts.length) % posts.length);
  };

  const goNext = () => {
    setStartIndex((i) => (i + 1) % posts.length);
  };

  const visiblePosts = Array.from({ length: Math.min(VISIBLE_COUNT, posts.length) }, (_, offset) =>
    posts[(startIndex + offset) % posts.length]
  );

  return (
    <div>
        <Link href="/blog">
            <p className="text-[#0A0A23] text-center font-sans font-bold
                hover:font-black
                hover:cursor-pointer
                hover:underline
                hover:text-[#006400] transition-colors
                text-xl mb-4
            ">
                Latest Blog Posts
            </p>
        </Link>
      <div className="flex items-center gap-4">
        {canScroll && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous blog posts"
            className="shrink-0 rounded-full border border-[#0A0A23]/10 bg-white p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <ChevronLeft className="text-[#0A0A23]" size={20} />
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {visiblePosts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`} className="flex">
          <article
            className="bg-white rounded-2xl shadow-lg border border-[#0A0A23]/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col h-[420px] w-full"
          >
            <div className="relative overflow-hidden shrink-0">
              <Image
                src={post.image_card}
                width={100}
                height={100}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="text-white opacity-[75%] bg-[#0A0A23] backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 min-h-0">
              <h2 className="font-sans text-xl font-bold text-[#0A0A23] mb-3 line-clamp-2 group-hover:text-[#006400] transition-colors">
                {post.title}
              </h2>

              <p className="text-[#333333] mb-4 line-clamp-3">
                {getPreviewText(post.content)}
              </p>

              <div className="flex items-center justify-between text-sm text-[#B3B3B3] mt-auto flex-wrap gap-x-2 gap-y-1">
                <div className="flex items-center gap-2 min-w-0">
                  <User size={16} className="shrink-0" />
                  <span className="truncate">{post.author}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 shrink-0">
                    <Calendar size={14} className="shrink-0" />
                    <span className="whitespace-nowrap">{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock size={14} className="shrink-0" />
                    <span className="whitespace-nowrap">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Link>
          ))}
        </div>
        {canScroll && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next blog posts"
            className="shrink-0 rounded-full border border-[#0A0A23]/10 bg-white p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <ChevronRight className="text-[#0A0A23]" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
