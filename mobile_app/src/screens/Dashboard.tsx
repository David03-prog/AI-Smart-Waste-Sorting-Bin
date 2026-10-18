import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { onValue, ref, set } from "firebase/database";
import { rtdb } from "../services/firebase";

type Latest = {
  label?: string;
  confidence?: number;
  time?: number;
};

export default function Dashboard() {
  const [paper, setPaper] = useState<number>(0);
  const [plastic, setPlastic] = useState<number>(0);
  const [latest, setLatest] = useState<Latest>({});

  useEffect(() => {
    const paperRef = ref(rtdb, "bins/paper/fillPercent");
    const plasticRef = ref(rtdb, "bins/plastic/fillPercent");
    const latestRef = ref(rtdb, "classification/latest");

    const unsub1 = onValue(paperRef, (snap) => setPaper(Number(snap.val() ?? 0)));
    const unsub2 = onValue(plasticRef, (snap) => setPlastic(Number(snap.val() ?? 0)));
    const unsub3 = onValue(latestRef, (snap) => setLatest((snap.val() ?? {}) as Latest));

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  const pushTestData = async () => {
    const now = Date.now();
    await set(ref(rtdb, "bins/paper/fillPercent"), Math.floor(Math.random() * 101));
    await set(ref(rtdb, "bins/plastic/fillPercent"), Math.floor(Math.random() * 101));
    await set(ref(rtdb, "classification/latest"), {
      label: Math.random() > 0.5 ? "paper" : "plastic",
      confidence: Number((0.7 + Math.random() * 0.29).toFixed(2)),
      time: now,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>SmartBin Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Last classification</Text>
        <Text style={styles.value}>
          {latest?.label ?? "—"}{" "}
          {typeof latest?.confidence === "number" ? `(${latest.confidence.toFixed(2)})` : ""}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.label}>Paper bin</Text>
          <Text style={styles.value}>{paper}%</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.label}>Plastic bin</Text>
          <Text style={styles.value}>{plastic}%</Text>
        </View>
      </View>

      <Pressable style={styles.btn} onPress={pushTestData}>
        <Text style={styles.btnText}>Push Test Data</Text>
      </Pressable>

      <Text style={styles.hint}>
        Tap “Push Test Data”. If values change, Expo + Firebase RTDB is correctly connected.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0B1220", justifyContent: "center" },
  h1: { color: "white", fontSize: 24, fontWeight: "800", marginBottom: 14 },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  card: {
    backgroundColor: "#121A2B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#23314F",
  },
  kpi: {
    flex: 1,
    backgroundColor: "#121A2B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#23314F",
  },
  label: { color: "#9FB0D6", fontSize: 12, marginBottom: 6 },
  value: { color: "white", fontSize: 18, fontWeight: "800" },
  btn: {
    marginTop: 16,
    backgroundColor: "#12B3A8",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#071012", fontSize: 15, fontWeight: "800" },
  hint: { color: "#B8C3E0", fontSize: 12, marginTop: 10, lineHeight: 18 },
});
