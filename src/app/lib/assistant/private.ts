// Private content: the captain-approved LinkedIn profile file and the "Assistant facts".
// The portfolio repo is public, so neither file is ever committed. On Vercel they come from
// environment variables; in local development from the gitignored `.private/` folder.
import fs from 'fs';
import path from 'path';

const PRIVATE_DIR = path.join(process.cwd(), '.private');

function load(envName: string, fileName: string): string | null {
    const fromEnv = process.env[envName];
    if (fromEnv?.trim()) {
        // Allow a base64 value for hosts where multi-line env vars are awkward.
        const value = fromEnv.trim();
        if (/^base64:/.test(value)) return Buffer.from(value.slice(7), 'base64').toString('utf8');
        return value;
    }
    const file = path.join(PRIVATE_DIR, fileName);
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

/** Captain-written answers that always ride in the (cached) system prompt. Highest priority source. */
export const loadAssistantFacts = () => load('ASSISTANT_FACTS', 'assistant-facts.md');

/** Curated LinkedIn profile (Markdown), chunked into the index. */
export const loadLinkedInProfile = () => load('ASSISTANT_LINKEDIN_PROFILE', 'linkedin-profile.md');
