import { useEffect, useState } from "react";
import axios from "axios";

// Helper to handle the API URL from your .env file
const API_URL = process.env.REACT_APP_API_URL;

function BuySell() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const token = localStorage.getItem("token");

  // Fetch all products using the environment variable
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/items`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !imageFile) {
      alert("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("image", imageFile);

    try {
      // POST request updated to use environment variable
      const res = await axios.post(`${API_URL}/api/items`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts([res.data, ...products]);
      setForm({ title: "", description: "", price: "" });
      setImageFile(null);
      setPreviewImage(null);
      setShowForm(false);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Failed to post item. Make sure you are logged in.");
    }
  };

  const handleInterested = (id) => {
    alert(`You showed interest in product ${id}`);
  };

  const filteredProducts = products.filter(
    (p) => p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Helper function to build the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (like from a cloud provider), use it. 
    // Otherwise, prefix it with your Render Backend URL.
    return imagePath.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
      
      {/* Background Blobs & Grid */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-r from-purple-200 to-pink-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 -z-10"></div>
      
      <div className="p-6 min-h-screen relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">Campus Marketplace</h1>
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            {showForm ? "Cancel" : "Sell an Item"}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl shadow-lg bg-white bg-opacity-90 backdrop-blur-sm border border-indigo-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">List a New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-4 py-2 border rounded-lg" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows="3" className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (₹)" className="w-full px-4 py-2 border rounded-lg" />
              
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg">
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {previewImage && <span className="text-green-600 text-sm">Selected!</span>}
              </div>

              {previewImage && (
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
                  <img src={previewImage} alt="Preview" className="object-contain w-full h-full" />
                </div>
              )}
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 shadow-md">Post Item</button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>

        {/* Products Grid */}
        <div className="flex justify-center">
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {currentProducts.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-2xl shadow-md bg-white bg-opacity-90 backdrop-blur-sm overflow-hidden transition-transform hover:scale-[1.02]">
                  {item.image && (
                    <div 
                      className="w-full h-48 flex items-center justify-center bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedImage(getImageUrl(item.image))}
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}

                  <div className="p-4 flex flex-col">
                    <h3 className="font-bold text-lg text-indigo-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                    <div className="mt-auto">
                      <p className="text-green-600 font-semibold text-lg">₹{item.price}</p>
                      <button
                        onClick={() => handleInterested(item._id)}
                        className="mt-3 w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-200"
                      >
                        I'm Interested
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No items found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 bg-indigo-100 rounded-lg disabled:opacity-50">Prev</button>
            <span className="flex items-center text-indigo-700">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-indigo-100 rounded-lg disabled:opacity-50">Next</button>
          </div>
        )}

        {/* Modal for full image */}
        {selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-full">
              <img src={selectedImage} alt="Full View" className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-lg" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes blob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-blob { animation: blob 10s infinite; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default BuySell;