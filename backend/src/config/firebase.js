// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC6XRmE_YYG_UWCuLMTzzW7OcBMpwK268",
  authDomain: "moneyround-aa7a9.firebaseapp.com",
  projectId: "moneyround-aa7a9",
  storageBucket: "moneyround-aa7a9.firebasestorage.app",
  messagingSenderId: "121181599706",
  appId: "1:121181599706:web:6676bb2efa260d934b32e3",
  measurementId: "G-8HVXVN237N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);