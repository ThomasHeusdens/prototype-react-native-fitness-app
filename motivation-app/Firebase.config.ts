// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxUGuOLv3oWO0yjR6QDJ1v5qus2PiaE7w",
  authDomain: "auth-system-571f4.firebaseapp.com",
  projectId: "auth-system-571f4",
  storageBucket: "auth-system-571f4.firebasestorage.app",
  messagingSenderId: "574277716151",
  appId: "1:574277716151:web:5d157a5de2952365cf2532"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);