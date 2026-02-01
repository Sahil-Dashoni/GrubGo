// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "grubgo3.firebaseapp.com",
  projectId: "grubgo3",
  storageBucket: "grubgo3.firebasestorage.app",
  messagingSenderId: "375008310590",
  appId: "1:375008310590:web:0e1d1178137731978de86f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}