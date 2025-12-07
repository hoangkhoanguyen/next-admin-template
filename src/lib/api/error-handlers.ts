// src/lib/api/error-handlers.ts
import type { AxiosInstance } from "axios";
import { isTokenExpired } from "./utils";
import { logout, refreshToken } from "./endpoints/auth";

let refreshTokenPromise: Promise<any> | null = null;

/**
 * Handle 401 error: refresh token if expired, otherwise logout
 */
export async function handle401Error(error: any, apiClient: AxiosInstance) {
  if (!isTokenExpired(error)) {
    await logout();
    window.location.reload();
    return;
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshToken();
  }

  await refreshTokenPromise;
  refreshTokenPromise = null;

  return apiClient.request(error.config);
}
