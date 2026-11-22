export type ProjectCategory = 'top' | 'frontend' | 'fullstack' | 'ai' | 'academic';

type CategoryOverride = Partial<Pick<Project, 'description' | 'tech' | 'github_repo' | 'frontend_repo' | 'backend_repo'>>;

export type Project = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    frontend_repo?: string;
    backend_repo?: string;
    live_app?: string;
    image: string;
    mobileFriendly: boolean;
    categories: ProjectCategory[];
    /** Award badge shown on the project's tile or compact row, e.g. { title: 'First Place', event: 'Some Hackathon 2026' }. */
    award?: { title: string; event: string };
    /** Capstone badge shown on the project's tile or compact row; `program` (e.g. 'CodePath AI201') follows "Capstone" when set. Not an award: it doesn't put the project in the Awards group. */
    capstone?: { program?: string };
    /** One-line measurable result shown on the homepage tile. Rendered only when set. */
    categoryOverrides?: Partial<Record<ProjectCategory, CategoryOverride>>;
};

const projects: Project[] = [
    {
        title: 'kanso',
        description: 'Digital clarity notebook that brings tasks, notes, habits, and mood into one place, with a Next.js front end, FastAPI + Postgres backend, and an AI learning-resource recommender.',
        tech: 'Next.js, React.js, TypeScript, Tailwind CSS, Python, FastAPI, PostgreSQL, Supabase Auth, RESTful CRUD Operations',
        github_repo: 'https://github.com/LuisFVillalon/TaskMaster-Frontend',
        frontend_repo: 'https://github.com/LuisFVillalon/TaskMaster-Frontend', // TODO: confirm link
        backend_repo: 'https://github.com/LuisFVillalon/TaskMaster-Backend', // TODO: confirm link
        live_app: 'https://kanso-landing.vercel.app/',
        image: '/projects/frontend/taskmaster.png',
        mobileFriendly: true,
        categories: ['top', 'fullstack'],
    },
    {
        title: 'kanso AI',
        description: "kanso's learning-resource recommender: given a note, an LLM plans a topic, level and search queries, then a deterministic pipeline searches DuckDuckGo, filters sponsored and paywalled results, checks for dead links, scores credibility, and returns one video, one article and one exercise, each with a reason.",
        tech: 'Python, FastAPI, Pydantic, OpenAI / Gemini, DuckDuckGo Search, Supabase JWT Auth, Fly.io',
        github_repo: 'https://github.com/LuisFVillalon/kanso-ai',
        live_app: 'https://kanso-landing.vercel.app/',
        image: '/projects/frontend/taskmaster.png',
        mobileFriendly: false,
        categories: ['ai'],
    },
    {
        title: 'Agentic Abstraction for Chip Engineering (AACE)',
        description: 'Multi-agent pipeline (Architect, Auditor, Stylist) that turns SystemVerilog/Verilog RTL into interactive architecture diagrams, built with LangGraph and LLMs on AWS Bedrock (Gemini/OpenAI fallback), FastAPI, Pydantic, Graphviz DOT, and Next.js.',
        tech: 'LangGraph, FastAPI, Pydantic, GraphViz API, Next.js, AWS Bedrock, S3, EC2',
        github_repo: 'https://github.com/LuisFVillalon/Agentic-Abstraction-for-Chip-Engineering',
        live_app: 'https://github.com/LuisFVillalon/Agentic-Abstraction-for-Chip-Engineering',
        image: '/projects/frontend/acee.png',
        mobileFriendly: false,
        categories: ['top', 'ai'],
    },
    {
        title: 'Operating Systems',
        description: 'Coursework covering OS organization, process and thread concurrency, synchronization, virtual memory and paging, file systems, I/O and interrupt handling, and deadlock detection/avoidance.',
        tech: 'C, Unix/Linux, Makefiles, Systems Programming',
        github_repo: 'https://github.com/LuisFVillalon/Operating-Systems',
        image: '/projects/academic/os.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'The Torchbearer: Algorithm Exam',
        description: 'Documentation for an algorithm that finds the most fuel-efficient path through a directed graph while hitting multiple mandatory checkpoints.',
        tech: 'Dijkstra\'s Algorithm, Weighted Directed Graphs, Traveling Salesperson Problem, Python',
        github_repo: 'https://github.com/LuisFVillalon/CS460-FinalExam',
        live_app: 'https://github.com/LuisFVillalon/CS460-FinalExam',
        image: '/projects/academic/cs480.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'ROSS',
        description: 'AI tool on Clio Manage that turns a personal-injury case into a cited 90-second brief for attorneys and a tracked portal for doctors. Beat 60+ teams for first place.',
        tech: 'Python, Clio API (OAuth), Claude Code, BM25 keyword retrieval, PDF citation highlighting',
        github_repo: 'https://github.com/LuisFVillalon/ROSS',
        live_app: 'https://github.com/LuisFVillalon/ROSS',
        image: '/projects/frontend/ross.png',
        mobileFriendly: false,
        categories: ['top', 'ai'],
        award: { title: 'First Place', event: 'Swans Applied AI Hackathon 2026' },
    },
    {
        title: "Luis's Personal AI Assistant",
        description: 'The "Ask AI" chat on this site: a RAG assistant that answers recruiters\' questions about my experience, projects and skills from my own content (site data, résumé, LinkedIn, public GitHub READMEs), cites its sources on every answer, says when it doesn\'t know, and can pass a message to me.',
        tech: 'Next.js, TypeScript, Claude Haiku 5.5, RAG, Voyage AI, Upstash Vector & Redis, Vercel Cron',
        github_repo: 'https://github.com/LuisFVillalon/LuisV-Portfolio',
        live_app: 'https://luis-v-portfolio.vercel.app',
        image: '/projects/backend/ai-assistant.png',
        mobileFriendly: true,
        categories: ['ai'],
    },
    {
        title: 'NutriNav AI',
        description: 'Multi-agent meal planner that turns a user profile into a personalized 1-day meal plan: a deterministic Nutritionist agent computes calorie and macro targets (Mifflin-St Jeor), a GPT-4o Chef agent writes recipes to hit them, and a USDA/WHO compliance checker rejects unsafe plans and feeds corrections back to the Chef for up to three retries. A vision agent estimates calories and macros from a food photo.',
        tech: 'Python, OpenAI GPT-4o, Verification Loops, USDA FoodData Central API',
        github_repo: 'https://github.com/LuisFVillalon/NutriNav-AI',
        image: '/projects/backend/nutrinav.png',
        mobileFriendly: false,
        categories: ['ai', 'academic'],
    },
    // CodePath AI201 assignments, one repo per project.
    {
        title: 'FitFindr',
        description: "Agent that turns a plain-language thrift request (\"vintage graphic tee under $30\") into a matching secondhand listing, 1–3 outfits built from the user's wardrobe, and a ready-to-post fit-card caption, calling its search tool over MCP. The capstone runs it as a Flask web service with a structured JSON request log, a measured cost per run, and a per-user rate limit, load-tested at 10× normal traffic.",
        tech: 'Python, Gemini API, MCP, Flask, Structured Logging, Rate Limiting',
        github_repo: 'https://github.com/LuisFVillalon/ai201-project2-fitfindr-starter-v2026',
        image: '/projects/ai201/fitfindr.svg',
        mobileFriendly: false,
        categories: ['ai'],
        capstone: { program: 'CodePath AI201' },
    },
    {
        title: 'Provenance Guard',
        description: 'Web service that estimates whether a piece of writing came from a person or an AI. It combines a local GPT-2 predictability score with a stylometry signal (sentence-length spread, word variety, punctuation) into one confidence and a plain-English label, writes every decision to an audit log, and lets writers appeal a decision.',
        tech: 'Python, Flask, Flask-Limiter, Hugging Face Transformers (GPT-2), Stylometry, REST API',
        github_repo: 'https://github.com/LuisFVillalon/ai201-project4-provenance-guard-starter-v2026',
        image: '/projects/ai201/provenance-guard.svg',
        mobileFriendly: false,
        categories: ['ai'],
    },
    {
        title: 'The Unofficial Guide',
        description: "RAG system over a corpus of city guides that answers travel questions with the source files it used. Guides are chunked by Markdown section so answers aren't stitched from fragments, and a relevance gate refuses questions the guides can't answer instead of letting the model invent details. Checked against five written criteria, three runs each.",
        tech: 'Python, RAG, ChromaDB, all-MiniLM-L6-v2 Embeddings, Gemini API, Flask',
        github_repo: 'https://github.com/LuisFVillalon/ai201-project1-unofficial-guide-starter-v2026',
        image: '/projects/ai201/unofficial-guide.svg',
        mobileFriendly: false,
        categories: ['ai'],
    },
    {
        title: 'TakeMeter',
        description: 'Text classifier that sorts r/SaaS posts into four labels (idea validation, marketing, sales & monetization, operations), comparing a fine-tuned DistilBERT model against a zero-shot baseline on a hand-labeled dataset, with per-label F1 and a confusion matrix across three seeds.',
        tech: 'Python, Hugging Face Transformers, DistilBERT, PyTorch, scikit-learn, Jupyter',
        github_repo: 'https://github.com/LuisFVillalon/ai201-project3-takemeter-starter-v2026',
        image: '/projects/ai201/takemeter.svg',
        mobileFriendly: false,
        categories: ['ai'],
    },
    {
        title: 'LuisV Portfolio',
        description: 'My personal software engineering portfolio site, featuring a project gallery, Markdown-based blog, and a contact form with email delivery.',
        tech: 'Next.js, React, TypeScript, Tailwind CSS, Resend',
        github_repo: 'https://github.com/LuisFVillalon/LuisV-Portfolio',
        live_app: 'https://luis-v-portfolio.vercel.app',
        image: '/projects/frontend/webportfolio.png',
        mobileFriendly: true,
        categories: ['fullstack'],
    },
    {
        title: 'The Crash App',
        description: 'Web application for students to report hit-and-runs and earn rewards.',
        tech: 'React.js, Tailwind CSS, Next.js, Forms',
        github_repo: 'https://github.com/LuisFVillalon/innovate-4-sdsu-hackathon-2025',
        live_app: 'https://github.com/LuisFVillalon/innovate-4-sdsu-hackathon-2025',
        image: '/projects/frontend/thecrashapp.png',
        mobileFriendly: true,
        categories: [],
        award: { title: 'Most Creative Project', event: 'Innovate 4 SDSU Hackathon 2025' },
    },
    {
        title: 'Whats Poppin?',
        description: 'Reddit-clone web application. Create an account, post, comment, and vote!',
        tech: 'HTML, CSS, JavaScript, React.js, Google Firebase Firestore Database and Authentication',
        github_repo: 'https://github.com/LuisFVillalon/WhatsPoppin',
        frontend_repo: 'https://github.com/LuisFVillalon/WhatsPoppin', // TODO: confirm link
        backend_repo: 'https://github.com/LuisFVillalon/WhatsPoppin', // TODO: confirm link
        live_app: 'https://luisfvillalon.github.io/WhatsPoppin/',
        image: '/projects/frontend/whatspoppin.png',
        mobileFriendly: false,
        categories: ['fullstack'],
        capstone: { program: 'The Odin Project' },
    },
    {
        title: 'Pokedex Catalog',
        description: 'View the information of 891 Pokemons. Look them up, store them in your local storage, release them!',
        tech: 'HTML, CSS, JavaScript, Data Structures',
        github_repo: 'https://github.com/LuisFVillalon/catalog-website',
        live_app: 'https://luisfvillalon.github.io/catalog-website/',
        image: '/projects/frontend/pokedexcatalog.png',
        mobileFriendly: true,
        categories: ['frontend'],
    },
    {
        title: 'Poke-Photo Tag',
        description: 'Identify and tag Pokémon in an image with real-time scoring, backed by a RESTful API with MongoDB for leaderboard management, dynamically storing and updating the top 10 records with automated entry removal.',
        tech: 'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, Mongoose, RESTful API',
        github_repo: 'https://github.com/LuisFVillalon/front-end-pokemon-photo-tag',
        frontend_repo: 'https://github.com/LuisFVillalon/front-end-pokemon-photo-tag', // TODO: confirm link
        backend_repo: 'https://github.com/LuisFVillalon/back-end-pokemon-photo-tag', // TODO: confirm link
        live_app: 'https://wheres-that-pokemon.netlify.app/',
        image: '/projects/frontend/pokephototag.png',
        mobileFriendly: false,
        categories: ['fullstack'],
    },
    {
        title: 'Tic-Tac-Toe',
        description: 'Play tic-tac-toe against an unbeatable computer!',
        tech: 'HTML, CSS, JavaScript, Recursion, Minimax Algorithm',
        github_repo: 'https://github.com/LuisFVillalon/TicTacToe-theOdinProject',
        live_app: 'https://luisfvillalon.github.io/TicTacToe-theOdinProject/',
        image: '/projects/frontend/tictactoe.png',
        mobileFriendly: true,
        categories: ['frontend'],
    },
    {
        title: 'Blog Template',
        description: 'A full-stack blog application featuring user authentication, post creation, comments, and token-based authorization, with a React front end and a Node.js/Express REST API back end.',
        tech: 'React.js, React Router, HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, Passport.js, bcrypt, JWT, REST API',
        github_repo: 'https://github.com/LuisFVillalon/Blog-Template',
        frontend_repo: 'https://github.com/LuisFVillalon/Blog-Template',
        backend_repo: 'https://github.com/LuisFVillalon/Blog-API',
        live_app: 'https://nimble-druid-a52a4e.netlify.app/',
        image: '/projects/frontend/blogtemplate.png',
        mobileFriendly: true,
        categories: ['fullstack'],
    },
    {
        title: 'To Do List',
        description: 'A project management app for organizing tasks by projects, date, and priority.',
        tech: 'HTML, CSS, JavaScript, ES6 Modules, Object Oriented Principles',
        github_repo: 'https://github.com/LuisFVillalon/TodoList-TOD',
        live_app: 'https://luisfvillalon.github.io/TodoList-TOD/',
        image: '/projects/frontend/todolist.png',
        mobileFriendly: false,
        categories: ['frontend'],
    },
    {
        title: 'Memory Card Game',
        description: 'A memory game where images shuffle on click, and repeating one resets progress.',
        tech: 'HTML, CSS, JavaScript, React.js, State Management',
        github_repo: 'https://github.com/LuisFVillalon/memory-card-game-TOP',
        live_app: 'https://luisfvillalon.github.io/memory-card-game-TOP/',
        image: '/projects/frontend/memorycard.png',
        mobileFriendly: false,
        categories: ['frontend'],
    },
    {
        title: 'Library',
        description: 'A book library app for adding, removing, and updating book entries.',
        tech: 'HTML, CSS, JavaScript, React.js, DOM Manipulation',
        github_repo: 'https://github.com/LuisFVillalon/Library-theOdinProject',
        live_app: 'https://luisfvillalon.github.io/Library-theOdinProject/',
        image: '/projects/frontend/library.png',
        mobileFriendly: true,
        categories: ['frontend'],
    },
    {
        title: 'Rock, Paper, Scissors!',
        description: 'Browser rock, paper, scissors game against the computer, which picks at random. First to 5 wins takes the game.',
        tech: 'HTML, CSS, JavaScript',
        github_repo: 'https://github.com/LuisFVillalon/Rock-Paper-Scissors-OdinProject',
        live_app: 'https://luisfvillalon.github.io/Rock-Paper-Scissors-OdinProject/',
        image: '/projects/frontend/rockpaperscissors.png',
        mobileFriendly: false,
        categories: ['frontend'],
    },
    {
        title: 'LLM Bible Tutor',
        description: 'Implement a Retrieval-Augmented Generation (RAG) pipeline for the Douay-Rheims Bible, enabling an LLM to answer scriptural queries with precise, cited verse references based on semantic vector search.',
        tech: 'Python, OpenAI (GPT-4o-mini, text-embedding-3-small), ChromaDB',
        github_repo: 'https://github.com/LuisFVillalon/LLM-Bible-Tutor',
        live_app: 'https://github.com/LuisFVillalon/LLM-Bible-Tutor',
        image: '/projects/backend/LLM_bible.png',
        mobileFriendly: false,
        categories: ['ai'],
    },
    // {
    //     title: 'Members Only',
    //     description: 'A members-only message board with a secure backend: authentication, role-based access control, and MongoDB, enabling user sign-up, encrypted passwords, and dynamic permissions for members and admins.',
    //     tech: 'HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, EJS, bcrypt, Passport.js',
    //     github_repo: 'https://github.com/LuisFVillalon/Members-Only',
    //     frontend_repo: 'https://github.com/LuisFVillalon/Members-Only', // TODO: confirm link
    //     backend_repo: 'https://github.com/LuisFVillalon/Members-Only', // TODO: confirm link
    //     live_app: 'https://members-only-9gew.onrender.com/',
    //     image: '/projects/frontend/membersonly.png',
    //     mobileFriendly: true,
    //     categories: ['fullstack'],
    // },
    {
        title: 'Assembly Language and Machine Organization',
        description: 'Covered machine architecture, assembly language, data representation, instruction execution, addressing modes, and operating system fundamentals.',
        tech: 'Assembly Language (Windows x86), Visual Studio',
        github_repo: 'https://github.com/LuisFVillalon/CS281-Assembly-Language-and-Machine-Organization',
        image: '/projects/academic/cs281.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'Pokedex',
        description: 'Developed a JavaFX-based GUI application that organizes, filters, and sorts Pokémon data, implementing data structures and sorting algorithms.',
        tech: 'Java, JavaFX, Data Structures, Sorting Algorithms, GUI Design, Event Handling, jGrasp',
        github_repo: 'https://github.com/LuisFVillalon/JAVA-Pokedex',
        image: '/projects/academic/pokedex.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'Introduction to Data Structures',
        description: 'Covered abstract classes and interfaces, JavaFX, Recursion, Stack, Array, Queue, LinkedList.',
        tech: 'JAVA, JavaFX, jGrasp',
        github_repo: 'https://github.com/LuisFVillalon/cs231-IntroDataStructures',
        image: '/projects/academic/cs231.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'Hang-Man',
        description: 'Developed a JavaFX-based Hangman game with a dynamic GUI, implementing polymorphism and inheritance to manage game logic and updating visuals based on user input.',
        tech: 'Java, JavaFX, Object-Oriented Programming (OOP), Polymorphism, Inheritance, GUI Design, jGrasp',
        github_repo: 'https://github.com/LuisFVillalon/hang-man',
        image: '/projects/academic/hangman.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
    {
        title: 'Introduction to Object Oriented Programming',
        description: 'Covered abstract classes and loops, arrays, classes, objects, inheritance, JavaFX, and event driven programs.',
        tech: 'JAVA, JavaFX, jGrasp',
        github_repo: 'https://github.com/LuisFVillalon/cs221-IntroOOP',
        image: '/projects/academic/cs221.png',
        mobileFriendly: false,
        categories: ['academic'],
    },
];

export const getProjectsByCategory = (category: ProjectCategory) =>
    projects.filter(p => p.categories.includes(category));

/** One project by its exact title, or undefined. */
export const getProjectByTitle = (title: string) => projects.find(p => p.title === title);

/** Every project that has an `award`, in projects.ts order. */
export const getAwardProjects = () => projects.filter(p => p.award);

export const applyCategoryOverrides = (project: Project, category: ProjectCategory): Project => ({
    ...project,
    ...project.categoryOverrides?.[category],
});
