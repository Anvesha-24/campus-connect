import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const features = [
    { 
      icon: "🔄", 
      title: "Buy & Sell", 
      description: "Trade textbooks, notes, and campus essentials with ease",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: "👥", 
      title: "Connect", 
      description: "Network with seniors and classmates across departments",
      color: "from-violet-500 to-purple-500"
    },
    { 
      icon: "📚", 
      title: "Resources", 
      description: "Access shared study materials, guides, and exam prep",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: "💬", 
      title: "Reviews", 
      description: "Get honest opinions about courses and professors",
      color: "from-rose-500 to-pink-500"
    },
  ];

  const testimonials = [
    { 
      quote: "Saved me hundreds on textbooks by connecting with seniors!", 
      author: "Alex, Computer Science",
      avatar: "👨‍💻"
    },
    { 
      quote: "Found the perfect study group through Campus Connect.", 
      author: "Priya, ECE",
      avatar: "👩‍🔬"
    },
    { 
      quote: "Got the best guidance for placements – amazing!", 
      author: "Anita, CSE",
      avatar: "👩‍🎓"
    },
    { 
      quote: "Scored high in exams with shared notes & mentors.", 
      author: "Rahul, Mechanical",
      avatar: "👨‍🏭"
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "5K+", label: "Transactions" },
    { value: "8K+", label: "Resources Shared" },
    { value: "4.9", label: "Rating" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-blue-900 via-gray-900 to-black"></div>

      {/* Animated gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-r from-pink-600 to-purple-800 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500 to-cyan-700 rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 -z-10"></div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/5 w-10 h-10 rounded-full bg-blue-500 opacity-20 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-purple-500 opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full bg-cyan-400 opacity-25 animate-float animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center px-4 py-28 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full bg-gray-900/70 backdrop-blur-xl p-10 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -top-3 -right-3 w-24 h-24 bg-blue-500 rounded-full filter blur-xl opacity-70"
          ></motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Campus Connect
            </span>{" "}
            🎓
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed"
          >
            Your ultimate hub to{" "}
            <span className="font-semibold text-blue-300">buy/sell</span>{" "},
            <span className="font-semibold text-indigo-300"> connect</span> with peers, 
            and{" "}
            <span className="font-semibold text-purple-300">thrive</span> in campus life.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all"
              >
                Get Started
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.5)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all hover:bg-gray-100"
              >
                Create Account
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-300 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl text-center mb-16 font-extrabold"
        >
          <span className="text-gray-100">Why Students</span>{" "}
          <span className="text-blue-400">Love</span>{" "}
          <span className="text-indigo-400">Campus Connect</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border border-white/10 text-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.color}"></div>
              <div className="relative z-10">
                <div className="flex justify-center text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-extrabold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-100"
        >
          What Students <span className="text-blue-400">Say</span>...
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/10 relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl">
                {t.avatar}
              </div>
              <div className="text-4xl text-blue-400 mb-3 opacity-70">"</div>
              <p className="text-lg text-gray-200 italic mb-6">"{t.quote}"</p>
              <p className="font-semibold text-blue-300">— {t.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold mb-4 text-white"
          >
            Ready to Transform Your Campus Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl mb-10 text-gray-200"
          >
            Join thousands of students already making the most of their journey 🚀
          </motion.p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Sign Up Now – It's Free!
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}

      {/* Add custom animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -20px) scale(1.05); }
            50% { transform: translate(0, -40px) scale(1.1); }
            75% { transform: translate(-20px, -20px) scale(1.05); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </div>
  );
}

export default Home;