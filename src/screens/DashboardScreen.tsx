import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTodos } from "../hooks/useTodos";
import { useTheme } from "../hooks/useTheme";
import { Shadows, Spacing, Typography } from "../constants/theme";
import { DOCTOR_NAME } from "../constants";
import { getGreeting, getTodayString } from "../utils/helpers";
import { Todo } from "../store/todoSlice";
import { TaskStatus } from "../constants";
import { RootStackParamList } from "../navigation";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import FilterTabs from "../components/FilterTabs";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import NetworkErrorBanner from "../components/NetworkErrorBanner";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const {
    todos,
    loading,
    error,
    searchQuery,
    filterStatus,
    stats,
    loadTodos,
    removeTodo,
    toggleStatus,
    search,
    filter,
    dismissError,
  } = useTodos();

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleDelete = useCallback(
    async (id: string) => {
      await removeTodo(id);
      Toast.show({ type: "success", text1: "Task deleted" });
    },
    [removeTodo],
  );

  const handleToggle = useCallback(
    async (id: string, status: TaskStatus) => {
      await toggleStatus(id, status);
      Toast.show({
        type: "success",
        text1:
          status === TaskStatus.COMPLETED
            ? "Task marked as pending"
            : "Task completed! 🎉",
      });
    },
    [toggleStatus],
  );

  const handlePressTask = useCallback(
    (todo: Todo) => {
      navigation.navigate("TaskDetail", { todo });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <TaskCard
        todo={item}
        onPress={() => handlePressTask(item)}
        onDelete={handleDelete}
        onToggleStatus={handleToggle}
      />
    ),
    [handlePressTask, handleDelete, handleToggle],
  );

  const keyExtractor = (item: Todo) => item.id;

  const ListHeader = (
    <>
      {error && (
        <NetworkErrorBanner
          message={error}
          onRetry={loadTodos}
          onDismiss={dismissError}
        />
      )}

      <View
        style={[styles.header, { backgroundColor: colors.surface }, Shadows.sm]}
      >
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.doctorName, { color: colors.text }]}>
            {DOCTOR_NAME}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {getTodayString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.settingsBtn,
            { backgroundColor: colors.surfaceVariant },
          ]}
          onPress={() => {}}
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Total"
          value={stats.total}
          emoji="📋"
          color={colors.primary}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          emoji="⏳"
          color={colors.priorityMedium}
        />
        <StatCard
          label="Done"
          value={stats.completed}
          emoji="✅"
          color={colors.priorityLow}
        />
      </View>

      <View
        style={[
          styles.progressCard,
          { backgroundColor: colors.surface },
          Shadows.sm,
        ]}
      >
        <ProgressBar
          progress={stats.progress}
          completed={stats.completed}
          total={stats.total}
        />
      </View>

      <SearchBar value={searchQuery} onChangeText={search} />

      <FilterTabs selected={filterStatus} onSelect={filter} />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {filterStatus === "All" ? "All Tasks" : `${filterStatus} Tasks`}
        </Text>
        <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
          {todos.length} item{todos.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </>
  );

  if (loading && todos.length === 0) {
    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: colors.background }]}
      >
        <LoadingSpinner message="Loading tasks..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={
          colors.background === "#111827" ? "light-content" : "dark-content"
        }
        backgroundColor={colors.background}
      />

      <FlatList
        data={todos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            emoji={searchQuery ? "🔍" : "📋"}
            title={searchQuery ? "No results found" : "No tasks yet"}
            subtitle={
              searchQuery
                ? "Try a different search term"
                : "Tap the + button to add your first task"
            }
          />
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTodos}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, Shadows.lg]}
        onPress={() => navigation.navigate("AddEditTask", {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  greeting: { ...Typography.body2 },
  doctorName: { ...Typography.h2, marginVertical: 2 },
  date: { ...Typography.caption },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  progressCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitle: { ...Typography.h4 },
  sectionCount: { ...Typography.caption },
  listContent: { paddingBottom: 100 },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "300",
  },
});

export default DashboardScreen;
