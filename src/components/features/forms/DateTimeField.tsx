"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Input,
} from "@/components/ui";

export function DateTimeField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.defaultValue ?? ""}
        render={({ field: controllerField, fieldState }) => (
          <>
            <Input
              type="datetime-local"
              id={field.name}
              value={controllerField.value ?? ""}
              onChange={controllerField.onChange}
              placeholder={field.placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={field.className}
              aria-invalid={!!fieldState.error}
            />
            <FieldError
              errors={
                fieldState.error?.message
                  ? [{ message: String(fieldState.error.message) }]
                  : undefined
              }
            />
          </>
        )}
      />
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  );
}
