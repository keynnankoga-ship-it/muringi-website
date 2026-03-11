require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2
const path = require("path")

const app = express()

/* =========================
   Middleware
========================= */

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

/* =========================
   MongoDB Connection
========================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

/* =========================
   Cloudinary Config
========================= */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "muringi-gallery",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

const upload = multer({ storage })

/* =========================
   Models
========================= */

const Affirmation = mongoose.model("Affirmation", new mongoose.Schema({

  text: String

}))

const Song = mongoose.model("Song", new mongoose.Schema({

  title: String,
  artist: String,
  cover: String,
  audio: String

}))

const DateIdea = mongoose.model("DateIdea", new mongoose.Schema({

  title: String,
  description: String,
  photos: [String]

}))

const Gallery = mongoose.model("Gallery", new mongoose.Schema({

  url: String

}))

/* =========================
   ROUTES
========================= */

/* ---------- Affirmations ---------- */

const fs = require("fs")
const path = require("path")

app.get("/affirmations",(req,res)=>{

const filePath = path.join(__dirname,"data","affirmations.json")

const affirmations = JSON.parse(
fs.readFileSync(filePath,"utf8")
)

res.json(affirmations)

})

/* ---------- Songs ---------- */

app.get("/songs", async (req, res) => {

  const songs = await Song.find()

  res.json(songs)

})

/* ---------- Date Ideas ---------- */

app.get("/dateIdeas", async (req, res) => {

  const ideas = await DateIdea.find()

  res.json(ideas)

})

/* ---------- Gallery Photos ---------- */

app.get("/galleryPhotos", async (req, res) => {

  const photos = await Gallery.find()

  res.json(photos)

})

/* =========================
   USER PHOTO UPLOAD
========================= */

app.post("/uploadPhoto", upload.single("photo"), async (req, res) => {

  const photo = new Gallery({

    url: req.file.path

  })

  await photo.save()

  res.json({ success: true })

})

/* =========================
   ADMIN ROUTES
========================= */

/* ---------- Add Song ---------- */

app.post("/admin/addSong", async (req, res) => {

  const song = new Song(req.body)

  await song.save()

  res.json({ success: true })

})

/* ---------- Delete Song ---------- */

app.delete("/admin/deleteSong/:id", async (req, res) => {

  await Song.findByIdAndDelete(req.params.id)

  res.json({ success: true })

})

/* ---------- Add Date Idea ---------- */

app.post("/admin/addDateIdea", upload.array("photos"), async (req, res) => {

  const photoUrls = req.files.map(file => file.path)

  const idea = new DateIdea({

    title: req.body.title,
    description: req.body.description,
    photos: photoUrls

  })

  await idea.save()

  res.json({ success: true })

})

/* ---------- Delete Date Idea ---------- */

app.delete("/admin/deleteDateIdea/:id", async (req, res) => {

  await DateIdea.findByIdAndDelete(req.params.id)

  res.json({ success: true })

})

/* ---------- Delete Gallery Photo ---------- */

app.delete("/admin/deletePhoto/:id", async (req, res) => {

  await Gallery.findByIdAndDelete(req.params.id)

  res.json({ success: true })

})

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

  console.log("Server running on port", PORT)

})