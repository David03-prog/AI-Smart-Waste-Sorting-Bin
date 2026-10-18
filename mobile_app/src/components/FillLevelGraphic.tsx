import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react-native";
import { BinStatus } from "../types";

export function FillLevelGraphic({ data }: { data: BinStatus }) {
  const fillLevel = data.fillLevel;

  let barColor = "#22c55e";
  let statusText = "Normal";
  let StatusIcon: any = CheckCircle;
  let statusColor = "#16a34a";
  let statusBg = "rgba(34,197,94,0.12)";

  if (fillLevel > 80) {
    barColor = "#ef4444";
    statusText = "Critical Fill";
    StatusIcon = AlertTriangle;
    statusColor = "#dc2626";
    statusBg = "rgba(239,68,68,0.12)";
  } else if (fillLevel > 50) {
    barColor = "#eab308";
    statusText = "Getting Full";
    StatusIcon = AlertTriangle;
    statusColor = "#ca8a04";
    statusBg = "rgba(234,179,8,0.12)";
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bin Capacity</Text>
        <View style={[styles.badge, { backgroundColor: statusBg }]}>
          <StatusIcon color={statusColor} size={14} />
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.binWrap}>
        <View style={[styles.liquid, { height: `${fillLevel}%`, backgroundColor: barColor }]} />
        <View style={styles.iconOverlay}>
          <Trash2 color="rgba(17,24,39,0.10)" size={84} />
        </View>

        <View style={styles.percentOverlay}>
          <View style={styles.percentBubble}>
            <Text style={styles.percentText}>{fillLevel}%</Text>
          </View>
        </View>

        <View style={styles.lines}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.line} />
          ))}
        </View>
      </View>

      <Text style={styles.updated}>Last updated: Just now</Text>
      {/* Optional: show per-bin values for Option B */}
      <Text style={styles.subLine}>
        Paper: {data.paperFill ?? 0}% • Plastic: {data.plasticFill ?? 0}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "800", color: "#1f2937" },
  badge: { flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignItems: "center" },
  badgeText: { fontSize: 13, fontWeight: "700" },

  binWrap: {
    height: 260,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  liquid: { width: "100%" },
  iconOverlay: { position: "absolute", inset: 0 as any, alignItems: "center", justifyContent: "center" },
  percentOverlay: { position: "absolute", inset: 0 as any, alignItems: "center", justifyContent: "center" },
  percentBubble: {
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  percentText: { fontSize: 28, fontWeight: "900", color: "#1f2937" },

  lines: { position: "absolute", right: 10, top: 12, bottom: 12, justifyContent: "space-between", opacity: 0.25 },
  line: { width: 10, height: 2, backgroundColor: "#6b7280", borderRadius: 2 },

  updated: { marginTop: 12, fontSize: 12, color: "#9ca3af", fontWeight: "700", textAlign: "center" },
  subLine: { marginTop: 6, fontSize: 12, color: "#9ca3af", textAlign: "center" },
});
