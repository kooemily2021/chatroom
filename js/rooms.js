import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


// ============================
// 변수
// ============================

let currentUID = null;

let currentRoomID = null;


// HTML 요소

const roomList =
document.getElementById("roomList");

const createRoomBtn =
document.getElementById("createRoomBtn");

const createRoom =
document.getElementById("createRoom");

const roomModal =
document.getElementById("roomModal");



// ============================
// 로그인 확인
// ============================

onAuthStateChanged(auth,(user)=>{


    if(!user){

        return;

    }


    currentUID = user.uid;


    loadRooms();


});



// ============================
// 채팅방 생성 버튼
// ============================

if(createRoomBtn){

    createRoomBtn.onclick=()=>{

        roomModal.style.display="flex";

    };

}



// ============================
// 채팅방 생성
// ============================

if(createRoom){

createRoom.onclick = async()=>{


    const name =
    document.getElementById("roomName")
    .value
    .trim();



    if(!name){

        alert("채팅방 이름을 입력하세요.");

        return;

    }



    try{


        await addDoc(

            collection(db,"rooms"),

            {

                name:name,

                owner:currentUID,


                members:[

                    currentUID

                ],


                type:"group",


                lastMessage:"",


                createdAt:
                serverTimestamp(),


                updatedAt:
                serverTimestamp()

            }

        );


        alert("채팅방 생성 완료");


        document.getElementById("roomName")
        .value="";


        roomModal.style.display="none";


    }


    catch(error){


        console.error(error);


        alert("채팅방 생성 실패");


    }


};

}



// ============================
// 내 채팅방 불러오기
// ============================


function loadRooms(){


    const q = query(

        collection(db,"rooms"),

        where(

            "members",

            "array-contains",

            currentUID

        )

    );



    onSnapshot(q,(snapshot)=>{


        roomList.innerHTML="";



        if(snapshot.empty){


            roomList.innerHTML=

            `

            <p class="empty">

            채팅방이 없습니다.

            </p>

            `;


            return;


        }




        snapshot.forEach((item)=>{


            const room =
            item.data();



            const div =
            document.createElement("div");



            div.className="room";



            div.innerHTML=

            `

            <h3>

            ${room.name}

            </h3>


            <p>

            ${room.lastMessage || "새 채팅"}

            </p>


            `;



            div.onclick=()=>{


                openRoom(

                    item.id,

                    room.name

                );


            };



            roomList.appendChild(div);



        });



    });



}



// ============================
// 채팅방 열기
// ============================


async function openRoom(roomID,name){


    currentRoomID = roomID;



    document
    .getElementById("roomTitle")
    .textContent=name;



    window.currentRoomID =
    roomID;



    // chat.js에게 알림

    document.dispatchEvent(

        new CustomEvent(

            "roomChanged",

            {

                detail:{

                    roomID:roomID,

                    name:name

                }

            }

        )

    );


}



// ============================
// 현재 방 가져오기
// ============================

export function getCurrentRoom(){

    return currentRoomID;

}
