
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "ramscom",
  "appId": "1:969268410715:web:41339549c17010d989c27e",
  "storageBucket": "ramscom.appspot.com",
  "apiKey": "AIzaSyC2_No1bsBCeeAgzCqCdgx5HXFez_Sov8E",
  "authDomain": "ramscom.firebaseapp.com",
  "measurementId": "G-EX3Q1VPZK0",
  "messagingSenderId": "969268410715"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
