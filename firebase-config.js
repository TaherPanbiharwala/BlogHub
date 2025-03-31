// firebase-config.js

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdMaLVCesTw5MpE8P_TVbUmbs6aHVaE4I",
    authDomain: "bloghub-3c0d8.firebaseapp.com",
    projectId: "bloghub-3c0d8",
    storageBucket: "bloghub-3c0d8.firebasestorage.app",
    messagingSenderId: "82344753354",
    appId: "1:82344753354:web:71507f5d4d7492ebc81c33",
    measurementId: "G-YXE8BCWNZ5"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore();