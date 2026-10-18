import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Bell, LogOut, User as UserIcon, Zap } from "lucide-react-native";
import { UserProfile, BinStatus, WasteLog } from "../types";
import { firebaseService } from "../services/firebaseService";
import { FillLevelGraphic } from "./FillLevelGraphic";
import { WasteLogs } from "./WasteLogs";

export function Dashboard({
  user,
  onLogout,
}: {
  user: UserProfile;
  onLogout: () => void;
}) {
  const [binStatus, setBinStatus] = useState<BinStatus>({
    fillLevel: 0,
    lastUpdated: Date.now(),
    status: "OK",
    paperFill: 0,
    plasticFill: 0,
  });

  const [logs, setLogs] = useState<WasteLog[]>([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const unsubFill = firebaseService.subscribeToFillLevel(setBinStatus);
    const unsubLogs = firebaseService.subscribeToLogs(setLogs);

    return () => {
      unsubFill();
      unsubLogs();
    };
  }, []);

  const showDot = binStatus.fillLevel > 50;

  const handleLogout = async () => {
    try {
      await firebaseService.logout();
    } catch (e: any) {
      alert(e?.message ?? "Logout failed");
    } finally {
      onLogout();
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await firebaseService.simulateDataOnce();
    } catch (e: any) {
      alert(e?.message ?? "Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <UserIcon color="#4b5563" size={20} />
          </View>
          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>{user.name || "User"}</Text>
          </View>
        </View>

        <View style={styles.headerBtns}>
          <Pressable style={styles.iconBtn}>
            <Bell color="#4b5563" size={18} />
            {showDot ? <View style={styles.dot} /> : null}
          </Pressable>

          <Pressable style={[styles.iconBtn, styles.logoutBtn]} onPress={handleLogout}>
            <LogOut color="#ef4444" size={18} />
          </Pressable>
        </View>
      </View>

      {/* ONE Virtualized list for the whole screen */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Pressable
              style={[styles.simBtn, simulating && styles.simBtnDisabled]}
              onPress={handleSimulate}
              disabled={simulating}
            >
              <View style={styles.simRow}>
                <Zap color="#fff" size={16} />
                <Text style={styles.simBtnText}>
                  {simulating ? "Simulating..." : "Simulate Data"}
                </Text>
              </View>
            </Pressable>

            <View style={{ height: 12 }} />

            <FillLevelGraphic data={binStatus} />

            <View style={{ height: 18 }} />

            {/* WasteLogs expects full logs array; we will render it separately below */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Live Activity</Text>
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <WasteLogs logs={[item]} showHeader={false} />}

        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={{ paddingTop: 12 }}>
            <Text style={{ color: "#9ca3af", fontWeight: "600" }}>No activity detected yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  userRow: { flexDirection: "row", gap: 10, alignItems: "center" },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  hello: { fontSize: 12, color: "#9ca3af", fontWeight: "600" },
  name: { fontSize: 14, color: "#111827", fontWeight: "800" },

  headerBtns: { flexDirection: "row", gap: 10 },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  logoutBtn: { backgroundColor: "#fff1f2" },

  dot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#fff",
  },

  content: { padding: 18, paddingBottom: 24 },

  simBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  simBtnDisabled: { opacity: 0.6 },
  simRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  simBtnText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1f2937" },
  liveBadge: { backgroundColor: "#000", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  liveText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
