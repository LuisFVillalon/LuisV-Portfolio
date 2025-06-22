// Sample blog data 

export type blogPostsType = {
    id: number;
    title: string;
    content: [];
    image_card: string;
    image_banner: string;
    author: string;
    date: string;
    readTime: string;    
    category: string;
  };

const blogPosts = [
    {
        id: 1,
        title: "How I Built My Portfolio Website as a Sales Funnel",
        content: [
            {
                subtitle: "Introduction",
                text: [
                    "Hi, I am Luis Villalón—a full-stack developer passionate about building web applications that help businesses improve efficiency through custom software solutions. When I set out to create my personal portfolio website, my goal was not just to showcase my technical skills—it was to design a platform that could attract opportunities, generate leads, and open the door to meaningful collaborations.",
                    "Inspired by the strategies in Start Small, Stay Small by Rob Walling, I approached this project with a business mindset. Rather than simply building a digital resume, I created a site designed to function as a streamlined sales funnel—guiding visitors from curiosity to contact.", 
                    "In this article, I will walk you through the technologies I used, how I structured the site to support business goals, and what I learned along the way."
                ]
            },
            {
                subtitle: "Funnel-First Design Philosophy",
                text: [
                    "A funnel-first website is built with the purpose: to lead visitors toward taking a specific action—whether that’s hiring you, booking a call, or reaching out for a collaboration. Every section of the site should contribute to that goal by building awareness, trust, and a path to conversion.", 
                    "The funnel can be broken into three key stages:"
                ]
            },
            {
                subtitle: "1. Attract (Awareness): Making a Strong First Impression",
                text: [
                    "This is the top of the funnel—when a visitor first lands on your site. The goal is to immediately capture attention and communicate your value clearly. I focused on creating a clean, modern landing page with concise messaging, a fast load time, and mobile responsiveness.", 
                    "In web development, first impressions are critical. Even small issues—slow performance, visual glitches, or confusing layouts—can drive visitors away. To avoid that, I prioritized clarity and consistency in my design choices.", 
                    "The hero section of my homepage introduces who I am, what I do, and what I can offer—all above the fold. Subtle animations, polished typography, and lightweight icons help create a professional feel from the first scroll."
                ]
            },
            {
                subtitle: "2. Engage (Intent): Building Trust and Authority",
                text: [
                    "Once visitors are interested, the next step is to build credibility. At this stage, they’re exploring the deeper parts of your site—reading your About section, checking your Projects, or browsing Testimonials. This is where you answer the unspoken question: “Can I trust this person?”",
                    "To support this, I built supporting pages that communicate not just what I can do, but how I work:",
                    "About Me shares my background and values. Projects highlight real-world work with a focus on outcomes. Experience outlines my academic and professional history, including relevant roles, internships, skills and tools acquired along the way. Blog entries (like this one) demonstrate my technical depth and problem-solving mindset. Testimonials (when applicable) show social proof and reinforce trust.",
                    "Each page is intentionally designed to continue the conversation, provide value, and position me as a reliable partner for technical work."
                ]
            },
            {
                subtitle: "3. Convert (Action): Turning Visitors into Leads",
                text: [
                    "At the bottom of the funnel, your visitor is ready to take the next step. Whether it’s filling out your contact form, booking a call, or downloading a resume, your site needs to make this process effortless.",
                    "To support conversion, I implemented clear, consistent calls to action (CTAs) across the site. Buttons like “Let’s Work Together,” “Book a Call,” or “Send a Message” are present on every page—ensuring the user always has a path forward.",
                    "I also kept the contact process simple: a single form powered by Nodemailer routes submissions directly to my inbox, ensuring I never miss an opportunity to connect.",
                ]
            },
            {
                subtitle: "Tech Stack & Tools",
                text: ["To build a site that’s fast, responsive, and scalable, I selected a modern full-stack toolset optimized for performance and developer experience:"]
            },
            {
                subtitle: "React.js",
                text: ["React provided the component-based structure I needed to build modular, reusable UI elements—from the navigation bar to project cards and forms."]
            },
            {
                subtitle: "Next.js",
                text: ["Next.js extends React with file-based routing and server-side rendering (SSR), both of which helped me improve page performance and SEO. I used static generation for most pages to keep load times minimal."]
            },
            {
                subtitle: "Tailwind CSS",
                text: ["Tailwind enabled fast and consistent styling using utility classes. It kept my styles scalable across devices and made it easier to iterate on the layout without managing complex CSS files."]
            },
            {
                subtitle: "TypeScript",
                text: ["TypeScript added type safety and better documentation to my codebase. I used it throughout to define props, states, and component interfaces—making the app easier to maintain and refactor."]
            },
            {
                subtitle: "Lucide Icons",
                text: ["Lucide Icons gave the site a clean, consistent visual language. I used icons for contact methods, action buttons, and section highlights to improve usability and aesthetics."]
            },
            {
                subtitle: "Nodemailer",
                text: ["For form submissions, I implemented Nodemailer to securely deliver user messages to my email. It allows me to receive leads without relying on third-party services, giving me full control over the contact process."]
            },
            {
                subtitle: "Lessons Learned & What I Would Improve",
                text: [
                    "Building this site taught me a valuable lesson: a developer portfolio should not just demonstrate skill—it should serve a strategic business purpose.",
                    "Here’s what I learned: A clear funnel structure helps visitors stay focused and take action. Performance and polish matter—subtle design flaws can undermine trust. Having CTAs throughout the site significantly increases the chance of engagement.",
                    "As for improvements, I plan to: Add more social proof (such as endorsements from classmates or professors). Implement a lightweight analytics tool to track engagement and behavior. Integrate a newsletter signup for longer-term lead capture.",
                    "This project also deepened my appreciation for UX thinking and how it directly impacts real-world results—even on a personal site."
                ]
            },
            {
                subtitle: "Final Thoughts",
                text: [
                    "Creating this portfolio wasn’t just a technical challenge—it was a strategic exercise in positioning, design, and communication. By treating my site like a product with a purpose, I now have a platform that not only reflects who I am as a developer but also works for me as a tool to create real opportunities.",
                    "If you're a student, a professor, a client, or a fellow developer, I invite you to explore the site, check out my code, or just reach out and connect.",
                    "Thanks for reading!"
                ]
            }

        ],
        image_card: "/blog/blog_01_card.png",
        image_banner: "/blog/blog_01.png",
        author: "Luis Villalón",
        date: "2025-06-20",
        readTime: "10 min read",
        category: "Full-stack Dev"
    },
];
export function getPostById(id: number) {
  return blogPosts.find(post => post.id === id);
}
export {
    blogPosts
};