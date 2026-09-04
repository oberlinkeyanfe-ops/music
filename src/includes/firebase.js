// Firebase v8 (API "namespaced", celle utilisée tout au long du cours)
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Remplacez ces valeurs par celles de VOTRE projet Firebase
// (Console Firebase -> Paramètres du projet -> Vos applications -> Config)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJET.firebaseapp.com",
  projectId: "VOTRE_PROJET",
  appId: "VOTRE_APP_ID",
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
