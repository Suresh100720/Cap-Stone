import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHlg15tbsqHUQpKqyI2IxanAbNoo40dso",
  authDomain: "fir-dff39.firebaseapp.com",
  projectId: "fir-dff39",
  storageBucket: "fir-dff39.firebasestorage.app",
  messagingSenderId: "639303940134",
  appId: "1:639303940134:web:0696b58fdece697e3f4ee7",
  measurementId: "G-SB88LR5TS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

