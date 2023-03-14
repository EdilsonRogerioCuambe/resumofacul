// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEsNnelqRpDcVtCjX1hD9thwp2XFjXKas",
  authDomain: "resumofacul-17214.firebaseapp.com",
  projectId: "resumofacul-17214",
  storageBucket: "resumofacul-17214.appspot.com",
  messagingSenderId: "686964939914",
  appId: "1:686964939914:web:e88edd40e92cc63afb6173",
  measurementId: "G-RN3T4J8M4S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "usuarios"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        authProvider: "google",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.log(error);
  }
};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      authProvider: "email",
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendVerificationEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    alert("Email de verificação enviado");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export {
  auth,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendVerificationEmail,
  sendPasswordReset,
  db,
  storage,
};
