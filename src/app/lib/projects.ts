type projectsFrontEnd = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    live_app: string;
    image: string;
    mobileFriendly: boolean;
  };

type topProjects = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    live_app: string;
    image: string;
    mobileFriendly: boolean;    
}

type projectsBackEnd = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    image: string;
    mobileFriendly: boolean;
};

type projectsAcademic = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    image: string;
    mobileFriendly: boolean;
};

const topProjects = [
    {
        title: 'Pokedex Catalog',
        description: 'View the information of 891 Pokemons. Look them up, store them in your local storage, and release them! ',
        tech: 'HTML, CSS, JavaScript, Data Structures',
        github_repo: 'https://github.com/LuisFernandoVillalon/catalog-website',
        live_app: 'https://luisfernandovillalon.github.io/catalog-website/',
        image: '/projects/frontend/pokedexcatalog.png',
        mobileFriendly: true,
    },
    {
        title: 'Imperial Web Experts',
        description: 'A web development agency that develops web applications that help generate leads and appointments for small businesses. Coming soon.',
        tech: 'HTML, CSS, JavaScript, TypeScript, Next.js, React.js',
        github_repo: '',
        live_app: '',  
        image: '/projects/IWE_logo.png',      
        mobileFriendly: true,
    },
    {  
        title: 'Whats Poppin?',
        description: 'Reddit-clone web application. Create an account, post, comment, and vote!',
        tech: 'HTML, CSS, JavaScript, React.js, Google Firebase Firestore Database and Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/WhatsPoppin',
        live_app: 'https://luisfernandovillalon.github.io/WhatsPoppin/',    
        image: '/projects/frontend/whatspoppin.png',   
        mobileFriendly: false,
    }
];

const projectsFrontEnd = [
    {
        title: 'Pokedex Catalog',
        description: 'View the information of 891 Pokemons. Look them up, store them in your local storage, release them!',
        tech: 'HTML, CSS, JavaScript, Data Structures',
        github_repo: 'https://github.com/LuisFernandoVillalon/catalog-website',
        live_app: 'https://luisfernandovillalon.github.io/catalog-website/',
        image: '/projects/frontend/pokedexcatalog.png',
        mobileFriendly: true,
    },
    {
        title: 'Poke-Photo Tag',
        description: 'Identify and tag Pokémon in an image with real-time scoring.',
        tech: 'HTML, CSS, JavaScript, React.js, API',
        github_repo: 'https://github.com/LuisFernandoVillalon/front-end-pokemon-photo-tag',
        live_app: 'https://wheres-that-pokemon.netlify.app/',  
        image: '/projects/frontend/pokephototag.png',      
        mobileFriendly: false,
    },
    {  
        title: 'Whats Poppin?',
        description: 'Reddit-clone web application. Create an account, post, comment, and vote!',
        tech: 'HTML, CSS, JavaScript, React.js, Google Firebase Firestore Database and Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/WhatsPoppin',
        live_app: 'https://luisfernandovillalon.github.io/WhatsPoppin/',    
        image: '/projects/frontend/whatspoppin.png',   
        mobileFriendly: false,
    },
    {
        title: 'Tic-Tac-Toe',
        description: 'Play tic-tac-toe against an unbeatable computer!',
        tech: 'HTML, CSS, JavaScript, Recursion, Minimax Algorithm',
        github_repo: 'https://github.com/LuisFernandoVillalon/TicTacToe-theOdinProject',
        live_app: 'https://luisfernandovillalon.github.io/TicTacToe-theOdinProject/',   
        image: '/projects/frontend/tictactoe.png',    
        mobileFriendly: true,
    },
    {
        title: 'Blog Template',
        description: 'A front-end blog template featuring user authentication, post creation, and a message board with CRUD functionality.',
        tech: 'HTML, CSS, JavaScript, React.js, React Router, REST API, Forms',
        github_repo: 'https://github.com/LuisFernandoVillalon/Blog-Template',
        live_app: 'https://nimble-druid-a52a4e.netlify.app/',      
        image: '/projects/frontend/blogtemplate.png', 
        mobileFriendly: true,
    },
    {
        title: 'Members Only',
        description: 'A members-only message board where users can sign up, log in, and post messages, with restricted content visible only to authorized members.',
        tech: 'HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/Members-Only',
        live_app: 'https://members-only-9gew.onrender.com/',    
        image: '/projects/frontend/membersonly.png',   
        mobileFriendly: true,
    },
    {
        title: 'To Do List',
        description: 'A project management app for organizing tasks by projects, date, and priority.',
        tech: 'HTML, CSS, JavaScript, ES6 Modules, Object Oriented Principles',
        github_repo: 'https://github.com/LuisFernandoVillalon/TodoList-TOD',
        live_app: 'https://luisfernandovillalon.github.io/TodoList-TOD/', 
        image: '/projects/frontend/todolist.png',      
        mobileFriendly: false,
    },
    {
        title: 'Memory Card Game',
        description: 'A memory game where images shuffle on click, and repeating one resets progress.',
        tech: 'HTML, CSS, JavaScript, React.js, State Management',
        github_repo: 'https://github.com/LuisFernandoVillalon/memory-card-game-TOP',
        live_app: 'https://luisfernandovillalon.github.io/memory-card-game-TOP/', 
        image: '/projects/frontend/memorycard.png',      
        mobileFriendly: false,
    },
    {
        title: 'Library',
        description: 'A book library app for adding, removing, and updating book entries.',
        tech: 'HTML, CS, JavaScript, React.js, DOM Manipulation',
        github_repo: 'https://github.com/LuisFernandoVillalon/Library-theOdinProject',
        live_app: 'https://luisfernandovillalon.github.io/Library-theOdinProject/',      
        image: '/projects/frontend/library.png', 
        mobileFriendly: true,
    },
    {
        title: 'Rock, Paper, Scissors!',
        description: 'Reddit-clone web application. Create an account, post, comment, and vote!',
        tech: 'HTML, CSS, JavaScript',
        github_repo: 'https://github.com/LuisFernandoVillalon/Rock-Paper-Scissors-OdinProject',
        live_app: 'https://luisfernandovillalon.github.io/Rock-Paper-Scissors-OdinProject/',        
        image: '/projects/frontend/rockpaperscissors.png',
        mobileFriendly: false,
    }
];

