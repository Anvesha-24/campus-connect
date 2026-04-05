import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, GraduationCap, BookOpen, UserPlus } from "lucide-react";
import axios from "axios";

// Using your environment variable for production
const API_URL = process.env.REACT_APP_API_URL;

function Register() {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    branch: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/users/register`, formdata);
      alert(res.data.message || "Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 py-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Join the Campus Connect community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={formdata.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                name="email"
                type="email"
                placeholder="College Email ID"
                required
                value={formdata.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                name="password"
                type="password"
                placeholder="Create Password"
                required
                value={formdata.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Year Dropdown */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <select
                  name="year"
                  required
                  value={formdata.year}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* Branch Dropdown */}
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <select
                  name="branch"
                  required
                  value={formdata.branch}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 mt-4 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <UserPlus size={20} />
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 font-medium">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;