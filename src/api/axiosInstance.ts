import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "../constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API REQUEST ERROR]", error.message);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    let message = "Something went wrong. Please try again.";

    if (!error.response) {
      message = "Network error. Please check your internet connection.";
    } else if (status === 400) {
      message = "Bad request. Please check your input.";
    } else if (status === 404) {
      message = "Resource not found.";
    } else if (status === 500) {
      message = "Server error. Please try again later.";
    } else if (status === 408 || error.code === "ECONNABORTED") {
      message = "Request timed out. Please try again.";
    }

    console.error(`[API RESPONSE ERROR] ${status ?? "NETWORK"}: ${message}`);
    return Promise.reject({ ...error, friendlyMessage: message });
  },
);

export default axiosInstance;
