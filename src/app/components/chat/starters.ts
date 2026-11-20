/** Starter questions that match the page the visitor is on. */
const STARTERS: { match: (path: string) => boolean; questions: string[] }[] = [
    {
        match: (p) => p.startsWith('/projects'),
        questions: ['Which projects use Claude?', 'What did ROSS win?', 'What is kanso?', "What's his tech stack?"],
    },
    {
        match: (p) => p.startsWith('/experience'),
        questions: ['Where has Luis interned?', 'What did he build at Ectron?', 'What is he studying?', 'Any leadership experience?'],
    },
    {
        match: (p) => p.startsWith('/blog'),
        questions: ['What does Luis write about?', 'What is his advice on working with AI?', 'What did ROSS win?', "What's his AI experience?"],
    },
    {
        match: () => true,
        questions: ['What is kanso about?', 'What types of roles is Luis looking for?', "What's his AI experience?", 'What is he working on now?'],
    },
];

export function startersFor(path: string): string[] {
    return STARTERS.find((s) => s.match(path))!.questions;
}
