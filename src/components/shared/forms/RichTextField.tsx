"use client";

import { useFormContext, Controller } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FieldLabel } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field";

interface RichTextFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export function RichTextField({
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  minHeight,
  maxHeight,
}: RichTextFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="space-y-2">
      {label && (
        <FieldLabel htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RichTextEditor
            value={field.value || ""}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            minHeight={minHeight}
            maxHeight={maxHeight}
            className={errorMessage ? "border-destructive" : ""}
          />
        )}
      />

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
  );
}
