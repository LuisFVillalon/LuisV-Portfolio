export type LinkedInPost = {
  id: number;
  embedUrl: string;
  title?: string;
};

// To add/update a post: open the post on LinkedIn > Send > Embed this post,
// and copy the `src` value from the generated <iframe> tag into embedUrl below.
const linkedinPosts: LinkedInPost[] = [
  {
    id: 1,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7508012589948391424?collapsed=1',
    title: 'Chunking in RAG',
  },
  {
    id: 2,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7470635373342171136?collapsed=1',
    title: 'AI Coding🧑🏽‍💻',
  },
  {
    id: 3,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7488363241639727104?collapsed=1',
    title: 'Summer 2k26☀️',
  },
  {
    id: 4,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7474256275996893184?collapsed=1',
    title: 'AI Temp🌡️',
  },
  {
    id: 5,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7430085004937916416?collapsed=1',
    title: 'Kanso v1📈',
  },
  {
    id: 6,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7399281446575775744?collapsed=1',
    title: 'SDSU Reflection',
  },
];

const linkedinProfileUrl = 'https://www.linkedin.com/in/luis-villalon/';

export { linkedinPosts, linkedinProfileUrl };
