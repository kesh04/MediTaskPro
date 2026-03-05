import axiosInstance from "./axiosInstance";
import { Todo, CreateTodoPayload, UpdateTodoPayload } from "../store/todoSlice";

const ENDPOINT = "/todo";

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    const response = await axiosInstance.get<Todo[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await axiosInstance.get<Todo>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const response = await axiosInstance.post<Todo>(ENDPOINT, payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
    const response = await axiosInstance.put<Todo>(
      `${ENDPOINT}/${id}`,
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  },
};
