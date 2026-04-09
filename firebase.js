import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBscAozoUDsY2hPH36y9WVH-S7Y85fJ8-A",
  authDomain: "estructura-odeaa.firebaseapp.com",
  databaseURL: "https://estructura-odeaa-default-rtdb.firebaseio.com",
  projectId: "estructura-odeaa",
  storageBucket: "estructura-odeaa.firebasestorage.app",
  messagingSenderId: "403044040527",
  appId: "1:403044040527:web:55afc12a7a14210997cf3a",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
