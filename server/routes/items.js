const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // âœ… import multer (memory storage)
const { generateEmbedding } = require("../utils/embeddings");
const { uploadBufferToCloudinary } = require("../utils/uploadToCloudinary");

// ðŸŸ¢ POST: Add a new item (with image upload)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Generate a semantic embedding from title+description so this item is
    // findable via meaning, not just exact keyword matches (see /api/search).
    // If the embedding call fails (rate limit, no token, etc.) we still save
    // the item â€” embedding is an enhancement, not a hard requirement.
    const embedding = await generateEmbedding(`${title}. ${description}`);

    // Upload the image buffer straight to Cloudinary - never touches local
    // disk, so it survives Render redeploys/restarts.
    const { url: imageUrl } = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "campus-connect/items",
      resourceType: "image",
    });

    const newItem = new Item({
      title,
      description,
      price,
      image: imageUrl, // full Cloudinary URL, stored directly
      user: req.user.id,
      ...(embedding && { embedding }),
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      ...savedItem._doc,
    });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ðŸŸ¢ GET: Fetch all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name").sort({ createdAt: -1 });

    // image is already a full Cloudinary URL - no reconstruction needed
    const modified = items.map((item) => ({ ...item._doc }));

    res.json(modified);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ðŸŸ¢ GET: Fetch items of the logged-in user
router.get("/user", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });

    const modified = items.map((item) => ({ ...item._doc }));

    res.json(modified);
  } catch (err) {
    console.error("Error fetching user items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ðŸŸ¢ DELETE: Delete an item
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

