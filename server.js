const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static("public"))
app.use("/uploads",express.static("uploads"))
app.use("/music",express.static("music"))

mongoose.connect("mongodb://127.0.0.1:27017/romanticSite")

const DateIdea = require("./models/DateIdea")
const Song = require("./models/Song")

/* FILE STORAGE */

const storage = multer.diskStorage({
 destination:"uploads/",
 filename:(req,file,cb)=>{
  cb(null,Date.now()+"-"+file.originalname)
 }
})

const upload = multer({storage})

/* GET DATE IDEAS */

app.get("/dateIdeas",async(req,res)=>{

const ideas = await DateIdea.find()

res.json(ideas)

})

/* ADD DATE IDEA */

app.post("/dateIdeas",async(req,res)=>{

const idea = new DateIdea(req.body)

await idea.save()

res.json(idea)

})

/* UPLOAD DATE PHOTO */

app.post("/uploadDatePhoto/:id",upload.single("photo"),async(req,res)=>{

const idea = await DateIdea.findById(req.params.id)

idea.photos.push("/uploads/"+req.file.filename)

await idea.save()

res.json(idea)

})

/* SONG ROUTES */

app.get("/songs",async(req,res)=>{

const songs = await Song.find()

res.json(songs)

})

app.post("/songs",async(req,res)=>{

const song = new Song(req.body)

await song.save()

res.json(song)

})

app.listen(5000,()=>{

console.log("Server running on port 5000")

})