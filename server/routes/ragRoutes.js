// server/routes/ragRoutes.js
//
// POST /api/rag/suggest-answer/:questionId
//
// Retrieval-Augmented Generation for the doubt-solving feature:
// 1. RETRIEVE: find similar past questions + relevant materials via embeddings
// 2. AUGMENT: build a context block from those retrieved documents
// 3. GENERATE: ask Groq/Llama 3.3 to draft an answer grounded in that context
//
// The output is clearly labeled "AI Suggested Answer" â€” it supplements, not
// replaces, real senior students answering. Seniors can still reply normally
// via the existing /api/answers route.

const express = require("express");
const Question = require("../models/Question");
const Material = require("../models/Material");
const Answer = require("../models/Answer");
const authMiddleware = require("../middleware/auth");
const { generateEmbedding } = require("../utils/embeddings");
const { rankBySimilarity } = require("../utils/similarity");

const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callGroq(messages) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not set");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.3, // lower temperature: prefer grounded, consistent answers over creative ones
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

router.post("/suggest-answer/:questionId", authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).select("+embedding");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Fall back to embedding the question text now if it was posted before
    // this feature existed (no stored embedding yet).
    const queryVector = question.embedding?.length
      ? question.embedding
      : await generateEmbedding(question.question);

    if (!queryVector) {
      return res.status(503).json({ message: "AI answer generation is temporarily unavailable." });
    }

    // RETRIEVE: similar past resolved questions (with answers) and relevant materials
    const [pastQuestions, materials] = await Promise.all([
      Question.find({ _id: { $ne: question._id } }).select("+embedding").lean(),
      Material.find().select("+embedding").lean(),
    ]);

    const topQuestions = rankBySimilarity(queryVector, pastQuestions, 3).filter((q) => q._score >= 0.3);
    const topMaterials = rankBySimilarity(queryVector, materials, 2).filter((m) => m._score >= 0.3);

    // Pull actual answers for the retrieved past questions, if any exist
    const pastAnswers = await Answer.find({
      questionId: { $in: topQuestions.map((q) => q._id) },
    }).lean();

    // AUGMENT: build the context block fed to the LLM
    let context = "";
    if (topQuestions.length) {
      context += "Related past questions and their answers:\n";
      for (const pq of topQuestions) {
        const answersForThis = pastAnswers.filter((a) => String(a.questionId) === String(pq._id));
        context += `- Q: ${pq.question}\n`;
        answersForThis.forEach((a) => {
          context += `  A: ${a.text}\n`;
        });
      }
    }
    if (topMaterials.length) {
      context += "\nPotentially relevant study materials:\n";
      topMaterials.forEach((m) => {
        context += `- ${m.subject}: ${m.description}\n`;
      });
    }

    if (!context) {
      return res.json({
        answer: null,
        message: "No relevant past questions or materials found to ground a suggestion on.",
      });
    }

    // GENERATE
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful campus study assistant. Answer the student's question using ONLY the context provided. " +
          "If the context doesn't fully answer it, say what's missing rather than guessing. Keep the answer concise and clear.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nStudent's question: ${question.question}\n\nAnswer:`,
      },
    ];

    const aiAnswer = await callGroq(messages);

    res.json({
      answer: aiAnswer,
      groundedIn: {
        questions: topQuestions.map((q) => ({ id: q._id, question: q.question, score: q._score })),
        materials: topMaterials.map((m) => ({ id: m._id, subject: m.subject, score: m._score })),
      },
    });
  } catch (err) {
    console.error("RAG suggest-answer error:", err);
    res.status(500).json({ message: "Failed to generate AI suggested answer", error: err.message });
  }
});

module.exports = router;
