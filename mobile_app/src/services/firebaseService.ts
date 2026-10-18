import { onValue, ref, query, limitToLast, set, push } from "firebase/database";
import { rtdb, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { BinStatus, UserProfile, WasteLog, WasteType } from "../types";

function clampPercent(x: any): number {
  const n = Number(x);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeStatus(fill: number): BinStatus["status"] {
  if (fill > 80) return "CRITICAL";
  if (fill > 50) return "FULL";
  return "OK";
}

function userToProfile(u: User): UserProfile {
  return {
    id: u.uid,
    email: u.email ?? "",
    name: (u.email ?? "").split("@")[0],
  };
}

export const firebaseService = {
  // REAL LOGIN
  async login(email: string, password: string): Promise<UserProfile> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return userToProfile(cred.user);
  },

  // REAL SIGNUP
  async signup(email: string, password: string): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return userToProfile(cred.user);
  },

  // REAL LOGOUT
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Auth state listener (optional but recommended)
  subscribeToAuth(cb: (user: UserProfile | null) => void) {
    return onAuthStateChanged(auth, (u) => cb(u ? userToProfile(u) : null));
  },

  // OPTION B: two bins (paper + plastic). UI shows overall = max(paper, plastic)
  subscribeToFillLevel(cb: (status: BinStatus) => void) {
    const paperRef = ref(rtdb, "bins/paper/fillPercent");
    const plasticRef = ref(rtdb, "bins/plastic/fillPercent");

    let paper = 0;
    let plastic = 0;

    const emit = () => {
      const overall = Math.max(paper, plastic);
      cb({
        fillLevel: overall,
        paperFill: paper,
        plasticFill: plastic,
        lastUpdated: Date.now(),
        status: computeStatus(overall),
      });
    };

    const unsubPaper = onValue(paperRef, (snap) => {
      paper = clampPercent(snap.val());
      emit();
    });

    const unsubPlastic = onValue(plasticRef, (snap) => {
      plastic = clampPercent(snap.val());
      emit();
    });

    return () => {
      unsubPaper();
      unsubPlastic();
    };
  },

  // Live activity feed: reads last 20 logs
  subscribeToLogs(cb: (logs: WasteLog[]) => void) {
    const logsRef = query(ref(rtdb, "logs"), limitToLast(20));

    const unsub = onValue(logsRef, (snap) => {
      const val = snap.val();
      if (!val) {
        cb([]);
        return;
      }

      const items: WasteLog[] = Object.entries(val).map(([id, raw]: any) => ({
        id,
        type: (raw.type as WasteType) ?? "PLASTIC",
        confidence: Number(raw.confidence ?? 0),
        timestamp: Number(raw.timestamp ?? Date.now()),
      }));

      items.sort((a, b) => b.timestamp - a.timestamp);
      cb(items);
    });

    return () => unsub();
  },

  // OPTION 2: simulate bins + logs (one-tap demo)
  async simulateDataOnce(): Promise<void> {
    const paper = Math.floor(Math.random() * 101);
    const plastic = Math.floor(Math.random() * 101);

    await set(ref(rtdb, "bins/paper/fillPercent"), paper);
    await set(ref(rtdb, "bins/plastic/fillPercent"), plastic);

    const types: WasteType[] = ["PAPER", "PLASTIC"];
    const type = types[Math.floor(Math.random() * types.length)];

    await push(ref(rtdb, "logs"), {
      type,
      confidence: Number((0.7 + Math.random() * 0.29).toFixed(2)),
      timestamp: Date.now(),
    });
  },
};
