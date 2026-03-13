document.addEventListener("DOMContentLoaded", () => {
loadAffirmation()
loadSongs()
loadDateIdeas()
loadGallery()
})

/* AFFIRMATION */

async function loadAffirmation(){

const container = document.getElementById("affirmation-text")

if(!container) return

try{

const res = await fetch("/affirmations")
const affirmations = await res.json()

if(!affirmations.length){
container.innerText="You are amazing and today will be a good day ❤️"
return
}

const index = new Date().getDate() % affirmations.length

container.innerText = affirmations[index].text

}catch{

container.innerText="You are amazing and today will be a good day ❤️"

}

}

/* SONGS */

async function loadSongs(){

const container = document.getElementById("playlist")

if(!container) return

const res = await fetch("/songs")
const songs = await res.json()

container.innerHTML=""

songs.forEach(song=>{

const div = document.createElement("div")
div.className="song"

div.innerHTML=`
<img src="${song.cover}" width="180">
<h3>${song.title}</h3>
<p>${song.artist}</p>
<audio controls>
<source src="${song.audio}" type="audio/mpeg">
</audio>
`

container.appendChild(div)

})

enableAudioControl()

}

/* SONG OF DAY */

fetch("/song-of-the-day")
.then(res=>res.json())
.then(song=>{

const container = document.getElementById("dailySong")

if(!song || !song.title) return

container.innerHTML=`
<div class="song">
<img src="${song.cover}" width="180">
<h3>${song.title}</h3>
<p>${song.artist}</p>
<audio controls>
<source src="${song.audio}" type="audio/mpeg">
</audio>
</div>
`

})

/* AUDIO CONTROL */

function enableAudioControl(){

const audios = document.querySelectorAll("audio")

audios.forEach(audio=>{

audio.onplay=()=>{

audios.forEach(other=>{
if(other!==audio) other.pause()
})

}

})

}

/* DATE IDEAS */

async function loadDateIdeas(){

const container = document.getElementById("dateIdeas")

if(!container) return

const res = await fetch("/dateIdeas")
const ideas = await res.json()

container.innerHTML=""

ideas.forEach(idea=>{

const div = document.createElement("div")

div.className="date-card"

div.innerHTML=`
<h3>${idea.title}</h3>
<p>${idea.description}</p>
`

container.appendChild(div)

})

}

/* GALLERY */

async function loadGallery(){

const container = document.getElementById("photoGallery")

if(!container) return

container.innerHTML=""

try{

const res = await fetch("/gallery")
const photos = await res.json()

photos.forEach(photo=>{

const img = document.createElement("img")

img.src = photo.url

container.appendChild(img)

})

}catch(e){
console.log(e)
}

/* fallback public images */

for(let i=1;i<=24;i++){

const img = document.createElement("img")

img.src=`/gallery/gallery${i}.jpeg`

container.appendChild(img)

}

}