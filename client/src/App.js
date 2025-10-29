// src/App.jsx
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
import Items from "./pages/Items"; // Items page

// ------------------ Components -----------------
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // Setup axios Authorization header if token exists & valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("Token expired. Logging out...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
        } else {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Invalid token format. Clearing storage...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes wrapped inside Layout */}
        <Route element={<Layout />}>
          {/* Default landing page */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Protected Routes */}
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

          {/* Catch-all: redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
