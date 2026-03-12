async function login(){

const password=document.getElementById("password").value

const res=await fetch("/admin-login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({password})

})

if(res.ok){

document.getElementById("panel").style.display="block"

}else{

alert("Wrong password")

}

}

async function addSong(){

const song={

title:document.getElementById("title").value,
artist:document.getElementById("artist").value,
audio:document.getElementById("audio").value,
cover:document.getElementById("cover").value

}

await fetch("/admin/add-song",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(song)

})

alert("Song added")

}

async function loadSubs(){

const res=await fetch("/admin/subscriptions")

const subs=await res.json()

const list=document.getElementById("subs")

list.innerHTML=""

subs.forEach(s=>{

const li=document.createElement("li")
li.innerText=s.token

list.appendChild(li)

})

}