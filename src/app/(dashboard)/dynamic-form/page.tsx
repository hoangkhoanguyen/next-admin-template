"use client";
import { fullDemoFormConfig } from "@/mock/fullDemoFormConfig";
import { generateFormSchema } from "@/lib/utils";
import { DynamicForm } from "@/components/shared/forms/DynamicForm";
import dynamicFormInitialValues from "@/mock/dynamicFormInitialValues";
import { Container } from "@/components/shared/layout/Container";
import Header from "@/components/shared/layout/Header";

export default function FullDemoDynamicFormPage() {
  const schema = generateFormSchema(fullDemoFormConfig);

  return (
    <>
      <Header />
      <Container className="py-6 @container">
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
