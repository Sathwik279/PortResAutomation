import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  projectId: "portresautomation-dashboard",
  appId: "1:1073801637615:web:bb0e7fa439845dc067b51a",
  storageBucket: "portresautomation-dashboard.firebasestorage.app",
  apiKey: "AIzaSyAcoh5Cop7qLqnSlRNWQt3wynHDNAl-Esg",
  authDomain: "portresautomation-dashboard.firebaseapp.com",
  messagingSenderId: "1073801637615",
  measurementId: "G-GN30TT97Z3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};
