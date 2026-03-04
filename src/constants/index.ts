export const API_BASE_URL =
  "https://60a21a08745cd70017576014.mockapi.io/api/v1";

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TaskStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
}

export const PRIORITY_OPTIONS = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

export const STATUS_OPTIONS = [TaskStatus.PENDING, TaskStatus.COMPLETED];

export const GREETINGS = {
  morning: "Good Morning",
  afternoon: "Good Afternoon",
  evening: "Good Evening",
};

export const DOCTOR_NAME = "Dr. Nimal";
