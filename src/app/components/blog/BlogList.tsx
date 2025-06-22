/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { blogPosts } from '@/app/lib/blogs';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogShowcase() { 

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 dm-serif-text-regular">My Latest Blog Posts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover insights, tutorials, and tips on web development, design, and technology
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
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
                <span className="opacity-[75%] bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="dm-serif-text-regular text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content[0].text[0].substring(0, 120)}...
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
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
    </div>
  );
}