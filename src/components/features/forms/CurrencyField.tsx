"use client";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Button,
} from "@/components/ui";

export function CurrencyField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const unit = field.unit ?? "₫";

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
                  step={0.01}
                />
                <InputGroupAddon>{unit}</InputGroupAddon>
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
