"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { SelectMulti } from "@/components/ui/select-multi";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui";

export function SelectMultiField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  if (!field.options) {
    console.warn(`SelectMultiField: field "${field.name}" missing options`);
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
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <SelectMulti
                options={field.options || []}
                value={controllerField.value ?? []}
                onChange={(value) => controllerField.onChange(value)}
                onAddNewOption={field.onAddNewOption}
                isInvalid={!!fieldState.error}
                disabled={field.disabled}
                placeholder={field.placeholder}
              />
              {field.buttonAfter && (
                <Button
                  type="button"
                  variant={field.buttonAfter.variant ?? "default"}
                  onClick={() =>
                    field.buttonAfter?.onClick
                      ? field.buttonAfter.onClick(controllerField.value)
                      : undefined
                  }
                >
                  {field.buttonAfter.label}
                </Button>
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
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
    </Field>
  );
}
