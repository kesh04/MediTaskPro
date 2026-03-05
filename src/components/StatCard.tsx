import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Shadows, Spacing, Typography } from "../constants/theme";

interface Props {
  label: string;
  value: number | string;
  emoji: string;
  color?: string;
}

const StatCard: React.FC<Props> = ({ label, value, emoji, color }) => {
  const { colors } = useTheme();
  const accent = color ?? colors.primary;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: `${accent}33` },
        Shadows.sm,
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  emoji: { fontSize: 22, marginBottom: 4 },
  value: { ...Typography.h2, marginBottom: 2 },
  label: { ...Typography.caption, textAlign: "center" },
});

export default StatCard;
