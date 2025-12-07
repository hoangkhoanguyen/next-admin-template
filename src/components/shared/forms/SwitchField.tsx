import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Controller, useFormContext } from "react-hook-form";
import { Label, Switch } from "@/components/ui";

export function SwitchField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue ?? false}
      render={({ field: controllerField }) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!controllerField.value}
            onCheckedChange={controllerField.onChange}
          />
          <Label>{field.label}</Label>
        </div>
      )}
    />
  );
}
