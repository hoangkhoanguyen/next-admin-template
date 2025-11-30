"use client";
import { fullDemoFormConfig } from "@/mock/fullDemoFormConfig";
import { generateFormSchema } from "@/lib/utils/form-schema-generator";
import { DynamicForm } from "@/components/features/forms/DynamicForm";
import dynamicFormInitialValues from "@/mock/dynamicFormInitialValues";

export default function FullDemoDynamicFormPage() {
  const schema = generateFormSchema(fullDemoFormConfig);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Full Demo Dynamic Form</h1>
      <DynamicForm
        fields={fullDemoFormConfig}
        schema={schema}
        initialValues={dynamicFormInitialValues}
        onSubmit={(data) => {
          console.log("Form data:", data);
        }}
      />
    </div>
  );
}
