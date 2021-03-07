import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDYxKyE9oW-Ne854_GWEzewLfHlVe1ZHd8",
  authDomain: "whatsapp-mern-b65cd.firebaseapp.com",
  projectId: "whatsapp-mern-b65cd",
  storageBucket: "whatsapp-mern-b65cd.appspot.com",
  messagingSenderId: "61497501443",
  appId: "1:61497501443:web:8c1b448914c7aa6ce82b36",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
