import React, { useEffect, useState } from "react";
import axios from "axios";

// Pull the API URL from your .env
const API_URL = process.env.REACT_APP_API_URL;

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Helper to construct image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
  };

  // Fetch items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/items`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create a local preview URL
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!file || !form.title || !form.description || !form.price)
      return alert("All fields are required");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("imageFile", file);

      const res = await axios.post(`${API_URL}/api/items`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` // Ensure you send the token!
        },
      });

      // The backend usually returns the path. Let's sync the list.
      const newItem = res.data.item;
      setItems([newItem, ...items]);
      
      // Reset Form
      setForm({ title: "", description: "", price: "" });
      setFile(null);
      setPreview(null);
      alert("Item uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Failed to upload item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-8">List Your Item</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Engineering Physics Textbook"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="500"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 text-sm border rounded-xl bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Condition, year of purchase, etc."
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
            </div>

            {/* Preview Area */}
            {preview && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-indigo-100" />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition transform active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Post Item Now"}
            </button>
          </form>

          {/* Items Preview / Live List */}
          <div className="border-l pl-0 lg:pl-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Marketplace Feed</h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {fetching ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-xl bg-slate-200 h-24 w-24"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">No items listed yet. Be the first!</div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-xl bg-white border"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-indigo-600 font-bold">₹{item.price}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Available</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Items;