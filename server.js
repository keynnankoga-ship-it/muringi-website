// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// --- Middleware
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/music", express.static("music"));

// --- Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error ❌:", err));

// --- Models
const DateIdea = require("./models/DateIdea");
const Song = require("./models/Song");

// --- File storage for uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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
  const idea = new DateIdea(req.body);
  await idea.save();
  res.json(idea);
});

// Upload a photo for a date idea
app.post("/uploadDatePhoto/:id", upload.single("photo"), async (req, res) => {
  const idea = await DateIdea.findById(req.params.id);
  idea.photos.push("/uploads/" + req.file.filename);
  await idea.save();
  res.json(idea);
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