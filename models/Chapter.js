const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Subject is required"]
  },
  chapter: {
    type: String,
    required: [true, "Chapter name is required"]
  },
  class: {
    type: String,
    required: [true, "Class is required"]
  },
  unit: {
    type: String,
    required: [true, "Unit is required"]
  },
  yearWiseQuestionCount: {
    type: Object,
    required: [true, "Year-wise question count is required"]
  },
  questionSolved: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Completed", "Not Started", "In Progress"],
    default: "Not Started"
  },
  isWeakChapter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Chapter", ChapterSchema);
