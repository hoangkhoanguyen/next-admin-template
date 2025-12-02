"use client";
import { fullDemoFormConfig } from "@/mock/fullDemoFormConfig";
import { generateFormSchema } from "@/lib/utils/form-schema-generator";
import { DynamicForm } from "@/components/features/forms/DynamicForm";
import dynamicFormInitialValues from "@/mock/dynamicFormInitialValues";
import { Container } from "@/components/shared/Container";
import Header from "@/components/shared/Header";

export default function FullDemoDynamicFormPage() {
  const schema = generateFormSchema(fullDemoFormConfig);

  return (
    <>
      <Header />
      <Container className="py-6">
        <h1 className="text-2xl font-bold mb-4">Full Demo Dynamic Form</h1>
        <DynamicForm
          fields={fullDemoFormConfig}
          schema={schema}
          initialValues={dynamicFormInitialValues}
          onSubmit={(data) => {
            console.log("Form data:", data);
          }}
        />
      </Container>
    </>
  );
}
