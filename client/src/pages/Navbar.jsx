import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // 🧩 install: npm install lucide-react

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false); // 🟢 for mobile menu toggle

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const navLinks = ['dashboard', 'buy-sell', 'connect', 'materials', 'reviews'];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.1 }}
          className="flex items-center"
        >
          <Link to="/home" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
              <span className="text-blue-900 font-bold text-xl">CC</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white">
              CampusConnect
            </span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <motion.ul
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="hidden md:flex space-x-6 items-center"
        >
          {navLinks.map((item) => (
            <motion.li
              key={item}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/${item}`}
                className="px-3 py-1 rounded-md hover:bg-blue-700/50 transition-all duration-300 font-medium text-white/90 hover:text-white"
              >
                {item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('/')}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Auth + Hamburger (Right side) */}
        <div className="flex items-center space-x-3">
          {/* Auth buttons (Desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium">Hi, {user.name || user.email.split('@')[0]}</span>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 text-blue-900 px-4 py-1.5 rounded-md font-semibold shadow-md hover:bg-white transition-all"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white/90 text-blue-900 px-4 py-1.5 rounded-md font-semibold shadow-md hover:bg-white transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-white/80 text-white px-4 py-1.5 rounded-md font-semibold hover:bg-white/10 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger icon (Mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-700 overflow-hidden"
          >
            <ul className="flex flex-col p-4 space-y-3">
              {navLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item}`}
                    className="block text-white/90 hover:text-white hover:bg-blue-700/40 px-4 py-2 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('/')}
                  </Link>
                </li>
              ))}

              {/* Auth Buttons (Mobile) */}
              <div className="border-t border-gray-700 pt-3 space-y-2">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full bg-white/90 text-blue-900 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-white transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-white/90 text-blue-900 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center border border-white/80 text-white px-4 py-2 rounded-md font-semibold hover:bg-white/10 transition-all"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
