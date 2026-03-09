import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { taskSchema, TaskFormValues } from "../utils/validation";
import { Priority, TaskStatus } from "../constants";
import { useTodos } from "../hooks/useTodos";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Shadows, Spacing, Typography } from "../constants/theme";
import { RootStackParamList } from "../navigation";

import FormInput from "../components/FormInput";
import PriorityPicker from "../components/PriorityPicker";
import LoadingSpinner from "../components/LoadingSpinner";

type RoutePropType = RouteProp<RootStackParamList, "AddEditTask">;

const AddEditTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
  const { addTodo, editTodo, submitting } = useTodos();

  const editingTodo = route.params?.todo;
  const isEditing = !!editingTodo;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: Priority.MEDIUM,
      status: TaskStatus.PENDING,
    },
  });

  useEffect(() => {
    if (editingTodo) {
      setValue("title", editingTodo.title);
      setValue("description", editingTodo.description ?? "");
      setValue("priority", editingTodo.priority);
      setValue("status", editingTodo.status);
    }
  }, [editingTodo, setValue]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditing && editingTodo) {
        await editTodo(editingTodo.id, data);
        Toast.show({ type: "success", text1: "Task updated successfully ✅" });
      } else {
        await addTodo({
          title: data.title,
          description: data.description ?? "",
          priority: data.priority,
          status: data.status,
        });
        Toast.show({ type: "success", text1: "Task created successfully 🎉" });
      }
      navigation.goBack();
    } catch {
      Toast.show({
        type: "error",
        text1: "Failed to save task. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
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
            {isEditing ? "Edit Task" : "New Task"}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface },
              Shadows.md,
            ]}
          >
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Task Information
            </Text>

            <FormInput<TaskFormValues>
              name="title"
              control={control}
              label="Title *"
              placeholder="e.g., Review patient records"
              error={errors.title?.message}
              autoCapitalize="sentences"
              returnKeyType="next"
            />

            <FormInput<TaskFormValues>
              name="description"
              control={control}
              label="Description"
              placeholder="Add more details about this task..."
              error={errors.description?.message}
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: "top" }}
              returnKeyType="done"
            />

            <Controller
              control={control}
              name="priority"
              render={({ field: { value, onChange } }) => (
                <PriorityPicker
                  value={value}
                  onChange={onChange}
                  error={errors.priority?.message}
                />
              )}
            />

            {isEditing && (
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.statusRow}>
                    <Text style={[styles.statusLabel, { color: colors.text }]}>
                      Status
                    </Text>
                    <View style={styles.statusBtns}>
                      {[TaskStatus.PENDING, TaskStatus.COMPLETED].map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.statusBtn,
                            {
                              backgroundColor:
                                value === s
                                  ? colors.primary
                                  : colors.surfaceVariant,
                              borderColor:
                                value === s ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => onChange(s)}
                        >
                          <Text
                            style={[
                              styles.statusBtnText,
                              {
                                color:
                                  value === s ? "#fff" : colors.textSecondary,
                              },
                            ]}
                          >
                            {s === TaskStatus.PENDING ? "⏳ " : "✅ "}
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: submitting ? colors.secondary : colors.primary,
              },
              Shadows.md,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <LoadingSpinner message="" />
            ) : (
              <Text style={styles.submitText}>
                {isEditing ? "💾  Save Changes" : "➕  Create Task"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backText: { ...Typography.body1, fontWeight: "600" },
  headerTitle: { ...Typography.h3 },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
    fontWeight: "600",
  },
  statusRow: { marginBottom: Spacing.md },
  statusLabel: { ...Typography.label, fontWeight: "600", marginBottom: 8 },
  statusBtns: { flexDirection: "row", gap: Spacing.sm },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  statusBtnText: { ...Typography.label, fontWeight: "600" },
  submitBtn: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: Spacing.sm,
    minHeight: 54,
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    ...Typography.h4,
    fontWeight: "700",
  },
  cancelBtn: { alignItems: "center", paddingVertical: Spacing.md },
  cancelText: { ...Typography.body1 },
});

export default AddEditTaskScreen;
