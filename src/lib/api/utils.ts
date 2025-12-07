// src/lib/api/utils.ts

/**
 * Check if error is due to expired access token
 */
export function isTokenExpired(error: any): boolean {
  const code = error.response?.data?.code;
  return code === "TOKEN_EXPIRED" || code === 1 || code === 2 || code === 3;
}
