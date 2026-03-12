async function loadSongs(){

const res=await fetch("/songs")
const songs=await res.json()

const playlist=document.getElementById("playlist")

playlist.innerHTML=""

songs.forEach(song=>{

const div=document.createElement("div")

div.className="song"

div.innerHTML=`

<img src="${song.cover}" width="200">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<audio controls>
<source src="${song.audio}" type="audio/mpeg">
</audio>

`

playlist.appendChild(div)

})

}

/* SONG OF DAY */

async function loadSongOfDay(){

const res=await fetch("/song-of-the-day")
const song=await res.json()

if(!song.title)return

const container=document.getElementById("dailySong")

container.innerHTML=`

<img src="${song.cover}" width="200">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<audio controls>
<source src="${song.audio}">
</audio>

`

}

/* GALLERY */

async function loadGallery(){

const res=await fetch("/gallery")
const photos=await res.json()

const gallery=document.getElementById("photoGallery")

gallery.innerHTML=""

photos.forEach(photo=>{

const img=document.createElement("img")
img.src=photo.url
gallery.appendChild(img)

})

}

/* PLAYLISTS */

async function loadPlaylists(){

const res=await fetch("/playlists")
const playlists=await res.json()

const container=document.getElementById("spotify")

container.innerHTML=""

playlists.forEach(p=>{

const div=document.createElement("div")
div.innerHTML=p.embed

container.appendChild(div)

})

}

document.addEventListener("DOMContentLoaded",()=>{

loadSongs()
loadSongOfDay()
loadGallery()
loadPlaylists()

})