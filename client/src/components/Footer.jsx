import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
          Campus Connect
        </div>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The ultimate platform for students to share notes, trade items, and connect with seniors.
        </p>

        <div className="flex justify-center space-x-8 mb-8">
          {/* GitHub Icon - Using a standard SVG so the build CANNOT fail */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200">
            <Linkedin size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 hover:scale-110 transition-all duration-200">
            <Twitter size={24} />
          </a>
          <a href="mailto:support@campusconnect.com" className="text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-200">
            <Mail size={24} />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm font-medium">
          <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
          <Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
        </div>

        <p className="text-gray-500 text-xs tracking-wider uppercase">
          © {new Date().getFullYear()} Campus Connect. Designed for students, by students.
        </p>
      </div>
    </footer>
  );
}