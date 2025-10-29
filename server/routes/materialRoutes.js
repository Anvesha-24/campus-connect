const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Material = require("../models/Material");
const authMiddleware = require("../middleware/auth");

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

    const material = new Material({
      subject,
      description,
      fileUrl: req.file.filename,
      uploadedBy: req.user.id,
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
