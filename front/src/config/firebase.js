
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_j8zB72czCySXwoFfOrlwRPdoHmNrNRY",
  authDomain: "learning-e47b8.firebaseapp.com",
  projectId: "learning-e47b8",
  storageBucket: "learning-e47b8.appspot.com",
  messagingSenderId: "459266027745",
  appId: "1:459266027745:web:7c78f3eab70e527c9f07a0",
  measurementId: "G-58LH7JTPW8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };


