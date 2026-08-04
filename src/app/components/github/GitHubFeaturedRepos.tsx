// src/app/components/github/GitHubFeaturedRepos.tsx
import { Star, GitFork, ArrowUpRight } from 'lucide-react';
import { GitHubFeaturedRepo } from '@/app/lib/githubStats';

function RepoCard({ repo }: { repo: GitHubFeaturedRepo }) {
  return (
    <a
      href={repo.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-[#0A0A23]/10 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-sans font-bold text-[#0A0A23] truncate group-hover:underline">{repo.name}</p>
        <ArrowUpRight size={14} className="text-[#0A0A23]/40 group-hover:text-[#006400] transition-colors shrink-0" />
      </div>
      <p className="text-sm text-[#333333]/70 mt-1 line-clamp-2 flex-1">
        {repo.description ?? 'No description provided.'}
      </p>
      <div className="flex items-center gap-3 mt-3 text-xs text-[#333333]/70">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: repo.languageColor ?? '#8b8b8b' }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={13} /> {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={13} /> {repo.forks}
        </span>
      </div>
    </a>
  );
}

export default function GitHubFeaturedRepos({ repos }: { repos: GitHubFeaturedRepo[] }) {
  if (repos.length === 0) {
    return <p className="text-sm text-[#333333]/60">No featured repositories found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  );
}
