import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let currentUser = null;

// 로그인 상태 확인
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    currentUser = snap.data();

    // 화면 표시
    document.getElementById("displayName").textContent =
        currentUser.displayName;

    document.getElementById("userID").textContent =
        currentUser.userID;

    document.getElementById("status").textContent =
        currentUser.status || "상태메시지가 없습니다.";

    if (currentUser.photoURL) {
        document.getElementById("profileImage").src =
            currentUser.photoURL;
    }

    // 마지막 접속 시간 저장
    await updateDoc(ref, {
        lastLogin: serverTimestamp()
    });

});

// 다른 파일에서도 사용할 수 있도록 export
export { currentUser };
