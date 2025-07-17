import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-1 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-row items-center justify-between text-sm leading-none">
        <p className="m-0">&copy; {new Date().getFullYear()} NetPazar. Tüm hakları saklıdır.</p>
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-white transition-colors">
            Gizlilik
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Şartlar
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            İletişim
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
