// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYPRctVh1wiDXpQ0XJGavijStImR5-E9g",
  authDomain: "appregistroasistencia.firebaseapp.com",
  projectId: "appregistroasistencia",
  storageBucket: "appregistroasistencia.firebasestorage.app",
  messagingSenderId: "476576274558",
  appId: "1:476576274558:web:cd4cd8950802410674602f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const db = getFirestore(app);