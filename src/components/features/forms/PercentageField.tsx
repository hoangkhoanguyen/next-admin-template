"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui";

export function PercentageField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                {...controllerField}
                value={controllerField.value ?? ""}
                type="number"
                placeholder={field.placeholder}
                aria-invalid={!!fieldState.error}
                disabled={field.disabled}
                readOnly={field.readOnly}
                className={field.className}
                inputMode={field.inputMode || "decimal"}
                min={0}
                max={100}
                step={0.01}
              />
              {field.buttonAfter && (
                <button
                  type="button"
                  onClick={() =>
                    field.buttonAfter?.onClick?.(controllerField.value)
                  }
                >
                  {field.buttonAfter.label}
                </button>
              )}
            </div>
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
