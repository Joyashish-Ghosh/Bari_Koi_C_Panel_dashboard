import { Outlet } from "react-router-dom";
import Navbar from "../Components/Dashboard/Navbar";
import Footer from "../Components/Dashboard/Footer";



const Main = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Navbar always stays at the top */}

      <Navbar />
      {/* Dynamic content will be rendered here */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer always stays at the bottom */}
      <Footer />
    </div>
  );              
};

export default Main;