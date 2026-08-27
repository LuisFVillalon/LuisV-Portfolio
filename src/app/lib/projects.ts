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
    categoryOverrides?: Partial<Record<ProjectCategory, CategoryOverride>>;
};

const projects: Project[] = [
    {
        title: 'kanso',
        description: 'A full-stack web application enabling users to custom-organize tasks, notes, and habits using categorical tags.',
        tech: 'Next.js, React.js, TypeScript, Tailwind CSS, Python, FastAPI, PostgreSQL, RESTful CRUD Operations',
        github_repo: 'https://github.com/LuisFVillalon/TaskMaster-Frontend',
        frontend_repo: 'https://github.com/LuisFVillalon/TaskMaster-Frontend', // TODO: confirm link
        backend_repo: 'https://github.com/LuisFVillalon/TaskMaster-Backend', // TODO: confirm link
        live_app: 'https://kanso-web-app.vercel.app/',
        image: '/projects/frontend/taskmaster.png',
        mobileFriendly: true,
        categories: ['top', 'fullstack', 'ai'],
        categoryOverrides: {
            ai: {
                description: 'Backend application designed to handle AI-driven task management and planning workflows through LLM service calls.',
                github_repo: 'https://github.com/LuisFVillalon/taskmaster-ai',
                tech: 'FastAPI, Pydantic, LLM Service Calls, OpenAI (GPT-4o-mini)',
                frontend_repo: undefined,
                backend_repo: undefined,
            },
        },
    },
    {
        title: 'Agentic Abstraction for Chip Engineering (AACE)',
        description: 'Agentic pipeline to create visual and interactive diagrams from chip design code.',
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
        title: 'NutriNav AI',
        description: 'Agentic pipeline designed to create nutritionally accurate, safe, and customizable meal plans tailored to a user\'s specific needs.',
        tech: 'LangGraph, FastAPI, Pydantic, USDA API, Next.js, Gemini 2.5 Flash',
        github_repo: 'https://github.com/LuisFVillalon/NutriNav-AI',
        live_app: 'https://github.com/LuisFVillalon/NutriNav-AI',
        image: '/projects/frontend/nutrinavai.png',
        mobileFriendly: false,
        categories: ['top', 'ai'],
    },
    {
        title: 'LuisV Portfolio',
        description: 'My personal software engineering portfolio site, featuring a project gallery, Markdown-based blog, and a contact form with email delivery.',
        tech: 'Next.js, React, TypeScript, Tailwind CSS, Resend',
        github_repo: 'https://github.com/LuisFVillalon/LuisV-Portfolio',
        live_app: 'https://luis-v-portfolio.vercel.app',
        image: '/projects/frontend/webportfolio.png',
        mobileFriendly: true,
        categories: ['frontend'],
    },
    {
        title: 'The Crash App',
        description: 'Web application for students to report hit-and-runs and earn rewards. Winner of Most Creative Project in Innovate 4 SDSU Hackathon 2025!',
        tech: 'React.js, Tailwind CSS, Next.js, Forms, JSON files',
        github_repo: 'https://github.com/LuisFVillalon/innovate-4-sdsu-hackathon-2025',
        live_app: 'https://github.com/LuisFVillalon/innovate-4-sdsu-hackathon-2025',
        image: '/projects/frontend/thecrashapp.png',
        mobileFriendly: true,
        categories: ['frontend'],
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
        tech: 'HTML, CS, JavaScript, React.js, DOM Manipulation',
        github_repo: 'https://github.com/LuisFVillalon/Library-theOdinProject',
        live_app: 'https://luisfvillalon.github.io/Library-theOdinProject/',
        image: '/projects/frontend/library.png',
        mobileFriendly: true,
        categories: ['frontend'],
    },
    {
        title: 'Rock, Paper, Scissors!',
        description: 'Reddit-clone web application. Create an account, post, comment, and vote!',
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
        tech: 'Python, OpenAI (GPT-4o-mini, text-embedding-3-small), LangChain, ChromaDB (vector database)',
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

export const applyCategoryOverrides = (project: Project, category: ProjectCategory): Project => ({
    ...project,
    ...project.categoryOverrides?.[category],
});
