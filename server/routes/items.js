const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/auth");

// Use same uploads folder as server.js
const uploadDir = path.join(__dirname, "..", "..", "uploads", "items");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    const modified = items.map((item) => ({
      ...item._doc,
      image: item.image
        ? `${req.protocol}://${req.get("host")}/uploads/items/${item.image}`
        : null,
    }));
    res.json(modified);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new item
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, description, price } = req.body;
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  try {
    const newItem = new Item({
      title,
      description,
      price,
      image: req.file.filename,
      user: req.user.id,
    });
    await newItem.save();

    res.status(201).json({
      ...newItem._doc,
      image: `${req.protocol}://${req.get("host")}/uploads/items/${newItem.image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post item" });
  }
});

module.exports = router;
