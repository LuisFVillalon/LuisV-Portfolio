// src/app/components/github/GitHubStatsSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';
import { SectionHeading } from '@/app/components/Cards/SectionCard';
import { GitHubStatsResponse } from '@/app/lib/githubStats';
import GitHubProfileSummary from './GitHubProfileSummary';
import GitHubFeaturedRepos from './GitHubFeaturedRepos';
import GitHubLanguageBars from './GitHubLanguageBars';
import GitHubActivityFeed from './GitHubActivityFeed';
import GitHubContributionGraph from './GitHubContributionGraph';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: GitHubStatsResponse };

export default function GitHubStatsSection() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/github-stats')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? 'Failed to load GitHub stats');
        return body as GitHubStatsResponse;
      })
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load GitHub stats' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Github className="text-[#0A0A23]" size={20} />
        <p className="text-[#0A0A23] text-center font-sans font-bold text-xl">GitHub Stats</p>
      </div>

      {state.status === 'loading' && (
        <p className="text-center text-sm text-[#333333]/60 py-8">Loading GitHub stats…</p>
      )}

      {state.status === 'error' && (
        <p className="text-center text-sm text-[#333333]/60 py-8">
          Couldn&apos;t load GitHub stats ({state.message}).
        </p>
      )}

      {state.status === 'ready' && (
        <div className="flex flex-col gap-6">
          <GitHubProfileSummary profile={state.data.profile} />

          <div>
            <SectionHeading>Featured Repositories</SectionHeading>
            <GitHubFeaturedRepos repos={state.data.featuredRepos} />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <SectionHeading>Top Languages</SectionHeading>
              <GitHubLanguageBars languages={state.data.languages} />
            </div>
            <div>
              <SectionHeading>Recent Activity</SectionHeading>
              <GitHubActivityFeed activity={state.data.recentActivity} />
            </div>
          </div>

          <div>
            <SectionHeading>Yearly Contributions</SectionHeading>
            <GitHubContributionGraph contributions={state.data.contributions} />
          </div>
        </div>
      )}
    </div>
  );
}
