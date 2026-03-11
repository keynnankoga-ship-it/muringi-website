const subscribeBtn=document.getElementById("subscribeBtn")

subscribeBtn.addEventListener("click",async()=>{

const permission=await Notification.requestPermission()

if(permission!=="granted"){

alert("Notifications blocked")

return

}

const res=await fetch("/firebase-config")

const config=await res.json()

firebase.initializeApp(config)

const messaging=firebase.messaging()

const token=await messaging.getToken({

vapidKey:config.vapidKey

})

await fetch("/subscribe",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({token})

})

alert("Subscribed to daily affirmation and song")

})

firebase.messaging().onMessage(payload=>{

new Notification(payload.notification.title,{

body:payload.notification.body

})

})