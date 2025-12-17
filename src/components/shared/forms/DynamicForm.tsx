"use client";

import { DynamicField } from "./DynamicField";
import { ImagePickerDialogProvider } from "@/components/shared/image/ImagePickerDialogContext";
import { useDynamicFormContext } from "./DynamicFormProvider";

export function DynamicForm() {
  const { fields } = useDynamicFormContext();

  return (
    <ImagePickerDialogProvider>
      <div className={`grid grid-cols-4 gap-4`}>
        {fields.map((field, index) => (
          <DynamicField key={`${field.name}-${index}`} field={field} />
        ))}
      </div>
    </ImagePickerDialogProvider>
  );
}
