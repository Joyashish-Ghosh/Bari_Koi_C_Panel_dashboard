// src/Components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Taste Sheba. All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-400">Designed & Developed by Your Team</p>
      </div>
    </footer>
  );
};

export default Footer;
