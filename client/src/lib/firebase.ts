import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD9t00gFj0ANHdLEmAPThiuBp-c4Xj-vwU",
  authDomain: "ai-governance-eda26.firebaseapp.com",
  projectId: "ai-governance-eda26",
  storageBucket: "ai-governance-eda26.firebasestorage.app",
  messagingSenderId: "573119711660",
  appId: "1:573119711660:web:65f9a02520068d569fd209",
  measurementId: "G-4M13QN7107"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export { auth, analytics };
