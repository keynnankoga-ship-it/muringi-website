require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

/* DATABASE */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

/* MODELS */

const Song = mongoose.model("Song",{
title:String,
artist:String,
audio:String,
cover:String
})

const Gallery = mongoose.model("Gallery",{url:String})

const DateIdea = mongoose.model("DateIdea",{
title:String,
description:String
})

const Playlist = mongoose.model("Playlist",{embed:String})

const Subscription = mongoose.model("Subscription",{token:String})

/* ADMIN LOGIN */

app.post("/admin-login",(req,res)=>{

const {password} = req.body

if(password === process.env.ADMIN_PASS){

return res.json({success:true})

}

res.status(401).json({success:false})

})

/* SONGS */

app.get("/songs",async(req,res)=>{
res.json(await Song.find())
})

app.post("/admin/add-song",async(req,res)=>{
await new Song(req.body).save()
res.json({success:true})
})

app.delete("/admin/delete-song/:id",async(req,res)=>{
await Song.findByIdAndDelete(req.params.id)
res.json({success:true})
})

app.get("/song-of-the-day",async(req,res)=>{

const songs = await Song.find()

if(!songs.length) return res.json({})

const index = new Date().getDate() % songs.length

res.json(songs[index])

})

/* GALLERY */

app.get("/gallery",async(req,res)=>{
res.json(await Gallery.find())
})

app.post("/admin/add-photo",async(req,res)=>{
await new Gallery(req.body).save()
res.json({success:true})
})

app.delete("/admin/delete-photo/:id",async(req,res)=>{
await Gallery.findByIdAndDelete(req.params.id)
res.json({success:true})
})

/* DATE IDEAS */

app.get("/dateIdeas",async(req,res)=>{
res.json(await DateIdea.find())
})

app.post("/admin/add-date",async(req,res)=>{
await new DateIdea(req.body).save()
res.json({success:true})
})

app.delete("/admin/delete-date/:id",async(req,res)=>{
await DateIdea.findByIdAndDelete(req.params.id)
res.json({success:true})
})

/* PLAYLISTS */

app.get("/playlists",async(req,res)=>{
res.json(await Playlist.find())
})

app.post("/admin/add-playlist",async(req,res)=>{
await new Playlist(req.body).save()
res.json({success:true})
})

app.delete("/admin/delete-playlist/:id",async(req,res)=>{
await Playlist.findByIdAndDelete(req.params.id)
res.json({success:true})
})

/* SUBSCRIPTIONS */

app.post("/subscribe",async(req,res)=>{

const {token} = req.body

if(!token) return res.status(400).json({})

const exists = await Subscription.findOne({token})

if(!exists){
await new Subscription({token}).save()
}

res.json({success:true})

})

app.get("/admin/subscriptions",async(req,res)=>{
res.json(await Subscription.find())
})

/* FIREBASE CONFIG */

app.get("/firebase-config",(req,res)=>{

res.json({

apiKey:process.env.FIREBASE_API_KEY,
authDomain:process.env.FIREBASE_PROJECT_ID+".firebaseapp.com",
projectId:process.env.FIREBASE_PROJECT_ID,
messagingSenderId:process.env.FIREBASE_SENDER_ID,
appId:process.env.FIREBASE_APP_ID,
vapidKey:process.env.FIREBASE_VAPID_KEY

})

})

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running")

})