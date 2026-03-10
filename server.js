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

/* ---------------------------
   Admin Login
--------------------------- */

const adminPassword = process.env.ADMIN_PASSWORD;

app.post("/admin-login",(req,res)=>{

const {password} = req.body;

if(password===adminPassword){

res.json({success:true});

}else{

res.status(401).json({
success:false,
message:"Wrong password"
});

}

});

/* ---------------------------
   Admin Delete Routes
--------------------------- */

app.delete("/admin/date/:id",async(req,res)=>{

try{

await DateIdea.findByIdAndDelete(req.params.id);

res.json({
message:"Date Idea deleted successfully"
});

}catch(err){

res.status(500).json({
error:"Failed to delete date idea"
});

}

});

app.delete("/admin/song/:id",async(req,res)=>{

try{

await Song.findByIdAndDelete(req.params.id);

res.json({
message:"Song deleted successfully"
});

}catch(err){

res.status(500).json({
error:"Failed to delete song"
});

}

});

app.delete("/admin/gallery/:id",async(req,res)=>{

try{

await GalleryPhoto.findByIdAndDelete(req.params.id);

res.json({
message:"Gallery photo deleted successfully"
});

}catch(err){

res.status(500).json({
error:"Failed to delete gallery photo"
});

}

});

/* ---------------------------
   Start Server
--------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`);

});