// src/app/components/github/GitHubContributionGraph.tsx
import { GitHubContributionsData } from '@/app/lib/githubStats';

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
};

export default function GitHubContributionGraph({ contributions }: { contributions: GitHubContributionsData | null }) {
  if (!contributions) {
    return (
      <p className="text-sm text-[#333333]/60">
        Contribution calendar unavailable — set <code className="px-1 py-0.5 rounded bg-[#0A0A23]/5">GITHUB_TOKEN</code> in
        .env.local to enable it.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-[#333333]/70">
        <span className="font-bold text-[#0A0A23]">{contributions.totalContributions.toLocaleString()}</span>{' '}
        contributions in the last year
      </p>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {contributions.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((day) => (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: LEVEL_COLORS[day.level] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
