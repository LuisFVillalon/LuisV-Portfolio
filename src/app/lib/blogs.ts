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
        title: "How Dropping Out and Saving Lives Led Me to Web Development",
        content: [
            {
                subtitle: "Introduction",
                text: [
                    "In 2016, I enrolled at the University of California, Riverside, as an environmental engineering major. Like many students fresh out of high school, I chose a major that sounded practical and impactful — but I didn’t truly understand what I was signing up for.",
                    "As the quarters went by, I began to realize something wasn’t clicking. I wasn’t engaged with the material. I wasn’t passionate about the work. I struggled to stay motivated, and my performance reflected it. I felt stuck, like I was on a path that I didn’t choose with intention — just one I fell into.", 
                    "By the time the COVID-19 pandemic hit in 2020, I was mentally burned out and academically floundering. That’s when I made one of the hardest decisions of my life: I dropped out."
                ]
            },
            {
                subtitle: "Searching for Direction",
                text: [
                    "Leaving college wasn’t a relief — it was a heavy, uncertain transition. I didn’t have a clear plan, but I did know one thing: I wanted to be useful. I wanted to give back to my community in a real, tangible way. I didn’t need a dream job — I needed a purpose.", 
                    "That search led me to emergency medical services (EMS)."
                ]
            },
            {
                subtitle: "EMS: A Crash Course in Purpose and Hard Work",
                text: [
                    "What drew me to EMS was its practicality. It was a hands-on trade — a skill you could learn, certify, and immediately put to work. I liked the idea that I could show up for people in moments that mattered most. I liked that it felt urgent, useful, and grounded in service.", 
                    "Working in EMS gave me a new sense of purpose, and it gave me something else too: perspective. I saw people from all walks of life — struggling, hurting, surviving. I saw just how hard people work every day to get by, and how little room there is for error when you’re living paycheck to paycheck. It humbled me. It showed me the real meaning of hard work.", 
                    "At the same time, it made me reflect on what I wanted for my own future. I respected the work, but I also saw its limitations — physically, emotionally, and financially. I realized that if I wanted more stability and long-term growth, I would need to build a new kind of opportunity for myself."
                ]
            },
            {
                subtitle: "From Public Service to Self-Study",
                text: [
                    "There was one idea from EMS that stuck with me: I had trained myself to save lives. That gave me confidence — confidence that I could train myself to do something else.”",
                    "That’s when I started looking into web development.",
                    "At first, I knew almost nothing about tech. But the more I learned, the more it pulled me in. Web development was everything I was looking for: creative, technical, constantly evolving, and — most importantly — useful. I realized that being able to build websites and applications wasn’t just a valuable skill, it was something I could offer to others.",
                    "I taught myself how to code — starting with free resources, YouTube videos, and online courses. I stayed up late working through problems, building projects from scratch, and learning how the web works, layer by layer. It was tough, but I enjoyed the challenge. Unlike before, I was choosing this path — and I felt excited to wake up and learn."
                ]
            },
            {
                subtitle: "Why Web Development Matters to Me",
                text: [
                    "One of the biggest reasons I chose tech — and specifically web development — is that it gives me a way to create value for my community. Whether it’s building a website for a local business or developing a tool to solve a small problem, I can use what I know to help people.",
                    "Another reason is that tech never stands still. New languages, frameworks, and tools are always emerging. That means I’ll never stop learning — and that’s something I’ve come to crave. In this field, growth isn’t optional, it’s built into the job.",
                    "And for someone like me, who once felt stuck, that’s a gift.",
                ]
            },
            {
                subtitle: "Coming Back Stronger",
                text: [
                    "After gaining confidence through self-study, I decided to go back to college — this time with a clearer purpose. I earned an Associate of Science in Computer Science from Imperial Valley College, and I’m currently pursuing my Bachelor’s degree in Computer Science at San Diego State University.",
                    "But my learning didn’t begin in the classroom. I came back to school as a self-taught full-stack developer, with experience in HTML, CSS, JavaScript, React, Node.js, databases, and building real-world projects. I’ve learned not just how to code, but how to think like a builder — how to break down problems, learn what I don’t know, and adapt.",
                ]
            },
            {
                subtitle: "Final Thoughts",
                text: [
                    "I didn’t take a traditional path to tech — and I’m proud of that. Dropping out of college, working in EMS, and teaching myself how to code wasn’t easy. But each step taught me something important:",
                    "Dropping out of college taught me the importance of pursuing something you’re truly passionate about. EMS taught me the value of hard work and the impact of serving your community. Web development showed me that passion and service don’t have to be separate — they can be one and the same.",
                    "Today, I’m a full-stack developer, a computer science student, and someone who’s committed to lifelong learning — not just for myself, but for my community.",
                    "If there’s one thing I’ve learned, it’s that the path may not always be clear — but with the right mindset and work ethic, you can build something meaningful from wherever you start."
                ]
            },
        ],
        image_card: "/blog/blog_02_card.png",
        image_banner: "/blog/blog_02.png",
        author: "Luis Villalón",
        date: "2025-06-18",
        readTime: "5 min read",
        category: "Career Dev"
    }, 
    {
        id: 2,
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
        date: "2025-06-19",
        readTime: "10 min read",
        category: "Web Dev"
    },
    {
        id: 3,
        title: "Choosing the Right Rendering Strategy for Your Web Application: Client-Side vs. Server-Side Rendering",
        content: [
            {
                subtitle: "Abstract",
                text: [
                    "This article explores the two dominant rendering strategies in modern web development: client-side rendering (CSR) and server-side rendering (SSR). It provides a technical overview of how each approach works, and compares their respective advantages and limitations from both user and developer perspectives. Key considerations such as performance, search engine optimization (SEO), accessibility, and developer experience are discussed in depth. The article also examines hybrid and emerging approaches, and concludes with a real-world case study to illustrate how these rendering methods are applied in practice.",
                ]
            },
            {
                subtitle: "Introduction",
                text: [
                    "In web development, rendering refers to the process of generating the visual content that users see on their screens—essentially, how a web page’s code (HTML, CSS, JavaScript) is translated into the interactive layout in a browser. The decision of where this rendering happens—on the client or on the server—can significantly impact a website’s performance, accessibility, and SEO.", 
                    "Client-Side Rendering (CSR) and Server-Side Rendering (SSR) represent two fundamentally different approaches to this process. With CSR, the browser constructs the page using JavaScript after receiving a mostly empty HTML shell. SSR, on the other hand, sends a fully-formed HTML document directly from the server to the browser.",
                    "For web developers building applications for clients, choosing the right rendering approach means balancing trade-offs between speed, interactivity, scalability, SEO, and maintenance. This article provides a structured guide to making that decision, backed by technical insights and real-world use cases."
                ]
            },
            {
                subtitle: "Technical Overview",
                text: [
                    "Client-Side Rendering (CSR) is a rendering strategy where the browser is responsible for building and displaying the content of a web page using JavaScript. When a user visits a site that uses CSR, the server returns a basic HTML document—often containing little more than a root element and links to JavaScript bundles. These scripts are then downloaded and executed in the browser, which constructs the user interface dynamically using libraries or frameworks like React, Vue, or Angular.", 
                    "One of the primary advantages of CSR is the ability to create highly interactive, single-page applications (SPAs). Since routing and component updates are handled entirely in the browser after the initial page load, users experience smooth and fast transitions between views without triggering full page reloads. This creates a modern, app-like experience that many users now expect. CSR also places less computational demand on the server, as the server's role is primarily to deliver static assets like HTML, CSS, and JavaScript files. This architecture often scales well with the use of Content Delivery Networks, a system of distributed servers located around the world that work together to deliver web content, and static hosting services.", 
                    "However, CSR comes with several notable limitations. Because the browser must download, parse, and execute JavaScript before rendering any meaningful content, users may encounter a delay before the page becomes visible or usable. This negatively affects performance metrics like Time to First Paint (FCP) and Largest Contentful Paint (LCP), particularly on slower networks or devices. In addition, CSR can be problematic for SEO. Since the initial HTML returned from the server contains no actual content, web crawlers may struggle to index the page properly unless the application is configured with additional tooling or prerendering strategies. CSR can also be challenging for accessibility, as assistive technologies may not function correctly until the JavaScript has finished rendering the DOM. Finally, complex client-side applications often require sophisticated state management, which can increase development difficulty and introduce additional performance considerations.",
                    "Server-Side Rendering (SSR) shifts the responsibility of content generation back to the server. When a user requests a page, the server processes the application code, generates the complete HTML content for that specific page, and returns it to the browser fully rendered. The browser can then display the content immediately, even before any JavaScript has loaded. Once the JavaScript bundle arrives, it hydrates the page, enabling interactivity by connecting the static HTML to client-side logic.",
                    "One of the most significant advantages of SSR is improved performance during the initial page load. Since the HTML arrives fully rendered, users see meaningful content faster, which improves metrics like FCP and LCP. SSR also offers substantial benefits for SEO, as search engine bots can index server-rendered pages more easily without requiring JavaScript execution. This makes SSR especially valuable for marketing websites, blogs, e-commerce stores, and any application that relies on visibility in search engine rankings. Furthermore, SSR enhances accessibility by providing content that is immediately available to screen readers and other assistive technologies, independent of JavaScript execution.",
                    "Despite these advantages, SSR introduces trade-offs in complexity and scalability. Every request requires the server to execute rendering logic and generate fresh HTML, which places a heavier computational burden on server infrastructure. As traffic increases, this can lead to slower response times and higher operational costs unless careful caching and load balancing strategies are employed. Moreover, SSR requires a process called hydration, which reattaches the client-side JavaScript to the server-rendered HTML. Hydration must be handled precisely to avoid mismatches between server and client output, which can result in rendering errors or degraded performance. Compared to CSR, SSR often involves a more complex deployment pipeline and backend setup, as it typically requires serverless functions or a Node.js runtime environment, rather than simple static file hosting.",
                ]
            },
            {
                subtitle: "Performance and User Experience Review",
                text: [
                    "Rendering strategy directly impacts how users experience a web application, particularly in terms of how quickly content appears and becomes usable. To evaluate this, developers and engineers often rely on a set of performance metrics that reflect the real-world responsiveness of a page. These include Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to Interactive (TTI)—each offering insight into a different phase of the user’s experience.",
                    "Time to First Byte (TTFB) measures the amount of time it takes for the browser to receive the first byte of data from the server after making a request. It reflects the efficiency of the server-side processing and network latency. In SSR, TTFB tends to be higher than in CSR because the server must execute application logic and render the full HTML before it can send anything back. This delay is especially noticeable under heavy load or with complex dynamic content. In CSR, on the other hand, TTFB is generally lower, as the server simply returns a static HTML shell and offloads rendering to the browser.",
                    "First Contentful Paint (FCP) is the point at which the browser renders the first piece of content—such as text, an image, or a background element—on the screen. It’s a key indicator of how quickly users perceive that the page is loading. In CSR applications, FCP is often delayed because the browser must wait for JavaScript bundles to load and execute before any content can appear. This leads to a brief but noticeable blank screen. SSR applications typically deliver better FCP times because the server sends fully-rendered HTML that the browser can display immediately upon receiving it.",
                    "Largest Contentful Paint (LCP) tracks when the largest visible element on the page—such as a hero image, headline, or main text block—finishes rendering. It’s a critical user-perceived performance metric, as it indicates when the page’s primary content becomes visible. CSR can struggle with LCP because rendering is entirely JavaScript-dependent; if scripts are large or the device is slow, the largest content might not appear until several seconds after the initial request. SSR improves LCP by sending this content pre-rendered, allowing the browser to display it much earlier in the load process.",
                    "Time to Interactive (TTI) refers to the time it takes for the page to become fully interactive—that is, when the user can click buttons, type in forms, or navigate without delay. In CSR, TTI often lags behind because all JavaScript must be parsed and executed before event handlers are attached and components become responsive. SSR can also experience delays in TTI due to the hydration process, where the static HTML must be “wired up” with JavaScript to enable interactivity. While SSR delivers content faster, the page may not be fully usable until hydration completes.",
                    "From a user experience perspective, these differences are tangible. CSR-based applications often feel sluggish on the initial page load, especially on slower devices or networks. The blank screen before content appears and the lag in interactivity can create a poor first impression. However, once loaded, CSR typically provides faster transitions between pages, since routing and rendering happen entirely in the browser without round-trips to the server.",
                    "In contrast, SSR offers a faster and more stable initial experience. The user sees meaningful content almost immediately, which improves perceived speed, accessibility, and trust. This is especially valuable for public-facing pages like homepages, blogs, or product listings. However, repeated navigation in SSR applications can be slower if the server must re-render each page on request, unless caching or hybrid techniques are used.",
                    "Modern frameworks aim to combine the strengths of both approaches. Technologies like Next.js, Nuxt.js, and SvelteKit support hybrid rendering strategies—such as Static Site Generation (SSG), Incremental Static Regeneration (ISR), and edge-based SSR—to balance TTFB, FCP, LCP, and TTI across different use cases. These tools allow developers to optimize routes independently based on how critical they are to SEO, performance, or user interactivity.",
                    "In summary, rendering strategy is tightly linked to how users perceive and interact with web applications. CSR prioritizes interactivity and scalability at the cost of slower first impressions, while SSR improves initial performance and accessibility with a trade-off in complexity and server load. Understanding and measuring these trade-offs using real performance metrics is essential for making informed architectural decisions in modern web development."
                ]
            },
            {
                subtitle: "SEO and Accessibility Considerations",
                text: [
                    "Search engine optimization (SEO) and accessibility are critical aspects of modern web development, especially for public-facing applications where discoverability and inclusive design can directly influence user engagement and business outcomes. Rendering strategy—whether client-side or server-side—has a significant impact on both of these concerns.",
                    "From an SEO perspective, Server-Side Rendering (SSR) generally offers stronger support out of the box. Because SSR delivers fully-formed HTML content on the initial request, web crawlers such as those used by Google, Bing, and other search engines can immediately parse and index page content without requiring JavaScript execution. This improves the likelihood that the page’s text, metadata, and semantic structure will be accurately represented in search results. SSR also makes it easier to ensure that essential SEO elements—such as , tags, and structured data (e.g., JSON-LD for rich snippets)—are available during the initial page load, rather than being dynamically inserted later by client-side scripts.",
                    "In contrast, Client-Side Rendering (CSR) poses challenges for SEO. Since the browser receives a mostly empty HTML shell and relies on JavaScript to populate the page, search engine bots may not see the actual content unless they support JavaScript execution. While modern crawlers like Googlebot are capable of executing JavaScript, this process introduces delays and inconsistencies. Pages rendered client-side may be indexed later or not at all, particularly if rendering is blocked by large scripts, complex dependencies, or race conditions in the code. To mitigate these issues, developers using CSR often resort to workarounds such as prerendering static snapshots or using headless browsers like Puppeteer to generate HTML for bots. These techniques can be effective but add additional layers of tooling and maintenance.",
                    "Accessibility is another area where SSR has a natural advantage. By delivering fully-rendered HTML from the start, SSR ensures that screen readers and other assistive technologies have immediate access to the page’s semantic structure and content. This is particularly important for users who rely on keyboard navigation, screen readers, or browser extensions that interpret HTML and ARIA roles. SSR reduces the chance of timing-related issues, such as interactive elements appearing only after JavaScript execution or dynamic content failing to announce itself properly.",
                    "CSR, on the other hand, requires careful attention to accessibility best practices. Since much of the content is generated after the page has loaded, assistive technologies may encounter an empty or incomplete DOM when parsing begins. Developers must ensure that dynamic content updates are properly announced using ARIA live regions, and that focus management, keyboard accessibility, and tab order are all handled explicitly. In larger applications, accessibility bugs often emerge when components are reused or updated asynchronously without fully accounting for how assistive tools will interpret them.",
                    "Frameworks like React, Vue, and Angular do offer tools to support accessible development in CSR workflows, but the burden is on developers to apply these tools consistently and correctly. Meanwhile, hybrid rendering approaches—where the initial content is server-rendered and then enhanced with client-side interactivity—can provide the best of both worlds. These approaches deliver SEO-friendly, accessible HTML while still enabling rich, app-like experiences for users.",
                    "Ultimately, both rendering strategies can be made SEO- and accessibility-friendly, but SSR provides a more stable foundation for both concerns. For projects where search visibility and inclusive design are top priorities, SSR—or a hybrid SSR/CSR approach—can significantly reduce the risk of content being missed or misunderstood by search engines and assistive technologies.",
                ]
            },
            {
                subtitle: "Developer Experience and Scalability",
                text: [
                    "The choice between CSR and SSR also greatly affects how developers interact with a project and how well the application scales in production environments. From a developer’s perspective, CSR tends to offer a simpler development workflow. It allows for decoupling the frontend from any backend server logic, enabling rapid prototyping and iteration. Frameworks like React, Vue, and Angular are commonly used in CSR applications and provide extensive tooling for managing routing, state, and components.",
                    "However, as applications grow, CSR can introduce complexity, particularly in state management, code splitting, and asynchronous data fetching. Large JavaScript bundles can also hinder performance, requiring developers to adopt optimization strategies such as lazy loading or tree shaking.",
                    "SSR introduces a steeper learning curve and a more complex build and deployment pipeline. Developers need to handle server logic, manage server-client rendering consistency, and maintain backend environments. That said, frameworks like Next.js and Nuxt.js simplify much of this complexity by abstracting routing, data fetching, and rendering modes into a unified workflow. These frameworks support features like automatic code splitting, static exports, and incremental regeneration.",
                    "From a scalability perspective, CSR scales more easily because it depends on static asset delivery, which can be efficiently distributed via global CDNs. The server’s role is minimal, reducing the operational load. SSR, by contrast, can place substantial strain on backend infrastructure, particularly when rendering content dynamically on every request. To mitigate this, SSR applications often rely on caching, edge functions, or serverless rendering to maintain scalability while improving performance.",
                    "Choosing between CSR and SSR involves understanding not just the technical merits but also the developer team's experience, deployment capabilities, and the application's expected traffic patterns and complexity.",
                ]
            },
            {
                subtitle: "Hybrid and Emerging Approaches",
                text: [
                    "Recognizing that no single rendering strategy fits all use cases, many modern frameworks now support hybrid rendering. This allows developers to use different strategies on a per-route or per-component basis, combining the strengths of CSR and SSR.",
                    "For example, Static Site Generation (SSG) pre-renders pages at build time, making them ideal for content that doesn't change frequently. Incremental Static Regeneration (ISR) expands on this by allowing pages to be updated after deployment without rebuilding the entire site.",
                    "Edge-side rendering and streaming rendering are also gaining traction. These methods bring rendering closer to the user—geographically speaking—by leveraging edge computing platforms like Cloudflare Workers or Vercel Edge Functions. This minimizes latency and improves performance. Streaming, particularly with React 18’s concurrent features, enables content to be progressively rendered and displayed, enhancing perceived load times.",
                    "New paradigms such as partial hydration and islands architecture—exemplified by frameworks like Astro and Qwik—seek to deliver fully static pages with only the interactive components hydrated. This significantly reduces JavaScript payloads and boosts performance.",
                    "These emerging techniques reflect a broader trend toward context-aware rendering, where developers dynamically choose the best strategy based on performance goals, user context, and infrastructure capabilities. As rendering tools continue to evolve, developers are empowered to fine-tune their strategies and provide optimal user experiences while maintaining scalable and maintainable codebases."
                ]
            },
            {
                subtitle: "Case Study: Netflix — Balancing SSR and CSR for Performance and Interactivity",
                text: [
                    "Netflix, one of the world’s leading streaming platforms, serves millions of users globally with rich, dynamic content that demands both rapid loading and highly interactive features. To meet these requirements, Netflix employs a sophisticated hybrid rendering approach that leverages both server-side rendering (SSR) and client-side rendering (CSR), utilizing the strengths of each method to optimize performance and user experience.",
                    "For the initial page load, Netflix uses SSR to generate the full HTML markup on the server, delivering key content such as movie thumbnails, titles, and descriptions directly to the browser. This approach ensures that users see meaningful content almost immediately, significantly improving perceived load times by reducing metrics such as First Contentful Paint (FCP) and Largest Contentful Paint (LCP). SSR also benefits SEO efforts on public-facing pages like marketing content and help documentation, improving discoverability by search engines even though much of Netflix’s core content remains behind authenticated walls.",
                    "Once the initial content is rendered, Netflix switches to CSR to manage subsequent interactions. Navigation between categories, content selection, and profile management occur on the client side, providing seamless transitions without full page reloads. This approach creates a smooth, app-like experience expected by users and helps reduce server load and latency during continued use.",
                    "To support this hybrid architecture at scale, Netflix leverages Content Delivery Networks (CDNs) and edge computing to cache static assets and pre-rendered HTML closer to users worldwide. Furthermore, their engineering teams continuously optimize hydration processes—where JavaScript activates interactive components after SSR—to minimize delays and deliver responsiveness without compromising initial load speed.",
                    "Netflix’s implementation highlights common engineering challenges such as managing hydration mismatches, synchronizing application state between client and server, and ensuring accessibility across diverse devices and network conditions. Nonetheless, their successful use of hybrid rendering demonstrates how carefully balancing SSR and CSR can deliver both speed and interactivity in large-scale web applications.",
                    "For web developers deciding between rendering strategies, Netflix offers a real-world example of tailoring approaches based on performance priorities, SEO needs, and operational scalability. By combining SSR for fast initial loads and SEO with CSR for rich interactivity, Netflix exemplifies the power of hybrid rendering architectures to meet complex user and business demands."
                ]
            },
            {
                subtitle: "Conclusion",
                text: [
                    "Choosing the right rendering strategy for a client’s web application is a multifaceted decision that hinges on balancing performance, SEO, accessibility, developer experience, and scalability. Client-Side Rendering (CSR) excels in delivering rich, interactive single-page applications with efficient scalability through static asset distribution, but it may face challenges in initial load times and SEO. Server-Side Rendering (SSR), conversely, prioritizes fast content delivery and SEO-friendly markup at the cost of greater server complexity and potential scalability bottlenecks.",
                    "Hybrid approaches and emerging techniques offer the best of both worlds, enabling developers to tailor rendering methods at a granular level to meet specific project requirements. As demonstrated by Netflix’s sophisticated architecture, leveraging SSR for rapid initial content display alongside CSR for seamless interactivity can create highly performant, user-friendly experiences at scale.",
                    "Ultimately, understanding the technical trade-offs and aligning them with business goals, user expectations, and infrastructure capabilities empowers developers to make informed architectural choices. By thoughtfully selecting or combining rendering strategies, web applications can achieve optimal speed, accessibility, and maintainability—delivering measurable value to clients and end users alike.",
                ]
            }
        ],
        image_card: "/blog/blog_03_card.png",
        image_banner: "/blog/blog_03.png",
        author: "Luis Villalón",
        date: "2025-06-22",
        readTime: "20 min read",
        category: "Web Dev"
    },
    {
        id: 4,
        title: "LLM-Powered Bible Tutor — A Deep Technical Breakdown + Engineering Reflection",
        "content": [
            {
            "subtitle": "Introducing the Vision Behind the Project",
            "text": [
                "The idea for this project began with a simple question: What if we could create an AI tutor that explains the Bible while staying completely grounded in Scripture itself? Large language models are powerful, but they sometimes invent content if they’re not given strict guardrails. When dealing with Scripture, accuracy isn’t optional — it’s essential.",
                "I wanted to build a system that could provide faithful, citation-backed explanations of the Catholic Douay–Rheims Bible. This felt like the perfect opportunity to combine my interest in AI engineering with my desire to build something meaningful for Christian-Catholic education. From the beginning, I knew I wanted retrieval-augmented generation (RAG) at the core, ensuring every generated answer explicitly tied back to real verses.",
                "What emerged was a full-stack RAG pipeline: a system that embeds 35,800+ Bible verses, stores them in ChromaDB, retrieves the most relevant passages through semantic search, and uses GPT-4o-mini to generate grounded, verse-cited answers. The result is an AI tutor that actually studies the Bible instead of guessing."
            ]
            },
            {
            "subtitle": "Defining the Technical Problem and Constraints",
            "text": [
                "Building an AI Bible tutor might seem simple at first glance. After all, it’s just “ask a question → get an answer.” But doing this responsibly required tackling several engineering challenges.",
                "The first challenge was ensuring theological accuracy. Without retrieval, even the best language models hallucinate biblical content. My system needed verifiable sourcing. That requirement alone shaped the entire architecture.",
                "The second challenge was scale. The Douay–Rheims Bible contains nearly 36,000 verses. Indexing the text required a robust embedding pipeline, efficient storage, and a smooth retrieval process that wouldn’t buckle under heavy usage.",
                "The third challenge was query alignment. User questions vary widely — from “What does the Bible say about forgiveness?” to “Explain John 6:54 in context.” A strong semantic search and prompt-engineering layer was needed so that GPT-4o-mini always received the right context.",
                "And finally, I wanted this system to remain fast, affordable, and deployable by everyday developers. That meant using lightweight but powerful tools: ChromaDB, LangChain, and GPT-4o-mini."
            ]
            },
            {
            "subtitle": "Building the Foundation: Preparing and Structuring the Dataset",
            "text": [
                "I started with the Douay–Rheims Catholic Bible, a public-domain translation known for its formal, robust wording. I converted the entire dataset into a structured CSV format with four essential columns: Book, Chapter, Verse, and Text.",
                "This structure allowed the embedding pipeline to treat each verse as its own independent document while still preserving enough metadata to return detailed citations in answers.",
                "This attention to structure paid off later when implementing retrieval, since every piece of context had to be retrievable and explainable."
            ]
            },
            {
            "subtitle": "Designing the Embedding Pipeline",
            "text": [
                "To power semantic search, I used the text-embedding-3-small model. It provides high-quality embeddings at extremely low cost, making it ideal for large-scale ingestion.",
                "A major challenge was batching. Embedding tens of thousands of verses individually would be slow and expensive, so I built a pipeline that loads the dataset, splits it into batches, embeds each batch, and pushes vectors into ChromaDB.",
                "Batching kept memory usage stable and allowed the pipeline to run on modest hardware while indexing 35,800+ verses efficiently."
            ]
            },
            {
            "subtitle": "Engineering the Vector Database with ChromaDB",
            "text": [
                "I chose ChromaDB for its simplicity, speed, and local persistence. It integrates cleanly with LangChain and supports metadata filtering, which proved essential.",
                "Each stored entry includes verse text, book, chapter, verse metadata, an embedding vector, and a unique ID. This makes retrieval both fast and explanatory.",
                "Because Chroma supports flexible querying, the system can retrieve relevant verses even when user questions differ significantly from the biblical wording."
            ]
            },
            {
            "subtitle": "Building the RAG Pipeline with LangChain",
            "text": [
                "LangChain tied the entire workflow together. When a user submits a question, the system embeds it, performs semantic search through ChromaDB, retrieves top verses, and then builds a structured prompt.",
                "The prompt includes strict rules for grounding, citation formatting, and theological clarity. GPT-4o-mini then generates an answer using only the retrieved verses as source material.",
                "This strict prompting ensures that the model does not hallucinate content and remains fully grounded in the provided biblical text."
            ]
            },
            {
            "subtitle": "Creating Grounded, Faithful AI Explanations",
            "text": [
                "One of the most rewarding aspects of the project is how reliably the system produces grounded explanations. When users ask about forgiveness, suffering, love, or prayer, the tutor pulls verses that genuinely relate to the theme.",
                "Because retrieval is semantic, not keyword-based, the system can handle broad theological topics and verse-specific questions equally well.",
                "Every answer includes citations, which reinforces trust and makes the tool suitable for spiritual study, apologetics, or catechesis."
            ]
            },
            {
            "subtitle": "Optimizing Prompting and Model Behavior",
            "text": [
                "I experimented extensively with different prompting formats. The final version emphasizes theological clarity, clear citations, and strict reliance on retrieved verses.",
                "Even though GPT-4o-mini is a smaller model, the combination of strong prompting and high-quality retrieval allows it to produce surprisingly deep explanations.",
                "Prompt engineering became essential, especially when dealing with ambiguous or emotionally complex questions."
            ]
            },
            {
            "subtitle": "Evaluating System Performance and Limitations",
            "text": [
                "The system performs extremely well for most question types, but natural limitations exist. Retrieval depends on embedding quality, so the occasional question may require broader context than a standard semantic search can provide.",
                "GPT-4o-mini also has limited reasoning capacity compared to larger models, though the RAG approach compensates for this by giving it authoritative source text.",
                "The dataset currently includes only the Douay–Rheims Bible. Adding additional sources like the Catechism would enrich answers but increase architectural complexity."
            ]
            },
            {
            "subtitle": "Future Improvements and Planned Enhancements",
            "text": [
                "I plan to expand the system by adding the Catechism of the Catholic Church, allowing cross-referenced answers that blend Scripture and doctrine.",
                "A web-based user interface would make the tutor accessible to a broader audience. Additional improvements like hybrid search and streaming responses are also on the roadmap.",
                "Long-term features could include commentary mode, verse cross-analysis, and thematic devotional guidance."
            ]
            },
            {
            "subtitle": "Reflecting on Learning and Technical Growth",
            "text": [
                "This project deepened my understanding of RAG systems, embedding workflows, and metadata-driven architectures. It strengthened my appreciation for the power of structured retrieval.",
                "Building an AI that serves a meaningful purpose taught me how technology can support spiritual and intellectual growth when applied responsibly.",
                "More than anything, this project showed me how engineering becomes most fulfilling when aligned with purpose — using AI to help people learn Scripture more faithfully."
            ]
            }
        ],
        image_card: "/blog/blog_04_card.png",
        image_banner: "/blog/blog_04.png",
        author: "Luis Villalón",
        date: "2025-10-28",
        readTime: "15 min read",
        category: "Web Dev"
    },     
    {
        id: 5,
        title: "SHPE National Conference 2025: My Experience and the Guide I Wish I Had",
        content: [
            {
                "subtitle": "Deciding to Attend and Preparing for the Journey",
                "text": [
                    "Attending the SHPE National Conference 2025 was one of the most meaningful experiences of my undergraduate years. As a computer science student focused on full-stack development, I decided to attend with two ambitious goals: building a strong professional network and securing a summer internship. In the weeks leading up to the conference, I refined my resume, practiced my elevator pitch, and reviewed my past projects to ensure I could speak confidently about my work. I believed that strong projects and relevant experience would help me stand out, but I quickly learned that succeeding at SHPE requires far more than technical preparation—it requires strategy, confidence, and adaptability."
                ]
            },
            {
                "subtitle": "Finding Community in Region 2 and National Meetings",
                "text": [
                    "The first major events I attended were the SHPE Region 2 meeting and the National SHPE meeting. Both introduced me to a vibrant and welcoming community of students and professionals who were passionate about their fields and supportive of each other’s goals. These initial interactions eased my nerves and made me feel at home almost instantly. They also reminded me that SHPE is not just about job opportunities; it is a community rooted in shared experiences, cultural pride, and mutual encouragement. That sense of belonging would become a defining part of my conference experience."
                ]
            },
            {
                "subtitle": "Stepping Into the Career Fair and Navigating the Energy",
                "text": [
                    "The career fair was unlike anything I had encountered before—massive, fast-paced, and filled with opportunities. Booths from major companies stretched across the hall, and I spoke with representatives from Apple, Ford, Honeywell, Microsoft, Goldman Sachs, USAA, Global Foundries, Trimble, and more. Some lines were so long they lasted thirty minutes or more, but waiting in those lines became an unexpected networking opportunity. I met students from different universities, exchanged stories, and learned tips simply by talking to the people around me. That experience showed me that networking at SHPE happens everywhere, not just at the booths."
                ]
            },
            {
                "subtitle": "Understanding the Importance of Communicating Your Identity",
                "text": [
                    "As I navigated the fair, I realized how essential it is to clearly articulate your technical identity. Several times, I had strong conversations with recruiters but forgot to explicitly state that I am a computer science student specializing in full-stack development. Recruiters meet hundreds of students each day, and unless you intentionally communicate your role and skills, your message can get lost. I also discovered how powerful it is to highlight a standout project early in a conversation. With thousands of attendees, sharing something unique or memorable about your work becomes critical for making a lasting impression."
                ]
            },
            {
                "subtitle": "Facing My Technical Interviews and Learning From Them",
                "text": [
                    "I was fortunate to receive two technical interviews during the conference, which felt like significant accomplishments. However, the interviews also revealed areas where I was unprepared. Even though I could confidently discuss my projects, I struggled with the algorithmic and problem-solving style common in technical interviews. This experience taught me that projects and hands-on experience open doors, but technical interview skills—particularly LeetCode-style practice—determine how far you can go once those doors open. It was a humbling moment, but also an important reminder that growth is continuous."
                ]
            },
            {
                "subtitle": "Developing Effective Networking Habits Through Experience",
                "text": [
                    "One of the most rewarding parts of the conference was learning how to network more effectively. I made it a point to connect with attendees and recruiters on LinkedIn, and I quickly saw how important it is to follow up professionally and promptly. I also learned the value of asking for a specific point of contact whenever a recruiter showed interest. Near the end of the conference, Ford scheduled me for a virtual interview, but I never received a follow-up. Had I gotten a direct email or name, I could have reached out instead of waiting. This taught me that persistence and communication are essential when navigating professional opportunities."
                ]
            },
            {
                "subtitle": "Refining Strategies for Approaching Companies and Maximizing Time",
                "text": [
                    "Another insight I gained was the importance of researching which companies actually had roles relevant to my field before approaching their booths. With so many companies present, it’s easy to waste time speaking to organizations without computer science or software engineering opportunities. I also realized that printed resumes are becoming less necessary since many companies cannot accept physical copies anymore. Still, having a small stack is helpful for the few that do. Throughout the conference, I made it a habit to ask for LinkedIn connections, knowing that these relationships could become valuable in the future."
                ]
            },
            {
                "subtitle": "Overcoming the Challenge of Standing Out in a Competitive Environment",
                "text": [
                    "With thousands of talented students attending, standing out felt challenging at first. What helped me most was being authentic, confident, and intentional in my interactions. Rather than trying to impress everyone, I focused on expressing my genuine enthusiasm for software engineering and discussing the projects that best represented my abilities. I found that recruiters often responded more positively to natural, honest conversations than to overly rehearsed pitches. This shift in mindset made the experience less stressful and more rewarding."
                ]
            },
            {
                "subtitle": "What I Took Away From SHPE and How It Shaped My Goals",
                "text": [
                    "By the end of the conference, I had gained far more than I had anticipated. I expanded my professional network, improved my communication skills, and gained a clearer understanding of the expectations of the professional world. The experience helped me recognize the areas where I need to grow, especially in technical interview preparation. It also left me feeling more confident in my potential and more motivated than ever to continue improving. SHPE reminded me that growth is a constant process, and each step forward brings new opportunities."
                ]
            },
            {
                "subtitle": "Reflecting on the Impact and Looking Ahead",
                "text": [
                    "Ultimately, the SHPE National Conference 2025 was more than a career fair—it was a personal and professional turning point. I left with stronger skills, meaningful connections, and a deeper appreciation for the supportive community that SHPE fosters. For anyone considering attending in the future, I encourage you to go prepared, stay curious, and embrace every moment. The conference has the power to challenge you, inspire you, and help you grow in ways you might not expect. If my experience helps you navigate your own SHPE journey with more confidence and clarity, then this reflection has accomplished exactly what I hoped it would."
                ]
            }
        ],
        image_card: "/blog/blog_05_card.png",
        image_banner: "/blog/blog_05.png",
        author: "Luis Villalón",
        date: "2025-11-09",
        readTime: "10 min read",
        category: "Career Dev"
    },    
    {
        id: 6,
        title: "Innovation 4 SDSU — My First Hackathon Experience and What I Learned",
        "content": [
            {
            "subtitle": "Deciding to Join My First Hackathon",
            "text": [
                "My first hackathon experience took place at the Innovation 4 SDSU Hackathon, hosted by CTRL. I walked in with little idea of what the weekend would look like, only knowing the event ran from 9 a.m. to 7 p.m. on Saturday and from 9 a.m. to 3 p.m. on Sunday. It sounded intense but exciting.",
                "I arrived an hour early on the first day to settle in and get comfortable. As I waited, I struck up a conversation with a fellow student I knew from AI Club. We talked casually about the event, what we hoped to get out of it, and how we were both a little nervous but also eager to begin.",
                "A few minutes later, a friend from ACM walked in with someone from his network. After catching up, he asked if I wanted to join their team. The student I was talking to joined as well, and suddenly, we had a four-person team formed naturally before the hackathon even began. It felt like the perfect start."
            ]
            },
            {
            "subtitle": "Understanding the Prompt and Identifying a Real Problem",
            "text": [
                "This year’s challenge was to improve the living experience for SDSU students. The prompt was broad, giving teams a lot of flexibility in what problem they wanted to tackle.",
                "Our team quickly gravitated toward an issue affecting tens of thousands of commuter students: the growing problem of hit-and-runs in parking lots. It was something many of us had heard about, and some had even experienced firsthand.",
                "We researched how many commuter students were on campus and discovered that roughly 24,000 students commute each semester, totaling nearly 48,000 annually. That number alone showed the scale of the problem. Then we turned to Reddit and found countless posts from frustrated students asking for help, information, or simply venting about hit-and-runs that left them with repair bills and no answers.",
                "Seeing how common these stories were made the issue feel even more urgent. It became clear this wasn’t just an idea — it was a real student problem waiting for a solution."
            ]
            },
            {
            "subtitle": "Planning the Solution and Seeking Mentorship",
            "text": [
                "Instead of diving straight into coding, we spent the first four hours brainstorming, analyzing use cases, and getting clarity on what we wanted to build. This planning session became one of the most important parts of our project.",
                "We talked to two professional mentors who asked hard questions about our idea. They helped us refine our direction, think more clearly about the user experience, and decide which features mattered most for an MVP.",
                "Since all of us had experience in web development, we chose to build a web app. It allowed us to move quickly while still creating something functional and realistic. The goal was simple: empower students to support one another by reporting incidents and providing victims with evidence they could use."
            ]
            },
            {
            "subtitle": "Designing a Practical MVP for Real Use Cases",
            "text": [
                "We designed the web app around two primary pain points. The first was witnessing an incident. If a student saw a hit-and-run occur, they could file a report containing the victim’s license plate, images, a text description, the timestamp, and optionally their contact information.",
                "The second use case involved the victim. A student might return to their car to find it damaged with no note or explanation. They could search their license plate in our system to see if someone had submitted a report. If a matching report existed, they could download it and use it as documentation for an insurance claim.",
                "This workflow emphasized community support — one student helping another — without needing an official campus-run reporting system. It made the parking lots feel a little less anonymous and a little more connected."
            ]
            },
            {
            "subtitle": "Finding a Way to Incentivize Reporting",
            "text": [
                "One major obstacle we recognized early on was motivation. How could we encourage students to actually report what they saw? Relying purely on goodwill wasn’t enough.",
                "After talking to a mentor, we received a brilliant idea: Crash Coins. These digital tokens would reward users for creating verified reports. Students could redeem the coins for on-campus benefits or rewards.",
                "Crash Coins added a gamified element to the platform and provided a clear incentive for students to participate. This feature became one of the most creative parts of our entire proposal."
            ]
            },
            {
            "subtitle": "Building the App and Overcoming Technical Hurdles",
            "text": [
                "Once planning was finished, each team member took ownership of a different page of the app. I created the home page, the rewards page, and handled much of the page-to-page integration.",
                "We faced a critical challenge when deciding how to structure our backend. Implementing a database would take too long, and we didn’t want backend complexity to slow down our progress. After speaking with another mentor, we pivoted to using a simple JSON file to store all of our demo data.",
                "This approach let us focus on creating a working prototype without tripping over unnecessary setup. Our tech stack included React.js, Next.js, TypeScript, Tailwind CSS, and our JSON file acting as a temporary database.",
                "AI tools ended up being lifesavers. Whenever we ran into errors or needed quick debugging, AI helped resolve issues faster than we could manually. This allowed us to keep building at a steady pace despite the time constraints."
            ]
            },
            {
            "subtitle": "Polishing the User Experience and Preparing the Presentation",
            "text": [
                "By the end of the first day and into the early hours of the second, we had a working MVP. With the technical work mostly done, we shifted our focus to presentation quality.",
                "We wanted to create something memorable, not just another slide deck, so we filmed two short skit videos. These acted out real scenarios where our app would help students, making the problem and our solution easy to understand.",
                "We also recorded a screen demo of the app in use and created a clean, simple PowerPoint with clear speaking roles. We rehearsed repeatedly to make sure our three-minute presentation was smooth, engaging, and polished."
            ]
            },
            {
            "subtitle": "Presenting First Out of 29 Teams",
            "text": [
                "We were the first of twenty-nine teams to present. Going first is always intimidating because you don’t know what standards the judges have in mind. But we went in confident and prepared.",
                "Our videos, storytelling, and demo immediately caught people’s attention. After our presentation, many attendees and mentors approached us to say they loved our storytelling approach and that it was one of the strongest presentations they had seen.",
                "Starting strong set the tone for the rest of the event, and it felt rewarding to hear such positive feedback right away."
            ]
            },
            {
            "subtitle": "Winning Most Creative and Looking Toward the Future",
            "text": [
                "When the awards were announced, we learned we had won Most Creative, which felt incredibly validating. Our blend of real-world research, thoughtful design, and creative incentives like Crash Coins set our project apart.",
                "During the final share-out, we also discussed our long-term vision for the project, including transitioning to React Native for a smoother mobile experience and building out the full Crash Coin rewards system.",
                "Even though this was only our first hackathon, we left feeling proud and energized by what we had accomplished together."
            ]
            },
            {
            "subtitle": "Reflecting on Growth and What I Learned",
            "text": [
                "This hackathon taught me lessons I couldn’t have learned in a classroom. I realized the importance of planning before coding, the value of seeking mentorship early, and the impact a strong presentation can have on the perception of your project.",
                "On a personal level, I learned how exciting it is to work under pressure with a team of motivated peers. I felt myself growing more confident in my abilities while recognizing how much more I want to learn.",
                "For anyone thinking about joining their first hackathon, I can honestly say: go for it. Be open to new ideas, be willing to take risks, and don’t underestimate the power of creativity. It’s an experience that will challenge you, inspire you, and leave you with memories you won’t forget."
            ]
            }
        ],
        image_card: "/blog/blog_06_card.png",
        image_banner: "/blog/blog_06.png",
        author: "Luis Villalón",
        date: "2025-11-15",
        readTime: "10 min read",
        category: "Career Dev"
    },       
];
export function getPostById(id: number) {
  return blogPosts.find(post => post.id === id);
}
export {
    blogPosts
};