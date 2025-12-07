"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Button,
} from "@/components/ui";

export function PercentageField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const suffix = field.suffix ?? "%";
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <InputGroup>
                <InputGroupInput
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
                <InputGroupAddon>{suffix}</InputGroupAddon>
              </InputGroup>
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
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  );
}
