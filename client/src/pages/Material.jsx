import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Material() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const materialsPerPage = 9;
  const token = localStorage.getItem("token");

  // -------------------- FETCH MATERIALS --------------------
  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(res.data);
      setFilteredMaterials(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch materials.");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // -------------------- HANDLE FORM --------------------
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // -------------------- SEARCH --------------------
  useEffect(() => {
    const filtered = materials.filter(
      (mat) =>
        mat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
    setCurrentPage(1);
  }, [searchTerm, materials]);

  // -------------------- UPLOAD MATERIAL --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.subject || !form.description) {
      return alert("All fields are required!");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("description", form.description);
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/materials/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMaterials([res.data.material, ...materials]);
      setForm({ subject: "", description: "" });
      setFile(null);
      alert("Material uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check file type or login.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- PAGINATION --------------------
  const indexOfLast = currentPage * materialsPerPage;
  const indexOfFirst = indexOfLast - materialsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-700">
          Materials Upload
        </h1>

        <input
          type="text"
          placeholder="Search for notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border focus:ring-2 focus:ring-purple-300 outline-none mb-6"
        />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 items-end"
        >
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="p-3 border rounded-md w-full focus:ring-2 focus:ring-purple-300 outline-none"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-3 border rounded-md w-full focus:ring-2 focus:ring-purple-300 outline-none"
          />
          <div className="p-3 border rounded-md bg-white w-full text-center">
            <label className="cursor-pointer">
              {file ? `Selected: ${file.name}` : "Choose file"}
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="sm:col-span-3 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-64 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md font-semibold shadow hover:shadow-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </motion.form>

        {currentMaterials.length === 0 ? (
          <p className="text-center text-gray-700">No materials found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentMaterials.map((mat) => (
              <motion.div
                key={mat._id}
                whileHover={{ scale: 1.05, y: -3 }}
                className="p-4 border rounded-xl shadow-md bg-white flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-purple-700">{mat.subject}</h3>
                  <p className="text-gray-600 text-sm mb-2">{mat.description}</p>
                  <p className="text-gray-400 text-xs">
                    Uploaded by: {mat.uploadedBy?.name || "Anonymous"}
                  </p>
                </div>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-center bg-purple-200 text-purple-800 py-1 rounded-md font-medium hover:bg-purple-300 transition"
                >
                  View / Download
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-6 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Material;
