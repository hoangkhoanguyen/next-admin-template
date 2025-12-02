"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  Button,
} from "@/components/ui";
import { Slider } from "@/components/ui/slider";

export function SliderField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  return (
    <Field>
      <div className="flex items-center justify-between mb-2">
        <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <span className="text-sm font-medium text-muted-foreground">
              {controllerField.value ?? field.defaultValue ?? 0}
              {field.suffix}
            </span>
          )}
        />
      </div>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <Slider
                value={[controllerField.value ?? field.defaultValue ?? 0]}
                onValueChange={(vals: number[]) =>
                  controllerField.onChange(vals[0])
                }
                min={(field.customUI?.min as number) ?? 0}
                max={(field.customUI?.max as number) ?? 100}
                step={(field.customUI?.step as number) ?? 1}
                disabled={field.disabled}
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
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
          </>
        )}
      />
    </Field>
  );
}
