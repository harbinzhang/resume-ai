// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your Firebase configuration
// For local development, these values can be dummy values when using emulators
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulators if in development mode
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
    // Auth emulator on port 9099
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

    // Firestore emulator on port 8080
    connectFirestoreEmulator(db, "127.0.0.1", 8080);

    // Functions emulator on port 5001
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);

    // Storage emulator on port 9199
    connectStorageEmulator(storage, "127.0.0.1", 9199);

    console.log("🔥 Firebase emulators connected");
}

export default app;
