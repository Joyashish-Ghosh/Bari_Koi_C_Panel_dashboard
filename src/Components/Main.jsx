import { Outlet } from "react-router-dom";
import Navbar from "../Components/Dashboard/Navbar";
import Footer from "../Components/Dashboard/Footer";



const Main = () => {
  return (
    <div>
      {/* Navbar always stays at the top */}

      <Navbar></Navbar>
      {/* Dynamic content will be rendered here */}
      <div className="min-h-screen">
        <Outlet />
      </div>

      {/* Footer always stays at the bottom */}
      <Footer></Footer>
    </div>
  );              
};

export default Main;