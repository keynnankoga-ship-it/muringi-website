async function loadAffirmation(){

const res = await fetch("/affirmations")

const affirmations = await res.json()

const container = document.getElementById("affirmation-text")

const today = new Date()

const start = new Date(today.getFullYear(),0,0)

const diff = today-start

const day = Math.floor(diff/(1000*60*60*24))

const index = day%affirmations.length

container.innerText = affirmations[index].text

}

async function loadSongs(){

const res = await fetch("/songs")

const songs = await res.json()

const playlist = document.getElementById("playlist")

playlist.innerHTML=""

songs.forEach(song=>{

const div=document.createElement("div")

div.className="song"

div.innerHTML=`

<img src="${song.cover}" width="200">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<audio controls src="${song.audio}"></audio>

`

playlist.appendChild(div)

})

}

async function loadSongOfDay(){

const res=await fetch("/song-of-the-day")

const song=await res.json()

const container=document.getElementById("dailySong")

container.innerHTML=`

<img src="${song.cover}" width="200">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<audio controls src="${song.audio}"></audio>

`

}

async function loadDateIdeas(){

const res=await fetch("/dateIdeas")

const ideas=await res.json()

const container=document.getElementById("dateIdeas")

container.innerHTML=""

ideas.forEach(idea=>{

const div=document.createElement("div")

div.className="date-card"

div.innerHTML=`

<h3>${idea.title}</h3>

<p>${idea.description}</p>

`

container.appendChild(div)

})

}

async function loadGallery(){

const res=await fetch("/gallery")

const photos=await res.json()

const gallery=document.getElementById("photoGallery")

gallery.innerHTML=""

photos.forEach(p=>{

const img=document.createElement("img")

img.src=p.url

gallery.appendChild(img)

})

}

document.addEventListener("DOMContentLoaded",()=>{

loadAffirmation()

loadSongs()

loadSongOfDay()

loadDateIdeas()

loadGallery()

})