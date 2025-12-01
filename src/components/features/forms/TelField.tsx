"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui";
import { Button } from "@/components/ui/button";

export function TelField({ field }: { field: FieldConfig }) {
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
                type="tel"
                placeholder={field.placeholder}
                aria-invalid={!!fieldState.error}
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
    </Field>
  );
}
