import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function RadioGroupField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue ?? ""}
      render={({ field: controllerField, fieldState }) => (
        <Field>
          {field.label && (
            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          )}
          <RadioGroup
            value={controllerField.value}
            onValueChange={controllerField.onChange}
            id={field.name}
          >
            {field.options?.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 mb-1"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${field.name}-${option.value}`}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError
            className="mt-1"
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
