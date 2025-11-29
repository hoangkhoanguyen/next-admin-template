"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui";

export function TextareaField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <Textarea
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
