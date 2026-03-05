import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Spacing, Typography } from "../constants/theme";

interface Props {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

const NetworkErrorBanner: React.FC<Props> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.error }]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  icon: { fontSize: 16 },
  message: { flex: 1, color: "#fff", ...Typography.body2 },
  actions: { flexDirection: "row", gap: Spacing.sm, alignItems: "center" },
  btn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  btnText: { color: "#fff", ...Typography.label, fontWeight: "700" },
  dismissBtn: { padding: 4 },
  dismissText: { color: "#fff", fontSize: 14 },
});

export default NetworkErrorBanner;
