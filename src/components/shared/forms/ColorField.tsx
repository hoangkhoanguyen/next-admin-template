"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  Input,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  Button,
} from "@/components/ui";

export function ColorField({ field }: { field: FieldConfig }) {
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
              <div className="flex items-center gap-2">
                <Input
                  {...controllerField}
                  value={controllerField.value ?? "#000000"}
                  type="color"
                  placeholder={field.placeholder}
                  aria-invalid={!!fieldState.error}
                  className="h-10 w-20 p-1 cursor-pointer"
                />
                <Input
                  value={controllerField.value ?? "#000000"}
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  type="text"
                  placeholder="#000000"
                  className="flex-1"
                  aria-invalid={!!fieldState.error}
                />
              </div>
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
