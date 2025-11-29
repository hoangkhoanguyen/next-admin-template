"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { DynamicField } from "./DynamicField";
import { GroupField } from "./GroupField";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

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
      <label className="block font-medium mb-2">{field.label}</label>

      {items.map((item, idx) => {
        // const nestedFields = field.fields?.map((subField) => ({
        //   ...subField,
        //   name: `${field.name}.${idx}.${subField.name}`,
        // })) as FieldConfig[] | undefined;

        // Determine item label: arrayConfig.itemLabel > customUI.itemHeader > default
        const itemLabel: string =
          typeof field.arrayConfig?.itemLabel === "function"
            ? field.arrayConfig.itemLabel(item, idx)
            : `${field.arrayConfig?.itemLabel} #${idx + 1}`;

        // if (field.arrayConfig?.itemLabel) {
        //   if (typeof field.arrayConfig.itemLabel === "function") {
        //     itemLabel = field.arrayConfig.itemLabel(item, idx);
        //   } else {
        //     itemLabel = String(field.arrayConfig.itemLabel);
        //   }
        // } else if (field.customUI?.itemHeader) {
        //   itemLabel = String(field.customUI.itemHeader(item, idx));
        // }

        // Setup actions for array item (delete button)
        const actions: React.ReactNode[] = [];

        if (field.arrayConfig?.actions?.includes("remove")) {
          actions.push(
            <Button
              type="button"
              size="icon-sm"
              variant="destructive"
              aria-label="Xóa"
              onClick={() => remove(idx)}
            >
              <Trash />
            </Button>
          );
        }

        const groupField: FieldConfig = {
          ...field,
          name: `${field.name}.${idx}`,
          type: "group",
          label: itemLabel,
          customUI: {
            ...field.customUI,
            actions,
          },
        };

        return (
          <div key={item[field.arrayConfig?.keyName || "id"]} className="mb-4">
            <GroupField field={groupField} />
          </div>
        );
      })}

      <div className="mt-2">
        <Button
          type="button"
          variant={"outline"}
          className="w-full"
          onClick={handleAppend}
        >
          <Plus />
          Thêm
        </Button>
      </div>
    </div>
  );
}
