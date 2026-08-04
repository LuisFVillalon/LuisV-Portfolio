// src/app/components/home/LinkedInSection.tsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import { linkedinPosts, linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import LinkedInPostCard from '@/app/components/Cards/LinkedInPostCard';

const VISIBLE_COUNT = 3;

export default function LinkedInSection() {
  const [index, setIndex] = useState(0);
  const canScroll = linkedinPosts.length > VISIBLE_COUNT;
  const visiblePosts = Array.from(
    { length: Math.min(VISIBLE_COUNT, linkedinPosts.length) },
    (_, offset) => linkedinPosts[(index + offset) % linkedinPosts.length]
  );

  const goPrev = () => setIndex((i) => (i - 1 + linkedinPosts.length) % linkedinPosts.length);
  const goNext = () => setIndex((i) => (i + 1) % linkedinPosts.length);

  return (
    <div>
      <a
        href={linkedinProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Linkedin className="text-[#0A0A23]" size={20} />
        <p className="text-[#0A0A23] text-center font-sans font-bold hover:font-black hover:cursor-pointer hover:underline hover:text-[#006400] transition-colors text-xl">
          Latest LinkedIn Posts
        </p>
      </a>

      <div className="flex items-center gap-4">
        {canScroll && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous LinkedIn posts"
            className="shrink-0 rounded-full border border-[#0A0A23]/10 bg-white p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <ChevronLeft className="text-[#0A0A23]" size={20} />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {visiblePosts.map((post) => (
            <LinkedInPostCard key={post.id} post={post} profileUrl={linkedinProfileUrl} />
          ))}
        </div>

        {canScroll && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next LinkedIn posts"
            className="shrink-0 rounded-full border border-[#0A0A23]/10 bg-white p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <ChevronRight className="text-[#0A0A23]" size={20} />
          </button>
        )}
      </div>

      {canScroll && (
        <div className="flex justify-center gap-1.5 mt-4">
          {linkedinPosts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to LinkedIn post ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-5 bg-[#0A0A23]' : 'w-2 bg-[#0A0A23]/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}