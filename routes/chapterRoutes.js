// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAllChapters,
  getChapterById,
  uploadChapters
} = require("../controllers/chapterController");

const adminAuth = require("../middlewares/adminAuth");

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes

// GET all chapters with filters, pagination, caching
router.get("/", getAllChapters);

// GET single chapter by ID
router.get("/:id", getChapterById);

// POST upload chapters (Admin only, JSON upload)
router.post("/", adminAuth, upload.single("file"), uploadChapters);

module.exports = router;
