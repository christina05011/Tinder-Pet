// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP2DMou92lN9_xNLm0gH914pcUdlC4QZk",
  authDomain: "tinderpet-2f2b5.firebaseapp.com",
  projectId: "tinderpet-2f2b5",
  storageBucket: "tinderpet-2f2b5.appspot.com",
  messagingSenderId: "752361571975",
  appId: "1:752361571975:web:e77a3344da82fb81819a22",
  measurementId: "G-C4LE7D8G7F"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const db = app.firestore()
const storage_ = firebase.storage(app)

export { auth, db, storage_ };