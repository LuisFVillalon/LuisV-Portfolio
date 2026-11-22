import { getProjectByTitle } from './projects';

type professionalExperience = {
    company: string;
    position: string;
    time: string;
    /** A paragraph, or an array of points rendered as a bulleted list. */
    description: string | string[];
    tech: string;
    link: string;
  };
type education = {
    institution: string;
    course: string;
    time: string;
    /** A paragraph, or an array of points rendered as a bulleted list. */
    description: string | string[];
    /** Subjects studied, shown under "What I learned" on the Experience page. */
    courses: string[];
    /** Languages and tools only; '' when none. */
    tech: string;
    /** Titles of projects in projects.ts built during this program, linked under "What I learned"; `label` shortens the link text. */
    built?: (string | { title: string; label: string })[];
    link: string;
};
type currentlyDoing = {
    company: string;
    position: string;
    time: string;
    description: string | string[];
    tech: string;
    link: string;
};
type leadership = {
    company: string;
    position: string;
    time: string;
    description: string | string[];
    tech: string;
    link: string;
};
type certificates = {
    title: string;
    institution: string;
    time: string;
    /** A paragraph, or an array of points rendered as a bulleted list. */
    description: string | string[];
    /** Subjects covered, shown under "What I learned" on the Experience page. */
    topics: string[];
    /** Languages and tools only; '' when none. */
    tech: string;
    /** Courses within a learning path, each optionally linked to its own certificate. */
    courses?: { name: string; link?: string }[];
    /** Titles of projects in projects.ts built during this program, linked under "What I learned"; `label` shortens the link text. */
    built?: (string | { title: string; label: string })[];
    cert_link?: string;
    institution_link: string;
};
type techTools = {
    subject: string;
    /**
     * `featured` tools are the ones the homepage Stack tile shows (the rest become a "+N" link to
     * /experience#skills); `short` is an optional shorter name used there.
     */
    tools: { tool: string, link: string, featured?: boolean, short?: string }[];
};

