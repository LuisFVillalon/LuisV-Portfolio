'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TocItem } from '@/app/lib/blogTypes';

interface TableOfContentsProps {
  items: TocItem[];
}

type TocSection = {
  section: TocItem;
  subsections: TocItem[];
};

function groupIntoSections(items: TocItem[]): TocSection[] {
  const sections: TocSection[] = [];

  for (const item of items) {
    if (item.level === 2) {
      sections.push({ section: item, subsections: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].subsections.push(item);
    }
  }

  return sections;
}

export default function TableOfContents({ items }: TableOfContentsProps): React.ReactElement | null {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  const sections = groupIntoSections(items);

  return (
    <nav className="not-prose mb-10 rounded-2xl border border-[#0A0A23]/10 bg-white shadow-lg">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex text-lg w-full items-center justify-between px-5 py-4 text-left font-sans font-bold text-[#0A0A23]"
      >
        Table of Contents
        <ChevronDown
          size={20}
          className={`text-[#B3B3B3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <ul className="text-base space-y-2 px-5 pb-5">
          {sections.map(({ section, subsections }) => (
            <li key={section.slug}>
              <a href={`#${section.slug}`} className="text-[#006400] font-bold hover:underline">
                {section.text}
              </a>
              {subsections.length > 0 && (
                <ul className="mt-2 ml-5 space-y-2">
                  {subsections.map((sub) => (
                    <li key={sub.slug}>
                      <a href={`#${sub.slug}`} className="text-[#006400] hover:underline">
                        {sub.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
