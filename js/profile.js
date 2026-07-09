import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";



// =========================
// 변수
// =========================

let myUID = null;


const profileModal =
document.getElementById("profileModal");


const editProfileBtn =
document.getElementById("editProfileBtn");


const saveProfile =
document.getElementById("saveProfile");



// =========================
// 로그인 확인
// =========================


onAuthStateChanged(auth, async(user)=>{


    if(!user)
    return;


    myUID=user.uid;


    loadProfile();


});




// =========================
// 프로필 불러오기
// =========================


async function loadProfile(){


    const ref =
    doc(db,"users",myUID);



    const snap =
    await getDoc(ref);



    if(!snap.exists())
    return;



    const data =
    snap.data();



    document
    .getElementById("displayName")
    .textContent =
    data.displayName;



    document
    .getElementById("userID")
    .textContent =
    data.userID;



    document
    .getElementById("status")
    .textContent =
    data.status || "상태메시지";



    if(data.photoURL){


        document
        .getElementById("profileImage")
        .src =
        data.photoURL;


    }



}





// =========================
// 수정창 열기
// =========================


editProfileBtn.onclick=()=>{


    profileModal.style.display="flex";


};





// =========================
// 저장
// =========================


saveProfile.onclick=async()=>{


    const nickname =

    document
    .getElementById("nicknameInput")
    .value
    .trim();



    const status =

    document
    .getElementById("statusInput")
    .value
    .trim();



    const updateData={};



    if(nickname){

        updateData.displayName =
        nickname;

    }



    if(status){

        updateData.status =
        status;

    }



    await updateDoc(

        doc(
            db,
            "users",
            myUID
        ),

        updateData

    );



    await loadProfile();



    profileModal.style.display="none";


};




// =========================
// 모달 닫기
// =========================


document
.querySelectorAll(".closeModal")
.forEach((btn)=>{


    btn.onclick=()=>{


        profileModal.style.display="none";


    };


});
