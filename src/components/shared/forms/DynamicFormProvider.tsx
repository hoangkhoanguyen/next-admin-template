"use client";

import { FieldConfig } from "@/lib/types";
import { generateFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DynamicForm } from "./DynamicForm";

const Context = createContext<{
  methods: ReturnType<typeof useForm>;
  isDirty: boolean;
  handleSubmit: ReturnType<typeof useForm>["handleSubmit"];
  fields: FieldConfig[];
} | null>(null);

const DynamicFormProvider = ({
  children,
  fields,
  initialValues,
}: PropsWithChildren<{
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
}>) => {
  const schema = useMemo(() => generateFormSchema(fields), [fields]);

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: structuredClone(initialValues),
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  return (
    <Context.Provider
      value={{
        methods,
        isDirty,
        handleSubmit,
        fields,
      }}
    >
      <FormProvider {...methods}>
        <DynamicForm />
        {children}
      </FormProvider>
    </Context.Provider>
  );
};

export default DynamicFormProvider;

export const useDynamicFormContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useDynamicFormContext must be used within a DynamicFormProvider"
    );
  }
  return context;
};
