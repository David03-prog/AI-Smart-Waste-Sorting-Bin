import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FileText, Coffee } from "lucide-react-native";
import { WasteLog } from "../types";

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function labelForType(type: WasteLog["type"]) {
  return type === "PAPER" ? "Paper Waste" : "Plastic Waste";
}

export function WasteLogs({
  logs,
  showHeader = true,
}: {
  logs: WasteLog[];
  showHeader?: boolean;
}) {
  return (
    <View>
      {showHeader ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>Live Activity</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      ) : null}

      <View style={{ gap: 12 }}>
        {logs.map((log) => {
          const isPaper = log.type === "PAPER";
          const Icon = isPaper ? FileText : Coffee;

          return (
            <View key={log.id} style={styles.card}>
              <View style={[styles.iconWrap, isPaper ? styles.paperBg : styles.plasticBg]}>
                <Icon color={isPaper ? "#2563eb" : "#f97316"} size={18} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{labelForType(log.type)}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>🕒 {formatTime(log.timestamp)}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <View style={[styles.badge, isPaper ? styles.badgePaper : styles.badgePlastic]}>
                  <Text style={[styles.badgeText, isPaper ? styles.badgeTextPaper : styles.badgeTextPlastic]}>
                    {log.type}
                  </Text>
                </View>
                <Text style={styles.conf}>{Math.round(log.confidence * 100)}% Conf.</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#111827" },
  liveBadge: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  paperBg: { backgroundColor: "#eff6ff" },
  plasticBg: { backgroundColor: "#fff7ed" },

  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  metaRow: { marginTop: 4 },
  metaText: { fontSize: 12, fontWeight: "700", color: "#9ca3af" },

  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgePaper: { backgroundColor: "#dbeafe" },
  badgePlastic: { backgroundColor: "#ffedd5" },

  badgeText: { fontSize: 12, fontWeight: "900" },
  badgeTextPaper: { color: "#2563eb" },
  badgeTextPlastic: { color: "#f97316" },

  conf: { marginTop: 6, fontSize: 12, fontWeight: "800", color: "#9ca3af" },
});
