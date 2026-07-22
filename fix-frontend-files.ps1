# Campus Connect - re-fix frontend files script
# Run this from the REPO ROOT: C:\Users\ayush\OneDrive\Desktop\campus-connect-clean

Write-Host "Writing client/src/pages/Connect.jsx..." -ForegroundColor Cyan
@'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Send, Search, User, MessageCircle, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL;

function Connect() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [answers, setAnswers] = useState({});
  const [answerForm, setAnswerForm] = useState({});

  // RAG state, keyed by question ID, so each question card has its own
  // independent loading/answer/error state.
  const [aiAnswers, setAiAnswers] = useState({}); // { [questionId]: { answer, groundedIn } }
  const [aiLoading, setAiLoading] = useState({}); // { [questionId]: boolean }
  const [aiError, setAiError] = useState({}); // { [questionId]: string }

  // -------------------- FETCH DATA --------------------
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/connect`);
        setQuestions(res.data);

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

  // Fetches a RAG-generated suggested answer, grounded in similar past
  // questions/materials. Purely additive — seniors can still answer normally
  // regardless of what the AI suggests.
  const handleGetAiAnswer = async (questionId) => {
    const token = localStorage.getItem("token");
    setAiLoading({ ...aiLoading, [questionId]: true });
    setAiError({ ...aiError, [questionId]: null });

    try {
      const res = await axios.post(
        `${API_URL}/api/rag/suggest-answer/${questionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiAnswers({ ...aiAnswers, [questionId]: res.data });
    } catch (err) {
      setAiError({
        ...aiError,
        [questionId]: err.response?.data?.message || "Couldn't generate an AI answer right now.",
      });
    } finally {
      setAiLoading({ ...aiLoading, [questionId]: false });
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

                  {/* AI Suggested Answer */}
                  <div className="mb-6">
                    {!aiAnswers[q._id] && !aiLoading[q._id] && (
                      <button
                        onClick={() => handleGetAiAnswer(q._id)}
                        className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <Sparkles size={14} />
                        Get AI Suggested Answer
                      </button>
                    )}

                    {aiLoading[q._id] && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 px-4 py-2.5">
                        <Loader2 size={14} className="animate-spin" />
                        Looking through similar questions and study materials...
                      </div>
                    )}

                    {aiError[q._id] && (
                      <p className="text-xs text-slate-500 italic px-1">{aiError[q._id]}</p>
                    )}

                    {aiAnswers[q._id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2 text-purple-400">
                          <Sparkles size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">AI Suggested Answer</span>
                        </div>
                        {aiAnswers[q._id].answer ? (
                          <>
                            <p className="text-sm text-slate-300 leading-relaxed">{aiAnswers[q._id].answer}</p>
                            {aiAnswers[q._id].groundedIn?.materials?.length > 0 && (
                              <p className="text-[10px] text-slate-500 mt-3">
                                Based on: {aiAnswers[q._id].groundedIn.materials.map((m) => m.subject).join(", ")}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 italic">{aiAnswers[q._id].message}</p>
                        )}
                        <p className="text-[10px] text-slate-600 mt-3 italic">
                          AI-generated — always double-check with a real senior or your course materials.
                        </p>
                      </motion.div>
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

'@ | Set-Content -Path "client\src\pages\Connect.jsx" -Encoding utf8

Write-Host "Writing client/src/pages/Material.jsx..." -ForegroundColor Cyan
@'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, FileText, Download, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Using your environment variable for production
const API_URL = process.env.REACT_APP_API_URL;

function Material() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Semantic search state — separate from the local keyword filter so we can
  // fall back gracefully if the AI search endpoint is briefly unavailable.
  const [isSemanticSearching, setIsSemanticSearching] = useState(false);
  const [semanticActive, setSemanticActive] = useState(false);

  const materialsPerPage = 6;
  const token = localStorage.getItem("token");

  // -------------------- FETCH MATERIALS --------------------
  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(res.data);
      setFilteredMaterials(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // -------------------- SEMANTIC SEARCH (debounced) --------------------
  // Searches by meaning via the backend (/api/search) instead of just
  // matching substrings, so "database keys" can find a resource titled
  // "primary and foreign key concepts" even with no shared words.
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMaterials(materials);
      setSemanticActive(false);
      setCurrentPage(1);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSemanticSearching(true);
      try {
        const res = await axios.get(`${API_URL}/api/search`, {
          params: { q: searchTerm, type: "materials" },
        });
        setFilteredMaterials(res.data.results.materials || []);
        setSemanticActive(true);
      } catch (err) {
        // If semantic search is briefly unavailable, fall back to a plain
        // local keyword match rather than showing an empty/broken state.
        console.error("Semantic search failed, falling back to keyword match:", err);
        const fallback = materials.filter(
          (mat) =>
            mat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mat.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMaterials(fallback);
        setSemanticActive(false);
      } finally {
        setIsSemanticSearching(false);
        setCurrentPage(1);
      }
    }, 400); // debounce so we don't fire a request on every keystroke

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, materials]);

  // -------------------- UPLOAD HANDLER --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.subject || !form.description) {
      return alert("Please fill all fields and select a file.");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("description", form.description);
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/api/materials/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMaterials([res.data.material, ...materials]);
      setForm({ subject: "", description: "" });
      setFile(null);
      alert("Study material shared successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed. Check file size/type.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- PAGINATION --------------------
  const indexOfLast = currentPage * materialsPerPage;
  const indexOfFirst = indexOfLast - materialsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Study Resources
          </h1>
          <p className="text-slate-400">Share notes, PYQs, and guides with your campus community.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-3">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search by meaning (e.g. 'database keys' finds indexing notes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
          {isSemanticSearching && (
            <div className="absolute right-4 top-4 text-purple-400 text-xs animate-pulse">Searching...</div>
          )}
        </div>

        {/* Semantic search indicator */}
        {searchTerm.trim() && semanticActive && !isSemanticSearching && (
          <div className="flex justify-center mb-8">
            <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
              <Sparkles size={12} />
              AI-powered semantic search — matching by meaning, not just keywords
            </span>
          </div>
        )}
        {!searchTerm.trim() && <div className="mb-10" />}

        {/* Upload Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-12 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="DBMS, AI, etc."
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Unit 1 Notes, Lab Manual..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Attachment</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-center text-sm text-slate-400 group-hover:bg-slate-700 transition flex items-center justify-center gap-2">
                  <Upload size={18} />
                  {file ? file.name.substring(0, 15) + "..." : "Choose File"}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 py-3.5 rounded-xl font-bold transition shadow-lg shadow-purple-900/20 disabled:opacity-50"
            >
              {loading ? "Sharing..." : "Post Resource"}
            </button>
          </form>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {currentMaterials.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500 italic">
                No matching resources found.
              </div>
            ) : (
              currentMaterials.map((mat) => (
                <motion.div
                  key={mat._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-purple-500/50 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                        <FileText size={24} />
                      </div>
                      {typeof mat.score === "number" && (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                          {Math.round(mat.score * 100)}% match
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-purple-400 transition">{mat.subject}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{mat.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <span className="block font-medium text-slate-300">By {mat.uploadedBy?.name || "Senior"}</span>
                    </div>
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg text-white transition-colors"
                    >
                      <Download size={20} />
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-bold text-slate-400">
              Page <span className="text-white">{currentPage}</span> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Material;

'@ | Set-Content -Path "client\src\pages\Material.jsx" -Encoding utf8

Write-Host "Done! Verifying..." -ForegroundColor Green
Select-String -Path "client\src\pages\Connect.jsx" -Pattern "Sparkles"
Select-String -Path "client\src\pages\Material.jsx" -Pattern "Sparkles"
Write-Host "If both showed matches, the files are correct. Now run: git add . ; git commit -m 'Fix: actually apply semantic search and RAG frontend UI' ; git push origin main" -ForegroundColor Yellow