const professionalExperience: professionalExperience[] = [
    {
        company: 'AI4Business Lab',
        position: 'Undergraduate Researcher: Adversarial Attacks & Defenses in Deep Learning',
        time: 'Jan 2026 - May 2026',
        description: [
            'Designed a deterministic Python agent that chooses which tools to use, and used it to study how that decision-making could be exploited',
            'Reviewed research on prompt injection and data poisoning in weekly team discussions',
            'Learned a three-layer trust-centered AI safety framework: psychological trust, technical safety, and security',
        ],
        tech:'Python, Agent design, Orchestration, Tool-use logic, AI security',
        link: 'https://sites.google.com/sdsu.edu/ai4businessv1/home'    
    },     
    {
        company: 'Second Course',
        position: 'Full-Stack Intern',
        time: 'Nov 2025 - Jan 2026',
        description: [
            "Improved a React Native and Firestore app used by 300+ college students to reduce food insecurity, and helped ship it to the App Store",
            "Connected app screens to Firebase/Firestore API calls, coordinating with the team's backend work to get data flowing into the app",
            "Fixed login and sign-up screens that broke when the keyboard opened, and restyled the news feed food card to match the app's theme",
            "Cleaned and restructured the codebase by removing unused files and making the code more modular and readable"
        ],
        tech:'TypeScript, Tailwind CSS, React Native, Firestore Database, Expo Go, Github',
        link: 'https://www.secondcourse.co/'    
    }, 
    {
        company: 'Calexico Neighborhood House – Mission Thrift Store & Happy Kids Preschool and Daycare',
        position: 'SEO & Digital Marketing Strategist',
        time: 'Mar 2025 - Jun 2025',
        description: [
            "Managed a $500+ enrollment marketing budget across door-to-door outreach, Instagram, newspaper and radio ads, signs across town, and tabling events; summer enrollment fell by about 37% (an estimate, from 80 to 50 children), versus the usual drop of more than half",
            "Organized an open house and school tours, and handled 3 to 5 parent inquiries per week by phone, email, and through the online enrollment form",
            "Managed the thrift store's Shopify store and its eBay and Letgo listings, assigning SKU numbers and organizing inventory for online sales",
            "Built the thrift store's online sales operation, which generated over $600 during his time there"
        ],
        tech:'Meta Business Suite, Google Analytics, Shopify, Canva, eBay, Letgo',
        link: 'https://www.facebook.com/nhclx/'    
    }, 
    {
        company: 'Sports Excitement',
        position: 'Front-End Developer Intern',
        time: 'Dec 2024 - Mar 2025',
        description: [
            "Rebuilt the login, sign-in, and sign-up pages for a youth sports social network from a Figma design as responsive front-end screens using CSS media queries",
            "Collaborated with backend, UI/UX, and marketing teams, as well as a scrum master, in weekly sprint meetings with approximately 10 teammates; completed assigned tasks and delivered front-end work that was not yet connected to a backend"
        ],
        tech:'Tailwind CSS, React.js, Figma, Github, Taiga',
        link: 'https://sportsexcitement.com/'
    },
    {
        company: 'Ectron Corporation',
        position: 'Software Engineer Intern',
        time: 'Jun 2024 - Aug 2024',
        description: [
            "Architected the system design for an asset-tracking prototype that shows field workers where job-site tools and equipment are located on an interactive map",
            "Developed the front end in React and Next.js, learned Plasmic CMS, and integrated Azure Maps and Azure SQL to locate 8 tracked assets, with click-to-zoom navigation from the asset list to the map",
            "Mentored three interns with no prior HTML or CSS experience, guiding them as they built the Express.js backend"
        ],
        tech: 'React.js, Next.js, Plasmic CMS, Azure Maps, Azure SQL Database, Express.js',
        link: 'https://ectron.com/'    
    },

];
const education: education[] = [
    {
        institution: 'San Diego State University',
        course: 'Bachelor of Science in Computer Science, Minor in Mathematics',
        time: 'Aug 2025 - May 2027',
        description: [
            'Built a focus on data science and machine learning to turn data into better applied AI products',
            'Pursued cybersecurity coursework to design more secure systems, preparing for a career in security',
        ],
        courses: ['Data Structures', 'Algorithms', 'Data Science', 'Machine Learning', 'Operating Systems', 'UNIX System Admin.', 'Software Security', 'Data Privacy'],
        built: ['Operating Systems', 'The Torchbearer: Algorithm Exam', 'NutriNav AI'],
        tech:'Python, C, C++, UNIX',
        link: 'https://cs.sdsu.edu/'
    },
    {
        institution: 'NXP Semiconductors',
        course: 'Engineering Bootcamp: Agentic AI in the Cloud',
        time: 'Feb 2026 - May 2026',
        description: [
            'Contributed to a multi-agent pipeline (Architect, Auditor, Stylist) that converts RTL hardware code into structured output, with verification loops to check accuracy',
            'Implemented the frontend and backend for a cloud-hosted agentic system on AWS, using Bedrock for models, S3 for run storage, and EC2 for hosting',
            "Collaborated with a team of five undergraduates under mentorship from NXP's Design & Automation Team",
        ],
        courses: ['Agent design', 'Tool-use logic', 'Prompt design', 'Verification Loops', 'Multi-Agent Orchestration', 'Cloud Infrastructure'],
        tech:'Python, FastAPI, Pydantic, LangGraph, Next.js, AWS Bedrock, S3, EC2, Graphviz',
        built: ['Agentic Abstraction for Chip Engineering (AACE)'],
        link: 'https://www.nxp.com/'
    },
    {
        institution: 'Imperial Valley College',
        course: 'Associate of Science in Computer Science',
        time: 'June 2023 - Dec 2024',
        description: 'Earned an A.S. in Computer Science, building foundations in object-oriented programming and data structures with Java, plus assembly language, before transferring to San Diego State University.',
        courses: ['Data Structures', 'Object Oriented Programming', 'Assembly Language'],
        tech:'Java',
        built: [
            'Pokedex',
            'Hang-Man',
            { title: 'Introduction to Object Oriented Programming', label: 'Intro to OOP' },
            'Introduction to Data Structures',
            'Assembly Language and Machine Organization',
        ],
        link: 'https://www.imperial.edu/'
    },
    {
        institution: 'The Odin Project',
        course: 'Full Stack JavaScript',
        time: 'Jul 2022 - Apr 2024',
        description: [
            "Completed The Odin Project's Full Stack JavaScript curriculum, building all nine projects",
            'Built a blog with JWT authentication and a REST API, a Pokémon photo game with a MongoDB leaderboard API, and a Reddit-style app on Firebase, among others',
        ],
        courses: ['Frontend', 'Backend', 'Full-stack', 'MERN'],
        tech:'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB',
        built: ['Whats Poppin?', 'Blog Template', 'Poke-Photo Tag', 'Pokedex Catalog', 'To Do List', 'Memory Card Game', 'Tic-Tac-Toe', 'Library', 'Rock, Paper, Scissors!'],
        link: 'https://www.theodinproject.com/'
    }
];
const certificates: certificates[] = [
    {
        title: 'AI201 | Applications of AI Engineering',
        institution: 'CodePath',
        time: 'Fall 2026',
        description: [
            'Built four AI systems:',
            'A RAG pipeline with a relevance gate',
            'A tool-using agent with MCP and failure handling',
            'A fine-tuned text classifier evaluated against a baseline and a staff-labeled set',
            'A confidence-scored API with rate limiting, audit logging, and adversarial testing',
            'Each system was tested against acceptance criteria written before any results existed.'
        ],
        topics: ['Retrieval-augmented generation', 'Agentic workflows and MCP', 'Fine-tuning and model evaluation', 'API design and rate limiting', 'Adversarial testing'],
        tech: 'Python',
        built: ['The Unofficial Guide', 'FitFindr', 'TakeMeter', 'Provenance Guard'],
        institution_link: 'https://www.codepath.org/'
    },
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
        cert_link: 'https://www.freecodecamp.org/certification/luisboy/responsive-web-design',
        institution_link: 'https://www.freecodecamp.org/'
    },
    {
        title: 'Legacy JavaScript Algorithms and Data Structures',
        institution: 'freeCodeCamp',
        time: 'Oct 2022',
        description: 'Developer certification representing approximately 300 hours of JavaScript work.',
        topics: ['ES6 Features', 'Regular Expressions', 'Algorithms', 'Object-Oriented Programming', 'Functional Programming'],
        tech: 'JavaScript',
        cert_link: 'https://www.freecodecamp.org/certification/luisboy/javascript-algorithms-and-data-structures',
        institution_link: 'https://www.freecodecamp.org/'
    },        
];
const techTools: techTools[] = [
    {
        subject: 'Programming Languages',
        tools: [
            {
                tool: 'Python',
                link: 'https://python.org/',
                featured: true,
            },
            {
                tool: 'C++',
                link: 'https://cplusplus.com/'
            },
            {
                tool: 'Java',
                link: 'https://docs.oracle.com/en/java/',
                featured: true,
            },
            {
                tool: 'JavaScript',
                link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
            },
            {
                tool: 'TypeScript',
                link: 'https://www.typescriptlang.org/docs/',
                featured: true,
            },            
        ]
    },
    {
        subject: 'Applied AI',
        tools: [
            { tool: 'Model Context Protocol (MCP)', short: 'MCP', link: 'https://modelcontextprotocol.io/', featured: true },
            { tool: 'Claude Code', link: 'https://docs.claude.com/en/docs/claude-code/overview' },
            { tool: 'AWS Bedrock', link: 'https://docs.aws.amazon.com/bedrock/' },
            { tool: 'LangGraph', link: 'https://www.langchain.com/langgraph', featured: true },
            {
                tool: 'RAG Systems',
                short: 'RAG',
                link: 'https://aws.amazon.com/what-is/retrieval-augmented-generation/',
                featured: true,
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
                short: 'Tailwind',
                link: 'https://tailwindcss.com/docs/installation/using-vite',
            },
            {
                tool: 'Next.js',
                link: 'https://nextjs.org/docs',
                featured: true,
            },
            {
                tool: 'React.js',
                short: 'React',
                link: 'https://legacy.reactjs.org/docs/getting-started.html',
                featured: true,
            },
            {
                tool: 'React Native',
                link: 'https://reactnative.dev/',
            },          
            { tool: 'Figma', link: 'https://www.figma.com/developers' },
        ]
    },
    {
        subject: 'Backend Development',
        tools: [
            {
                tool: 'Node.js',
                link: 'https://nodejs.org/docs/latest/api/',
                featured: true,
            },
            { tool: 'Express.js', short: 'Express', link: 'https://expressjs.com/' },
            {
                tool: 'Pydantic',
                link: 'https://pydantic.dev/docs/validation/latest/get-started/'
            },            
            {
                tool: 'FastAPI',
                link: 'https://fastapi.tiangolo.com/',
                featured: true,
            },
            {
                tool: 'Restful APIs',
                link: 'https://docs.github.com/en/rest?apiVersion=2022-11-28'
            }
        ]
    },    
    {
        subject: 'Cloud & Data',
        tools: [
            { tool: 'Azure Maps', link: 'https://learn.microsoft.com/en-us/azure/azure-maps/' },
            { tool: 'AWS S3', link: 'https://docs.aws.amazon.com/s3/' },
            { tool: 'AWS EC2', link: 'https://docs.aws.amazon.com/ec2/' },
            {
                tool: 'MongoDB',
                link: 'https://www.mongodb.com/docs/',
                featured: true,
            },
            {
                tool: 'Google Firebase',
                short: 'Firebase',
                link: 'https://firebase.google.com/docs',
            },
            {
                tool: 'PostgreSQL',
                link: 'https://www.postgresql.org/docs/',
                featured: true,
            },
            {
                tool: 'Supabase',
                link: 'https://supabase.com/',
                featured: true,
            }
        ]
    },
    {
        subject: 'Systems',
        tools: [
            { tool: 'UNIX/Linux command line', short: 'Linux', link: 'https://www.gnu.org/software/bash/manual/', featured: true },
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
        description: [
            "Collaborated in the launch of this chapter, including its website and a Discord announcement channel that now connects 20 members; maintain the website",
            "Participated in the chapter's launch events this semester, including a meeting and a tabling event, building the foundation for student recruitment",
            'Plan workshops and speaker events that give students access to industry professionals',
        ],
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
        description: [
            "Collaborated in the launch of this chapter, including its website and a Discord announcement channel that now connects 20 members; maintain the website",
            "Participated in the chapter's launch events this semester, including a meeting and a tabling event, building the foundation for student recruitment",
            'Plan workshops and speaker events that give students access to industry professionals',
        ],
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
        skills: 'Customer service, Sales, Inventory management, Collaboration, Leadership, Initiative',
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
        skills: 'Customer service, Teamwork, Multitasking, Food safety',
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