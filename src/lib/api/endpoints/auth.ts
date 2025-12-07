// src/lib/api/endpoints/auth.ts
import apiClient from "../client";

// Refresh token API call
export async function refreshToken(): Promise<string> {
  const response = await apiClient.post("/auth/refresh-token");
  // Giả sử response trả về { accessToken: string }
  return response.data.accessToken;
}

// Logout API call
export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
