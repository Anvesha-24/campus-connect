import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// -------------------- Pages --------------------
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BuySell from "./pages/BuySell";
import Material from "./pages/Material";
import Connect from "./pages/Connect";
import Reviews from "./pages/Reviews";
import Items from "./pages/Items";

// ------------------ Components -----------------
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Set the base URL for all axios requests from your environment variables
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  
  // -------------------- GLOBAL AUTH CONFIG --------------------
  useEffect(() => {
    // 1. Initial check for existing token
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // 2. Request Interceptor: Sync token with every outgoing request
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const latestToken = localStorage.getItem("token");
        if (latestToken) {
          config.headers.Authorization = `Bearer ${latestToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 3. Response Interceptor: Handle Global 401 (Unauthorized)
    // If the backend says the token is invalid/expired, log the user out automatically
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login"; // Force redirect on session expiry
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- AUTH ROUTES (No Navbar/Footer) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- MAIN APP ROUTES (Wrapped in Layout) --- */}
        <Route element={<Layout />}>
          
          {/* Public Landing Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Protected Campus Features */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/buy-sell"
            element={
              <PrivateRoute>
                <BuySell />
              </PrivateRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <PrivateRoute>
                <Material />
              </PrivateRoute>
            }
          />
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Items />
              </PrivateRoute>
            }
          />
          <Route
            path="/connect"
            element={
              <PrivateRoute>
                <Connect />
              </PrivateRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <PrivateRoute>
                <Reviews />
              </PrivateRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;