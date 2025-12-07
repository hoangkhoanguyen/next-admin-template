// src/lib/api/client.ts
import axios from "axios";
import { handle401Error } from "./error-handlers";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      return handle401Error(error, apiClient);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
