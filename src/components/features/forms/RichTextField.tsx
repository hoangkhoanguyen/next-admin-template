"use client";

import * as React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
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
  showPreview?: boolean;
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
  showPreview = true,
}: RichTextFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const htmlValue = useWatch({ control, name }) as string | undefined;

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
      {showPreview && (
        <div className="mt-3 border rounded-md">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/40">
            Preview (rendered HTML)
          </div>
          <div
            className="px-3 py-3 prose prose-sm max-w-none"
            // Note: This renders trusted admin input. Sanitize if needed.
            dangerouslySetInnerHTML={{ __html: htmlValue || "" }}
          />
        </div>
      )}

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
  );
}
