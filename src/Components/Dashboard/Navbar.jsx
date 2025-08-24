// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 text-white/95 shadow-lg backdrop-blur bg-gradient-to-r from-[#070742] via-[#0a0a5b] to-[#13137a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="https://i.postimg.cc/nzzgnZXH/partner5.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-lg ring-1 ring-white/20 bg-white/10 object-contain p-1.5"
            />
            <span className="hidden sm:inline text-lg font-semibold tracking-tight">Sheba Platform Limited</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link to="/Home" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

