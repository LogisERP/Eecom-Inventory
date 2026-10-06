import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7mB1pC6b4SHvQQW1pSNQWtXmobe_El6U",
  authDomain: "ecom-inventory-v1.firebaseapp.com",
  projectId: "ecom-inventory-v1",
  storageBucket: "ecom-inventory-v1.firebasestorage.app",
  messagingSenderId: "582542591727",
  appId: "1:582542591727:web:44307fcae1fad8a5257d1a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
