import { fullDemoFormConfig } from "@/mock/fullDemoFormConfig";
import { Container } from "@/components/shared/layout/Container";
import Header from "@/components/shared/layout/Header";
import DynamicFormProvider from "@/components/shared/forms/DynamicFormProvider";
import SubmitButton from "./SubmitButton";

export default function FullDemoDynamicFormPage() {
  return (
    <>
      <Header />
      <Container className="py-6 @container">
        <h1 className="text-2xl font-bold mb-4">Full Demo Dynamic Form</h1>
        <DynamicFormProvider fields={fullDemoFormConfig}>
          <SubmitButton />
        </DynamicFormProvider>
      </Container>
    </>
  );
}
