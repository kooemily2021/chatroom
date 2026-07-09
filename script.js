import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

  await signOut(auth);

  location.reload();

});

const firebaseConfig = {
  apiKey: "AIzaSyCSrBXhL89-9raX3j8URfeXGHpl4Zg42iI",
  authDomain: "chatroom-a3e10.firebaseapp.com",
  projectId: "chatroom-a3e10",
  storageBucket: "chatroom-a3e10.firebasestorage.app",
  messagingSenderId: "854579145661",
  appId: "1:854579145661:web:ada8936fa3bccd52c680d4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

let currentUser = null;
let currentRoom = null;

document
.getElementById("loginBtn")
.addEventListener("click", async () => {
  await signInWithPopup(auth, provider);
});

onAuthStateChanged(auth, (user) => {

  if(!user) return;

  currentUser = user;

  document.getElementById("userInfo").innerHTML =
    `로그인: ${user.displayName}`;

  loadRooms();
});

document
.getElementById("createRoomBtn")
.addEventListener("click", async () => {

  const roomName =
    document.getElementById("roomName").value;

 if(!roomName.trim()) return;

  await addDoc(collection(db,"rooms"),{
    name: roomName
  });
});

function loadRooms(){

  onSnapshot(
    collection(db,"rooms"),
    (snapshot)=>{

      const rooms =
        document.getElementById("rooms");

      rooms.innerHTML="";

      snapshot.forEach(doc=>{

        const room = doc.data();

        const div =
          document.createElement("div");

        div.className="room";
        div.textContent=room.name;

        div.onclick=()=>{
          openRoom(doc.id,room.name);
        };

        rooms.appendChild(div);
      });
    }
  );
}

function openRoom(roomId,name){

  currentRoom=roomId;

  document
  .getElementById("chatSection")
  .style.display="block";

  document
  .getElementById("currentRoom")
  .textContent=name;

  const q = query(
    collection(db,"rooms",roomId,"messages"),
    orderBy("createdAt")
  );

  onSnapshot(q,(snapshot)=>{

    const chatbox =
      document.getElementById("chatbox");

    chatbox.innerHTML="";

    snapshot.forEach(doc=>{

      const msg=doc.data();

      chatbox.innerHTML+=`
        <div class="message">
          <b>${msg.user}</b><br>
          ${msg.text}
        </div>
      `;
    });

    chatbox.scrollTop=
      chatbox.scrollHeight;
  });
}

document
.getElementById("sendBtn")
.addEventListener("click",async()=>{

  if(!currentRoom) return;

  const message =
    document.getElementById("message").value;

  if(!message) return;

  await addDoc(
    collection(
      db,
      "rooms",
      currentRoom,
      "messages"
    ),
    {
      user: currentUser.displayName,
      text: message,
      createdAt: Date.now()

    document
.getElementById("message")
.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){
    document.getElementById("sendBtn").click();
  }

});
    }
  );

  document.getElementById("message").value="";
});
