import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react"; // modern icons

export default function Footer() {
  return (
      <footer className="relative z-10 bg-gray-900 border-t border-white/10 py-12">

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
            Campus Connect
          </div>
          <p className="text-gray-400 mb-6">
            Connecting students, enhancing campus life
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Campus Connect. All rights reserved.
          </p>
        </div>
      </footer>
  );
}
