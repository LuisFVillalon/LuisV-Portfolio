// app/api/github-stats/route.ts
//
// Aggregates public GitHub data for the homepage "GitHub Stats" section:
// profile summary, featured (pinned) repos, top languages, recent activity,
// and the yearly contribution calendar.
//
// Requires two env vars (see .env.local):
//   GITHUB_USERNAME  — your GitHub handle, e.g. "octocat"
//   GITHUB_TOKEN     — a GitHub personal access token (classic, no scopes needed
//                       for public data) used for GraphQL access + higher rate
//                       limits. Without it, the route falls back to unauthenticated
//                       REST calls and the contribution calendar is omitted, since
//                       GitHub only exposes contribution history via authenticated GraphQL.
import { NextResponse } from 'next/server';
import {
  DEFAULT_LANGUAGE_COLOR,
  LANGUAGE_COLORS,
  type GitHubActivityItem,
  type GitHubContributionsData,
  type GitHubFeaturedRepo,
  type GitHubLanguageStat,
  type GitHubProfile,
  type GitHubStatsResponse,
} from '@/app/lib/githubStats';

export const revalidate = 3600; // re-fetch at most once an hour

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function contributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

// GitHub's Events API no longer includes `commits`/`size` on PushEvent payloads
// (only `before`/`head`), so the commit count comes from the compare endpoint.
async function countPushCommits(repoName: string, payload: Record<string, unknown>): Promise<number | null> {
  if (Array.isArray(payload.commits)) return payload.commits.length;
  const { before, head } = payload;
  if (typeof before !== 'string' || typeof head !== 'string' || /^0+$/.test(before)) return null;
  try {
    const compare = await githubRestFetch(`https://api.github.com/repos/${repoName}/compare/${before}...${head}`);
    return typeof compare.total_commits === 'number' ? compare.total_commits : null;
  } catch {
    return null;
  }
}

function summarizeEvent(
  type: string,
  repoName: string,
  payload: Record<string, unknown>,
  pushCommits: number | null = null
): string {
  switch (type) {
    case 'PushEvent': {
      if (pushCommits === null) return `Pushed to ${repoName}`;
      return `Pushed ${pushCommits} commit${pushCommits === 1 ? '' : 's'} to ${repoName}`;
    }
    case 'PullRequestEvent':
      return `${payload.action ?? 'Updated'} a pull request in ${repoName}`;
    case 'IssuesEvent':
      return `${payload.action ?? 'Updated'} an issue in ${repoName}`;
    case 'CreateEvent':
      return `Created ${payload.ref_type ?? 'a ref'} in ${repoName}`;
    case 'ForkEvent':
      return `Forked ${repoName}`;
    case 'WatchEvent':
      return `Starred ${repoName}`;
    case 'ReleaseEvent':
      return `Published a release in ${repoName}`;
    default:
      return `${type.replace('Event', '')} in ${repoName}`;
  }
}

// ---- GraphQL path (used when GITHUB_TOKEN is set) --------------------------

const GRAPHQL_QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      name
      login
      avatarUrl
      bio
      url
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        totalCount
        nodes {
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            updatedAt
            primaryLanguage {
              name
              color
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface GraphQLRepoLanguageEdge {
  size: number;
  node: { name: string; color: string | null };
}

interface GraphQLPinnedRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  primaryLanguage: { name: string; color: string | null } | null;
}

interface GraphQLResponse {
  data?: {
    user: {
      name: string | null;
      login: string;
      avatarUrl: string;
      bio: string | null;
      url: string;
      repositories: {
        totalCount: number;
        nodes: { languages: { edges: GraphQLRepoLanguageEdge[] } }[];
      };
      pinnedItems: { nodes: GraphQLPinnedRepo[] };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

async function fetchViaGraphQL(username: string, token: string): Promise<Omit<GitHubStatsResponse, 'recentActivity'>> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { login: username } }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL request failed: ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse;
  if (json.errors?.length || !json.data?.user) {
    throw new Error(json.errors?.[0]?.message ?? 'GitHub GraphQL returned no user');
  }

  const user = json.data.user;

  const profile: GitHubProfile = {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    htmlUrl: user.url,
    publicRepos: user.repositories.totalCount,
    followers: 0,
  };

  const featuredRepos: GitHubFeaturedRepo[] = user.pinnedItems.nodes.map((repo) => ({
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.url,
    homepageUrl: repo.homepageUrl,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name ?? null,
    languageColor: repo.primaryLanguage?.color ?? null,
    updatedAt: repo.updatedAt,
  }));

  const languageBytes = new Map<string, { bytes: number; color: string }>();
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const existing = languageBytes.get(edge.node.name);
      languageBytes.set(edge.node.name, {
        bytes: (existing?.bytes ?? 0) + edge.size,
        color: edge.node.color ?? DEFAULT_LANGUAGE_COLOR,
      });
    }
  }
  const totalBytes = [...languageBytes.values()].reduce((sum, l) => sum + l.bytes, 0) || 1;
  const languages: GitHubLanguageStat[] = [...languageBytes.entries()]
    .map(([name, { bytes, color }]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);

  const contributions: GitHubContributionsData = {
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    weeks: user.contributionsCollection.contributionCalendar.weeks.map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: contributionLevel(d.contributionCount),
      })),
    })),
  };

  return { profile, featuredRepos, languages, contributions };
}

