// src/app/components/github/GitHubActivityFeed.tsx
import { GitCommitHorizontal } from 'lucide-react';
import { GitHubActivityItem } from '@/app/lib/githubStats';

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function GitHubActivityFeed({ activity }: { activity: GitHubActivityItem[] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-[#333333]/60">No recent public activity.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-[#0A0A23]/10">
      {activity.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-2.5">
          <GitCommitHorizontal size={16} className="text-[#0A0A23]/40 mt-0.5 shrink-0" />
          <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#333333]/80 hover:text-[#006400] hover:underline flex-1">
            {item.summary}
          </a>
          <span className="text-xs text-[#333333]/50 shrink-0">{timeAgo(item.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
