"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { SelectSingle } from "@/components/ui/select-single";
import { Field, FieldLabel, FieldError } from "@/components/ui";

export function SelectSingleField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  if (!field.options) {
    console.warn(`SelectSingleField: field "${field.name}" missing options`);
    return null;
  }

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <SelectSingle
              options={field.options || []}
              value={controllerField.value ?? null}
              onChange={(value) => controllerField.onChange(value)}
              placeholder={field.placeholder}
              onAddNewOption={field.onAddNewOption}
              isInvalid={!!fieldState.error}
              disabled={field.disabled}
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
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
    </Field>
  );
}
