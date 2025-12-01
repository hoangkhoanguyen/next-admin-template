import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel, DatePicker } from "@/components/ui";

export function DatePickerField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue ?? undefined}
      render={({ field: controllerField, fieldState }) => (
        <Field>
          {field.label && (
            <FieldLabel htmlFor={field.name} className="mb-2 block">
              {field.label}
            </FieldLabel>
          )}
          <DatePicker
            value={controllerField.value}
            onChange={controllerField.onChange}
            placeholder={field.placeholder}
          />
          <FieldError
            errors={
              fieldState.error?.message
                ? [{ message: String(fieldState.error.message) }]
                : undefined
            }
          />
        </Field>
      )}
    />
  );
}
