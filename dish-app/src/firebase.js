import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVw566rEHgm_SMlJkA__oDvSBCzn1jibE",
  authDomain: "dish-app-e4135.firebaseapp.com",
  projectId: "dish-app-e4135",
  storageBucket: "dish-app-e4135.firebasestorage.app",
  messagingSenderId: "573366212230",
  appId: "1:573366212230:web:eb0fd0135978620d4d2307"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);