import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MarkdownBlogPost, getPreviewText } from '@/app/lib/blogTypes';

interface BlogListProps {
  posts: MarkdownBlogPost[];
}

export default function BlogShowcase({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
      <Link key={post.id} href={`/blog/${post.id}`}>
        <article
          className="bg-white rounded-2xl shadow-lg border border-[#0A0A23]/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group h-full flex flex-col"
        >
          <div className="relative overflow-hidden">
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
          <div className="p-6 flex flex-col flex-1">
            <h2 className="font-sans text-xl font-bold text-[#0A0A23] mb-3 group-hover:text-[#006400] transition-colors">
              {post.title}
            </h2>

            <p className="text-[#333333] mb-4 line-clamp-3 flex-1">
              {getPreviewText(post.content)}
            </p>

            <div className="flex items-center justify-between text-sm text-[#B3B3B3]">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
      ))}
    </div>
  );
}
