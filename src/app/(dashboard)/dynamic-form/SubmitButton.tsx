"use client";

import { useDynamicFormContext } from "@/components/shared/forms/DynamicFormProvider";
import { Button } from "@/components/ui";

const SubmitButton = () => {
  const { handleSubmit } = useDynamicFormContext();

  return (
    <Button
      onClick={handleSubmit((data) => {
        console.log("data", data);
      })}
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
