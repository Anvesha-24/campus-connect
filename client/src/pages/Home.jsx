import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const features = [
    { 
      icon: "🔄", 
      title: "Buy & Sell", 
      description: "Trade textbooks, electronics, and campus essentials with ease",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: "👥", 
      title: "Connect", 
      description: "Network with seniors and classmates across all departments",
      color: "from-violet-500 to-purple-500"
    },
    { 
      icon: "📚", 
      title: "Resources", 
      description: "Access shared study materials, PYQs, and semester guides",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: "💬", 
      title: "Reviews", 
      description: "Get honest opinions about courses, electives, and faculty",
      color: "from-rose-500 to-pink-500"
    },
  ];

  const testimonials = [
    { 
      quote: "Saved me thousands on textbooks by connecting with seniors!", 
      author: "Alex, CS Major",
      avatar: "👨‍💻"
    },
    { 
      quote: "Found the perfect project group through the Connect feature.", 
      author: "Priya, ECE",
      avatar: "👩‍🔬"
    }
  ];

  // Simplified Stats for better mobile viewing
  const stats = [
    { value: "1,000+", label: "Students" },
    { value: "500+", label: "Items Listed" },
    { value: "200+", label: "Resources" },
    { value: "4.9", label: "Avg Rating" },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Background Layer - Uses fixed position to prevent jitter during scroll */}
      <div className="fixed inset-0 -z-20 bg-slate-950"></div>

      {/* Animated gradient blobs - Optimized Opacity */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full filter blur-[120px] animate-blob"></div>
      <div className="absolute top-40 -right-40 w-[700px] h-[700px] bg-purple-800/10 rounded-full filter blur-[120px] animate-blob animation-delay-2000"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/10 text-center"
        >
          <motion.h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Connect</span>
          </motion.h1>
          
          <motion.p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            The all-in-one student ecosystem. Empowering your academic journey through community-driven sharing and networking.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all"
              >
                Join the Community
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold backdrop-blur-md border border-white/20 transition-all"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats - Now with better mobile grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
              <div className="text-2xl font-black text-blue-400">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Everything you need, <span className="text-blue-500">all in one place.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-blue-500/50 transition-colors"
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

export default Home;