"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldLabel, FieldError } from "@/components/ui";

export function PasswordField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <PasswordInput
              {...controllerField}
              value={controllerField.value ?? ""}
              placeholder={field.placeholder}
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
    </Field>
  );
}
