import React, { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        alert("Failed to load reviews");
      }
    };
    fetchReviews();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([res.data, ...reviews]);
      setForm({ title: "", content: "" });
      alert("✅ Review submitted!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 flex justify-center py-12 px-6">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
          Student Reviews
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 bg-gray-50 p-6 rounded-2xl shadow-md border"
        >
          <input
            type="text"
            name="title"
            placeholder="Subject / Faculty"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <textarea
            name="content"
            placeholder="Write your honest review..."
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg text-white shadow-md transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Reviews List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">All Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center italic">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="grid gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl border shadow-md bg-white hover:shadow-lg transition duration-200"
              >
                <h3 className="font-bold text-lg text-gray-900">{rev.title}</h3>
                <p className="text-gray-700 mt-2">{rev.content}</p>
                <p className="text-gray-500 text-sm mt-3">
                  ✍️ Posted by{" "}
                  <span className="font-medium text-blue-600">
                    {rev.userName || "Anonymous"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
