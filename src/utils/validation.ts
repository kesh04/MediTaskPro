import * as Yup from "yup";
import { Priority, TaskStatus } from "../constants";

export const taskSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional()
    .default(""),
  priority: Yup.mixed<Priority>()
    .oneOf(Object.values(Priority), "Please select a valid priority")
    .required("Priority is required"),
  status: Yup.mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus))
    .required()
    .default(TaskStatus.PENDING),
});

export type TaskFormValues = Yup.InferType<typeof taskSchema>;
