import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBoKtM8ei6KeG2xrPHIv_YvTKa2ENfoqzE",
    authDomain: "tiendita-9ad1f.firebaseapp.com",
    projectId: "tiendita-9ad1f",
    storageBucket: "tiendita-9ad1f.firebasestorage.app",
    messagingSenderId: "772708780226",
    appId: "1:772708780226:web:54fb4460d27fc610b1935b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);