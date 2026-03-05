import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Spacing, Typography } from "../constants/theme";

interface Props {
  message?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<Props> = ({
  message = "Loading...",
  overlay = false,
}) => {
  const { colors } = useTheme();

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.box, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: "center",
    gap: Spacing.md,
    minWidth: 140,
  },
  inline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  text: { ...Typography.body2, textAlign: "center" },
});

export default LoadingSpinner;
