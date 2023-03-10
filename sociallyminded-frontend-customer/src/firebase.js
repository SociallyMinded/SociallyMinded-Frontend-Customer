import firebase from "./firebase"
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from "./firebaseConfig";

// Import the functions you need from the SDKs you need
import { initializeApp, GoogleAuthProvider } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // set up authentication
export const db = getFirestore(app)

