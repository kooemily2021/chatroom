import { auth, db } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Google 로그인 Provider
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ----------------------------
// 랜덤 사용자 ID 생성
// 예: @AB123456
// ----------------------------

function createUserID() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const a = letters[Math.floor(Math.random()*26)];
    const b = letters[Math.floor(Math.random()*26)];

    const number = Math.floor(
        100000 + Math.random()*900000
    );

    return `@${a}${b}${number}`;
}

// ----------------------------
// Google 로그인
// ----------------------------

loginBtn.onclick = async () => {

    try{

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        const ref = doc(db,"users",user.uid);

        const snap = await getDoc(ref);

        // 처음 로그인한 회원이면 생성

        if(!snap.exists()){

            await setDoc(ref,{

                uid:user.uid,

                displayName:user.displayName,

                email:user.email,

                photoURL:user.photoURL,

                userID:createUserID(),

                status:"안녕하세요!",

                friends:[],

                requests:[],

                createdAt:serverTimestamp()

            });

        }

        alert("로그인 성공!");

    }

    catch(e){

    console.error("로그인 오류:", e);
    alert(e.code + "\n" + e.message);

}
    }

}

// ----------------------------
// 로그아웃
// ----------------------------

logoutBtn.onclick=()=>{

    signOut(auth);

}

// ----------------------------
// 로그인 상태 확인
// ----------------------------

onAuthStateChanged(auth,(user)=>{

    if(user){

        document.getElementById("displayName").textContent=
        user.displayName;

        document.getElementById("profileImage").src=
        user.photoURL;

    }

    else{

        document.getElementById("displayName").textContent=
        "로그인하세요";

    }

});
