// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Helper function to check token validity
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

function PrivateRoute({ children }) {
  if (!isTokenValid()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
