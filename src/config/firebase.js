import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApuyevDPpcXfiRJqmrsYyEK8E7kY1gNQI",
  authDomain: "harbor-crm-7eae9.firebaseapp.com",
  projectId: "harbor-crm-7eae9",
  storageBucket: "harbor-crm-7eae9.firebasestorage.app",
  messagingSenderId: "156853453480",
  appId: "1:156853453480:web:7988ee986ce878503e789d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);