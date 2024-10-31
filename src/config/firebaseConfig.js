// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYPRctVh1wiDXpQ0XJGavijStImR5-E9g",
  authDomain: "appregistroasistencia.firebaseapp.com",
  projectId: "appregistroasistencia",
  storageBucket: "appregistroasistencia.firebasestorage.app",
  messagingSenderId: "476576274558",
  appId: "1:476576274558:web:cd4cd8950802410674602f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
