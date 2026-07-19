const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// 1. Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Import Routes
const userRouter = require("./routes/userRoutes");
const itemsRouter = require("./routes/items");
const materialsRouter = require("./routes/materialRoutes");
const connectRoutes = require("./routes/connectRoutes");
const answerRouter = require("./routes/answerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const searchRoutes = require("./routes/searchRoutes");
const ragRoutes = require("./routes/ragRoutes");

// 3. Middleware
// Restrict CORS to your actual frontend origin(s) instead of allowing every site.
// Set CLIENT_URL in .env to your deployed frontend URL (and add localhost for dev).
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"].filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Static Files & Folder Setup
const pathToUploads = path.join(__dirname, "uploads");
const itemsUploadPath = path.join(__dirname, "uploads", "items");
const materialsUploadPath = path.join(pathToUploads, "materials");

// Ensure folders exist
if (!fs.existsSync(itemsUploadPath)) fs.mkdirSync(itemsUploadPath, { recursive: true });
if (!fs.existsSync(materialsUploadPath)) fs.mkdirSync(materialsUploadPath, { recursive: true });

// Serve static files
app.use("/uploads/items", express.static(itemsUploadPath));
app.use("/uploads/materials", express.static(materialsUploadPath));

// 5. Routes
// Health Check Route (Crucial for Render)
app.get("/", (req, res) => {
  res.status(200).send("Campus Connect API is Live and Healthy!");
});

app.use("/api/users", userRouter);
app.use("/api/items", itemsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/connect", connectRoutes);
app.use("/api/answers", answerRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/rag", ragRoutes);

// 6. Error Handling
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 7. Database Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    // Start the server ONLY after DB is connected
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); 
  });