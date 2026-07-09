import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let myUID = "";

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    myUID = user.uid;

    loadRequests();

    loadFriends();

});

// ----------------------------
// 친구 요청 보내기
// ----------------------------

document.getElementById("sendFriendRequest").onclick = async () => {

    const friendID = document
        .getElementById("friendID")
        .value
        .trim();

    if (!friendID) {
        alert("친구 ID를 입력하세요.");
        return;
    }

    const q = query(
        collection(db, "users"),
        where("userID", "==", friendID)
    );

    const result = await getDocs(q);

    if (result.empty) {
        alert("사용자를 찾을 수 없습니다.");
        return;
    }

    const friend = result.docs[0];

    if (friend.id === myUID) {
        alert("자기 자신은 추가할 수 없습니다.");
        return;
    }

    const myDoc = await getDoc(doc(db, "users", myUID));

    const myData = myDoc.data();

    if (myData.friends.includes(friend.id)) {
        alert("이미 친구입니다.");
        return;
    }

    await updateDoc(
        doc(db, "users", friend.id),
        {
            requests: arrayUnion(myUID)
        }
    );

    alert("친구 요청을 보냈습니다.");

};



// ----------------------------
// 친구 요청 불러오기
// ----------------------------

async function loadRequests() {

    const ref = doc(db, "users", myUID);

    onSnapshot(ref, async (snap) => {

        const data = snap.data();

        const list = document.getElementById("requestList");

        list.innerHTML = "";

        if (!data.requests.length) {

            list.innerHTML =
                "<p class='empty'>요청이 없습니다.</p>";

            return;

        }

        for (const uid of data.requests) {

            const user = await getDoc(
                doc(db, "users", uid)
            );

            const u = user.data();

            const div = document.createElement("div");

            div.className = "friend";

            div.innerHTML = `
                <img src="${u.photoURL}">
                <div>
                    <b>${u.displayName}</b><br>
                    ${u.userID}
                </div>

                <button class="accept">수락</button>

                <button class="reject">거절</button>
            `;

            div.querySelector(".accept")
                .onclick = () => acceptFriend(uid);

            div.querySelector(".reject")
                .onclick = () => rejectFriend(uid);

            list.appendChild(div);

        }

    });

}



// ----------------------------
// 친구 요청 수락
// ----------------------------

async function acceptFriend(uid) {

    await updateDoc(
        doc(db, "users", myUID),
        {
            friends: arrayUnion(uid),
            requests: arrayRemove(uid)
        }
    );

    await updateDoc(
        doc(db, "users", uid),
        {
            friends: arrayUnion(myUID)
        }
    );

}



// ----------------------------
// 친구 요청 거절
// ----------------------------

async function rejectFriend(uid) {

    await updateDoc(
        doc(db, "users", myUID),
        {
            requests: arrayRemove(uid)
        }
    );

}



// ----------------------------
// 친구 목록
// ----------------------------

async function loadFriends() {

    const ref = doc(db, "users", myUID);

    onSnapshot(ref, async (snap) => {

        const data = snap.data();

        const list =
            document.getElementById("friendList");

        list.innerHTML = "";

        if (!data.friends.length) {

            list.innerHTML =
                "<p class='empty'>친구가 없습니다.</p>";

            return;

        }

        for (const uid of data.friends) {

            const friend =
                await getDoc(doc(db, "users", uid));

            const f = friend.data();

            const div = document.createElement("div");

            div.className = "friend";

            div.innerHTML = `
                <img src="${f.photoURL}">
                <div>
                    <b>${f.displayName}</b><br>
                    ${f.status}
                </div>
            `;

            list.appendChild(div);

        }

    });

}
