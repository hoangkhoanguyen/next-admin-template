import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Controller, useFormContext } from "react-hook-form";
import { FileUploader, Field, FieldLabel, FieldError } from "@/components/ui";

export function ImageUploaderField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue ?? null}
      render={({ field: controllerField, fieldState }) => (
        <Field>
          {field.label && (
            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          )}
          <FileUploader
            value={controllerField.value}
            onChange={controllerField.onChange}
            label={field.placeholder || "Chọn ảnh"}
            isMulti={field.isMulti}
            accept={field.accept || "image/*"}
          />
          <FieldError
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
