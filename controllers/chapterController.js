// controllers/chapterController.js
const Chapter = require("../models/Chapter");
const redis = require("../config/redis");

//GET ALL CHAPTERS
exports.getAllChapters = async (req, res) => {
  try {
    const filters = {};
    const { class: className, unit, status, isWeakChapter, subject, page = 1, limit = 10 } = req.query;

    if (className) filters.class = className;
    if (unit) filters.unit = unit;
    if (status) filters.status = status;
    if (subject) filters.subject = subject;
    if (isWeakChapter !== undefined) filters.isWeakChapter = isWeakChapter === "true";

    const skip = (page - 1) * limit;

    // Check cache
    const cacheKey = `chapters:${JSON.stringify(filters)}:page=${page}&limit=${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Get data from DB
    const chapters = await Chapter.find(filters).skip(skip).limit(Number(limit));
    const total = await Chapter.countDocuments(filters);

    const response = {
      total,
      page: Number(page),
      limit: Number(limit),
      data: chapters
    };

    // Cache result
    await redis.set(cacheKey, JSON.stringify(response), "EX", 3600); // 1 hour

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//GET SINGLE CHAPTER 
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json(chapter);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  UPLOAD CHAPTERS (ADMIN) 
exports.uploadChapters = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileData = require(`../uploads/${req.file.filename}`);
    const failed = [];
    const inserted = [];

    for (const chapter of fileData) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.save();
        inserted.push(newChapter);
      } catch (err) {
        failed.push({ chapter, error: err.message });
      }
    }

    // Invalidate Redis cache
    await redis.flushall();

    res.status(201).json({
      insertedCount: inserted.length,
      failedCount: failed.length,
      failedChapters: failed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while uploading chapters" });
  }
};
