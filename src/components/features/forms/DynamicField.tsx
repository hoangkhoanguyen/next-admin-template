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
import { ImageUploaderField } from "./ImageUploaderField";
import { ImagePickerField } from "./ImagePickerField";
import { FileUploaderField } from "./FileUploaderField";
import { CurrencyField } from "./CurrencyField";
import { PercentageField } from "./PercentageField";
import { NumberField } from "./NumberField";
import { CheckboxField } from "./CheckboxField";
import { DateTimeField } from "./DateTimeField";
import { TimeField } from "./TimeField";
import { RichTextField } from "./RichTextField";
import { ColorField } from "./ColorField";
import { SliderField } from "./SliderField";
import { RangeField } from "./RangeField";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

interface DynamicFieldProps {
  field: FieldConfig;
  parentName?: string;
}

export function DynamicField({ field, parentName }: DynamicFieldProps) {
  const colSpanClassMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    // Thêm nếu cần
  };
  const rowSpanClassMap: Record<number, string> = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
    5: "row-span-5",
    6: "row-span-6",
    // Thêm nếu cần
  };
  const getColSpanClass = (colSpan?: number) =>
    colSpan ? colSpanClassMap[colSpan] ?? "" : "";
  const getRowSpanClass = (rowSpan?: number) =>
    rowSpan ? rowSpanClassMap[rowSpan] ?? "" : "";

  if (field.type === "spacer") {
    const colSpanClass = getColSpanClass(field.colSpan);
    const rowSpanClass = getRowSpanClass(field.rowSpan);
    return <div className={`${colSpanClass} ${rowSpanClass}`.trim()} />;
  }
  const fieldName = parentName ? `${parentName}.${field.name}` : field.name;
  const colSpanClass = getColSpanClass(field.colSpan);
  const rowSpanClass = getRowSpanClass(field.rowSpan);

  const wrap = (node: React.ReactNode) => (
    <div className={`${colSpanClass} ${rowSpanClass}`.trim()}>{node}</div>
  );

  switch (field.type) {
    case "currency":
      return wrap(<CurrencyField field={{ ...field, name: fieldName }} />);
    case "percentage":
      return wrap(<PercentageField field={{ ...field, name: fieldName }} />);
    case "text":
      return wrap(<TextField field={{ ...field, name: fieldName }} />);
    case "email":
      return wrap(<EmailField field={{ ...field, name: fieldName }} />);
    case "password":
      return wrap(<PasswordField field={{ ...field, name: fieldName }} />);
    case "textarea":
      return wrap(<TextareaField field={{ ...field, name: fieldName }} />);
    case "url":
      return wrap(<UrlField field={{ ...field, name: fieldName }} />);
    case "tel":
      return wrap(<TelField field={{ ...field, name: fieldName }} />);
    case "number":
      return wrap(<NumberField field={{ ...field, name: fieldName }} />);
    case "select-single":
      return wrap(<SelectSingleField field={{ ...field, name: fieldName }} />);
    case "select-multi":
      return wrap(<SelectMultiField field={{ ...field, name: fieldName }} />);
    case "array":
      return wrap(<ArrayField field={{ ...field, name: fieldName }} />);
    case "group":
      return wrap(<GroupField field={{ ...field, name: fieldName }} />);
    case "switch":
      return wrap(<SwitchField field={{ ...field, name: fieldName }} />);
    case "radio-group":
      return wrap(<RadioGroupField field={{ ...field, name: fieldName }} />);
    case "date":
      return wrap(<DatePickerField field={{ ...field, name: fieldName }} />);
    case "image-uploader":
      return wrap(<ImageUploaderField field={{ ...field, name: fieldName }} />);
    case "imagepicker":
      return wrap(<ImagePickerField field={{ ...field, name: fieldName }} />);
    case "file-uploader":
      return wrap(<FileUploaderField field={{ ...field, name: fieldName }} />);
    case "datetime":
      return wrap(<DateTimeField field={{ ...field, name: fieldName }} />);
    case "time":
      return wrap(<TimeField field={{ ...field, name: fieldName }} />);
    case "checkbox":
      return wrap(<CheckboxField field={{ ...field, name: fieldName }} />);
    case "richtext":
      return wrap(
        <RichTextField
          name={fieldName}
          label={field.label}
          description={field.description}
          placeholder={field.placeholder}
          required={!!field.zodSchema}
          disabled={field.disabled}
          minHeight={field.customUI?.minHeight as string}
          maxHeight={field.customUI?.maxHeight as string}
        />
      );
    case "color":
      return wrap(<ColorField field={{ ...field, name: fieldName }} />);
    case "slider":
      return wrap(<SliderField field={{ ...field, name: fieldName }} />);
    case "range":
      return wrap(<RangeField field={{ ...field, name: fieldName }} />);
    default:
      return null;
  }
}
