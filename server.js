require("dotenv").config()

const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI)

const Affirmation=mongoose.model("Affirmation",{text:String})

const Song=mongoose.model("Song",{

title:String,

artist:String,

audio:String,

cover:String

})

const DateIdea=mongoose.model("DateIdea",{

title:String,

description:String

})

const Gallery=mongoose.model("Gallery",{

url:String

})

app.get("/affirmations",async(req,res)=>{

const data=await Affirmation.find()

res.json(data)

})

app.get("/songs",async(req,res)=>{

const data=await Song.find()

res.json(data)

})

app.get("/song-of-the-day",async(req,res)=>{

const songs=await Song.find()

const index=new Date().getDate()%songs.length

res.json(songs[index])

})

app.get("/dateIdeas",async(req,res)=>{

const data=await DateIdea.find()

res.json(data)

})

app.get("/gallery",async(req,res)=>{

const data=await Gallery.find()

res.json(data)

})

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

app.post("/subscribe",(req,res)=>{

console.log("Token received",req.body.token)

res.json({success:true})

})

app.listen(process.env.PORT||3000,()=>{

console.log("Server running")

})