import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

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
const storage = getStorage(app);

export { auth, db, storage };
