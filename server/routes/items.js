const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // ✅ import multer
const { generateEmbedding } = require("../utils/embeddings");

// 🟢 POST: Add a new item (with image upload)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Generate a semantic embedding from title+description so this item is
    // findable via meaning, not just exact keyword matches (see /api/search).
    // If the embedding call fails (rate limit, no token, etc.) we still save
    // the item — embedding is an enhancement, not a hard requirement.
    const embedding = await generateEmbedding(`${title}. ${description}`);

    const newItem = new Item({
      title,
      description,
      price,
      image: req.file.filename, // ✅ use uploaded filename
      user: req.user.id,
      ...(embedding && { embedding }),
    });

    const savedItem = await newItem.save();

    // Return the saved item with full image URL
    res.status(201).json({
      ...savedItem._doc,
      image: `${req.protocol}://${req.get("host")}/uploads/items/${savedItem.image}`,
    });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 GET: Fetch all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name").sort({ createdAt: -1 });

    const modified = items.map((item) => ({
      ...item._doc,
      image: item.image
        ? `${req.protocol}://${req.get("host")}/uploads/items/${item.image}`
        : null,
    }));

    res.json(modified);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 GET: Fetch items of the logged-in user
router.get("/user", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });

    const modified = items.map((item) => ({
      ...item._doc,
      image: item.image
        ? `${req.protocol}://${req.get("host")}/uploads/items/${item.image}`
        : null,
    }));

    res.json(modified);
  } catch (err) {
    console.error("Error fetching user items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 DELETE: Delete an item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;