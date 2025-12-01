"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { SelectSingle } from "@/components/ui/select-single";
import { Button } from "@/components/ui/button";
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
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <SelectSingle
                options={field.options || []}
                value={controllerField.value ?? null}
                onChange={(value) => controllerField.onChange(value)}
                placeholder={field.placeholder}
                onAddNewOption={field.onAddNewOption}
                isInvalid={!!fieldState.error}
                disabled={field.disabled}
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