const projectsBackEnd = [
    {
        title: 'Blog API',
        description: 'Developed a backend API for a blog with user authentication, CRUD functionality for posts and comments, validation, and token-based authorization.',
        tech: 'JavaScript, Node.js, Express.js, MongoDB, Mongoose, Passport.js, bcrypt, JWT (token-based authentication), MVC pattern (models, controllers, routes)',
        github_repo: 'https://github.com/LuisFernandoVillalon/Blog-API',
        live_app:'',
        image: '/projects/backend/blogtemplate.png',
        mobileFriendly: false,
    },
    {
        title: 'Members Only',
        description: 'Developed a secure backend with authentication, role-based access control, and MongoDB, enabling user sign-up, encrypted passwords, and dynamic permissions for members and admins.',
        tech: ' JavaScript, Node.js, Express.js, MongoDB, Mongoose, EJS, CSS, bcrypt, Passport.js',
        github_repo: 'https://github.com/LuisFernandoVillalon/Members-Only',
        live_app:'',
        image: '/projects/backend/membersonly.png',    
        mobileFriendly: false,
    },
    {  
        title: 'Whats Poppin?',
        description: 'Developed a RESTful backend with Node.js, Express.js, and MongoDB, implementing authentication, API routes, and CRUD functionality for managing event postings.',
        tech: 'JavaScript. Google Firebase Firestore Database and Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/WhatsPoppin',
        live_app:'',
        image: '/projects/backend/whatspoppin.png',   
        mobileFriendly: false,
    },
    {
        title: 'Poke-Photo Tag',
        description: 'Built a RESTful API with MongoDB for efficient leaderboard management, dynamically storing and updating the top 10 records with automated entry removal.',
        tech: 'JavaScript, Node.js, Express.js, MongoDB, Mongoose, RESTful API, Schema Models, Routes, Controllers',
        github_repo: 'https://github.com/LuisFernandoVillalon/back-end-pokemon-photo-tag',
        live_app:'',
        image: '/projects/backend/pokephototag.png',     
        mobileFriendly: false,
    }

];

const projectsAcademic = [
    {
        title: 'Assembly Language and Machine Organization',
        description: 'Covered machine architecture, assembly language, data representation, instruction execution, addressing modes, and operating system fundamentals.',
        tech: 'Assembly Language (Windows x86), Visual Studio',
        github_repo: 'https://github.com/LuisFernandoVillalon/CS281-Assembly-Language-and-Machine-Organization',
        live_app:'',
        image: '/projects/academic/cs281.png',
        mobileFriendly: false,
    },
    {
        title: 'Pokedex',
        description: 'Developed a JavaFX-based GUI application that organizes, filters, and sorts Pokémon data, implementing data structures and sorting algorithms.',
        tech: 'Java, JavaFX, Data Structures, Sorting Algorithms, GUI Design, Event Handling, jGrasp',
        github_repo: 'https://github.com/LuisFernandoVillalon/JAVA-Pokedex',
        live_app:'',
        image: '/projects/academic/pokedex.png',       
        mobileFriendly: false,
    },
    {  
        title: 'Introduction to Data Structures',
        description: 'Covered abstract classes and interfaces, JavaFX, Recursion, Stack, Array, Queue, LinkedList.',
        tech: 'JAVA, JavaFX, jGrasp',
        github_repo: 'https://github.com/LuisFernandoVillalon/cs231-IntroDataStructures',
        live_app:'',
        image: '/projects/academic/cs231.png',   
        mobileFriendly: false,
    },
    {
        title: 'Hang-Man',
        description: 'Developed a JavaFX-based Hangman game with a dynamic GUI, implementing polymorphism and inheritance to manage game logic and updating visuals based on user input.',
        tech: 'Java, JavaFX, Object-Oriented Programming (OOP), Polymorphism, Inheritance, GUI Design, jGrasp',
        github_repo: 'https://github.com/LuisFernandoVillalon/hang-man',
        live_app:'',
        image: '/projects/academic/hangman.png',     
        mobileFriendly: false,
    },
    {
        title: 'Introduction to Object Oriented Programming',
        description: 'Covered abstract classes and loops, arrays, classes, objects, inheritance, JavaFX, and event driven programs.',
        tech: 'JAVA, JavaFX, jGrasp',
        github_repo: 'https://github.com/LuisFernandoVillalon/cs221-IntroOOP',
        live_app:'',
        image: '/projects/academic/cs221.png',     
        mobileFriendly: false,
    }


];

export {
    projectsFrontEnd, projectsBackEnd, projectsAcademic, topProjects
};