import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function BlogPage() {
    return (
        <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
            <Navbar />
            <div className="my-[5%] md:my-[1%] mx-[10%] md:mx-[20%] flex flex-col md:flex-row  h-[100%]">
                <div className="text-start col-start-1 col-end-5 text-[#0A0A23] flex flex-col">
                    <h1 className="my-[1%] text-5xl font-extrabold">Coming soon...</h1>              
                </div>
            </div>
            <Footer />
        </div>
      
    );
  }
