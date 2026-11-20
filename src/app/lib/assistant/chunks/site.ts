// Structure-aware chunks from the site's own data files: one chunk per project, role,
// education entry, certificate and skill group; blog posts split at their headings.
import { getBlogPosts } from '../../markdownBlogs';
import { slugifyHeading } from '../../blogTypes';
import { getAwardProjects, getProjectsByCategory, type Project, type ProjectCategory } from '../../projects';
import {
    beyondTech,
    certificates,
    currentlyDoing,
    education,
    leadership,
    professionalExperience,
    profile,
    resume,
    techTools,
} from '../../experience';
import { linkedinPosts, linkedinProfileUrl } from '../../linkedinPosts';
import { makeChunk, slug, splitRecursive, splitMarkdownSections, type Chunk } from './types';

const CATEGORY_NAMES: Record<ProjectCategory, string> = {
    top: 'Featured',
    ai: 'AI',
    fullstack: 'Full-stack',
    frontend: 'Front-end',
    academic: 'Coursework',
};

/** Every project once, in projects.ts order (categories, then award winners, which may have no category). */
function allProjects(): Project[] {
    const seen = new Set<string>();
    const list: Project[] = [];
    for (const category of ['top', 'ai', 'fullstack', 'frontend', 'academic'] as ProjectCategory[]) {
        for (const project of getProjectsByCategory(category)) add(project);
    }
    getAwardProjects().forEach(add);
    return list;

    function add(project: Project) {
        if (!seen.has(project.title)) {
            seen.add(project.title);
            list.push(project);
        }
    }
}

function projectChunk(project: Project): Chunk {
    const groups = project.categories.filter((c) => c !== 'top');
    const type = project.award ? 'awards' : (groups[0] ?? 'all');
    const lines = [
        `Project: ${project.title}`,
        project.award && `Award: ${project.award.title}, ${project.award.event}`,
        `Description: ${project.description}`,
        `Tech: ${project.tech}`,
        project.categories.length > 0 && `Categories on the site: ${project.categories.map((c) => CATEGORY_NAMES[c]).join(', ')}`,
        `Code: ${project.github_repo}`,
        project.frontend_repo && project.frontend_repo !== project.github_repo && `Front-end repo: ${project.frontend_repo}`,
        project.backend_repo && `Back-end repo: ${project.backend_repo}`,
        project.live_app && project.live_app !== project.github_repo && `Live app: ${project.live_app}`,
    ];
    for (const [category, override] of Object.entries(project.categoryOverrides ?? {})) {
        if (override?.description) {
            lines.push(
                `${CATEGORY_NAMES[category as ProjectCategory]} side of this project: ${override.description}` +
                    (override.tech ? ` (Tech: ${override.tech})` : '') +
                    (override.github_repo ? ` Code: ${override.github_repo}` : ''),
            );
        }
    }
    return makeChunk({
        id: `site:project:${slug(project.title)}`,
        sourceType: 'site',
        title: project.title,
        section: 'Project',
        label: `Projects · ${project.title}`,
        href: `/projects?type=${type}`,
        text: lines.filter(Boolean).join('\n'),
    });
}

function experienceChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    const role = (
        kind: string,
        r: { company: string; position: string; time: string; description: string; tech: string; link: string },
    ) =>
        makeChunk({
            id: `site:${kind}:${slug(r.company)}-${slug(r.position)}`,
            sourceType: 'site',
            title: `${r.position} at ${r.company}`,
            section: kind === 'role' ? 'Experience' : kind === 'now' ? 'Currently doing' : 'Leadership',
            label: `Experience · ${r.company}`,
            href: '/experience',
            text: [
                `${r.position} at ${r.company} (${r.time})`,
                r.description,
                r.tech && `Skills and tools: ${r.tech}`,
                r.link && `Organization link: ${r.link}`,
            ]
                .filter(Boolean)
                .join('\n'),
        });

    professionalExperience.forEach((r) => chunks.push(role('role', r)));
    currentlyDoing.forEach((r) => chunks.push(role('now', r)));
    leadership.forEach((r) => chunks.push(role('leadership', r)));

    for (const e of education) {
        chunks.push(
            makeChunk({
                id: `site:education:${slug(e.institution)}-${slug(e.course)}`,
                sourceType: 'site',
                title: `${e.course}, ${e.institution}`,
                section: 'Education',
                label: `Education · ${e.institution}`,
                href: '/experience',
                text: [
                    `${e.course} at ${e.institution} (${e.time})`,
                    e.description,
                    e.courses.length > 0 && `Coursework: ${e.courses.join(', ')}`,
                    e.tech && `Tech: ${e.tech}`,
                    e.built && e.built.length > 0 && `Built: ${e.built.join(', ')}`,
                ]
                    .filter(Boolean)
                    .join('\n'),
            }),
        );
    }

    for (const c of certificates) {
        chunks.push(
            makeChunk({
                id: `site:certificate:${slug(c.institution)}-${slug(c.title)}`,
                sourceType: 'site',
                title: `${c.title} (${c.institution})`,
                section: 'Certificate',
                label: `Certificates · ${c.title}`,
                href: '/experience',
                text: [
                    `Certificate: ${c.title} from ${c.institution} (${c.time})`,
                    c.description,
                    c.topics.length > 0 && `Covers: ${c.topics.join(', ')}`,
                    c.tech && `Tools: ${c.tech}`,
                    c.courses && c.courses.length > 0 && `Courses: ${c.courses.map((course) => course.name).join('; ')}`,
                    c.cert_link && `Verification: ${c.cert_link}`,
                ]
                    .filter(Boolean)
                    .join('\n'),
            }),
        );
    }

    for (const b of beyondTech) {
        const employers = b.employers?.map((e) => e.name).join(', ');
        chunks.push(
            makeChunk({
                id: `site:beyond-tech:${slug(b.title)}`,
                sourceType: 'site',
                title: `${b.title}, ${b.org}`,
                section: 'Beyond tech',
                label: 'Experience · Beyond tech',
                href: '/experience',
                text: [
                    `Non-engineering role: ${b.title}, ${b.org} (${b.time})`,
                    employers && `Employers: ${employers}`,
                    b.description,
                    b.skills && `Skills: ${b.skills}`,
                ]
                    .filter(Boolean)
                    .join('\n'),
            }),
        );
    }

    chunks.push(
        makeChunk({
            id: 'site:skills',
            sourceType: 'site',
            title: 'Technical skills',
            section: 'Skills',
            label: 'Experience · Skills',
            href: '/experience',
            text: techTools.map((group) => `${group.subject}: ${group.tools.map((t) => t.tool).join(', ')}`).join('\n'),
        }),
    );

    chunks.push(
        makeChunk({
            id: 'site:profile',
            sourceType: 'site',
            title: 'Profile summary',
            section: 'Home page',
            label: 'Home',
            href: '/',
            text: [
                'Luis Fernando Villalón: Software Engineer · Full-Stack · Applied AI.',
                profile.openTo && `Open to: ${profile.openTo}.`,
                `Résumé: ${resume}`,
                `LinkedIn: ${linkedinProfileUrl}`,
                'Contact page: /contact',
            ]
                .filter(Boolean)
                .join('\n'),
        }),
    );

    chunks.push(
        makeChunk({
            id: 'site:linkedin-posts',
            sourceType: 'site',
            title: 'LinkedIn posts featured on the home page',
            section: 'Home page',
            label: 'LinkedIn posts',
            href: linkedinProfileUrl,
            text: `Posts Luis features from LinkedIn, most reactions first: ${linkedinPosts
                .map((p) => p.title)
                .filter(Boolean)
                .join('; ')}.`,
        }),
    );

    return chunks;
}

function blogChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    for (const post of getBlogPosts()) {
        const base = `/blog/${post.id}`;
        splitMarkdownSections(post.body).forEach((section, i) => {
            const pieces = splitRecursive(section.body);
            pieces.forEach((piece, j) => {
                const sectionSlug = section.heading ? slugifyHeading(section.heading) : 'intro';
                chunks.push(
                    makeChunk({
                        id: `site:blog:${post.id}#${sectionSlug || `s${i}`}${pieces.length > 1 ? `-${j + 1}` : ''}`,
                        sourceType: 'site',
                        title: `Blog post "${post.title}" (${post.date}, ${post.category})`,
                        section: section.heading ?? 'Introduction',
                        label: `Blog · ${post.title}`,
                        href: section.heading ? `${base}#${sectionSlug}` : base,
                        text: piece,
                    }),
                );
            });
        });
    }
    return chunks;
}

export function siteChunks(): Chunk[] {
    return [...allProjects().map(projectChunk), ...experienceChunks(), ...blogChunks()];
}
