import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Send, User, Clock, AlertCircle } from "lucide-react";

// Accessing the API URL from your .env
const API_URL = process.env.REACT_APP_API_URL;

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // -------------------- FETCH REVIEWS --------------------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // -------------------- SUBMIT REVIEW --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to post a review!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/reviews`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([res.data, ...reviews]);
      setForm({ title: "", content: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((rev) =>
    rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Student Feedback
          </h1>
          <p className="text-slate-400">Honest reviews on courses, faculties, and campus life.</p>
        </div>

        {/* Post Review Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl mb-12 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6 text-blue-400">
            <MessageSquare size={20} />
            <h2 className="font-bold uppercase tracking-widest text-sm">Post a Review</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Subject or Faculty Name (e.g., Data Structures - Dr. Sharma)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
            <textarea
              name="content"
              placeholder="Share your experience... What should other students know?"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              {loading ? "Posting..." : <><Send size={18} /> Submit Review</>}
            </button>
          </form>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-4 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search reviews by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredReviews.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl"
              >
                <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No reviews found matching your search.</p>
              </motion.div>
            ) : (
              filteredReviews.map((rev) => (
                <motion.div
                  key={rev._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-white">{rev.title}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock size={14} />
                      <span>{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6">{rev.content}</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">
                      {rev.userName || "Verified Student"}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Reviews;