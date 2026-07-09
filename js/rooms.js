import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let myUID = "";

const roomList = document.getElementById("roomList");

const createRoomBtn =
document.getElementById("createRoomBtn");

const createRoom =
document.getElementById("createRoom");

const roomModal =
document.getElementById("roomModal");

// 로그인 확인

onAuthStateChanged(auth,(user)=>{

    if(!user) return;

    myUID=user.uid;

    loadRooms();

});


// ----------------------
// 채팅방 만들기 버튼
// ----------------------

createRoomBtn.onclick=()=>{

    roomModal.style.display="flex";

};


// ----------------------
// 모달 닫기
// ----------------------

document.querySelectorAll(".closeModal")
.forEach(btn=>{

    btn.onclick=()=>{

        roomModal.style.display="none";

    }

});


// ----------------------
// 채팅방 생성
// ----------------------

createRoom.onclick=async()=>{

    const name=
    document.getElementById("roomName")
    .value.trim();

    if(name===""){

        alert("채팅방 이름을 입력하세요.");

        return;

    }

    await addDoc(
        collection(db,"rooms"),
        {

            roomName:name,

            owner:myUID,

            members:[myUID],

            lastMessage:"",

            updatedAt:serverTimestamp(),

            createdAt:serverTimestamp()

        }
    );

    document.getElementById("roomName").value="";

    roomModal.style.display="none";

};


// ----------------------
// 내 채팅방 불러오기
// ----------------------

async function loadRooms(){

    const q=query(

        collection(db,"rooms"),

        where("members","array-contains",myUID)

    );

    onSnapshot(q,(snapshot)=>{

        roomList.innerHTML="";

        if(snapshot.empty){

            roomList.innerHTML=
            "<p class='empty'>채팅방이 없습니다.</p>";

            return;

        }

        snapshot.forEach(docSnap=>{

            const room=docSnap.data();

            const div=document.createElement("div");

            div.className="room";

            div.innerHTML=`

                <h3>${room.roomName}</h3>

                <small>${room.lastMessage}</small>

            `;

            div.onclick=()=>{

                openRoom(docSnap.id);

            };

            roomList.appendChild(div);

        });

    });

}


// ----------------------
// 채팅방 열기
// ----------------------

function openRoom(roomID){

    document.getElementById("roomTitle")
    .textContent="불러오는 중...";

    // chat.js에서 사용
    window.currentRoom=roomID;

    document.dispatchEvent(

        new CustomEvent("roomChanged",{

            detail:roomID

        })

    );

}
