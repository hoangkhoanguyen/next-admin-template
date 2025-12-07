import { z } from "zod";
import { DynamicForm } from "../DynamicForm";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

const numberField: FieldConfig = {
  name: "quantity",
  type: "number",
  label: "Quantity",
  placeholder: "Enter a number",
  description: "Số lượng sản phẩm",
  defaultValue: 1,
  inputMode: "numeric",
};

const schema = z.object({
  quantity: z.number().min(0, "Phải lớn hơn hoặc bằng 0"),
});

export default function NumberFieldDemo() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <DynamicForm
        fields={[numberField]}
        schema={schema}
        initialValues={{ quantity: 1 }}
        onSubmit={(data) => alert(JSON.stringify(data))}
      />
    </div>
  );
}
