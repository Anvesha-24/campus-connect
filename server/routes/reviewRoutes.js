const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "All fields required" });
    }

    // userName could come from auth middleware later
    const review = new Review({
      title,
      content,
      userName: req.user?.name || "Anonymous", 
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

module.exports = router;