// ---- REST fallback (used when GITHUB_TOKEN is not set) --------------------

async function githubRestFetch(url: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, next: { revalidate } });
  if (!res.ok) throw new Error(`GitHub REST request failed (${url}): ${res.status}`);
  return res.json();
}

interface RestUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
}

interface RestRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  languages_url: string;
}

async function fetchViaRest(username: string): Promise<Omit<GitHubStatsResponse, 'recentActivity'>> {
  const user: RestUser = await githubRestFetch(`https://api.github.com/users/${username}`);
  const repos: RestRepo[] = await githubRestFetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const ownedRepos = repos.filter((r) => !r.fork);

  const profile: GitHubProfile = {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
  };

  const topByStars = [...ownedRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
  const featuredRepos: GitHubFeaturedRepo[] = topByStars.map((repo) => ({
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepageUrl: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    languageColor: repo.language ? LANGUAGE_COLORS[repo.language] ?? DEFAULT_LANGUAGE_COLOR : null,
    updatedAt: repo.updated_at,
  }));

  // Pull per-repo language breakdowns for the most recently updated repos only,
  // to keep request volume reasonable on the unauthenticated rate limit.
  const languageBytes = new Map<string, number>();
  const reposForLanguages = ownedRepos.slice(0, 15);
  const languageResults = await Promise.allSettled(
    reposForLanguages.map((repo) => githubRestFetch(repo.languages_url) as Promise<Record<string, number>>)
  );
  for (const result of languageResults) {
    if (result.status !== 'fulfilled') continue;
    for (const [name, bytes] of Object.entries(result.value)) {
      languageBytes.set(name, (languageBytes.get(name) ?? 0) + bytes);
    }
  }
  const totalBytes = [...languageBytes.values()].reduce((sum, b) => sum + b, 0) || 1;
  const languages: GitHubLanguageStat[] = [...languageBytes.entries()]
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? DEFAULT_LANGUAGE_COLOR,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);

  // GitHub only exposes the contribution calendar via authenticated GraphQL.
  const contributions: GitHubContributionsData | null = null;

  return { profile, featuredRepos, languages, contributions };
}

// ---- Recent activity (REST, works with or without a token) ----------------

interface RestEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: Record<string, unknown>;
  created_at: string;
}

async function fetchRecentActivity(username: string): Promise<GitHubActivityItem[]> {
  const events: RestEvent[] = await githubRestFetch(
    `https://api.github.com/users/${username}/events/public?per_page=10`
  );
  return Promise.all(
    events.slice(0, 8).map(async (event) => {
      const pushCommits =
        event.type === 'PushEvent' ? await countPushCommits(event.repo.name, event.payload) : null;
      return {
        id: event.id,
        type: event.type,
        repoName: event.repo.name,
        repoUrl: `https://github.com/${event.repo.name}`,
        summary: summarizeEvent(event.type, event.repo.name, event.payload, pushCommits),
        createdAt: event.created_at,
      };
    })
  );
}

// ---- Route handler ----------------------------------------------------------

export async function GET() {
  if (!GITHUB_USERNAME) {
    return NextResponse.json(
      { error: 'GITHUB_USERNAME is not configured. Add it to .env.local.' },
      { status: 500 }
    );
  }

  try {
    const [core, recentActivity] = await Promise.all([
      GITHUB_TOKEN ? fetchViaGraphQL(GITHUB_USERNAME, GITHUB_TOKEN) : fetchViaRest(GITHUB_USERNAME),
      fetchRecentActivity(GITHUB_USERNAME).catch(() => [] as GitHubActivityItem[]),
    ]);

    const response: GitHubStatsResponse = { ...core, recentActivity };
    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching GitHub stats';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
