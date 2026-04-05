import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Brand Logo / Name */}
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
          Campus Connect
        </div>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The ultimate platform for students to share notes, trade items, and connect with seniors.
        </p>

        {/* Social Icons Section */}
        <div className="flex justify-center space-x-8 mb-8">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Github size={24} />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200"
          >
            <Linkedin size={24} />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-sky-400 hover:scale-110 transition-all duration-200"
          >
            <Twitter size={24} />
          </a>
          <a 
            href="mailto:support@campusconnect.com" 
            className="text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-200"
          >
            <Mail size={24} />
          </a>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm font-medium">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
          <Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mb-8"></div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs tracking-wider uppercase">
          © {new Date().getFullYear()} Campus Connect. Designed for students, by students.
        </p>
      </div>
    </footer>
  );
}