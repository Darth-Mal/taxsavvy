"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h3 className="text-xl font-bold cursor-pointer">Taxsavvy</h3>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <div className="pill-btn">Filing</div>
          <div className="pill-btn">Reforms</div>
          <div className="pill-btn">Learn</div>
          <div className="pill-btn">About</div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col items-center space-y-3 py-4">
          <div className="pill-btn w-3/4 text-center">Filing</div>
          <div className="pill-btn w-3/4 text-center">Reforms</div>
          <div className="pill-btn w-3/4 text-center">Learn</div>
          <div className="pill-btn w-3/4 text-center">About</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
