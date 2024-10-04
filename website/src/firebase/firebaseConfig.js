// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvrkJcpU8jYIxK9g-Nu1tHc5UjXZNNOXs",
  authDomain: "budgetit-b58d9.firebaseapp.com",
  projectId: "budgetit-b58d9",
  storageBucket: "budgetit-b58d9.appspot.com",
  messagingSenderId: "501171728789",
  appId: "1:501171728789:web:086f1767c452f0bc6d469c"
};




// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);