// server/routes/searchRoutes.js
//
// GET /api/search?q=...&type=all|items|materials|questions&limit=10
//
// Semantic search: embeds the query, then ranks existing documents by
// cosine similarity to that query vector instead of exact keyword matching.
// e.g. "cheap physics textbook" can match a listing titled
// "Used mechanics book, good condition" even with zero shared keywords.

const express = require("express");
const Item = require("../models/Item");
const Material = require("../models/Material");
const Question = require("../models/Question");
const { generateEmbedding } = require("../utils/embeddings");
const { rankBySimilarity } = require("../utils/similarity");

const router = express.Router();

// Minimum similarity score to bother returning — filters out noise when
// nothing in the DB is actually relevant to the query.
const RELEVANCE_THRESHOLD = 0.35;

router.get("/", async (req, res) => {
  try {
    const { q, type = "all", limit = 10 } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const queryVector = await generateEmbedding(q);
    if (!queryVector) {
      return res.status(503).json({
        message: "Search is temporarily unavailable (embedding service failed). Try again shortly.",
      });
    }

    const topK = Math.min(Number(limit) || 10, 25);
    const results = {};

    if (type === "all" || type === "items") {
      const items = await Item.find().select("+embedding").populate("user", "name").lean();
      results.items = rankBySimilarity(queryVector, items, topK)
        .filter((r) => r._score >= RELEVANCE_THRESHOLD)
        .map(({ embedding, _score, ...rest }) => ({ ...rest, score: _score }));
    }

    if (type === "all" || type === "materials") {
      const materials = await Material.find().select("+embedding").populate("uploadedBy", "name").lean();
      results.materials = rankBySimilarity(queryVector, materials, topK)
        .filter((r) => r._score >= RELEVANCE_THRESHOLD)
        .map(({ embedding, _score, ...rest }) => ({ ...rest, score: _score }));
    }

    if (type === "all" || type === "questions") {
      const questions = await Question.find().select("+embedding").lean();
      results.questions = rankBySimilarity(queryVector, questions, topK)
        .filter((r) => r._score >= RELEVANCE_THRESHOLD)
        .map(({ embedding, _score, ...rest }) => ({ ...rest, score: _score }));
    }

    res.json({ query: q, results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});

module.exports = router;