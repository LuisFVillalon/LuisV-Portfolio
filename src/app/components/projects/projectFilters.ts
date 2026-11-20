// Filter values for the Projects page. Kept free of project data so the client filter stays small.
/** The Projects page filter values; each one except 'all', 'awards' (projects with an award) and 'live' (projects with a live deployment) is also a ProjectCategory. */
export const PROJECT_FILTERS = ['all', 'awards', 'live', 'ai', 'fullstack', 'frontend', 'academic'] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

export const filterLabel: Record<ProjectFilter, string> = {
    all: 'All',
    awards: 'Awards',
    live: 'Live',
    ai: 'AI',
    fullstack: 'Full-stack',
    frontend: 'Front-end',
    academic: 'Coursework',
};

/** Reads ?type= (string or repeated param) into a filter, falling back to 'all'. */
export const parseProjectFilter = (type: string | string[] | undefined): ProjectFilter => {
    const value = Array.isArray(type) ? type[0] : type;
    return PROJECT_FILTERS.find((f) => f === value) ?? 'all';
};
