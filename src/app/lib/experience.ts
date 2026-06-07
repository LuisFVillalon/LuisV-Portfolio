type professionalExperience = {
    company: string;
    position: string;
    time: string;
    description: string;
    tech: string;
    link: string;    
  };
type education = {
    institution: string;
    course: string;
    time: string;
    description: string;
    tech: string;
    link: string;
};
type currentlyDoing = {
    company: string;
    position: string;
    time: string;
    description: string;
    tech: string;
    link: string;
};
type leadership = {
    company: string;
    position: string;
    time: string;
    description: string;
    tech: string;
    link: string;
};
type certificates = {
    title: string;
    institution: string;
    time: string;
    description: string;
    tech: string;
    cert_link: string;
    institution_link: string;
};
type techTools = {
    subject: string;
    tools: { tool: string, link: string }[];
};

const professionalExperience: professionalExperience[] = [
    {
        company: 'AI4Business Lab',
        position: 'Undergraduate Researcher: Adversarial Attacks & Defenses in Deep Learning',
        time: 'Jan 2026 - May 2026',
        description: 'Research AI agent trust, safety, and adversarial robustness, contributing to a three-layer trust-centered AI safety framework and designing a simple agent to study emerging autonomy and security vulnerabilities.',
        tech:'LLM APIs, LangChain, Python, RAG Systems',
        link: 'https://sites.google.com/sdsu.edu/ai4business/home'    
    },     
    {
        company: 'Second Course',
        position: 'Full-Stack Intern',
        time: 'Nov 2025 - Jan 2026',
        description: 'Developed a React Native application with Firestore as a backend for the Apple Store with the purpose of addressing food insecurity among college students.',
        tech:'React Native, Firestore Database, Expo Go, Github',
        link: 'https://www.secondcourse.co/food-security'    
    }, 
    {
        company: 'Calexico Neighborhood House – Mission Thrift Store & Happy Kids Preschool and Daycare',
        position: 'SEO & Digital Marketing Strategist',
        time: 'Mar 2025 - Jun 2025',
        description: 'Strategized SEO and digital marketing to increase thrift store sales and preschool enrollment by coordinating with Shopify devs, managing inventory, and executing data-driven social media campaigns.',
        tech:'Meta Business Suite, Meta Ads Manager, Google Analytics, Shopify',
        link: 'https://nhclx.org/'    
    }, 
    {
        company: 'Sports Excitement',
        position: 'Front-End Developer Intern',
        time: 'Dec 2024 - Mar 2025',
        description: 'Developed responsive a web application, collaborated on UI/UX improvements, and optimized performance for a global sports platform.',
        tech:'HTML, Tailwind CSS, React.js, Figma, Github, Taiga',
        link: 'https://www.linkedin.com/company/sportsexcitement/posts/?feedView=all'
    },
    {
        company: 'Ectron Corporation',
        position: 'Software Engineer Intern',
        time: 'Jun 2024 - Aug 2024',
        description: 'Led and collaborated in the development of a full-stack asset tracking application designed for commercial use. The application helped workers quickly locate essential tools and equipment upon arrival at job sites, improving efficiency and reducing downtime.',
        tech:'HTML, CSS, React.js, Next.js, Plasmic CMS, Express.js, Node.js, Microsoft Azure SQL Database',
        link: 'https://ectron.com/'    
    },

];
const education: education[] = [
    {
        institution: 'NxP Semiconductors',
        course: 'Engineering Bootcamp: Agentic AI in the Cloud',
        time: 'Feb 2026 - Apr 2026',
        description: 'Developed and deployed cloud-based agentic AI systems using LangChain, LLM APIs, RAG architectures, multi-agent orchestration, and scalable AWS/GCP under mentorship from the Design & Automation Team at NXP .',
        tech:'LLM APIs, LangChain, Python, RAG Systems',
        link: 'https://www.nxp.com/'
    },    
    {
        institution: 'San Diego State University',
        course: 'Bachelor of Science in Computer Science',
        time: 'Aug 2025 - May 2027',
        description: '',
        tech:'Python, C++, Data Structures, Algorithms, Software Systems, Computer Architecture, Artificial Intelligence',
        link: 'https://cs.sdsu.edu/'
    },
    {
        institution: 'Imperial Valley College',
        course: 'Associate of Science in Computer Science',
        time: 'June 2023 - Dec 2024',
        description: '',
        tech:'Data Structures, Object Oriented Programming, Java, Assembly Language',
        link: 'https://www.imperial.edu/'
    },
    {
        institution: 'The Odin Project',
        course: 'Full Stack JavaScript',
        time: 'Jul 2022 - Apr 2024',
        description: 'Completed the Full Stack JavaScript curriculum from The Odin Project, gaining hands-on experience with front-end and back-end technologies.',
        tech:'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB',
        link: 'https://www.theodinproject.com/'
    }
];
const certificates: certificates[] = [
    {
        title: 'TIP103 | Advanced Technical Interview Prep',
        institution: 'CodePath',
        time: 'Spring 2026',
        description:  'Strengthened data structures and algorithms proficiency through intensive technical interview preparation and peer-based problem solving.',
        tech: 'Data Structures, Algorithms, Collaboration, Critical Thinking',
        cert_link: 'https://drive.google.com/file/d/1NytGYb7hFF5FIvmpa5_flASpNuvmOtp_/view',
        institution_link: 'https://www.codepath.org/'
    },    
    {
        title: 'SEO',
        institution: 'HubSpot Academy',
        time: 'Feb 2025',
        description: 'Learned the fundamentals of search engine optimization, including keyword research, on-page and technical SEO, and link-building strategies to improve website visibility and rankings.',
        tech: 'Keyword Research, Backlink Strategies, Content Optimization, on-page SEO, Performance Tracking',
        cert_link: 'https://app-na2.hubspot.com/academy/achievements/mdm3m2ys/en/1/luis-villalon/seo',
        institution_link: 'https://academy.hubspot.com/'
    },
    {
        title: 'SEO II',
        institution: 'HubSpot Academy',
        time: 'Feb 2025',
        description: 'Learned foundational SEO principles, focusing on advanced strategies like topic clustering, content optimization, and technical SEO to drive higher search rankings and organic traffic',
        tech: 'Keyword Research, Backlink Strategies, Content Optimization, on-page SEO, Performance Tracking',
        cert_link: 'https://app-na2.hubspot.com/academy/achievements/mdm3m2ys/en/1/luis-villalon/seo',
        institution_link: 'https://academy.hubspot.com/'
    },
    {
        title: 'MongoDB Certifications',
        institution: 'MongoDB',
        time: 'May 2023',
        description: 'Completed several certifications verifying my knowledge of MongoDB NoSQL.',
        tech: 'Connection, Atlas, Aggregation, CRUD, Data Modeling, Indexes, Transactions, Document Model',
        cert_link: 'https://www.linkedin.com/in/luis-villalon/details/certifications/',
        institution_link: 'https://www.mongodb.com/'
    },    
    {
        title: 'Responsive Web Design',
        institution: 'freeCodeCamp',
        time: 'Oct 2022',
        description: 'Developer certification representing approximately 300 hours of responsive web design work.',
        tech: 'HTML, CSS, Responsive Design, CSS Frameworks, Web Accessibility',
        cert_link: 'https://www.freecodecamp.org/certification/LuisBoy/responsive-web-design',
        institution_link: 'https://www.freecodecamp.org/'
    },
    {
        title: 'Legacy JavaScript Algorithms and Data Structures',
        institution: 'freeCodeCamp',
        time: 'Oct 2022',
        description: 'Developer certification representing approximately 300 hours of JavaScript work.',
        tech: 'JavaScript, ES6 Features, Regular Expressions, Algorithms, Object-Oriented Programming, Functional Programming',
        cert_link: 'https://www.freecodecamp.org/certification/LuisBoy/responsive-web-design',
        institution_link: 'https://www.freecodecamp.org/'
    },        
];
const techTools: techTools[] = [
    {
        subject: 'Programming Languages',
        tools: [
            {
                tool: 'Python',
                link: 'https://python.org/'
            },
            {
                tool: 'C++',
                link: 'https://cplusplus.com/'
            },
            {
                tool: 'Java',
                link: 'https://docs.oracle.com/en/java/'
            },
            {
                tool: 'JavaScript',
                link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
            },
            {
                tool: 'TypeScript',
                link: 'https://www.typescriptlang.org/docs/'
            },            
        ]
    },
{
        subject: 'Agentic AI',
        tools: [
            {
                tool: 'LangGraph',
                link: 'https://www.langchain.com/langgraph'
            },
            {
                tool: 'RAG Systems',
                link: 'https://aws.amazon.com/what-is/retrieval-augmented-generation/'
            },
            {
                tool: 'LLM APIs',
                link: 'https://www.ibm.com/think/insights/llm-apis'
            }, 
        ]
    },    
    {
        subject: 'Frontend Development',
        tools: [
            {
                tool: 'HTML',
                link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
            },
            {
                tool: 'CSS',
                link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
            },        
            {
                tool: 'Tailwind CSS',
                link: 'https://tailwindcss.com/docs/installation/using-vite'
            },
            {
                tool: 'Next.js',
                link: 'https://nextjs.org/docs'
            },
            {
                tool: 'React.js',
                link: 'https://legacy.reactjs.org/docs/getting-started.html'
            },
            {
                tool: 'React Native',
                link: 'https://reactnative.dev/'
            },            
        ]
    },
    {
        subject: 'Backend Development',
        tools: [
            {
                tool: 'Node.js',
                link: 'https://nodejs.org/docs/latest/api/'
            },
            {
                tool: 'Pydantic',
                link: 'https://pydantic.dev/docs/validation/latest/get-started/'
            },            
            {
                tool: 'FastAPI',
                link: 'https://fastapi.tiangolo.com/'
            },
            {
                tool: 'Restful APIs',
                link: 'https://docs.github.com/en/rest?apiVersion=2022-11-28'
            }
        ]
    },    
    {
        subject: 'Databases',
        tools: [
            {
                tool: 'MongoDB',
                link: 'https://www.mongodb.com/docs/'
            },
            {
                tool: 'Google Firebase',
                link: 'https://firebase.google.com/docs'
            },
            {
                tool: 'PostgreSQL',
                link: 'https://www.postgresql.org/docs/'
            },
            {
                tool: 'Supabase',
                link: 'https://supabase.com/'
            }
        ]
    },
    {
        subject: 'Version Control & Project Management',
        tools: [
            {
                tool: 'GitHub',
                link: 'https://docs.github.com/en/get-started'
            },
            {
                tool: 'Git',
                link: 'https://git-scm.com/docs'
            }
        ]
    },
    {
        subject: 'Digital Marketing',
        tools: [
            {
                tool: 'Google Analytics',
                link: 'https://developers.google.com/analytics'
            },
        ]
    },
       
];
const currentlyDoing: currentlyDoing[] = [
    {
        company: 'CodePath',
        position: 'AI110 | Foundations of AI Engineering',
        time: 'Jun 2026 - Aug 2026',
        description: 'Trained in AI-assisted software engineering, applying AI-driven development techniques and the evaluation of AI-generated code to build and evaluate intelligent software systems.',
        tech:'RAG, Agentic workflows, Machine Learning, Data structures, Algorithms',
        link: 'https://www.codepath.org/'    
    },       
    {
        company: 'ColorStack',
        position: 'Outreach Chair',
        time: 'Jan 2026 - Present',
        description: 'Lead recruitment strategy and digital presence while building partnerships with industry professionals and campus organizations to drive member growth and connect members with career opportunities',
        tech:'Leadership, Teamwork, Communication, Networking, Community',
        link: 'https://www.colorstack.org/'    
    },     
    {
        company: 'San Diego State University',
        position: 'Bachelor of Science in Computer Science',
        time: 'Aug 2025 - May 2027',
        description: '',
        tech:'Python, C, C++, Data Structures, Algorithms, Software Systems, Computer Architecture, Artificial Intelligence, Operating Systems',
        link: 'https://cs.sdsu.edu/'
    },
]
const leadership: leadership[] = [
    {
        company: 'ColorStack',
        position: 'Outreach Chair',
        time: 'Jan 2026 - Present',
        description: 'Lead recruitment strategy and digital presence while building partnerships with industry professionals and campus organizations to drive member growth and connect members with career opportunities',
        tech:'Leadership, Teamwork, Communication, Networking, Community',
        link: 'https://www.colorstack.org/'    
    }, 
]

export {
    professionalExperience, education, certificates, techTools, currentlyDoing, leadership
};