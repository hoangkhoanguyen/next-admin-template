import { z } from "zod";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

/**
 * Demo form config để test error states của select fields
 */
export const selectFieldsErrorTestConfig: FieldConfig[] = [
  {
    name: "requiredSelect",
    type: "select-single",
    label: "Required Select (Single)",
    placeholder: "Chọn một giá trị...",
    description: "Field này bắt buộc phải chọn",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
    zodSchema: z.string().min(1, "Vui lòng chọn một giá trị"),
  },
  {
    name: "requiredMultiSelect",
    type: "select-multi",
    label: "Required Multi-Select (Min 2)",
    placeholder: "Chọn ít nhất 2 giá trị...",
    description: "Phải chọn ít nhất 2 items",
    options: [
      { label: "React", value: "react" },
      { label: "Vue", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
      { label: "Next.js", value: "nextjs" },
    ],
    zodSchema: z.array(z.string()).min(2, "Phải chọn ít nhất 2 kỹ năng"),
  },
  {
    name: "optionalSelect",
    type: "select-single",
    label: "Optional Select",
    placeholder: "Tùy chọn...",
    description: "Field này không bắt buộc",
    options: [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
      { label: "C", value: "c" },
    ],
    zodSchema: z.string().optional(),
  },
  {
    name: "maxMultiSelect",
    type: "select-multi",
    label: "Max 3 Multi-Select",
    placeholder: "Chọn tối đa 3 giá trị...",
    description: "Chỉ được chọn tối đa 3 items",
    options: [
      { label: "Item 1", value: "item1" },
      { label: "Item 2", value: "item2" },
      { label: "Item 3", value: "item3" },
      { label: "Item 4", value: "item4" },
      { label: "Item 5", value: "item5" },
    ],
    zodSchema: z
      .array(z.string())
      .max(3, "Chỉ được chọn tối đa 3 items")
      .min(1, "Phải chọn ít nhất 1 item"),
  },
  {
    name: "disabledSelect",
    type: "select-single",
    label: "Disabled Select",
    placeholder: "Disabled...",
    description: "Field này bị disabled",
    options: [
      { label: "X", value: "x" },
      { label: "Y", value: "y" },
    ],
    disabled: true,
    defaultValue: "x",
    zodSchema: z.string().optional(),
  },
];

export const selectFieldsErrorTestInitialValues = {
  requiredSelect: "",
  requiredMultiSelect: [],
  optionalSelect: "",
  maxMultiSelect: [],
  disabledSelect: "x",
};
