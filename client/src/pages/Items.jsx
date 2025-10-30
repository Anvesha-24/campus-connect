import React, { useEffect, useState } from "react";
import axios from "axios";

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Optional: set base URL for axios
  axios.defaults.baseURL = "http://localhost:5000";

  // Fetch items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/api/items");
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
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.title || !form.description || !form.price)
      return alert("All fields are required");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("imageFile", file);

      const res = await axios.post("/api/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add newly uploaded item to the top of the list
      const newItem = {
        ...res.data.item,
        image: `/uploads/items/${res.data.item.image}`, // full relative path for img
      };
      setItems([newItem, ...items]);
      setForm({ title: "", description: "", price: "" });
      setFile(null);
      alert("Item uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Items Upload</h1>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {file && <p className="text-sm text-gray-600">Selected file: {file.name}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>
        </form>

        {/* Items List */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Available Items</h2>

        {fetching ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No items available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item._id} className="border rounded-md p-2">
                <h3 className="font-semibold">{item.title}</h3>
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-32 object-cover mt-2"
                  />
                )}
                <p>{item.description}</p>
                <p className="font-medium">₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;
