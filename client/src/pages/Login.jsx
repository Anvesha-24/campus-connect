import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // For button disable
  const navigate = useNavigate();

  // Check for expired/invalid token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("Token expired. Clearing local storage...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Invalid token format. Clearing storage...", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // disable button during request

    // Clear old token/session before login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log("Login data:", { email, password });

   try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      console.log("Login response:", res.data);

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Set axios default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false); // re-enable button
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      <div className="bg-gradient-to-tr from-slate-300 via-slate-200 to-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={`block bg-blue-600 hover:bg-blue-500 text-white py-2 mt-4 rounded-md w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
