// Firebase v8 (API "namespaced", celle utilisée tout au long du cours)
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Remplacez ces valeurs par celles de VOTRE projet Firebase
// (Console Firebase -> Paramètres du projet -> Vos applications -> Config)
const firebaseConfig = {
  apiKey: "AIzaSyAS2WTL_REpbi0vV71SnkCr1qM35Y75E7U",
  authDomain: "music-487ea.firebaseapp.com",
  projectId: "music-487ea",
  appId: "1:553467667180:web:a32931dedad371358fbbc9",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

export const usersCollection = db.collection("users");
export const songsCollection = db.collection("songs");
export const commentsCollection = db.collection("comments");

// Persistance hors-ligne (voir Partie 10 du guide)
db.enablePersistence().catch((err) => {
  console.log("Firebase persistence error:", err.code);
});
