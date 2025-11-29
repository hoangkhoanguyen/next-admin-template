import { z, ZodObject, ZodTypeAny } from "zod";
import type { FieldConfig } from "../types/dynamic-form.types";

/**
 * Tự động generate Zod schema từ mảng FieldConfig
 */
export function generateFormSchema(fields: FieldConfig[]): ZodObject {
  function getFieldSchema(field: FieldConfig): ZodTypeAny {
    if (field.zodSchema) return field.zodSchema;
    if (field.type === "array" && field.fields) {
      // Mỗi item là object gồm các field con
      return z.array(generateFormSchema(field.fields));
    }
    if (field.type === "group" && field.fields) {
      // Nhóm các field con thành object
      return generateFormSchema(field.fields);
    }
    return z.unknown();
  }

  const shape: Record<string, ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.name] = getFieldSchema(field);
  }
  return z.object(shape);
}
