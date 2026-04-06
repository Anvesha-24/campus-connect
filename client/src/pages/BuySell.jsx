import { useEffect, useState } from "react";
import axios from "axios";

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

  const filteredProducts = products.filter(
    (p) => p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Campus <span className="text-indigo-600">Marketplace</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            The trusted hub to buy, sell, and trade essentials with fellow students.
          </p>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`mt-8 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg ${
              showForm ? "bg-rose-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {showForm ? "Close Form" : "List Your Item"}
          </button>
        </div>

        {/* Listing Form */}
        {showForm && (
          <div className="mb-16 bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6">Create New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="What are you selling?" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell us more about it..." rows="3" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full pl-10 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-sm font-medium text-indigo-700">Item Image</span>
                <label className="cursor-pointer bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {previewImage && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-indigo-200">
                  <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
              
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                Launch Listing
              </button>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search items by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentProducts.map((item) => (
            <div key={item._id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              {item.image && (
                <div className="h-64 overflow-hidden bg-slate-100 relative">
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 z-10 shadow-sm">
                    Student Verified
                  </div>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                    onClick={() => setSelectedImage(getImageUrl(item.image))}
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</span>
                    <p className="text-2xl font-black text-emerald-600">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => alert(`Interested in ${item.title}`)}
                    className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-xl font-medium">No items found matching your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-20">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-bold text-slate-600">
              {currentPage} <span className="text-slate-300 mx-2">/</span> {totalPages}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md z-[100] p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full View" className="max-h-full max-w-full rounded-2xl shadow-2xl border-4 border-white/10" />
        </div>
      )}
    </div>
  );
}

export default BuySell;