import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTodos } from "../hooks/useTodos";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Shadows, Spacing, Typography } from "../constants/theme";
import { TaskStatus } from "../constants";
import { formatDate } from "../utils/helpers";
import { RootStackParamList } from "../navigation";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RoutePropType = RouteProp<RootStackParamList, "TaskDetail">;
type NavProp = NativeStackNavigationProp<RootStackParamList, "TaskDetail">;

const TaskDetailScreen: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const { removeTodo, toggleStatus, submitting } = useTodos();
  const [todo, setTodo] = useState(route.params.todo);

  const handleToggle = useCallback(async () => {
    try {
      const newStatus =
        todo.status === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;
      await toggleStatus(todo.id, todo.status);
      setTodo((prev) => ({ ...prev, status: newStatus }));
      Toast.show({
        type: "success",
        text1:
          newStatus === TaskStatus.COMPLETED
            ? "Task completed! 🎉"
            : "Task marked as pending",
      });
    } catch {
      Toast.show({ type: "error", text1: "Failed to update status" });
    }
  }, [todo, toggleStatus]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${todo.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTodo(todo.id);
              Toast.show({ type: "success", text1: "Task deleted" });
              navigation.goBack();
            } catch {
              Toast.show({ type: "error", text1: "Failed to delete task" });
            }
          },
        },
      ],
    );
  }, [todo.id, todo.title, removeTodo, navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate("AddEditTask", { todo });
  }, [navigation, todo]);

  const isCompleted = todo.status === TaskStatus.COMPLETED;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {submitting && <LoadingSpinner overlay message="Saving..." />}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Task Detail
        </Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.stripeBanner,
            {
              backgroundColor:
                todo.priority === "High"
                  ? colors.priorityHigh
                  : todo.priority === "Medium"
                    ? colors.priorityMedium
                    : colors.priorityLow,
            },
          ]}
        >
          <Text style={styles.stripeText}>{todo.priority} Priority</Text>
        </View>

        <View
          style={[styles.card, { backgroundColor: colors.surface }, Shadows.md]}
        >
          <Text
            style={[
              styles.title,
              { color: colors.text },
              isCompleted && styles.strikethrough,
            ]}
          >
            {todo.title}
          </Text>

          <View style={styles.badgeRow}>
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.descLabel, { color: colors.textSecondary }]}>
            Description
          </Text>
          <Text
            style={[
              styles.desc,
              { color: todo.description ? colors.text : colors.textMuted },
            ]}
          >
            {todo.description || "No description provided."}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
              Created
            </Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>
              {formatDate(todo.createdAt)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
              Task ID
            </Text>
            <Text style={[styles.metaValue, { color: colors.textMuted }]}>
              #{todo.id}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              backgroundColor: isCompleted
                ? colors.priorityMedium
                : colors.success,
            },
            Shadows.md,
          ]}
          onPress={handleToggle}
          activeOpacity={0.85}
        >
          <Text style={styles.toggleText}>
            {isCompleted ? "⏳  Mark as Pending" : "✅  Mark as Completed"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.editBtn,
            { backgroundColor: colors.primary },
            Shadows.md,
          ]}
          onPress={handleEdit}
          activeOpacity={0.85}
        >
          <Text style={styles.editBtnText}>✏️ Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: colors.danger }]}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Text style={[styles.deleteBtnText, { color: colors.danger }]}>
            🗑️ Delete Task
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {},
  backText: { ...Typography.body1, fontWeight: "600" },
  headerTitle: { ...Typography.h4, alignItems: "center", textAlign: "center" },
  editText: { ...Typography.body1, fontWeight: "600" },
  scroll: { paddingBottom: Spacing.xxl },
  stripeBanner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  stripeText: { color: "#fff", ...Typography.label, fontWeight: "700" },
  card: {
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  title: { ...Typography.h2, marginBottom: Spacing.md },
  strikethrough: { textDecorationLine: "line-through", opacity: 0.5 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: Spacing.md },
  divider: { height: 1, marginVertical: Spacing.md },
  descLabel: {
    ...Typography.label,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  desc: { ...Typography.body1, lineHeight: 26 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  metaLabel: { ...Typography.body2 },
  metaValue: { ...Typography.body2, fontWeight: "500" },
  toggleBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleText: { color: "#fff", ...Typography.h4, fontWeight: "700" },
  editBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", ...Typography.h4, fontWeight: "700" },
  deleteBtn: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  deleteBtnText: { ...Typography.h4, fontWeight: "700" },
});

export default TaskDetailScreen;
