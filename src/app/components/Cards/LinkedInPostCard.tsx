// src/app/components/home/LinkedInPostCard.tsx
import { Linkedin, ArrowUpRight } from 'lucide-react';
import { LinkedInPost } from '@/app/lib/linkedinPosts';

export default function LinkedInPostCard({ post, profileUrl }: { post: LinkedInPost; profileUrl: string }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg border border-[#0A0A23]/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-[420px]">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#0A0A23]/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#0A0A23]">
            <Linkedin size={14} className="text-white" />
          </span>
        </div>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label="Open on LinkedIn" className="shrink-0 text-[#333333]/50 hover:text-[#006400] transition-colors">
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="relative flex-1 bg-[#f5f5f7]">
        <iframe
          src={post.embedUrl}
          title={post.title ?? `LinkedIn post ${post.id}`}
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </article>
  );
}