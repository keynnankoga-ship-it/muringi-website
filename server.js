require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();

/* ---------------------------
   Middleware
--------------------------- */

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/music", express.static("music"));

/* ---------------------------
   MongoDB Connection
--------------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.error("MongoDB connection error ❌:", err));


/* ---------------------------
   Models
--------------------------- */

const dateIdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  photos: [String]
});

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  reason: String,
  cover: String,
  file: String
});

const DateIdea = mongoose.model("DateIdea", dateIdeaSchema);
const Song = mongoose.model("Song", songSchema);


/* ---------------------------
   Cloudinary Configuration
--------------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


/* ---------------------------
   Multer Cloudinary Storage
--------------------------- */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "muringi-date-photos",
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

const upload = multer({ storage });


/* ---------------------------
   Date Ideas Routes
--------------------------- */

// Get all date ideas
app.get("/dateIdeas", async (req, res) => {
  try {
    const ideas = await DateIdea.find();
    res.json(ideas);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add new date idea
app.post("/dateIdeas", async (req, res) => {
  try {
    const idea = new DateIdea(req.body);
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Upload photo for date idea
app.post("/uploadDatePhoto/:id", upload.single("photo"), async (req, res) => {
  try {
    const idea = await DateIdea.findById(req.params.id);

    if (!idea.photos) {
      idea.photos = [];
    }

    idea.photos.push(req.file.path);
    await idea.save();

    res.json(idea);
  } catch (err) {
    res.status(500).json(err);
  }
});


/* ---------------------------
   Songs Routes
--------------------------- */

// Get all songs
app.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add song
app.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json(err);
  }
});


/* ---------------------------
   Start Server
--------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});