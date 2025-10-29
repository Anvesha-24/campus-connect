import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  // Handle form submit
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
      const res = await axios.post("http://localhost:5000/api/items", formData, {
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

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) => p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
      
      {/* Floating gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-r from-purple-200 to-pink-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 -z-10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/5 w-10 h-10 rounded-full bg-blue-300 opacity-30 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-purple-300 opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full bg-cyan-300 opacity-30 animate-float animation-delay-4000"></div>

      <div className="p-6 min-h-screen relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">
          Campus Marketplace
        </h1>
        <p className="text-center text-indigo-600 mb-8 max-w-2xl mx-auto">
          Buy and sell textbooks, notes, and campus essentials with your fellow students
        </p>

        {/* Toggle Form Button */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            {showForm ? "Cancel" : "Sell an Item"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl shadow-lg bg-white bg-opacity-90 backdrop-blur-sm border border-indigo-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">List a New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Calculus Textbook"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your item..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors inline-block">
                      Choose Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {previewImage && (
                    <span className="text-sm text-green-600">Image selected</span>
                  )}
                </div>
              </div>

              {previewImage && (
                <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg border">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                Post Item
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>

        {/* Results count */}
        <div className="max-w-6xl mx-auto mb-4">
          <p className="text-indigo-700">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Products Container */}
        <div className="flex justify-center">
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {currentProducts.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-2xl shadow-md bg-white bg-opacity-90 backdrop-blur-sm flex flex-col overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
                >
                  {item.image && (
                    <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100 cursor-pointer"
                         onClick={() => setSelectedImage(item.image)}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-lg text-indigo-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {item.description}
                    </p>

                    <div className="mt-auto">
                      <p className="text-green-600 font-semibold text-lg">₹{item.price}</p>
                      <button
                        onClick={() => handleInterested(item._id)}
                        className="mt-3 w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                      >
                        I'm Interested
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-box-open text-4xl mb-3"></i>
              <p>No items found. {!searchTerm && "Be the first to list an item!"}</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="flex items-center text-indigo-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 bg-white text-black px-3 py-1 rounded-full shadow-md hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-times"></i> Close
              </button>
              <img
                src={selectedImage}
                alt="Full View"
                className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>

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
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}

export default BuySell;