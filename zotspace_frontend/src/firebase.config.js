// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyD_scocSO8DaY3w3nqMx3QVPxswIXsOq0s",

  authDomain: "zotspace-59461.firebaseapp.com",

  projectId: "zotspace-59461",

  storageBucket: "zotspace-59461.firebasestorage.app",

  messagingSenderId: "559704438677",

  appId: "1:559704438677:web:846596e1790d2f7bc4a89c",

  measurementId: "G-ZH2Z7MZ2EY"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export const auth = getAuth(app);

