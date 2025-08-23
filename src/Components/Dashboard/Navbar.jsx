// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Sheba Platform Limited</Link>
        <div className="space-x-4">
          {/* <Link to="/dashboardpage" className="hover:underline">Employee</Link>
          {/* <Link to="/employees" className="hover:underline">Employees</Link> */}
          {/* <Link to="/about" className="hover:underline">About</Link> */} 
          {/* <Link to="/crud" className="hover:underline">CRUD</Link> */}
          <Link to="/Home" className="hover:underline">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
