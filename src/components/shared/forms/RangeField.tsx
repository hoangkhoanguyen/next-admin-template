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

export function RangeField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  return (
    <Field>
      <div className="flex items-center justify-between mb-2">
        <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            const value = controllerField.value ?? { from: 0, to: 100 };
            return (
              <span className="text-sm font-medium text-muted-foreground">
                {value.from} - {value.to}
                {field.suffix}
              </span>
            );
          }}
        />
      </div>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => {
          const value = controllerField.value ??
            field.defaultValue ?? { from: 0, to: 100 };

          return (
            <>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <Slider
                  value={[value.from, value.to]}
                  onValueChange={(vals) =>
                    controllerField.onChange({ from: vals[0], to: vals[1] })
                  }
                  min={(field.customUI?.min as number) ?? 0}
                  max={(field.customUI?.max as number) ?? 100}
                  step={(field.customUI?.step as number) ?? 1}
                  disabled={field.disabled}
                  aria-invalid={!!fieldState.error}
                  minStepsBetweenThumbs={1}
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
          );
        }}
      />
    </Field>
  );
}
