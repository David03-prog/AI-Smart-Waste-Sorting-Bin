import React, { useEffect, useState } from "react";
import { AuthScreen } from "./src/components/AuthScreen";
import { Dashboard } from "./src/components/Dashboard";
import { UserProfile } from "./src/types";
import { firebaseService } from "./src/services/firebaseService";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = firebaseService.subscribeToAuth((u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return null;

  if (!user) return <AuthScreen onLogin={setUser} />;

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
