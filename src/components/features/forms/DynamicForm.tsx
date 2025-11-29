"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodObject } from "zod";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { DynamicField } from "./DynamicField";
import { Button } from "@/components/ui/button";

interface DynamicFormProps {
  fields: FieldConfig[];
  schema: ZodObject;
  onSubmit: (data: any) => void;
}

export function DynamicForm({ fields, schema, onSubmit }: DynamicFormProps) {
  const methods = useForm({ resolver: zodResolver(schema), mode: "onChange" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <DynamicField key={field.name} field={field} />
          ))}
        </div>
        <Button type="submit" className="mt-6">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
