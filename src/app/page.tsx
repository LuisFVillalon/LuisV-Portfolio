// app/page.tsx
import Navbar from './components/NavBar';
import Homebody from './components/home/HomeBody';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className=" flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <Homebody />
      <Footer />
    </div>
  );
}
