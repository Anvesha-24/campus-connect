// Import the JWT package to verify tokens
const jwt = require("jsonwebtoken");

// Middleware function to protect routes
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract the token from the header (after "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Save decoded payload (id, role, etc.) to req.user
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Export the middleware
module.exports = verifyToken;
