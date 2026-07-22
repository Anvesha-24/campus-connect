const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const Material = require("../models/Material");
const authMiddleware = require("../middleware/auth");
const { generateEmbedding } = require("../utils/embeddings");

// ------------------- UPLOAD FOLDER -------------------
const uploadDir = path.join(__dirname, "..", "uploads", "materials");

// Ensure folder exists
fs.mkdirSync(uploadDir, { recursive: true });

// ------------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_"); // replace spaces
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf)$/i)) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // Max 20MB
});

// Pulls plain text out of an uploaded PDF so it can be embedded alongside
// subject/description - this is what actually lets search/RAG understand
// what's *inside* the notes, not just their label. Capped at ~2000 characters
// since that's enough signal for a meaningful embedding without needing
// full document chunking (which would be overkill for this use case).
const MAX_EXTRACTED_CHARS = 2000;

async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text.replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_CHARS);
  } catch (err) {
    console.error("PDF text extraction failed:", err.message);
    return ""; // fall back gracefully - embedding just uses subject+description instead
  }
}

// ------------------- GET ALL MATERIALS -------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    const modified = materials.map((m) => ({
      _id: m._id,
      subject: m.subject,
      description: m.description,
      fileUrl: `${req.protocol}://${req.get("host")}/uploads/materials/${m.fileUrl}`,
      uploadedBy: m.uploadedBy,
    }));

    res.json(modified);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPLOAD MATERIAL -------------------
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!req.file || !subject || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const extractedText = await extractPdfText(filePath);

    // Embed subject + description + actual PDF content, so search can match
    // on what the notes are really about, not just their short label.
    const embeddingInput = extractedText
      ? `${subject}. ${description}. ${extractedText}`
      : `${subject}. ${description}`;

    const embedding = await generateEmbedding(embeddingInput);

    const material = new Material({
      subject,
      description,
      fileUrl: req.file.filename,
      uploadedBy: req.user.id,
      ...(embedding && { embedding }),
    });

    await material.save();

    res.status(201).json({
      message: "Material uploaded successfully",
      material: {
        _id: material._id,
        subject: material.subject,
        description: material.description,
        fileUrl: `${req.protocol}://${req.get("host")}/uploads/materials/${material.fileUrl}`,
        uploadedBy: {
          _id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;

