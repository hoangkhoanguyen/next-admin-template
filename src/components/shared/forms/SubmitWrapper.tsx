"use client";

import { Button } from "@/components/ui";
import { useDynamicFormContext } from "./DynamicFormProvider";
import { Slot } from "@radix-ui/react-slot";
import { ComponentProps, PropsWithChildren } from "react";

interface SubmitWrapperProps {
  onSubmit?: (data: any) => void;
  asChild?: boolean;
  className?: string;
}

const noop = () => {};

const SubmitWrapper = ({
  onSubmit,
  children,
  asChild,
  ...props
}: PropsWithChildren<ComponentProps<typeof Button> & SubmitWrapperProps>) => {
  const Comp = asChild ? Slot : Button;

  const { handleSubmit, isDirty } = useDynamicFormContext();
  // Always pass a function to handleSubmit
  const submitHandler = handleSubmit(onSubmit ?? noop);

  return (
    <Comp type="button" onClick={submitHandler} disabled={!isDirty} {...props}>
      {children}
    </Comp>
  );
};

export default SubmitWrapper;
