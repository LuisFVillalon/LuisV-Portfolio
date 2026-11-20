import { getProjectByTitle } from './projects';

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
    /** Subjects studied, shown under "What I learned" on the Experience page. */
    courses: string[];
    /** Languages and tools only; '' when none. */
    tech: string;
    /** Titles of projects in projects.ts built during this program, linked under "What I learned". */
    built?: string[];
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
    /** Subjects covered, shown under "What I learned" on the Experience page. */
    topics: string[];
    /** Languages and tools only; '' when none. */
    tech: string;
    /** Courses within a learning path, each optionally linked to its own certificate. */
    courses?: { name: string; link?: string }[];
    cert_link?: string;
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
        link: 'https://sites.google.com/sdsu.edu/ai4businessv1/home'    
    },     
    {
        company: 'Second Course',
        position: 'Full-Stack Intern',
        time: 'Nov 2025 - Jan 2026',
        description: 'Developed a React Native application with Firestore as a backend for the App Store with the purpose of addressing food insecurity among college students.',
        tech:'React Native, Firestore Database, Expo Go, Github',
        link: 'https://www.secondcourse.co/'    
    }, 
    {
        company: 'Calexico Neighborhood House – Mission Thrift Store & Happy Kids Preschool and Daycare',
        position: 'SEO & Digital Marketing Strategist',
        time: 'Mar 2025 - Jun 2025',
        description: 'Strategized SEO and digital marketing to increase thrift store sales and preschool enrollment by coordinating with Shopify devs, managing inventory, and executing data-driven social media campaigns.',
        tech:'Meta Business Suite, Meta Ads Manager, Google Analytics, Shopify',
        link: 'https://www.facebook.com/nhclx/'    
    }, 
    {
        company: 'Sports Excitement',
        position: 'Front-End Developer Intern',
        time: 'Dec 2024 - Mar 2025',
        description: 'Developed a responsive web application, collaborated on UI/UX improvements, and optimized performance for a global sports platform.',
        tech:'HTML, Tailwind CSS, React.js, Figma, Github, Taiga',
        link: 'https://sportsexcitement.com/'
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
        institution: 'NXP Semiconductors',
        course: 'Engineering Bootcamp: Agentic AI in the Cloud',
        time: 'Feb 2026 - May 2026',
        description: 'Developed and deployed cloud-based agentic AI systems using LangChain, LLM APIs, RAG architectures, multi-agent orchestration, and scalable AWS/GCP under mentorship from the Design & Automation Team at NXP.',
        courses: ['RAG Systems', 'Multi-Agent Orchestration', 'Cloud Deployment (AWS/GCP)'],
        tech:'LLM APIs, LangChain, Python',
        built: ['Agentic Abstraction for Chip Engineering (AACE)'],
        link: 'https://www.nxp.com/'
    },    
    {
        institution: 'San Diego State University',
        course: 'Bachelor of Science in Computer Science, Minor in Mathematics',
        time: 'Aug 2025 - May 2027',
        description: 'Transferred from Imperial Valley College to complete a B.S. in Computer Science with a Minor in Mathematics, going deeper into algorithms, software systems, computer architecture, operating systems, and artificial intelligence.',
        courses: ['Data Structures', 'Algorithms', 'Software Systems', 'Computer Architecture', 'Operating Systems', 'Artificial Intelligence'],
        tech:'Python, C, C++',
        link: 'https://cs.sdsu.edu/'
    },
    {
        institution: 'Imperial Valley College',
        course: 'Associate of Science in Computer Science',
        time: 'June 2023 - Dec 2024',
        description: 'Earned an A.S. in Computer Science, building foundations in object-oriented programming and data structures with Java, plus assembly language, before transferring to San Diego State University.',
        courses: ['Data Structures', 'Object Oriented Programming', 'Assembly Language'],
        tech:'Java',
        link: 'https://www.imperial.edu/'
    },
    {
        institution: 'The Odin Project',
        course: 'Full Stack JavaScript',
        time: 'Jul 2022 - Apr 2024',
        description: 'Completed the Full Stack JavaScript curriculum from The Odin Project, gaining hands-on experience with front-end and back-end technologies.',
        courses: [],
        tech:'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB',
        built: ['Whats Poppin?', 'Tic-Tac-Toe', 'Library'],
        link: 'https://www.theodinproject.com/'
    }
];
const certificates: certificates[] = [
    {
        title: 'AI Fluency: Framework and Foundations',
        institution: 'Anthropic: Claude Academy',
        time: 'Sept 2026',
        description: 'Learned Anthropic\'s 4D AI Fluency framework (Delegation, Description, Discernment, Diligence) for deciding when to use AI, prompting it effectively, critically evaluating its outputs, and using it responsibly.',
        topics: ['AI Fluency', 'Prompt Design', 'Output Evaluation', 'Human-AI Collaboration', 'Responsible AI'],
        tech: '',
        cert_link: 'https://academy.claude.com/verify/c6af0df1db8e5e38e225f58e6e3a9c9b',
        institution_link: 'https://academy.claude.com/'
    },
    {
        title: 'Claude 101',
        institution: 'Anthropic: Claude Academy',
        time: 'Sept 2026',
        description: 'Learned to integrate Claude into everyday work, including structured prompting, reusable context with Projects and Skills, artifacts, connected tools, and research mode.',
        topics: ['Prompt Engineering'],
        tech: 'Claude Projects, Skills, Artifacts, Connectors, Claude Code',
        cert_link: 'https://academy.claude.com/verify/3222bc453c71b8ccd8c3f58443790589',
        institution_link: 'https://academy.claude.com/'
    },       
    {
        title: 'AI201 | Applications of AI Engineering',
        institution: 'CodePath',
        time: 'Sep 2026 - Nov 2026',
        description: 'Trained in AI-assisted software engineering, designing and developing complex systems, evaluating AI-generated code and automating backend integrations.',
        topics: ['RAG', 'Agentic workflows', 'Machine Learning', 'Data structures', 'Algorithms'],
        tech: '',
        institution_link: 'https://www.codepath.org/'
    },
    {
        title: 'TIP103 | Advanced Technical Interview Prep',
        institution: 'CodePath',
        time: 'Spring 2026',
        description:  'Strengthened data structures and algorithms proficiency through intensive technical interview preparation and peer-based problem solving.',
        topics: ['Data Structures', 'Algorithms', 'Collaboration', 'Critical Thinking'],
        tech: '',
        cert_link: 'https://drive.google.com/file/d/1NytGYb7hFF5FIvmpa5_flASpNuvmOtp_/view',
        institution_link: 'https://www.codepath.org/'
    },    
    {
        title: 'SEO',
        institution: 'HubSpot Academy',
        time: 'Feb 2025',
        description: 'Learned the fundamentals of search engine optimization, including keyword research, on-page and technical SEO, and link-building strategies to improve website visibility and rankings.',
        topics: ['Keyword Research', 'Backlink Strategies', 'Content Optimization', 'on-page SEO', 'Performance Tracking'],
        tech: '',
        cert_link: 'https://app-na2.hubspot.com/academy/achievements/mdm3m2ys/en/1/luis-villalon/seo',
        institution_link: 'https://academy.hubspot.com/'
    },
    {
        title: 'SEO II',
        institution: 'HubSpot Academy',
        time: 'Feb 2025',
        description: 'Learned foundational SEO principles, focusing on advanced strategies like topic clustering, content optimization, and technical SEO to drive higher search rankings and organic traffic',
        topics: ['Keyword Research', 'Backlink Strategies', 'Content Optimization', 'on-page SEO', 'Performance Tracking'],
        tech: '',
        cert_link: 'https://app-na2.hubspot.com/academy/achievements/mdm3m2ys/en/1/luis-villalon/seo',
        institution_link: 'https://academy.hubspot.com/'
    },
    {
        title: 'Introduction to MongoDB (Learning Path)',
        institution: 'MongoDB',
        time: 'May 2023',
        description: "Completed MongoDB's 11-course learning path (~16 hours), covering MongoDB Atlas and how to model, query and tune a document database.",
        topics: ['CRUD operations', 'Document model & data modeling', 'Indexes', 'Aggregation', 'Transactions', 'Atlas Search', 'Connecting from an app'],
        tech: '',
        // The title links to the learning-path certificate; each course links to its own (May 10-12, 2023). Getting Started has no certificate of its own.
        courses: [
            { name: 'Getting Started with MongoDB Atlas' },
            { name: 'MongoDB CRUD Operations: Insert and Find Documents', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-4e3af1ae-13e6-4900-833b-56e716cf5544-certificate.pdf' },
            { name: 'MongoDB and the Document Model', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-6ab3d8e3-afc1-4165-8a8f-12fd3709938a-certificate.pdf' },
            { name: 'MongoDB Atlas Search', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-7ad917f5-83ac-4e2d-8f63-5ed52f7f7d54-certificate.pdf' },
            { name: 'MongoDB Indexes', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-8449adb4-562d-484c-a1cc-9b31094740eb-certificate.pdf' },
            { name: 'MongoDB Transactions', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-8e6ceafe-90e6-45b0-a1b5-783357b79dce-certificate.pdf' },
            { name: 'Connecting to a MongoDB Database', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-b0507899-39ae-4502-8bb0-28d6aa5e6fde-certificate.pdf' },
            { name: 'MongoDB CRUD Operations: Replace and Delete Documents', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-bb03370d-335a-4810-8146-65a1019868fc-certificate.pdf' },
            { name: 'MongoDB CRUD Operations: Modifying Query Results', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-c29325bd-de71-4507-8134-563dc4b02cd9-certificate.pdf' },
            { name: 'MongoDB Data Modeling Intro', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-edac7760-318d-450f-8c0f-83cbb47c5196-certificate.pdf' },
            { name: 'MongoDB Aggregation', link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-9adc80cb-196a-43d1-a88e-11ab316bc731-certificate.pdf' },
        ],
        cert_link: 'https://ti-user-certificates.s3.us-east-1.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/f2aa516f-6634-4cdc-98a7-274d513040f0-luis-villalon-e0fa28a9-4056-40ae-8af9-89ed40629f11-certificate.pdf',
        institution_link: 'https://www.mongodb.com/'
    },    
    {
        title: 'Responsive Web Design',
        institution: 'freeCodeCamp',
        time: 'Oct 2022',
        description: 'Developer certification representing approximately 300 hours of responsive web design work.',
        topics: ['Responsive Design', 'Web Accessibility'],
        tech: 'HTML, CSS, CSS Frameworks',
        cert_link: 'https://www.freecodecamp.org/certification/LuisBoy/responsive-web-design',
        institution_link: 'https://www.freecodecamp.org/'
    },
    {
        title: 'Legacy JavaScript Algorithms and Data Structures',
        institution: 'freeCodeCamp',
        time: 'Oct 2022',
        description: 'Developer certification representing approximately 300 hours of JavaScript work.',
        topics: ['ES6 Features', 'Regular Expressions', 'Algorithms', 'Object-Oriented Programming', 'Functional Programming'],
        tech: 'JavaScript',
        cert_link: 'https://www.freecodecamp.org/certification/LuisBoy/javascript-algorithms-and-data-structures',
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
// kanso's details come from its projects.ts entry so the two stay in sync.
const kanso = getProjectByTitle('kanso');

const currentlyDoing: currentlyDoing[] = [
    ...(kanso
        ? [
              {
                  company: 'kanso',
                  position: 'Building a digital clarity notebook (tasks, notes, habits, mood)',
                  time: 'Present',
                  description: kanso.description,
                  tech: kanso.tech,
                  link: 'https://kanso-landing.vercel.app/',
              },
          ]
        : []),
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
        position: 'Bachelor of Science in Computer Science, Minor in Mathematics',
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

// Non-engineering work shown last on the Experience page.
type beyondTech = {
    title: string;
    org: string;
    link?: string;
    employers?: { name: string, link: string }[];
    time: string;
    description: string;
    skills: string;
};
const beyondTech: beyondTech[] = [
    {
        title: 'After School Enrichment Tutor',
        org: 'SPARKS, Calexico Unified School District',
        link: 'https://www.cusdk12.org/departments/educational-services/after-school-program/index.html',
        time: 'Dec 2023 - May 2024',
        description: 'Led engaging after-school enrichment classes on science, technology, engineering, art, and math (STEAM), fostering curiosity and hands-on learning for students.',
        skills: 'Leadership, Creativity, Adaptability, Communication, Problem-Solving, Organization, Engagement, Mentorship, Collaboration',
    },
    {
        title: 'Sales',
        org: 'Retail Industry',
        employers: [
            { name: 'Garlan\'s', link: 'https://www.garlans.com' },
            { name: 'Aeropostale', link: 'https://www.aeropostale.com' },
        ],
        time: '1+ year',
        description: 'Tracked sales performance and consistently met daily goals by engaging customers, driving purchases, and optimizing retail sales strategies.',
        skills: '',
    },
    {
        title: 'Emergency Medical Technician',
        org: 'American Medical Response',
        link: 'https://www.amr.net/',
        time: 'Feb 2022 - Sept 2022',
        description: 'Provided emergency medical care and basic life support during 911 calls and interfacility transports, ensuring patient stability and safety.',
        skills: 'Emergency Response, Patient Care, First Aid, Critical Thinking, Teamwork, Stress Management, Assessment',
    },
    {
        title: 'Customer Service',
        org: 'Food Service Industry',
        employers: [
            { name: 'After\'s', link: 'https://aftersicecream.com/' },
            { name: 'El Fogon', link: 'https://www.elfogonmexgrill.com/' },
            { name: 'KFC', link: 'https://www.kfc.com' },
            { name: 'The Habit', link: 'https://www.habitburger.com' },
        ],
        time: '3+ years',
        description: 'Gained hands-on experience in fast-paced food service environments, providing customer service, preparing food, and working efficiently as part of a team.',
        skills: '',
    },
];

// Homepage intro details. `openTo` (the roles Luis is looking for) renders on the
// homepage only when set.
type profile = {
    openTo?: string;
};
const profile: profile = {
    openTo: 'Early Career New Grad Software Engineer roles',
};

const resume = '/resumes/Luis_Villalon_Resume.pdf';

export {
    professionalExperience, education, certificates, techTools, currentlyDoing, leadership, beyondTech, profile, resume
};