import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Controller, useFormContext } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

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
            <FieldLabel htmlFor={field.name}>
              {field.label}
            </FieldLabel>
          )}
          <ImageUploader
            value={controllerField.value}
            onChange={controllerField.onChange}
            label={field.placeholder || "Chọn ảnh"}
            isMulti={field.isMulti}
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
