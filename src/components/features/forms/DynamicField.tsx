import { GroupField } from "./GroupField";
import { TextField } from "./TextField";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { TextareaField } from "./TextareaField";
import { UrlField } from "./UrlField";
import { TelField } from "./TelField";
import { ArrayField } from "./ArrayField";
import { RadioGroupField } from "./RadioGroupField";
import { DatePickerField } from "./DatePickerField";
import { SwitchField } from "./SwitchField";
import { SelectSingleField } from "./SelectSingleField";
import { SelectMultiField } from "./SelectMultiField";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

interface DynamicFieldProps {
  field: FieldConfig;
  parentName?: string;
}

export function DynamicField({ field, parentName }: DynamicFieldProps) {
  const fieldName = parentName ? `${parentName}.${field.name}` : field.name;

  switch (field.type) {
    case "text":
      return <TextField field={{ ...field, name: fieldName }} />;
    case "email":
      return <EmailField field={{ ...field, name: fieldName }} />;
    case "password":
      return <PasswordField field={{ ...field, name: fieldName }} />;
    case "textarea":
      return <TextareaField field={{ ...field, name: fieldName }} />;
    case "url":
      return <UrlField field={{ ...field, name: fieldName }} />;
    case "tel":
      return <TelField field={{ ...field, name: fieldName }} />;
    case "select-single":
      return <SelectSingleField field={{ ...field, name: fieldName }} />;
    case "select-multi":
      return <SelectMultiField field={{ ...field, name: fieldName }} />;
    case "array":
      return <ArrayField field={{ ...field, name: fieldName }} />;
    case "group":
      return <GroupField field={{ ...field, name: fieldName }} />;
    case "switch":
      return <SwitchField field={{ ...field, name: fieldName }} />;
    case "radio-group":
      return <RadioGroupField field={{ ...field, name: fieldName }} />;
    case "date":
      return <DatePickerField field={{ ...field, name: fieldName }} />;
    default:
      return null;
  }
}
