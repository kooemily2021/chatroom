// ==============================
// Firebase SDK Import
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";


// ==============================
// Firebase Config
// ==============================

const firebaseConfig = {

    apiKey: "여기에 API KEY",

    authDomain: "여기에 authDomain",

    projectId: "여기에 projectId",

    storageBucket: "여기에 storageBucket",

    messagingSenderId: "여기에 messagingSenderId",

    appId: "여기에 appId"

};


// ==============================
// Initialize
// ==============================

const app = initializeApp(firebaseConfig);


// ==============================
// Services
// ==============================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ==============================
// Export
// ==============================

export {

    auth,

    db,

    storage

};
