"use client";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { DynamicField } from "./DynamicField";
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from "lucide-react";
import { FieldError, FieldLabel } from "@/components/ui";
import { GroupField } from "./GroupField";

export function ArrayField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: field.name,
    keyName: field.arrayConfig?.keyName,
  });

  const handleAppend = () => {
    const defaultVal = field.arrayConfig?.itemDefaultValue ?? {};
    append(defaultVal as any);
  };

  return (
    <div>
      <FieldLabel className="block font-medium mb-2">{field.label}</FieldLabel>

      {/* Hiển thị lỗi array-level */}
      <Controller
        control={control}
        name={field.name}
        render={({ fieldState: { error } }) => {
          return (
            <>
              {error?.message ? (
                <FieldError>{String(error.message)}</FieldError>
              ) : null}
            </>
          );
        }}
      />

      {items.map((item: any, idx: number) => {
        const itemLabel: string =
          typeof field.arrayConfig?.itemLabel === "function"
            ? field.arrayConfig.itemLabel(item, idx)
            : `${field.arrayConfig?.itemLabel} #${idx + 1}`;

        const actions: React.ReactNode[] = [];
        if (field.arrayConfig?.actions?.includes("remove")) {
          actions.push(
            <Button
              type="button"
              size="icon-sm"
              variant="destructive"
              onClick={() => remove(idx)}
              key={`remove-${idx}`}
            >
              <X size={16} />
            </Button>
          );
        }

        return (
          <GroupField
            key={item[field.arrayConfig?.keyName ?? "id"]}
            field={{
              type: "group",
              name: `${field.name}.${idx}`,
              label: itemLabel,
              customUI: {
                actions: actions,
              },
              fields: field.fields,
            }}
          />
        );
      })}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleAppend}
        className="mt-2 w-full"
      >
        <Plus size={16} className="mr-1" /> Thêm
      </Button>
    </div>
  );
}
