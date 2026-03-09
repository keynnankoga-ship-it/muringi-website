// server.js
require('dotenv').config(); //<-- load .env first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const app = express();

// --- Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/music", express.static("music"));

// --- MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error ❌:", err));

// --- Mongoose Models
const dateSchema = new mongoose.Schema({
  title: String,
  photos: { type: [String], default: [] } // Array of photo URLs
});
const DateIdea = mongoose.model("DateIdea", dateSchema);

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  reason: String,
  cover: String,
  file: String
});
const Song = mongoose.model("Song", songSchema);

// --- Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dateideas",
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

const upload = multer({ storage });

// --- Routes

// Get all date ideas
app.get("/dateIdeas", async (req, res) => {
  const ideas = await DateIdea.find();
  res.json(ideas);
});

// Add a new date idea
app.post("/dateIdeas", async (req, res) => {
  const idea = new DateIdea({ title: req.body.title });
  await idea.save();
  res.json(idea);
});

// Upload a photo for a specific date idea
app.post("/uploadDatePhoto/:id", upload.single("photo"), async (req, res) => {
  try {
    const idea = await DateIdea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Date idea not found" });

    // Save Cloudinary URL
    idea.photos.push(req.file.path); 
    await idea.save();

    res.json({ success: true, idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Get all songs
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// Add a new song
app.post("/songs", async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.json(song);
});

// --- Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));