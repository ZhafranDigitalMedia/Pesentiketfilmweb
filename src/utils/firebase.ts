import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7UHMwil0M4QwWWLEGE-XvKINrx7u0zIc",
  authDomain: "cinebook-befa2.firebaseapp.com",
  projectId: "cinebook-befa2",
  storageBucket: "cinebook-befa2.firebasestorage.app",
  messagingSenderId: "725090839686",
  appId: "1:725090839686:web:a4c207f78937fd15737507",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
