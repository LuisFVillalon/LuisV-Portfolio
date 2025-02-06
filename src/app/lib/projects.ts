type projectsFrontEnd = {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    live_app: string;
    image: string
  };

const projectsFrontEnd = [
    {
        title: 'Pokedex Catalog',
        description: 'View the information of 891 Pokemons.',
        tech: 'HTML, CSS, JavaScript, Data Structures',
        github_repo: 'https://github.com/LuisFernandoVillalon/catalog-website',
        live_app: 'https://luisfernandovillalon.github.io/catalog-website/',
        image: '/projects/frontend/pokedexcatalog.png'
    },
    {
        title: 'Poke-Photo Tag',
        description: 'Identify and tag Pokémon in an image with real-time scoring.',
        tech: 'HTML, CSS, JavaScript, React.js, Google Firebase Firestore Database',
        github_repo: 'https://github.com/LuisFernandoVillalon/front-end-pokemon-photo-tag',
        live_app: 'https://wheres-that-pokemon.netlify.app/',  
        image: '/projects/frontend/pokephototag.png'      
    },
    {  
        title: 'Whats Poppin?',
        description: 'Reddit-clone web application.',
        tech: 'HTML, CSS, JavaScript, React.js, Google Firebase Firestore Database and Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/WhatsPoppin',
        live_app: 'https://luisfernandovillalon.github.io/WhatsPoppin/',    
        image: '/projects/frontend/whatspoppin.png'    
    },
    {
        title: 'Tic-Tac-Toe',
        description: 'Play tic-tac-toe against a computer.',
        tech: 'HTML, CSS, JavaScript, Recursion, Minimax Algorithm',
        github_repo: 'https://github.com/LuisFernandoVillalon/TicTacToe-theOdinProject',
        live_app: 'https://luisfernandovillalon.github.io/TicTacToe-theOdinProject/',   
        image: '/projects/frontend/tictactoe.png'     
    },
    {
        title: 'Blog Template',
        description: 'A front-end blog template featuring user authentication, post creation, and a message board with CRUD functionality.',
        tech: 'HTML, CSS, JavaScript, React.js, React Router, REST API, Forms',
        github_repo: 'https://github.com/LuisFernandoVillalon/Blog-Template',
        live_app: 'https://nimble-druid-a52a4e.netlify.app/',      
        image: '/projects/frontend/blogtemplate.png'  
    },
    {
        title: 'Members Only',
        description: 'A members-only message board where users can sign up, log in, and post messages, with restricted content visible only to authorized members.',
        tech: 'HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, Authentication',
        github_repo: 'https://github.com/LuisFernandoVillalon/Members-Only',
        live_app: 'https://members-only-9gew.onrender.com/',    
        image: '/projects/frontend/membersonly.png'    
    },
    {
        title: 'To Do List',
        description: 'A project management app for organizing tasks by projects, date, and priority.',
        tech: 'HTML, CSS, JavaScript, ES6 Modules, Object Oriented Principles',
        github_repo: 'https://github.com/LuisFernandoVillalon/TodoList-TOD',
        live_app: 'https://luisfernandovillalon.github.io/TodoList-TOD/', 
        image: '/projects/frontend/todolist.png'       
    },
    {
        title: 'Memory Card Game',
        description: 'A memory game where images shuffle on click, and repeating one resets progress.',
        tech: 'HTML, CSS, JavaScript, React.js, State Management',
        github_repo: 'https://github.com/LuisFernandoVillalon/memory-card-game-TOP',
        live_app: 'https://luisfernandovillalon.github.io/memory-card-game-TOP/', 
        image: '/projects/frontend/memorycard.png'       
    },
    {
        title: 'Library',
        description: 'A book library app for adding, removing, and updating book entries.',
        tech: 'HTML, CS, JavaScript, React.js, DOM Manipulation',
        github_repo: 'https://github.com/LuisFernandoVillalon/Library-theOdinProject',
        live_app: 'https://luisfernandovillalon.github.io/Library-theOdinProject/',      
        image: '/projects/frontend/library.png'  
    },
    {
        title: 'Rock, Paper, Scissors!',
        description: 'Reddit-clone web application.',
        tech: 'HTML, CSS, JavaScript',
        github_repo: 'https://github.com/LuisFernandoVillalon/Rock-Paper-Scissors-OdinProject',
        live_app: 'https://luisfernandovillalon.github.io/Rock-Paper-Scissors-OdinProject/',        
        image: '/projects/frontend/rockpaperscissors.png'
    }
];

export {
    projectsFrontEnd
};