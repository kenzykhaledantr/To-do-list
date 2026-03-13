import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // only if you use Firestore
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: "AIzaSyAMYPJ8OzmrsY1LTSYwM7KOMRcDdAU-eVo",
  authDomain: "to-do-list-24e5b.firebaseapp.com",
  projectId: "to-do-list-24e5b",
  storageBucket: "to-do-list-24e5b.firebasestorage.app",
  messagingSenderId: "846057201640",
  appId: "1:846057201640:android:a875ad569b7df2606dce5d"
};


const app = initializeApp(firebaseConfig);

// ✅ Replace getAuth() with this
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);