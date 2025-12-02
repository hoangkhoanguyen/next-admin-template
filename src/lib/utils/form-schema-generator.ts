import { z, ZodObject, ZodTypeAny } from "zod";
import type { FieldConfig } from "../types/dynamic-form.types";

/**
 * Tự động generate Zod schema từ mảng FieldConfig
 */
export function generateFormSchema(fields: FieldConfig[]): ZodObject {
  function getFieldSchema(field: FieldConfig): ZodTypeAny {
    if (field.type === "spacer") return undefined;
    if (field.zodSchema) return field.zodSchema;
    if (field.type === "array" && field.fields) {
      // Mỗi item là object gồm các field con
      const arrSchema = z.array(generateFormSchema(field.fields));

      return field.arrayConfig?.arraySchema
        ? field.arrayConfig.arraySchema(arrSchema)
        : arrSchema;
    }
    if (field.type === "group" && field.fields) {
      // Nhóm các field con thành object
      return generateFormSchema(field.fields);
    }
    return z.unknown();
  }

  const shape: Record<string, ZodTypeAny> = {};
  for (const field of fields) {
    if (field.type === "spacer") continue;
    shape[field.name] = getFieldSchema(field);
  }
  return z.object(shape);
}
