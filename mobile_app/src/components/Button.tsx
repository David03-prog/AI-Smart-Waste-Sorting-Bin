import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          variant === "outline" && styles.outlineText,
          variant === "ghost" && styles.ghostText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { alignSelf: "stretch" },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: "#000" },
  primaryText: { color: "#fff", fontWeight: "700" },

  outline: { borderWidth: 2, borderColor: "#e5e7eb", backgroundColor: "transparent" },
  outlineText: { color: "#374151", fontWeight: "700" },

  ghost: { backgroundColor: "transparent" },
  ghostText: { color: "#6b7280", fontWeight: "700" },

  text: { fontSize: 15 },
});
