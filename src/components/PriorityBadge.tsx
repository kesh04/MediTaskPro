import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Priority } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Typography } from "../constants/theme";

interface Props {
  priority: Priority;
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const { colors } = useTheme();

  const colorMap: Record<Priority, string> = {
    [Priority.LOW]: colors.priorityLow,
    [Priority.MEDIUM]: colors.priorityMedium,
    [Priority.HIGH]: colors.priorityHigh,
  };

  const color = colorMap[priority];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}22`, borderColor: color },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    ...Typography.caption,
    fontWeight: "600",
  },
});

export default PriorityBadge;
