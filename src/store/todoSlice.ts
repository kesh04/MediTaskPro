import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { todoService } from "../api/todoService";
import { Priority, TaskStatus } from "../constants";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
}

export type CreateTodoPayload = Omit<Todo, "id" | "createdAt">;
export type UpdateTodoPayload = Partial<CreateTodoPayload>;

interface TodoState {
  todos: Todo[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: TaskStatus | "All";
  lastFetched: number | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  submitting: false,
  error: null,
  searchQuery: "",
  filterStatus: "All",
  lastFetched: null,
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await todoService.getAll();
    } catch (err: unknown) {
      const error = err as { friendlyMessage?: string; message?: string };
      return rejectWithValue(
        error.friendlyMessage ?? error.message ?? "Failed to fetch tasks",
      );
    }
  },
);

export const createTodo = createAsyncThunk(
  "todos/create",
  async (payload: CreateTodoPayload, { rejectWithValue }) => {
    try {
      return await todoService.create(payload);
    } catch (err: unknown) {
      const error = err as { friendlyMessage?: string; message?: string };
      return rejectWithValue(
        error.friendlyMessage ?? error.message ?? "Failed to create task",
      );
    }
  },
);

export const updateTodo = createAsyncThunk(
  "todos/update",
  async (
    { id, payload }: { id: string; payload: UpdateTodoPayload },
    { rejectWithValue },
  ) => {
    try {
      return await todoService.update(id, payload);
    } catch (err: unknown) {
      const error = err as { friendlyMessage?: string; message?: string };
      return rejectWithValue(
        error.friendlyMessage ?? error.message ?? "Failed to update task",
      );
    }
  },
);

export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await todoService.delete(id);
      return id;
    } catch (err: unknown) {
      const error = err as { friendlyMessage?: string; message?: string };
      return rejectWithValue(
        error.friendlyMessage ?? error.message ?? "Failed to delete task",
      );
    }
  },
);

export const toggleTodoStatus = createAsyncThunk(
  "todos/toggleStatus",
  async (
    { id, currentStatus }: { id: string; currentStatus: TaskStatus },
    { rejectWithValue },
  ) => {
    try {
      const newStatus =
        currentStatus === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;
      return await todoService.update(id, { status: newStatus });
    } catch (err: unknown) {
      const error = err as { friendlyMessage?: string; message?: string };
      return rejectWithValue(
        error.friendlyMessage ?? error.message ?? "Failed to update status",
      );
    }
  },
);

//  Slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<TaskStatus | "All">) {
      state.filterStatus = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTodo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.submitting = false;
        state.todos.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateTodo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.todos[index] = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTodo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.submitting = false;
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(toggleTodoStatus.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.todos[index] = action.payload;
      })
      .addCase(toggleTodoStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setFilterStatus, clearError } =
  todoSlice.actions;
export default todoSlice.reducer;
