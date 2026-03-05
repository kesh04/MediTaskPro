import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  setSearchQuery,
  setFilterStatus,
  clearError,
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../store/todoSlice";
import { TaskStatus } from "../constants";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, submitting, error, searchQuery, filterStatus } =
    useAppSelector((state) => state.todos);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filterStatus !== "All") {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [todos, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;
    const pending = total - completed;
    const progress = total > 0 ? completed / total : 0;
    return { total, completed, pending, progress };
  }, [todos]);

  const loadTodos = useCallback(() => dispatch(fetchTodos()), [dispatch]);

  const addTodo = useCallback(
    (payload: CreateTodoPayload) => dispatch(createTodo(payload)),
    [dispatch],
  );

  const editTodo = useCallback(
    (id: string, payload: UpdateTodoPayload) =>
      dispatch(updateTodo({ id, payload })),
    [dispatch],
  );

  const removeTodo = useCallback(
    (id: string) => dispatch(deleteTodo(id)),
    [dispatch],
  );

  const toggleStatus = useCallback(
    (id: string, currentStatus: TaskStatus) =>
      dispatch(toggleTodoStatus({ id, currentStatus })),
    [dispatch],
  );

  const search = useCallback(
    (q: string) => dispatch(setSearchQuery(q)),
    [dispatch],
  );

  const filter = useCallback(
    (status: TaskStatus | "All") => dispatch(setFilterStatus(status)),
    [dispatch],
  );

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    loading,
    submitting,
    error,
    searchQuery,
    filterStatus,
    stats,
    loadTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleStatus,
    search,
    filter,
    dismissError,
  };
};
