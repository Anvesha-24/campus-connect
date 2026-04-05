import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* 1. Permanent Navigation */}
      <Navbar />

      {/* 2. Dynamic Content Area */}
      <main className="flex-grow">
        {/* Adding AnimatePresence here allows for smooth 
            page transitions whenever the route changes.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Permanent Footer */}
      <Footer />
    </div>
  );
}

export default Layout;