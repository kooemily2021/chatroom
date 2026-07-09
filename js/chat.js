import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";



// ==========================
// 변수
// ==========================

let myUID = null;

let currentRoomID = null;

let unsubscribe = null;



const chatArea =
document.getElementById("chatArea");


const messageInput =
document.getElementById("messageInput");


const sendBtn =
document.getElementById("sendBtn");




// ==========================
// 로그인 확인
// ==========================

onAuthStateChanged(auth,(user)=>{


    if(!user) return;


    myUID=user.uid;


});




// ==========================
// 방 변경 감지
// ==========================


document.addEventListener(

"roomChanged",

(event)=>{


    const data =
    event.detail;


    currentRoomID =
    data.roomID;


    loadMessages();


}

);





// ==========================
// 메시지 불러오기
// ==========================


function loadMessages(){


    if(!currentRoomID)
    return;



    chatArea.innerHTML="";



    if(unsubscribe){

        unsubscribe();

    }




    const q = query(

        collection(

            db,

            "rooms",

            currentRoomID,

            "messages"

        ),

        orderBy(

            "createdAt",

            "asc"

        )

    );




    unsubscribe = onSnapshot(

        q,

        (snapshot)=>{


            chatArea.innerHTML="";



            snapshot.forEach((doc)=>{


                const msg =
                doc.data();



                showMessage(msg);



            });



            scrollBottom();



        }

    );

}




// ==========================
// 화면에 메시지 표시
// ==========================


function showMessage(msg){



    const div =
    document.createElement("div");



    div.className =
    "message " +

    (

        msg.sender === myUID

        ?

        "me"

        :

        "other"

    );




    const time =
    msg.createdAt

    ?

    msg.createdAt
    .toDate()
    .toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    )

    :

    "";




    div.innerHTML=

    `

    <div class="name">

    ${msg.name || ""}

    </div>


    <div>

    ${msg.text}

    </div>


    <div class="time">

    ${time}

    </div>


    `;




    chatArea.appendChild(div);


}




// ==========================
// 메시지 보내기
// ==========================


async function sendMessage(){



    const text =
    messageInput.value.trim();



    if(!text)
    return;



    if(!currentRoomID){

        alert("채팅방을 선택하세요.");

        return;

    }




    await addDoc(

        collection(

            db,

            "rooms",

            currentRoomID,

            "messages"

        ),

        {

            sender:myUID,


            text:text,


            createdAt:
            serverTimestamp()


        }

    );



    // 마지막 메시지 업데이트


    await updateDoc(

        doc(

            db,

            "rooms",

            currentRoomID

        ),

        {

            lastMessage:text,

            updatedAt:
            serverTimestamp()

        }

    );




    messageInput.value="";


}





// ==========================
// 버튼 전송
// ==========================


sendBtn.onclick=()=>{


    sendMessage();


};




// ==========================
// Enter 전송
// ==========================


messageInput.addEventListener(

"keydown",

(e)=>{


    if(

        e.key==="Enter"

    ){

        sendMessage();

    }


}

);




// ==========================
// 자동 스크롤
// ==========================


function scrollBottom(){


    chatArea.scrollTop =

    chatArea.scrollHeight;


}
