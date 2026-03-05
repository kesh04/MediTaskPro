import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Shadows, Spacing, Typography } from "../constants/theme";
import { Todo } from "../store/todoSlice";
import { TaskStatus } from "../constants";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { formatDate, truncate } from "../utils/helpers";

interface Props {
  todo: Todo;
  onPress: () => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<Props> = ({
  todo,
  onPress,
  onDelete,
  onToggleStatus,
}) => {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(todo.id),
        },
      ],
    );
  }, [todo.id, todo.title, onDelete]);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.8],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity
        style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        onPress={handleDelete}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ scale }], alignItems: "center" }}>
          <Text style={styles.deleteActionIcon}>🗑️</Text>
          <Text style={styles.deleteActionLabel}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      {/* Visible card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface }, Shadows.md]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Left stripe by priority */}
        <View
          style={[
            styles.stripe,
            {
              backgroundColor:
                todo.priority === "High"
                  ? colors.priorityHigh
                  : todo.priority === "Medium"
                    ? colors.priorityMedium
                    : colors.priorityLow,
            },
          ]}
        />

        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                todo.status === TaskStatus.COMPLETED && styles.strikethrough,
              ]}
              numberOfLines={1}
            >
              {todo.title}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  borderColor:
                    todo.status === TaskStatus.COMPLETED
                      ? colors.success
                      : colors.border,
                  backgroundColor:
                    todo.status === TaskStatus.COMPLETED
                      ? colors.success
                      : "transparent",
                },
              ]}
              onPress={() => onToggleStatus(todo.id, todo.status)}
            >
              {todo.status === TaskStatus.COMPLETED && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Description */}
          {todo.description ? (
            <Text
              style={[styles.desc, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {truncate(todo.description, 80)}
            </Text>
          ) : null}

          {/* Footer row */}
          <View style={styles.footer}>
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDate(todo.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  deleteAction: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.xs,
  },
  deleteActionIcon: { fontSize: 22 },
  deleteActionLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  card: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  stripe: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h4,
    flex: 1,
    marginRight: Spacing.sm,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  desc: {
    ...Typography.body2,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  date: {
    ...Typography.caption,
    marginLeft: "auto",
  },
});

export default TaskCard;
