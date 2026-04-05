import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Send, Search, User, MessageCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL;

function Connect() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [answers, setAnswers] = useState({});
  const [answerForm, setAnswerForm] = useState({});

  // -------------------- FETCH DATA --------------------
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/connect`);
        setQuestions(res.data);

        // Optimization: Ideally, your backend should return answers WITH questions.
        // If not, we fetch them here.
        const newAnswers = {};
        await Promise.all(res.data.map(async (q) => {
          try {
            const ansRes = await axios.get(`${API_URL}/api/answers/${q._id}`);
            newAnswers[q._id] = ansRes.data;
          } catch (e) {
            newAnswers[q._id] = [];
          }
        }));
        setAnswers(newAnswers);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchAllData();
  }, []);

  // -------------------- HANDLERS --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/connect`, form);
      setQuestions([res.data, ...questions]);
      setForm({ question: "" });
    } catch (err) {
      alert("Failed to post question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    const text = answerForm[questionId];
    if (!text?.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/answers/${questionId}`, { text });
      setAnswers({
        ...answers,
        [questionId]: [res.data, ...(answers[questionId] || [])],
      });
      setAnswerForm({ ...answerForm, [questionId]: "" });
    } catch (err) {
      alert("Failed to post answer");
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Senior-Junior Hub
          </h1>
          <p className="text-slate-400 font-medium italic">"The only dumb question is the one you don't ask."</p>
        </div>

        {/* Ask Question Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-12 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <MessageSquare size={20} />
            <h2 className="font-bold uppercase tracking-widest text-xs">New Inquiry</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              name="question"
              placeholder="E.g., How do I prepare for the Google internship interview?"
              value={form.question}
              onChange={(e) => setForm({ question: e.target.value })}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none min-h-[100px]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? "Posting..." : <><Send size={18} /> Broadcast Question</>}
            </button>
          </form>
        </motion.div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-4 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          <AnimatePresence>
            {filteredQuestions.map((q) => (
              <motion.div
                key={q._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
              >
                <div className="p-6 pb-4 border-b border-slate-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300">{q.userName || "Student"}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Question Thread</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{q.question}</h3>
                </div>

                {/* Answers Section */}
                <div className="p-6 bg-slate-900/50">
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                    {answers[q._id]?.length > 0 ? (
                      answers[q._id].map((a) => (
                        <div key={a._id} className="flex gap-3">
                          <ChevronRight size={16} className="mt-1 text-blue-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-300">
                              <span className="font-bold text-blue-400 mr-2">{a.userName}:</span>
                              {a.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-600 text-sm italic">Waiting for a senior's wisdom...</p>
                    )}
                  </div>

                  {/* Reply Box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Share your advice..."
                      value={answerForm[q._id] || ""}
                      onChange={(e) => setAnswerForm({ ...answerForm, [q._id]: e.target.value })}
                      className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleAnswerSubmit(q._id)}
                      className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl transition-colors"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Connect;