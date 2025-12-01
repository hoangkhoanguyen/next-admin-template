import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

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
