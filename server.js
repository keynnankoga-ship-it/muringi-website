require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* =========================
   Admin Session
========================= */
app.use(session({
  secret: process.env.ADMIN_PASS,
  resave: false,
  saveUninitialized: true
}));

/* =========================
   MongoDB Connection
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* =========================
   Cloudinary Config
========================= */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "muringi-gallery",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

/* =========================
   Models
========================= */
const Affirmation = mongoose.model("Affirmation", new mongoose.Schema({ text: String }));
const Song = mongoose.model("Song", new mongoose.Schema({
  title: String,
  artist: String,
  cover: String,
  audio: String
}));
const DateIdea = mongoose.model("DateIdea", new mongoose.Schema({
  title: String,
  description: String,
  photos: [String]
}));
const Gallery = mongoose.model("Gallery", new mongoose.Schema({ url: String }));

/* =========================
   Admin Protection Middleware
========================= */
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

/* =========================
   Firebase Config Route
========================= */
app.get("/firebase-config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    vapidKey: process.env.FIREBASE_VAPID_KEY
  });
});

/* =========================
   Routes
========================= */

/* Daily Affirmation (366-day system) */
app.get("/affirmations", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "affirmations.json");
    const affirmations = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!affirmations.length) return res.json([{ text: "You are loved." }]);

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % affirmations.length;
    res.json(affirmations[index]);
  } catch (err) {
    res.status(500).json({ error: "Affirmations failed" });
  }
});

/* Songs */
app.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Songs failed" });
  }
});

/* Song of the Day */
app.get("/song-of-the-day", async (req, res) => {
  try {
    const songs = await Song.find();
    if (!songs.length) return res.json({});

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % songs.length;
    res.json(songs[index]);
  } catch (err) {
    res.status(500).json({ error: "Song of the day failed" });
  }
});

/* Date Ideas */
app.get("/dateIdeas", async (req, res) => {
  try {
    const ideas = await DateIdea.find();
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: "Date ideas failed" });
  }
});

/* Gallery */
app.get("/gallery", async (req, res) => {
  try {
    const photos = await Gallery.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Gallery failed" });
  }
});

/* =========================
   User Upload (Gallery only)
========================= */
app.post("/upload-gallery", upload.single("photo"), async (req, res) => {
  try {
    const photo = new Gallery({ url: req.file.path });
    await photo.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

/* =========================
   Admin Login
========================= */
app.post("/admin-login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ success: true });
  }
  res.json({ success: false });
});

/* =========================
   Admin Routes
========================= */

/* Add Song */
app.post("/admin/song", requireAdmin, async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Song add failed" });
  }
});

/* Delete Song */
app.delete("/admin/song/:id", requireAdmin, async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Song delete failed" });
  }
});

/* Add Date Idea */
app.post("/admin/date", requireAdmin, upload.array("photos"), async (req, res) => {
  try {
    const photoUrls = req.files.map(file => file.path);
    const idea = new DateIdea({
      title: req.body.title,
      description: req.body.description,
      photos: photoUrls
    });
    await idea.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Date idea failed" });
  }
});

/* Delete Date Idea */
app.delete("/admin/date/:id", requireAdmin, async (req, res) => {
  try {
    await DateIdea.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* Delete Gallery Photo */
app.delete("/admin/gallery/:id", requireAdmin, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Gallery delete failed" });
  }
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});