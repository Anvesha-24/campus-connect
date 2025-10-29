import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav className='bg-gradient-to-r from-gray-900 via-black-800 to-blue-900 text-white shadow-lg h-16 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 flex justify-between items-center h-full'>
        {/* Logo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.1 }}
          className='flex items-center'
        >
          <Link to="/home" className='flex items-center space-x-2 group'>
            <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform'>
              <span className='text-blue-900 font-bold text-xl'>CC</span>
            </div>
            <span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white'>
              CampusConnect
            </span>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <motion.ul 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className='hidden md:flex space-x-6 items-center'
        >
          {['dashboard', 'buy-sell', 'connect', 'materials', 'reviews'].map((item) => (
            <motion.li 
              key={item}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/${item}`} 
                className='px-3 py-1 rounded-md hover:bg-blue-700/50 transition-all duration-300 font-medium text-white/90 hover:text-white flex items-center'
              >
                {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Auth Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.3 }}
          className='flex items-center'
        >
          {user ? (
            <div className='flex items-center space-x-4'>
              <span className='text-sm font-medium hidden sm:inline'>
                Welcome, {user.name || user.email.split('@')[0]}
              </span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-white/90 text-blue-900 px-4 py-1.5 rounded-md font-semibold shadow-md hover:bg-white transition-all'
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className='flex space-x-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login" 
                  className='bg-white/90 text-blue-900 px-4 py-1.5 rounded-md font-semibold shadow-md hover:bg-white transition-all'
                >
                  Login
                </Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='hidden sm:block'
              >
                <Link 
                  to="/register" 
                  className='border border-white/80 text-white px-4 py-1.5 rounded-md font-semibold hover:bg-white/10 transition-all'
                >
                  Register
                </Link>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
}

export default Navbar;