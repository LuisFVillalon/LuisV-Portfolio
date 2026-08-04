// src/app/components/github/GitHubLanguageBars.tsx
import { GitHubLanguageStat } from '@/app/lib/githubStats';

export default function GitHubLanguageBars({ languages }: { languages: GitHubLanguageStat[] }) {
  if (languages.length === 0) {
    return <p className="text-sm text-[#333333]/60">No language data available.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#0A0A23]/5">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        {languages.map((lang) => (
          <li key={lang.name} className="flex items-center gap-1.5 text-sm text-[#333333]/80">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
            <span className="truncate">{lang.name}</span>
            <span className="text-[#333333]/50 ml-auto">{lang.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
