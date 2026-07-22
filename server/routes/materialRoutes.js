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
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB
});

// Pulls plain text out of an uploaded PDF. No length cap here - we extract
// everything and let the chunking step below decide what actually gets
// embedded. Some PDFs open with a syllabus/table of contents, others dive
// straight into content, so we can't assume where the "real" material starts.
async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("PDF text extraction failed:", err.message);
    return ""; // fall back gracefully - embedding just uses subject+description instead
  }
}

// The embedding model only meaningfully "reads" roughly its first ~250-300
// words of input - anything beyond that contributes little. So instead of
// embedding one long blob (which would just get truncated, and would be
// biased toward whatever happens to be at the very start - often a syllabus,
// not real content), we split the document into chunks, embed each chunk
// separately, and average them into one document-level vector. This way a
// PDF's real explanatory content contributes to the final embedding even if
// it doesn't appear until several pages in.
const CHUNK_SIZE = 1200; // characters per chunk, comfortably under the model's effective window
const MAX_CHUNKS = 4; // caps embedding API calls per upload (subject/desc chunk + up to 4 content chunks)

async function generateDocumentEmbedding(subject, description, extractedText) {
  const chunks = [`${subject}. ${description}`]; // always include this - short, reliable signal

  if (extractedText) {
    for (let i = 0; i < extractedText.length && chunks.length - 1 < MAX_CHUNKS; i += CHUNK_SIZE) {
      const chunk = extractedText.slice(i, i + CHUNK_SIZE).trim();
      if (chunk) chunks.push(chunk);
    }
  }

  const chunkEmbeddings = await Promise.all(chunks.map((c) => generateEmbedding(c)));
  const validEmbeddings = chunkEmbeddings.filter(Boolean);

  if (validEmbeddings.length === 0) return null;

  // Mean-pool across all chunk embeddings into a single document vector.
  const dim = validEmbeddings[0].length;
  const pooled = new Array(dim).fill(0);
  for (const vec of validEmbeddings) {
    for (let i = 0; i < dim; i++) pooled[i] += vec[i];
  }
  return pooled.map((v) => v / validEmbeddings.length);
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
    const embedding = await generateDocumentEmbedding(subject, description, extractedText);

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

