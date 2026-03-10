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

app.get("/song-of-the-day", async (req,res)=>{

try{

const songs = await Song.find()

const today = new Date().getDate()

const index = today % songs.length

res.json(songs[index])

}catch(err){

res.status(500).json({error:"Failed to get song"})

}

})


/*--------------------
    Admin
--------------------*/
app.post("/add-song", async (req,res)=>{

await Song.create(req.body)

res.redirect("/admin")

})

// File storage for gallery uploads (reuse your Cloudinary setup)
app.post("/upload-gallery", upload.single("photo"), async (req, res) => {
  // For simplicity, store photos in MongoDB as URLs
  const newPhoto = {
    url: req.file.path, // Cloudinary URL
    uploadedAt: new Date()
  };

  // Save in MongoDB collection called 'GalleryPhoto'
  await GalleryPhoto.create(newPhoto);

  res.json({ success: true, photo: newPhoto });
});

// Get all gallery photos
app.get("/gallery", async (req, res) => {
  const photos = await GalleryPhoto.find().sort({ uploadedAt: -1 });
  res.json(photos);
});

const GalleryPhoto = require("./models/GalleryPhoto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary config (already in your server)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Storage for songs, date ideas, gallery
const storageGallery = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "private-gallery",
    allowed_formats: ["jpg","jpeg","png"]
  }
});
const uploadGallery = multer({ storage: storageGallery });

// Upload private gallery photo
app.post("/upload-gallery", uploadGallery.single("photo"), async (req,res)=>{
  const photo = new GalleryPhoto({
    url: req.file.path,
    uploadedAt: new Date()
  });
  await photo.save();
  res.json(photo);
});

// Upload song (with file + cover)
const storageSongs = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "songs",
    allowed_formats: ["mp3","m4a","jpeg","png"]
  }
});
const uploadSong = multer({ storage: storageSongs });

app.post("/upload-song", uploadSong.fields([
  { name: "file", maxCount: 1 },
  { name: "cover", maxCount: 1 }
]), async (req,res)=>{
  const song = new Song({
    title: req.body.title,
    artist: req.body.artist,
    reason: req.body.reason,
    file: req.files['file'][0].path,
    cover: req.files['cover'][0].path
  });
  await song.save();
  res.json(song);
});

/* ---------------------------
   Start Server
--------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});