import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TaskStatus } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Typography } from "../constants/theme";

interface Props {
  status: TaskStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const { colors } = useTheme();
  const isCompleted = status === TaskStatus.COMPLETED;
  const color = isCompleted ? colors.statusCompleted : colors.statusPending;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}22`, borderColor: color },
      ]}
    >
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    ...Typography.caption,
    fontWeight: "600",
  },
});

export default StatusBadge;
