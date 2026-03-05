import { GREETINGS } from "../constants";

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS.morning;
  if (hour < 17) return GREETINGS.afternoon;
  return GREETINGS.evening;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const truncate = (text: string, max = 60): string =>
  text.length > max ? `${text.slice(0, max)}...` : text;

export const toPercent = (value: number): string =>
  `${Math.round(value * 100)}%`;

export const getTodayString = (): string => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
