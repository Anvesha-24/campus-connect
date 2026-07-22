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

  // Semantic search state â€” separate from the local keyword filter so we can
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
              AI-powered semantic search â€” matching by meaning, not just keywords
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

