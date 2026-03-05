import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Spacing, Typography } from "../constants/theme";

interface Props {
  title?: string;
  subtitle?: string;
  emoji?: string;
}

const EmptyState: React.FC<Props> = ({
  title = "No tasks yet",
  subtitle = "Tap the + button to add your first task",
  emoji = "📋",
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  emoji: { fontSize: 56, marginBottom: Spacing.md },
  title: { ...Typography.h3, textAlign: "center", marginBottom: Spacing.xs },
  subtitle: { ...Typography.body2, textAlign: "center" },
});

export default EmptyState;
