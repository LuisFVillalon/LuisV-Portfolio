import { notFound, permanentRedirect } from 'next/navigation';

// The per-category pages became filters on /projects; old links keep working via a permanent redirect.
const categories = ['frontend', 'fullstack', 'ai', 'academic'];

export function generateStaticParams() {
    return categories.map((category) => ({ category }));
}

export default async function ProjectCategoryRedirect({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    if (!categories.includes(category)) notFound();
    permanentRedirect(`/projects?type=${category}`);
}
