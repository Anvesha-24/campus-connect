import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Helper function to check if the JWT token exists and hasn't expired.
 * We decode the middle part (payload) of the JWT which contains the 'exp' timestamp.
 */
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // JWT format: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Check if current time is less than expiration time (multiplied by 1000 for ms)
    const isValid = payload.exp * 1000 > Date.now();
    return isValid;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
};

function PrivateRoute({ children }) {
  const location = useLocation();

  if (!isTokenValid()) {
    // Clean up potentially stale data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login, but save the current location so we can redirect 
    // them back after they log in (great for UX!)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;