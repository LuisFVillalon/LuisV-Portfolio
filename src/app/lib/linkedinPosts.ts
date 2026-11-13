export type LinkedInPost = {
  id: number;
  embedUrl: string;
  title?: string;
};

// To add/update a post: open the post on LinkedIn > Send > Embed this post,
// and copy the `src` value from the generated <iframe> tag into embedUrl below.
// Ordered by reactions, most first.
const linkedinPosts: LinkedInPost[] = [
  {
    id: 1,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7513322740578267139?collapsed=1',
    title: 'Hackathon Win🏆',
  },
  {
    id: 2,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7430085004937916416?collapsed=1',
    title: 'Kanso v1📈',
  },
  {
    id: 3,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7429022299565068289?collapsed=1',
    title: 'CodePath TIP 103🚀',
  },
  {
    id: 4,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7525633740224483328?collapsed=1',
    title: 'Voice Agent Hackathon🎙️',
  },
  {
    // Repost of a Swans post that tags Luis.
    id: 5,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7523215943406370816?collapsed=1',
    title: 'Swans Hackathon Recap',
  },
  {
    id: 6,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7523552106524590080?collapsed=1',
    title: 'SHPE 2026',
  },
  {
    id: 7,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7429037175674966022?collapsed=1',
    title: 'NXP ✕ CTRL Bootcamp',
  },
  {
    id: 8,
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7469291995262414848?collapsed=1',
    title: 'Spring Reflection',
  },
];

const linkedinProfileUrl = 'https://www.linkedin.com/in/luis-villalon/';

export { linkedinPosts, linkedinProfileUrl };
