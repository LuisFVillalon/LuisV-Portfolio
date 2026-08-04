// src/app/components/github/GitHubProfileSummary.tsx
import Image from 'next/image';
import { BookMarked, Users, ArrowUpRight } from 'lucide-react';
import { GitHubProfile } from '@/app/lib/githubStats';

export default function GitHubProfileSummary({ profile }: { profile: GitHubProfile }) {
  return (
    <a
      href={profile.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-[#0A0A23]/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <Image
        src={profile.avatarUrl}
        alt={profile.name ?? profile.login}
        width={64}
        height={64}
        className="rounded-full shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="font-sans font-bold text-[#0A0A23] truncate group-hover:underline">
            {profile.name ?? profile.login}
          </p>
          <ArrowUpRight size={14} className="text-[#0A0A23]/40 group-hover:text-[#006400] transition-colors shrink-0" />
        </div>
        <p className="text-sm text-[#333333]/70 truncate">@{profile.login}</p>
        {profile.bio && <p className="text-sm text-[#333333]/70 mt-1 line-clamp-2">{profile.bio}</p>}
        <div className="flex items-center gap-4 mt-2 text-xs text-[#333333]/70">
          <span className="flex items-center gap-1">
            <BookMarked size={14} /> {profile.publicRepos} public repos
          </span>
          {profile.followers > 0 && (
            <span className="flex items-center gap-1">
              <Users size={14} /> {profile.followers} followers
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
