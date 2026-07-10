import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hook to create an authenticated API client
export function useApiClient() {
  const { getToken } = useAuth();

  const authClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  authClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  authClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }
  );

  return authClient;
}

export type { AxiosInstance } from "axios";
