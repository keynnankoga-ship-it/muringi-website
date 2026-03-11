require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const app = express();

/* ---------------------------
   Middleware
--------------------------- */

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/music", express.static(path.join(__dirname, "music")));

/* ---------------------------
   MongoDB Connection
--------------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected ✅"))
.catch(err=>console.error("MongoDB connection error ❌:",err));

/* ---------------------------
   Models
--------------------------- */

const dateIdeaSchema = new mongoose.Schema({
title:String,
description:String,
photos:[String]
});

const songSchema = new mongoose.Schema({
title:String,
artist:String,
reason:String,
cover:String,
file:String
});

const galleryPhotoSchema = new mongoose.Schema({
url:String,
uploadedAt:Date
});

const DateIdea = mongoose.model("DateIdea",dateIdeaSchema);
const Song = mongoose.model("Song",songSchema);
const GalleryPhoto = mongoose.model("GalleryPhoto",galleryPhotoSchema);

/* ---------------------------
   Cloudinary Config
--------------------------- */

cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET
});

/* ---------------------------
   Multer Storage
--------------------------- */

const storageDatePhotos = new CloudinaryStorage({
cloudinary,
params:{
folder:"muringi-date-photos",
allowed_formats:["jpg","jpeg","png"]
}
});

const storageGallery = new CloudinaryStorage({
cloudinary,
params:{
folder:"private-gallery",
allowed_formats:["jpg","jpeg","png"]
}
});

const storageSongs = new CloudinaryStorage({
cloudinary,
params:{
folder:"songs",
allowed_formats:["mp3","m4a","jpeg","png"]
}
});

const uploadDatePhoto = multer({storage:storageDatePhotos});
const uploadGallery = multer({storage:storageGallery});
const uploadSong = multer({storage:storageSongs});

/* ---------------------------
   Date Ideas Routes
--------------------------- */

app.get("/dateIdeas",async(req,res)=>{

try{

const ideas = await DateIdea.find();

res.json(ideas);

}catch(err){

res.status(500).json(err);

}

});

app.post("/upload-date",async(req,res)=>{

try{

const idea = new DateIdea(req.body);

await idea.save();

res.json(idea);

}catch(err){

res.status(500).json(err);

}

});

app.post("/uploadDatePhotos/:id",uploadDatePhoto.array("photos"),async(req,res)=>{

try{

const idea = await DateIdea.findById(req.params.id);

if(!idea.photos) idea.photos=[];

req.files.forEach(file=>{
idea.photos.push(file.path);
});

await idea.save();

res.json(idea);

}catch(err){

res.status(500).json(err);

}

});

/* ---------------------------
   Songs Routes
--------------------------- */

app.get("/songs",async(req,res)=>{

try{

const songs = await Song.find();

res.json(songs);

}catch(err){

res.status(500).json(err);

}

});

app.post("/upload-song",uploadSong.fields([
{name:"file",maxCount:1},
{name:"cover",maxCount:1}
]),async(req,res)=>{

try{

const song = new Song({
title:req.body.title,
artist:req.body.artist,
reason:req.body.reason,
file:req.files.file[0].path,
cover:req.files.cover[0].path
});

await song.save();

res.json(song);

}catch(err){

res.status(500).json(err);

}

});

app.get("/song-of-the-day",async(req,res)=>{

try{

const songs = await Song.find();

if(songs.length===0){
return res.json({});
}

const index = Math.floor(Math.random()*songs.length);

res.json(songs[index]);

}catch(err){

res.status(500).json({error:"Failed to get song"});

}

});

/* ---------------------------
   Private Gallery Routes
--------------------------- */

app.post("/upload-gallery",uploadGallery.single("photo"),async(req,res)=>{

try{

const photo = new GalleryPhoto({
url:req.file.path,
uploadedAt:new Date()
});

await photo.save();

res.json(photo);

}catch(err){

res.status(500).json(err);

}

});

app.get("/gallery",async(req,res)=>{

try{

const photos = await GalleryPhoto.find().sort({uploadedAt:-1});

res.json(photos);

}catch(err){

res.status(500).json(err);

}

});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

/* ---------------------------
   Middleware
--------------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

/* ---------------------------
   MongoDB Connection
--------------------------- */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

/* ---------------------------
   Schemas
--------------------------- */
const dateIdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  photos: [String] // stored paths
});

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  reason: String,
  file: String,
  cover: String
});

const galleryPhotoSchema = new mongoose.Schema({
  url: String
});

const DateIdea = mongoose.model("DateIdea", dateIdeaSchema);
const Song = mongoose.model("Song", songSchema);
const GalleryPhoto = mongoose.model("GalleryPhoto", galleryPhotoSchema);

/* ---------------------------
   Multer Setup for Uploads
--------------------------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "public/uploads";
    if (file.fieldname === "songFile" || file.fieldname === "songCover") folder = "public/music";
    if (file.fieldname === "gallery") folder = "public/privateGallery";
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ---------------------------
   Admin Login
--------------------------- */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.post("/admin-login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Wrong password" });
  }
});

/* ---------------------------
   Date Ideas Routes
--------------------------- */
// Get all
app.get("/dateIdeas", async (req, res) => {
  const ideas = await DateIdea.find();
  res.json(ideas);
});

// Add new date idea
app.post("/admin/date", upload.array("photos"), async (req, res) => {
  try {
    const photos = req.files.map(f => "/" + f.path.replace(/\\/g, "/"));
    const newIdea = new DateIdea({
      title: req.body.title,
      description: req.body.description,
      photos
    });
    await newIdea.save();
    res.json({ success: true, message: "Date Idea added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add date idea" });
  }
});

// Delete
app.delete("/admin/date/:id", async (req, res) => {
  try {
    await DateIdea.findByIdAndDelete(req.params.id);
    res.json({ message: "Date Idea deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete date idea" });
  }
});

/* ---------------------------
   Songs Routes
--------------------------- */
// Get all
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// Add new song
app.post("/admin/song", upload.fields([{ name: "songFile" }, { name: "songCover" }]), async (req, res) => {
  try {
    const file = req.files.songFile[0] ? "/" + req.files.songFile[0].path.replace(/\\/g, "/") : "";
    const cover = req.files.songCover[0] ? "/" + req.files.songCover[0].path.replace(/\\/g, "/") : "";
    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      reason: req.body.reason,
      file,
      cover
    });
    await newSong.save();
    res.json({ success: true, message: "Song added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add song" });
  }
});

// Delete
app.delete("/admin/song/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete song" });
  }
});

/* ---------------------------
   Private Gallery Routes
--------------------------- */
// Get all
app.get("/gallery", async (req, res) => {
  const photos = await GalleryPhoto.find();
  res.json(photos);
});

// Add photo
app.post("/admin/gallery", upload.single("gallery"), async (req, res) => {
  try {
    const url = "/" + req.file.path.replace(/\\/g, "/");
    const newPhoto = new GalleryPhoto({ url });
    await newPhoto.save();
    res.json({ success: true, message: "Photo added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add photo" });
  }
});

// Delete photo
app.delete("/admin/gallery/:id", async (req, res) => {
  try {
    await GalleryPhoto.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete gallery photo" });
  }
});

/* ---------------------------
   Start Server
--------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});