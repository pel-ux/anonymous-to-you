// Import the functions you need from the SDKs you need
import { initializeApp,getApps, } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBNwu8Kig0KXSrjd18Gw5NDrDgy9Pacbo",
  authDomain: "anonymous-to-you.firebaseapp.com",
  projectId: "anonymous-to-you",
  storageBucket: "anonymous-to-you.firebasestorage.app",
  messagingSenderId: "1058830268230",
  appId: "1:1058830268230:web:3159c1704d745f16ce5747",
  measurementId: "G-4Z7CSW47VW"
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);