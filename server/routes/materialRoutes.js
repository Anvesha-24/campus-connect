const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const Material = require("../models/Material");
const authMiddleware = require("../middleware/auth");
const { generateEmbedding } = require("../utils/embeddings");
const { uploadBufferToCloudinary } = require("../utils/uploadToCloudinary");

// ------------------- MULTER CONFIG -------------------
// Memory storage - the PDF buffer goes straight to Cloudinary and to
// pdf-parse, never touching Render's ephemeral local disk.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf)$/i)) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB
});

// Pulls plain text out of an uploaded PDF buffer directly (no disk read).
async function extractPdfText(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
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
// separately, and average them into one document-level vector.
const CHUNK_SIZE = 1200;
const MAX_CHUNKS = 4;

async function generateDocumentEmbedding(subject, description, extractedText) {
  const chunks = [`${subject}. ${description}`];

  if (extractedText) {
    for (let i = 0; i < extractedText.length && chunks.length - 1 < MAX_CHUNKS; i += CHUNK_SIZE) {
      const chunk = extractedText.slice(i, i + CHUNK_SIZE).trim();
      if (chunk) chunks.push(chunk);
    }
  }

  const chunkEmbeddings = await Promise.all(chunks.map((c) => generateEmbedding(c)));
  const validEmbeddings = chunkEmbeddings.filter(Boolean);

  if (validEmbeddings.length === 0) return null;

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

    // fileUrl is already a full Cloudinary URL - no reconstruction needed
    const modified = materials.map((m) => ({
      _id: m._id,
      subject: m.subject,
      description: m.description,
      fileUrl: m.fileUrl,
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

    const extractedText = await extractPdfText(req.file.buffer);
    const embedding = await generateDocumentEmbedding(subject, description, extractedText);

    // Upload the PDF buffer to Cloudinary as a "raw" resource (non-image file)
    const { url: fileUrl } = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "campus-connect/materials",
      resourceType: "raw",
    });

    const material = new Material({
      subject,
      description,
      fileUrl, // full Cloudinary URL, stored directly
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
        fileUrl: material.fileUrl,
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

