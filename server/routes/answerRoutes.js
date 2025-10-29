const express = require("express");
const Answer = require("../models/Answer");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST an answer
router.post("/:questionId", authMiddleware, async (req, res) => {
  try {
    const newAnswer = new Answer({
      text: req.body.text,
      questionId: req.params.questionId,
      userId: req.user.id,
      userName: req.user.name,
    });
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(500).json({ message: "Failed to post answer", error: err.message });
  }
});

// GET all answers for a question
router.get("/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId }).sort({ createdAt: 1 });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch answers", error: err.message });
  }
});

module.exports = router;
