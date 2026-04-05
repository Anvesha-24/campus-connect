import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard, ShoppingBag, Users, FileText, Star } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isOpen, setIsOpen] = useState(false);

  // Sync user state if localStorage changes (e.g., on login)
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on location change in case login happened within the same window
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Marketplace', path: '/buy-sell', icon: <ShoppingBag size={18} /> },
    { name: 'Connect', path: '/connect', icon: <Users size={18} /> },
    { name: 'Materials', path: '/materials', icon: <FileText size={18} /> },
    { name: 'Reviews', path: '/reviews', icon: <Star size={18} /> },
  ];

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-white shadow-xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic">C</span>
            </div>
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CAMPUS CONNECT
            </span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-semibold text-sm ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center border-l border-slate-800 ml-4 pl-6 space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Student</span>
                <span className="text-sm font-semibold text-white">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors group"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white px-4">Login</Link>
              <Link to="/register" className="bg-white text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-t border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 text-slate-300 hover:text-white hover:bg-slate-900 rounded-2xl transition-all"
                >
                  <span className="p-2 bg-slate-800 rounded-lg text-blue-400">{link.icon}</span>
                  <span className="font-bold">{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-800">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <span className="p-2 bg-red-500/10 rounded-lg"><LogOut size={20} /></span>
                    <span className="font-bold">Sign Out</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-center p-4 font-bold text-white border border-slate-800 rounded-2xl">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="text-center p-4 font-bold bg-blue-600 text-white rounded-2xl">Join Now</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;