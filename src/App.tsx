// src/App.tsx
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed, please try again.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Resume AI</h1>

      {user ? (
        <div>
          <p>
            Logged in as: <b>{user.displayName || user.email}</b>
          </p>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={handleLogin}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
