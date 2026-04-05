import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Use the environment variable from your .env file
const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Helper function for image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-avatar.png";
    return imagePath.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
  };

  // -------------------- FETCH USER PROFILE --------------------
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, token]);

  // -------------------- FETCH LATEST UPDATES --------------------
  useEffect(() => {
    const fetchUpdates = async () => {
      if (!token) return;
      try {
        const [materialsRes, itemsRes, connectRes] = await Promise.all([
          axios.get(`${API_URL}/api/materials`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/items`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/connect`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const updates = [
          ...materialsRes.data.map((m) => ({
            text: `📘 New material uploaded: ${m.subject}`,
            createdAt: m.createdAt,
          })),
          ...itemsRes.data.map((i) => ({
            text: `💻 New item posted: ${i.title}`,
            createdAt: i.createdAt,
          })),
          ...connectRes.data.map((c) => ({
            text: `🎓 New post: ${c.question || c.content || "Question posted"}`,
            createdAt: c.createdAt,
          })),
        ];

        updates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestUpdates(updates.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch latest updates", err);
      }
    };

    fetchUpdates();
  }, [token]);

  // -------------------- FETCH USER'S POSTED ITEMS --------------------
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/items/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserItems(res.data);
      } catch (err) {
        console.error("Failed to fetch user items", err);
      }
    };

    if (token) fetchUserItems();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserItems(userItems.filter((item) => item._id !== id));
      alert("Item removed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove the item.");
    }
  };

  if (!user) {
    return <div className="text-center mt-10 text-lg text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 pt-5 px-6 pb-44">
      <div className="max-w-5xl mx-auto space-y-8 mt-10">

        {/* Profile Section */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <img
            src={getImageUrl(user?.avatar)}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover bg-slate-700"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {user?.name || "Student"}
            </h1>
            <p className="text-slate-300">{user?.email}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to="/buy-sell" className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-white/20 transition group">
            <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition">Buy/Sell Items</h2>
            <p className="text-slate-300">Browse or post products to exchange on Campus</p>
          </Link>

          <Link to="/materials" className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-white/20 transition group">
            <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition">Study Material</h2>
            <p className="text-slate-300">Share and access important notes and PYQ's</p>
          </Link>

          <Link to="/connect" className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-white/20 transition group">
            <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition">Connect with Seniors</h2>
            <p className="text-slate-300">Ask questions, seek help or career guidance</p>
          </Link>

          <Link to="/reviews" className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-white/20 transition group">
            <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition">Reviews</h2>
            <p className="text-slate-300">Read and post reviews for subjects or faculty</p>
          </Link>
        </div>

        {/* Latest Updates */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Latest Updates</h3>
          <ul className="space-y-3 text-slate-300">
            {latestUpdates.length === 0 ? (
              <li className="text-gray-400 italic">No updates yet.</li>
            ) : (
              latestUpdates.map((u, idx) => (
                <li key={idx} className="border-b border-slate-600/50 pb-2 flex items-start gap-2">
                  <span className="text-sm">{u.text}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* User's Posted Items */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Your Posted Items</h3>

          {userItems.length === 0 ? (
            <p className="text-gray-400 italic">You haven't posted any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg p-4 shadow-md flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-indigo-900 text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <p className="font-bold text-green-600 text-lg mb-3">₹{item.price}</p>

                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-40 object-contain mt-2 rounded bg-gray-50 border"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition shadow-sm"
                  >
                    Mark as Sold / Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="text-center pb-10">
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg transform hover:scale-105"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;