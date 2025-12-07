// src/lib/api/zodSafeParse.ts
import { ZodType } from "zod";

/**
 * Helper: parse data with Zod schema, return null if invalid
 */
export function zodSafeParse<T>(
  schema: ZodType<T>,
  data: unknown,
  defaultData: T
): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultData;
}
