"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Checkbox, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui";

export function CheckboxField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Field>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.defaultValue ?? false}
        render={({ field: controllerField, fieldState }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={!!controllerField.value}
              onCheckedChange={controllerField.onChange}
              disabled={field.disabled}
              {...(field.readOnly ? { readOnly: true } : {})}
            />
            <label htmlFor={field.name} className="cursor-pointer select-none text-sm">
              {field.label}
            </label>
            <FieldError
              errors={fieldState.error?.message ? [{ message: String(fieldState.error.message) }] : undefined}
            />
          </div>
        )}
      />
      {field.description && <FieldDescription>{field.description}</FieldDescription>}
    </Field>
  );
}
