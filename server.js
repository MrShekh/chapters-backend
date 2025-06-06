// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter.js");
const chapterRoutes = require("./routes/chapterRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter); 

// Routes
app.use("/api/v1/chapters", chapterRoutes);

// MongoDB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
