const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const itemsRouter = require("./routes/items");
const materialsRouter = require("./routes/materialRoutes");
const connectRoutes = require("./routes/connectRoutes");
const answerRouter = require("./routes/answerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- STATIC FILES ------------------- //
// Absolute path for uploads folder in project root
const pathToUploads = path.join(__dirname, "uploads");
const itemsUploadPath = path.join(__dirname, "..", "uploads", "items");

const materialsUploadPath = path.join(pathToUploads, "materials");

// Ensure folders exist
const fs = require("fs");
if (!fs.existsSync(itemsUploadPath)) fs.mkdirSync(itemsUploadPath, { recursive: true });
if (!fs.existsSync(materialsUploadPath)) fs.mkdirSync(materialsUploadPath, { recursive: true });

// Serve static files
app.use("/uploads/items", express.static(itemsUploadPath));
app.use("/uploads/materials", express.static(materialsUploadPath));

console.log("Serving items from:", itemsUploadPath);
console.log("Serving materials from:", materialsUploadPath);

// ------------------- ROUTES ------------------- //
app.use("/api/users", userRouter);
app.use("/api/items", itemsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/connect", connectRoutes);
app.use("/api/answers", answerRouter);
app.use("/api/reviews", reviewRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
