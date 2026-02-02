export default function Footer() {
  return (
    <div className="text-[#0A0A23] flex justify-between w-full border-t border-gray-250 shadow-md mt-auto ">
    <footer className=" w-full flex justify-between space-x-5 mx-[10%] md:mx-[20%] my-[0.5%] items-center" style={{ animation: "fadeUp 0.5s ease-in 0s forwards" }}>
          <p className="text-2xl">
            Luis Villalon © 2026
          </p>
          <div className="flex justify-end items-center space-x-5">
            <a href="https://www.linkedin.com/in/luis-villalon/" target="_blank" rel="noopener noreferrer">
              <i className="                        hover:font-black 
                        hover:cursor-pointer
                        hover:underline
                        hover:text-[#006400] transition-colors
                        fab fa-linkedin text-3xl" 
              ></i>
            </a>
            <a href="https://github.com/LuisFVillalon" target="_blank" rel="noopener noreferrer">
              <i className="                        hover:font-black 
                        hover:cursor-pointer
                        hover:underline
                        hover:text-[#006400] transition-colors
                        fab fa-github text-3xl"
              ></i>
            </a>
          </div>
    </footer>
    <style>{`
            @keyframes fadeUp {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
            }     
            
        `}</style>
    </div>
  );
}
