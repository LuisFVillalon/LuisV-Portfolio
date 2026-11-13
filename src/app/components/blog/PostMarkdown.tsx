import React from 'react';
import Image from 'next/image';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugifyHeading } from '@/app/lib/blogTypes';

/** Flattens rendered heading children back to text so the id matches the TOC slug. */
function textOf(children: React.ReactNode): string {
    return React.Children.toArray(children)
        .map((child) => {
            if (typeof child === 'string' || typeof child === 'number') return String(child);
            if (React.isValidElement(child)) return textOf((child.props as { children?: React.ReactNode }).children);
            return '';
        })
        .join('');
}

const bodyText = 'font-sans text-[16px] md:text-[17px] text-[#2b2b33]';

const components: Components = {
    // Posts start their body at ##; a stray # is demoted so the page keeps a single h1.
    h1: ({ children }) => (
        <h2 className="mt-10 mb-3 font-sans text-[21px] md:text-[25px] font-extrabold leading-tight text-[#0A0A23]">{children}</h2>
    ),
    h2: ({ children }) => (
        <h2
            id={slugifyHeading(textOf(children))}
            className="mt-10 mb-3 scroll-mt-24 border-t border-[#0A0A23]/10 pt-6 font-sans text-[21px] md:text-[25px] font-extrabold leading-tight text-[#0A0A23]"
        >
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3
            id={slugifyHeading(textOf(children))}
            className="mt-7 mb-2 scroll-mt-24 font-sans text-[17px] md:text-[19px] font-bold leading-snug text-[#0A0A23]"
        >
            {children}
        </h3>
    ),
    p: ({ children }) => <p className={`${bodyText} my-4 leading-[1.75]`}>{children}</p>,
    strong: ({ children }) => <strong className="font-bold text-[#0A0A23]">{children}</strong>,
    ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-5 marker:text-[#006400]">{children}</ul>,
    ol: ({ children }) => (
        <ol className="my-4 list-decimal space-y-2 pl-6 marker:font-bold marker:text-[#006400]">{children}</ol>
    ),
    li: ({ children }) => <li className={`${bodyText} pl-1 leading-[1.7] [&>p]:my-0`}>{children}</li>,
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words font-semibold text-[#006400] underline decoration-[#006400]/40 underline-offset-[3px] hover:decoration-[#006400]"
        >
            {children}
        </a>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-6 rounded-r-lg border-l-4 border-[#006400] bg-[#F3F3F5] px-5 py-3">{children}</blockquote>
    ),
    code: ({ children, className }) =>
        className ? (
            <code className={className}>{children}</code>
        ) : (
            <code className="rounded bg-[#F3F3F5] px-1.5 py-0.5 text-[0.88em] text-[#0A0A23]">{children}</code>
        ),
    pre: ({ children }) => (
        <pre className="my-6 overflow-x-auto rounded-xl bg-[#0A0A23] p-4 text-[13px] leading-relaxed text-[#e6e6f0]">{children}</pre>
    ),
    hr: () => <hr className="my-10 border-[#0A0A23]/10" />,
    // Images sit inside <p>, so the wrapper uses block spans. The width/height pair is only
    // a placeholder ratio: once loaded the image keeps its natural ratio, is never cropped
    // (object-contain), and very tall images are capped.
    img: ({ src, alt }) => (
        <span className="my-8 block">
            <span className="block overflow-hidden rounded-xl border border-[#0A0A23]/10 bg-[#F3F3F5]">
                <Image
                    src={typeof src === 'string' ? src : ''}
                    alt={alt || ''}
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="mx-auto block h-auto max-h-[560px] w-full object-contain"
                />
            </span>
            {alt && <span className="mt-2 block text-center text-xs text-[#6e6e78]">{alt}</span>}
        </span>
    ),
};

/** Renders a post's Markdown body with readable, bento-consistent typography. */
export default function PostMarkdown({ source }: { source: string }): React.ReactElement {
    return (
        <div className="min-w-0 [&>*:first-child]:!mt-0 [&>*:first-child]:!border-t-0 [&>*:first-child]:!pt-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {source}
            </ReactMarkdown>
        </div>
    );
}
