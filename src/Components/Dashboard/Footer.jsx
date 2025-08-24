// src/Components/Dashboard/Footer.jsx
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 text-white/95 bg-gradient-to-r from-[#070742] via-[#0a0a5b] to-[#13137a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <div>
            <p className="text-sm font-medium">
              &copy; {year} Sheba Platform Limited. All rights reserved.
            </p>
            <p className="text-xs text-white/70 mt-1">
              Developed by System Operation System (SOC Team)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/80 mt-1">
            <span className="hover:text-white transition-colors">Privacy</span>
            <span className="hover:text-white transition-colors">Terms</span>
            <span className="hover:text-white transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
