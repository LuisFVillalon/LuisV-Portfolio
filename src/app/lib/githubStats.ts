// src/app/lib/githubStats.ts
// Types + small config shared between the /api/github-stats route and the
// GitHub stats section components. Data itself is fetched live from the
// GitHub API at request time (see the API route) — nothing here is static content.

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
}

export interface GitHubFeaturedRepo {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepageUrl: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  updatedAt: string;
}

export interface GitHubLanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface GitHubActivityItem {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  summary: string;
  createdAt: string;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionWeek {
  days: GitHubContributionDay[];
}

export interface GitHubContributionsData {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

export interface GitHubStatsResponse {
  profile: GitHubProfile;
  featuredRepos: GitHubFeaturedRepo[];
  languages: GitHubLanguageStat[];
  recentActivity: GitHubActivityItem[];
  /** null when GITHUB_TOKEN isn't configured — the contribution calendar needs an authenticated GraphQL call. */
  contributions: GitHubContributionsData | null;
}

// Fallback colors for languages GitHub's GraphQL API doesn't return a color for
// (only used when falling back to the unauthenticated REST path).
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Vue: '#41b883',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

export const DEFAULT_LANGUAGE_COLOR = '#8b8b8b';
