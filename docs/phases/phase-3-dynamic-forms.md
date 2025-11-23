# Phase 3: Dynamic Forms System

> **Goal:** Build a production-ready dynamic form system with 12+ field types
>
> **Duration:** 2 weeks (10-12 days)  
> **Dependencies:** Phase 1 (Foundation), Phase 2 (UI Components)  
> **Next Phase:** [Phase 4: Authentication & Layout](./phase-4-auth-layout.md)

---

## 📋 Overview

This phase builds a **complete dynamic form system** that generates forms from configuration objects. Instead of creating forms manually, you define a config and the system renders everything automatically.

**Why Dynamic Forms?**

- ✅ **Reduce code** - 300 lines → 30 lines per form
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Validation** - Automatic Zod schema generation
- ✅ **Reusable** - One system for all forms
- ✅ **Maintainable** - Change config, not components
- ✅ **Consistent** - Same UX across all forms

**Example:**

```typescript
// Before (300+ lines of JSX)
<form>
  <div>
    <label>Name</label>
    <input />
  </div>
  <div>
    <label>Email</label>
    <input />
  </div>
  // ... 20 more fields
</form>;

// After (30 lines of config)
const config: FormConfig = {
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    // ... 20 more fields
  ],
};
<DynamicForm config={config} onSubmit={handleSubmit} />;
```

---

## 🎯 Deliverables Checklist

### Week 1: Foundation + Core Fields (5 days)

#### Core System (Day 1-2)

- [ ] TypeScript type definitions (`form.types.ts`)
- [ ] `DynamicForm` component (main wrapper)
- [ ] `DynamicField` router component
- [ ] Zod validation utilities
- [ ] Form context setup
- [ ] Error handling system

#### Basic Field Types (Day 3-5)

- [ ] TextField (text, textarea, email, url, tel)
- [ ] NumberField (number, currency, percentage)
- [ ] SelectField (single, multi-select)
- [ ] CheckboxField (single checkbox, checkbox group)
- [ ] RadioField (radio group)
- [ ] SwitchField (toggle switch)
- [ ] DateField (date, datetime, daterange)

### Week 2: Advanced Fields (5 days)

#### Advanced Field Types (Day 6-8)

- [ ] AsyncSelectField (API-driven options with React Query)
- [ ] CreatableSelectField (user-created options)
- [ ] ImagePickerField (gallery + URL input)
- [ ] FileUploadField (single, multiple with preview)
- [ ] RichTextField (WYSIWYG editor)

#### Specialty Fields (Day 9-10)

- [ ] ColorField (color picker)
- [ ] SliderField (range slider)
- [ ] PasswordField (with strength indicator)

#### Testing & Documentation (Day 10-12)

- [ ] Form showcase page (`/forms-showcase`)
- [ ] 6+ example forms (user, product, order, settings)
- [ ] Validation examples
- [ ] Conditional logic examples
- [ ] Field dependencies examples

---

## 🛠️ Step-by-Step Implementation

### Step 1: Core Type Definitions (30 min)

**File:** `lib/dynamic-forms/types.ts`

```typescript
import { z } from "zod";
import { ReactNode } from "react";

// ============================================
// FIELD TYPES
// ============================================

export type FieldType =
  // Text inputs
  | "text"
  | "textarea"
  | "email"
  | "password"
  | "url"
  | "tel"
  // Number inputs
  | "number"
  | "currency"
  | "percentage"
  // Selection
  | "select"
  | "multi-select"
  | "async-select"
  | "creatable-select"
  | "radio"
  | "checkbox"
  | "checkbox-group"
  | "switch"
  // Date & Time
  | "date"
  | "datetime"
  | "daterange"
  // File & Media
  | "file"
  | "imagepicker"
  // Rich Content
  | "richtext"
  | "color"
  | "slider";

// ============================================
// OPTION TYPES
// ============================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

export interface ImageData {
  id?: string;
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  source: "gallery" | "url" | "upload";
  metadata?: {
    category?: string;
    tags?: string[];
    uploadedAt?: string;
    uploadedBy?: string;
    [key: string]: any;
  };
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "email" | "url" | "custom";
  value?: any;
  message?: string;
}

export interface ConditionalLogic {
  field: string;
  operator: "equals" | "not-equals" | "contains" | "greater-than" | "less-than";
  value: any;
}

// ============================================
// FIELD CONFIG
// ============================================

export interface FieldConfig {
  // Basic Properties
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validation?: ValidationRule[];

  // Conditional Display
  showWhen?: ConditionalLogic;
  hideWhen?: ConditionalLogic;

  // Layout
  className?: string;
  gridColumn?: string; // e.g., "span 2" for grid layouts

  // Text Field Properties
  minLength?: number;
  maxLength?: number;
  rows?: number; // for textarea

  // Number Field Properties
  min?: number;
  max?: number;
  step?: number;
  prefix?: string; // e.g., "$" for currency
  suffix?: string; // e.g., "%" for percentage

  // Select Field Properties
  options?: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;

  // Async Select Properties
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
  apiEndpoint?: string;
  queryKey?: string[];

  // Creatable Select Properties
  allowCreate?: boolean;
  onCreate?: (value: string) => void | Promise<void>;

  // Image Picker Properties
  allowGallery?: boolean;
  allowUrl?: boolean;
  allowUpload?: boolean;
  galleryEndpoint?: string;
  galleryQueryKey?: string[];
  galleryFilters?: {
    category?: string;
    tags?: string[];
    minWidth?: number;
    minHeight?: number;
    format?: string;
  };
  maxImages?: number;
  minImages?: number;
  acceptedFormats?: string[];
  maxFileSize?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  showImagePreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  showImageInfo?: boolean;
  showDimensions?: boolean;
  validateUrl?: (url: string) => boolean | Promise<boolean>;
  urlPlaceholder?: string;
  onImageSelect?: (image: ImageData) => void;
  onImageRemove?: (image: ImageData) => void;
  onUrlPaste?: (url: string) => void;

  // File Upload Properties
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;

  // Date Field Properties
  minDate?: Date | string;
  maxDate?: Date | string;
  disablePast?: boolean;
  disableFuture?: boolean;

  // Rich Text Properties
  toolbar?: string[];
  height?: number;

  // Color Picker Properties
  format?: "hex" | "rgb" | "hsl";
  showAlpha?: boolean;

  // Slider Properties
  marks?: { value: number; label: string }[];
  showValue?: boolean;

  // Callbacks
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  // Custom Render
  render?: (props: RenderProps) => ReactNode;
}

export interface RenderProps {
  field: any; // React Hook Form field
  fieldState: any; // React Hook Form field state
  formState: any; // React Hook Form form state
}

// ============================================
// FORM CONFIG
// ============================================

export interface FormConfig {
  fields: FieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  layout?: "vertical" | "horizontal" | "grid";
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
  showReset?: boolean;
  resetLabel?: string;
}

// ============================================
// FORM SUBMISSION
// ============================================

export interface FormSubmitData {
  [key: string]: any;
}

export interface FormSubmitResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}
```

**What this provides:**

- ✅ Complete type system for all 25+ field types
- ✅ Type-safe field configurations
- ✅ Validation rules
- ✅ Conditional logic types
- ✅ Image picker types
- ✅ All field-specific properties

---

### Step 2: Validation Utilities (20 min)

**File:** `lib/dynamic-forms/validation.ts`

```typescript
import { z } from "zod";
import { FieldConfig, ValidationRule } from "./types";

export function generateZodSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    // Base schema based on field type
    switch (field.type) {
      case "email":
        schema = z.string().email("Invalid email address");
        break;
      case "url":
        schema = z.string().url("Invalid URL");
        break;
      case "number":
      case "currency":
      case "percentage":
        schema = z.number();
        if (field.min !== undefined) {
          schema = (schema as z.ZodNumber).min(
            field.min,
            `Minimum value is ${field.min}`
          );
        }
        if (field.max !== undefined) {
          schema = (schema as z.ZodNumber).max(
            field.max,
            `Maximum value is ${field.max}`
          );
        }
        break;
      case "date":
      case "datetime":
        schema = z.date();
        break;
      case "multi-select":
      case "checkbox-group":
        schema = z.array(z.string()).min(1, "Select at least one option");
        break;
      case "file":
      case "imagepicker":
        schema = z.any(); // File validation handled separately
        break;
      default:
        schema = z.string();
        if (field.minLength) {
          schema = (schema as z.ZodString).min(
            field.minLength,
            `Minimum ${field.minLength} characters`
          );
        }
        if (field.maxLength) {
          schema = (schema as z.ZodString).max(
            field.maxLength,
            `Maximum ${field.maxLength} characters`
          );
        }
    }

    // Apply custom validation rules
    if (field.validation) {
      field.validation.forEach((rule) => {
        switch (rule.type) {
          case "pattern":
            if (rule.value instanceof RegExp) {
              schema = (schema as z.ZodString).regex(
                rule.value,
                rule.message || "Invalid format"
              );
            }
            break;
          case "custom":
            if (typeof rule.value === "function") {
              schema = schema.refine(
                rule.value,
                rule.message || "Validation failed"
              );
            }
            break;
        }
      });
    }

    // Apply required
    if (!field.required) {
      schema = schema.optional();
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}

export function validateField(value: any, field: FieldConfig): string | null {
  // Quick validation for single field
  try {
    const schema = generateZodSchema([field]);
    schema.parse({ [field.name]: value });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Validation error";
    }
    return "Validation error";
  }
}
```

---

### Step 3: DynamicForm Component (45 min)

**File:** `components/forms/DynamicForm.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormConfig, FormSubmitData } from "@/lib/dynamic-forms/types";
import { generateZodSchema } from "@/lib/dynamic-forms/validation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DynamicField } from "./DynamicField";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: FormSubmitData) => void | Promise<void>;
  defaultValues?: FormSubmitData;
  isLoading?: boolean;
}

export function DynamicForm({
  config,
  onSubmit,
  defaultValues,
  isLoading = false,
}: DynamicFormProps) {
  // Generate Zod schema from config
  const schema = generateZodSchema(config.fields);

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  // Handle form submission
  const handleSubmit = async (data: FormSubmitData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Determine grid layout
  const gridClass =
    config.layout === "grid"
      ? `grid gap-6 md:grid-cols-${config.gridCols || 2}`
      : "space-y-6";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-8", config.className)}
      >
        {/* Fields */}
        <div className={gridClass}>
          {config.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              control={form.control}
              formState={form.formState}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {config.onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={config.onCancel}
              disabled={isLoading}
            >
              {config.cancelLabel || "Cancel"}
            </Button>
          )}

          {config.showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              {config.resetLabel || "Reset"}
            </Button>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              config.submitLabel || "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

### Step 4: DynamicField Router (30 min)

**File:** `components/forms/DynamicField.tsx`

```typescript
"use client";

import { Control, Controller, FormState } from "react-hook-form";
import { FieldConfig } from "@/lib/dynamic-forms/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Import field components
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioField } from "./fields/RadioField";
import { SwitchField } from "./fields/SwitchField";
import { DateField } from "./fields/DateField";
import { AsyncSelectField } from "./fields/AsyncSelectField";
import { CreatableSelectField } from "./fields/CreatableSelectField";
import { ImagePickerField } from "./fields/ImagePickerField";
import { FileUploadField } from "./fields/FileUploadField";
import { RichTextField } from "./fields/RichTextField";
import { ColorField } from "./fields/ColorField";
import { SliderField } from "./fields/SliderField";
import { PasswordField } from "./fields/PasswordField";

interface DynamicFieldProps {
  field: FieldConfig;
  control: Control<any>;
  formState: FormState<any>;
}

export function DynamicField({ field, control, formState }: DynamicFieldProps) {
  // Check conditional logic
  const shouldShow = checkConditionalLogic(field, formState);
  if (!shouldShow) return null;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <FormItem
          className={cn(
            field.className,
            field.gridColumn && `col-span-${field.gridColumn}`
          )}
        >
          {field.label && <FormLabel>{field.label}</FormLabel>}
          <FormControl>
            {renderFieldByType(field, formField, fieldState)}
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFieldByType(
  field: FieldConfig,
  formField: any,
  fieldState: any
) {
  // Custom render
  if (field.render) {
    return field.render({ field: formField, fieldState, formState: {} });
  }

  // Standard field types
  switch (field.type) {
    // Text inputs
    case "text":
    case "textarea":
    case "email":
    case "url":
    case "tel":
      return <TextField field={field} formField={formField} />;

    // Number inputs
    case "number":
    case "currency":
    case "percentage":
      return <NumberField field={field} formField={formField} />;

    // Select
    case "select":
    case "multi-select":
      return <SelectField field={field} formField={formField} />;

    case "async-select":
      return <AsyncSelectField field={field} formField={formField} />;

    case "creatable-select":
      return <CreatableSelectField field={field} formField={formField} />;

    // Boolean
    case "checkbox":
      return <CheckboxField field={field} formField={formField} />;

    case "switch":
      return <SwitchField field={field} formField={formField} />;

    case "radio":
      return <RadioField field={field} formField={formField} />;

    // Date
    case "date":
    case "datetime":
    case "daterange":
      return <DateField field={field} formField={formField} />;

    // Files
    case "file":
      return <FileUploadField field={field} formField={formField} />;

    case "imagepicker":
      return <ImagePickerField field={field} formField={formField} />;

    // Rich content
    case "richtext":
      return <RichTextField field={field} formField={formField} />;

    case "color":
      return <ColorField field={field} formField={formField} />;

    case "slider":
      return <SliderField field={field} formField={formField} />;

    case "password":
      return <PasswordField field={field} formField={formField} />;

    default:
      return <TextField field={field} formField={formField} />;
  }
}

function checkConditionalLogic(
  field: FieldConfig,
  formState: FormState<any>
): boolean {
  // Check showWhen
  if (field.showWhen) {
    const { field: targetField, operator, value } = field.showWhen;
    const currentValue = formState.defaultValues?.[targetField];

    switch (operator) {
      case "equals":
        return currentValue === value;
      case "not-equals":
        return currentValue !== value;
      case "contains":
        return Array.isArray(currentValue) && currentValue.includes(value);
      case "greater-than":
        return currentValue > value;
      case "less-than":
        return currentValue < value;
      default:
        return true;
    }
  }

  // Check hideWhen
  if (field.hideWhen) {
    const { field: targetField, operator, value } = field.hideWhen;
    const currentValue = formState.defaultValues?.[targetField];

    // Inverse of showWhen logic
    switch (operator) {
      case "equals":
        return currentValue !== value;
      case "not-equals":
        return currentValue === value;
      default:
        return true;
    }
  }

  return true;
}
```

---

### Step 5: TextField Component (30 min)

**File:** `components/forms/fields/TextField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextFieldProps {
  field: FieldConfig;
  formField: any;
}

export function TextField({ field, formField }: TextFieldProps) {
  const isTextarea = field.type === "textarea";

  const commonProps = {
    ...formField,
    placeholder: field.placeholder,
    disabled: field.disabled,
    readOnly: field.readOnly,
    maxLength: field.maxLength,
  };

  if (isTextarea) {
    return <Textarea {...commonProps} rows={field.rows || 4} />;
  }

  // Determine input type
  let inputType = "text";
  if (field.type === "email") inputType = "email";
  if (field.type === "url") inputType = "url";
  if (field.type === "tel") inputType = "tel";

  return <Input {...commonProps} type={inputType} />;
}
```

---

### Step 6: NumberField Component (20 min)

**File:** `components/forms/fields/NumberField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Input } from "@/components/ui/input";

interface NumberFieldProps {
  field: FieldConfig;
  formField: any;
}

export function NumberField({ field, formField }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    formField.onChange(value);
  };

  return (
    <div className="relative">
      {field.prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {field.prefix}
        </span>
      )}
      <Input
        {...formField}
        type="number"
        placeholder={field.placeholder}
        disabled={field.disabled}
        readOnly={field.readOnly}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={handleChange}
        className={field.prefix ? "pl-8" : field.suffix ? "pr-8" : ""}
      />
      {field.suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {field.suffix}
        </span>
      )}
    </div>
  );
}
```

---

### Step 7: SelectField Component (30 min)

**File:** `components/forms/fields/SelectField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SelectFieldProps {
  field: FieldConfig;
  formField: any;
}

export function SelectField({ field, formField }: SelectFieldProps) {
  const isMulti = field.type === "multi-select" || field.multiple;

  if (isMulti) {
    return <MultiSelect field={field} formField={formField} />;
  }

  return (
    <Select
      onValueChange={formField.onChange}
      defaultValue={formField.value}
      disabled={field.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={field.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
            {option.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {option.description}
              </p>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MultiSelect({ field, formField }: SelectFieldProps) {
  const selectedValues = formField.value || [];

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];
    formField.onChange(newValues);
  };

  return (
    <div className="space-y-2 border rounded-md p-4">
      {field.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${field.name}-${option.value}`}
            checked={selectedValues.includes(String(option.value))}
            onCheckedChange={() => handleToggle(String(option.value))}
            disabled={option.disabled || field.disabled}
          />
          <Label
            htmlFor={`${field.name}-${option.value}`}
            className="text-sm font-normal cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Progress Tracking

After Step 7, you should have:

- ✅ Complete type system
- ✅ Validation utilities
- ✅ DynamicForm wrapper
- ✅ DynamicField router
- ✅ 3 core field types (TextField, NumberField, SelectField)

**Continue below for remaining field types...**

---

### Step 8: CheckboxField, RadioField, SwitchField (30 min)

**File:** `components/forms/fields/CheckboxField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  field: FieldConfig;
  formField: any;
}

export function CheckboxField({ field, formField }: CheckboxFieldProps) {
  // Single checkbox
  if (!field.options) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          checked={formField.value}
          onCheckedChange={formField.onChange}
          disabled={field.disabled}
        />
        <Label
          htmlFor={field.name}
          className="text-sm font-normal cursor-pointer"
        >
          {field.placeholder || field.label}
        </Label>
      </div>
    );
  }

  // Checkbox group
  const selectedValues = formField.value || [];

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];
    formField.onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {field.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${field.name}-${option.value}`}
            checked={selectedValues.includes(String(option.value))}
            onCheckedChange={() => handleToggle(String(option.value))}
            disabled={option.disabled || field.disabled}
          />
          <Label
            htmlFor={`${field.name}-${option.value}`}
            className="text-sm font-normal cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
```

**File:** `components/forms/fields/RadioField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioFieldProps {
  field: FieldConfig;
  formField: any;
}

export function RadioField({ field, formField }: RadioFieldProps) {
  return (
    <RadioGroup
      onValueChange={formField.onChange}
      defaultValue={formField.value}
      disabled={field.disabled}
    >
      <div className="space-y-3">
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={String(option.value)}
              id={`${field.name}-${option.value}`}
              disabled={option.disabled}
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
```

**File:** `components/forms/fields/SwitchField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwitchFieldProps {
  field: FieldConfig;
  formField: any;
}

export function SwitchField({ field, formField }: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5 flex-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
      </div>
      <Switch
        id={field.name}
        checked={formField.value}
        onCheckedChange={formField.onChange}
        disabled={field.disabled}
      />
    </div>
  );
}
```

---

### Step 9: DateField Component (30 min)

**First, install date picker:**

```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
npm install date-fns
```

**File:** `components/forms/fields/DateField.tsx`

```typescript
"use client";

import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateFieldProps {
  field: FieldConfig;
  formField: any;
}

export function DateField({ field, formField }: DateFieldProps) {
  const isDateTime = field.type === "datetime";
  const isDateRange = field.type === "daterange";

  if (isDateRange) {
    return <DateRangePicker field={field} formField={formField} />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !formField.value && "text-muted-foreground"
          )}
          disabled={field.disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formField.value ? (
            format(formField.value, isDateTime ? "PPP HH:mm" : "PPP")
          ) : (
            <span>{field.placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={formField.value}
          onSelect={formField.onChange}
          disabled={(date) => {
            if (field.disablePast && date < new Date()) return true;
            if (field.disableFuture && date > new Date()) return true;
            if (field.minDate && date < new Date(field.minDate)) return true;
            if (field.maxDate && date > new Date(field.maxDate)) return true;
            return false;
          }}
          initialFocus
        />
        {isDateTime && (
          <div className="p-3 border-t">
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const newDate = new Date(formField.value || new Date());
                newDate.setHours(parseInt(hours), parseInt(minutes));
                formField.onChange(newDate);
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function DateRangePicker({ field, formField }: DateFieldProps) {
  const [from, to] = formField.value || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
              </>
            ) : (
              format(from, "LLL dd, y")
            )
          ) : (
            <span>{field.placeholder || "Pick a date range"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(range) => {
            formField.onChange([range?.from, range?.to]);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

---

### Step 10: AsyncSelectField with React Query (45 min)

**File:** `components/forms/fields/AsyncSelectField.tsx`

```typescript
"use client";

import { FieldConfig, SelectOption } from "@/lib/dynamic-forms/types";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import apiClient from "@/lib/api/client";

interface AsyncSelectFieldProps {
  field: FieldConfig;
  formField: any;
}

export function AsyncSelectField({ field, formField }: AsyncSelectFieldProps) {
  // Fetch options from API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: field.queryKey || ["select-options", field.apiEndpoint],
    queryFn: async () => {
      if (field.loadOptions) {
        return field.loadOptions("");
      }
      if (field.apiEndpoint) {
        const response = await apiClient.get(field.apiEndpoint);
        return response.data;
      }
      return [];
    },
    enabled: !!field.apiEndpoint || !!field.loadOptions,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 border rounded-md">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading options...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message="Failed to load options" retry={() => refetch()} />
    );
  }

  const options: SelectOption[] = data || [];

  return (
    <Select
      onValueChange={formField.onChange}
      defaultValue={formField.value}
      disabled={field.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={field.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No options available
          </div>
        ) : (
          options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
```

---

### Step 11: CreatableSelectField (From existing docs - 30 min)

**File:** `components/forms/fields/CreatableSelectField.tsx`

> Reference the complete implementation from `/docs/dynamic-forms/fields/10-creatable-select.md`

```typescript
"use client";

import { useState } from "react";
import { FieldConfig, SelectOption } from "@/lib/dynamic-forms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreatableSelectFieldProps {
  field: FieldConfig;
  formField: any;
}

export function CreatableSelectField({
  field,
  formField,
}: CreatableSelectFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<SelectOption[]>(field.options || []);
  const { toast } = useToast();

  const selectedValues = formField.value || [];

  const handleCreate = async () => {
    if (!inputValue.trim()) return;

    // Check duplicates
    if (
      options.some(
        (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      toast({
        title: "Duplicate",
        description: "This option already exists",
        variant: "destructive",
      });
      return;
    }

    const newOption: SelectOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };

    // Call onCreate callback if provided
    if (field.onCreate) {
      await field.onCreate(inputValue);
    }

    setOptions([...options, newOption]);
    formField.onChange([...selectedValues, newOption.value]);
    setInputValue("");

    toast({
      title: "Created",
      description: `"${inputValue}" added successfully`,
    });
  };

  const handleRemove = (value: string) => {
    formField.onChange(selectedValues.filter((v: string) => v !== value));
  };

  return (
    <div className="space-y-3">
      {/* Input to create new option */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={field.placeholder || "Type to create..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCreate}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected values */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value: string) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge key={value} variant="secondary">
                {option?.label || value}
                <button
                  type="button"
                  onClick={() => handleRemove(value)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Existing options */}
      <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                const newValues = selectedValues.includes(option.value)
                  ? selectedValues.filter((v: string) => v !== option.value)
                  : [...selectedValues, option.value];
                formField.onChange(newValues);
              }}
              className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                selectedValues.includes(option.value) ? "bg-muted" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 12: ImagePickerField (From existing docs - 30 min)

**File:** `components/forms/fields/ImagePickerField.tsx`

> Reference the complete implementation from `/docs/dynamic-forms/fields/11-imagepicker-field.md`

This is already fully documented with 650+ lines. Just copy from the existing docs.

---

### Step 13: FileUploadField, RichTextField, ColorField (60 min)

**File:** `components/forms/fields/FileUploadField.tsx`

```typescript
"use client";

import { useState } from "react";
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";

interface FileUploadFieldProps {
  field: FieldConfig;
  formField: any;
}

export function FileUploadField({ field, formField }: FileUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (field.maxSize && file.size > field.maxSize) {
      alert(`File size must be less than ${field.maxSize / 1024 / 1024}MB`);
      return;
    }

    formField.onChange(file);

    // Generate preview for images
    if (field.showPreview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    formField.onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {!formField.value ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4">
            <Button type="button" variant="outline" asChild>
              <label className="cursor-pointer">
                Choose File
                <Input
                  type="file"
                  className="hidden"
                  accept={field.accept}
                  onChange={handleFileChange}
                  disabled={field.disabled}
                />
              </label>
            </Button>
          </div>
          {field.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm">{formField.value.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**File:** `components/forms/fields/RichTextField.tsx`

```typescript
"use client";

import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Textarea } from "@/components/ui/textarea";
// TODO: Integrate proper rich text editor like TipTap
// For now, use textarea as placeholder

interface RichTextFieldProps {
  field: FieldConfig;
  formField: any;
}

export function RichTextField({ field, formField }: RichTextFieldProps) {
  // Placeholder implementation
  // Replace with TipTap or other rich text editor
  return (
    <Textarea
      {...formField}
      placeholder={field.placeholder}
      rows={field.height ? field.height / 20 : 10}
      disabled={field.disabled}
      className="font-mono"
    />
  );
}
```

**File:** `components/forms/fields/ColorField.tsx`

```typescript
"use client";

import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Input } from "@/components/ui/input";

interface ColorFieldProps {
  field: FieldConfig;
  formField: any;
}

export function ColorField({ field, formField }: ColorFieldProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="color"
        {...formField}
        className="w-20 h-10 cursor-pointer"
        disabled={field.disabled}
      />
      <Input
        type="text"
        value={formField.value || "#000000"}
        onChange={(e) => formField.onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1"
        disabled={field.disabled}
      />
    </div>
  );
}
```

---

### Step 14: SliderField, PasswordField (30 min)

**First install slider:**

```bash
npx shadcn@latest add slider
```

**File:** `components/forms/fields/SliderField.tsx`

```typescript
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Slider } from "@/components/ui/slider";

interface SliderFieldProps {
  field: FieldConfig;
  formField: any;
}

export function SliderField({ field, formField }: SliderFieldProps) {
  return (
    <div className="space-y-4">
      <Slider
        min={field.min || 0}
        max={field.max || 100}
        step={field.step || 1}
        value={[formField.value || field.min || 0]}
        onValueChange={(value) => formField.onChange(value[0])}
        disabled={field.disabled}
      />
      {field.showValue && (
        <div className="text-center text-sm text-muted-foreground">
          {formField.value || field.min || 0}
        </div>
      )}
    </div>
  );
}
```

**File:** `components/forms/fields/PasswordField.tsx`

```typescript
"use client";

import { useState } from "react";
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  field: FieldConfig;
  formField: any;
}

export function PasswordField({ field, formField }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (
    password: string
  ): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { level: 0, label: "", color: "" },
      { level: 1, label: "Weak", color: "bg-red-500" },
      { level: 2, label: "Fair", color: "bg-yellow-500" },
      { level: 3, label: "Good", color: "bg-blue-500" },
      { level: 4, label: "Strong", color: "bg-green-500" },
    ];

    return levels[strength];
  };

  const strength = getStrength(formField.value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...formField}
          type={showPassword ? "text" : "password"}
          placeholder={field.placeholder}
          disabled={field.disabled}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Strength Indicator */}
      {formField.value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= strength.level ? strength.color : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {strength.label && `Password strength: ${strength.label}`}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 📚 Step 15: Forms Showcase Page (90 min)

**File:** `app/forms-showcase/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Container, Section } from "@/components/shared/Section";
import { H1, H2, Text } from "@/components/shared/Typography";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { DynamicForm } from "@/components/forms/DynamicForm";
import { FormConfig } from "@/lib/dynamic-forms/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function FormsShowcasePage() {
  const { toast } = useToast();

  // Example 1: User Registration Form
  const userFormConfig: FormConfig = {
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        placeholder: "John",
        required: true,
        gridColumn: "span 1",
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        placeholder: "Doe",
        required: true,
        gridColumn: "span 1",
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Enter password",
        required: true,
        minLength: 8,
      },
      {
        name: "role",
        type: "select",
        label: "Role",
        placeholder: "Select a role",
        required: true,
        options: [
          { value: "admin", label: "Admin" },
          { value: "manager", label: "Manager" },
          { value: "staff", label: "Staff" },
        ],
      },
      {
        name: "subscribe",
        type: "switch",
        label: "Subscribe to newsletter",
        description: "Receive updates and news",
      },
    ],
    layout: "grid",
    gridCols: 2,
    submitLabel: "Create User",
  };

  // Example 2: Product Form
  const productFormConfig: FormConfig = {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Product Name",
        placeholder: "Enter product name",
        required: true,
      },
      {
        name: "sku",
        type: "text",
        label: "SKU",
        placeholder: "PROD-001",
        required: true,
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "Product description...",
        rows: 4,
      },
      {
        name: "price",
        type: "currency",
        label: "Price",
        placeholder: "0.00",
        required: true,
        prefix: "$",
        min: 0,
        step: 0.01,
      },
      {
        name: "stock",
        type: "number",
        label: "Stock Quantity",
        placeholder: "0",
        required: true,
        min: 0,
      },
      {
        name: "category",
        type: "select",
        label: "Category",
        placeholder: "Select category",
        required: true,
        options: [
          { value: "toys", label: "Toys" },
          { value: "games", label: "Games" },
          { value: "books", label: "Books" },
        ],
      },
      {
        name: "tags",
        type: "creatable-select",
        label: "Tags",
        placeholder: "Add tags...",
        options: [
          { value: "new", label: "New" },
          { value: "sale", label: "Sale" },
          { value: "featured", label: "Featured" },
        ],
        allowCreate: true,
      },
      {
        name: "images",
        type: "imagepicker",
        label: "Product Images",
        allowGallery: true,
        allowUrl: true,
        maxImages: 5,
      },
      {
        name: "active",
        type: "switch",
        label: "Active",
        description: "Product is visible to customers",
      },
    ],
    layout: "vertical",
    submitLabel: "Save Product",
    showReset: true,
  };

  // Example 3: Settings Form
  const settingsFormConfig: FormConfig = {
    fields: [
      {
        name: "siteName",
        type: "text",
        label: "Site Name",
        placeholder: "My Store",
        required: true,
      },
      {
        name: "timezone",
        type: "select",
        label: "Timezone",
        required: true,
        options: [
          { value: "UTC", label: "UTC" },
          { value: "America/New_York", label: "Eastern Time" },
          { value: "America/Los_Angeles", label: "Pacific Time" },
        ],
      },
      {
        name: "currency",
        type: "radio",
        label: "Currency",
        required: true,
        options: [
          { value: "USD", label: "USD - US Dollar" },
          { value: "EUR", label: "EUR - Euro" },
          { value: "GBP", label: "GBP - British Pound" },
        ],
      },
      {
        name: "features",
        type: "checkbox-group",
        label: "Enabled Features",
        options: [
          { value: "reviews", label: "Customer Reviews" },
          { value: "wishlist", label: "Wishlist" },
          { value: "compare", label: "Product Comparison" },
        ],
      },
      {
        name: "maintenanceMode",
        type: "switch",
        label: "Maintenance Mode",
        description: "Enable to show maintenance page",
      },
    ],
    layout: "vertical",
    submitLabel: "Save Settings",
  };

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    toast({
      title: "Success",
      description: "Form submitted successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <H1>Dynamic Forms Showcase</H1>
              <Text>Complete form system with 12+ field types</Text>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <Tabs defaultValue="user" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user">User Form</TabsTrigger>
            <TabsTrigger value="product">Product Form</TabsTrigger>
            <TabsTrigger value="settings">Settings Form</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Registration Form</CardTitle>
                <CardDescription>
                  Example form with text, email, password, select, and switch
                  fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm config={userFormConfig} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product">
            <Card>
              <CardHeader>
                <CardTitle>Product Management Form</CardTitle>
                <CardDescription>
                  Complex form with all field types including image picker and
                  creatable select
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm
                  config={productFormConfig}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings Form</CardTitle>
                <CardDescription>
                  Form with radio, checkbox group, and switches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm
                  config={settingsFormConfig}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Field Types Reference */}
        <Section title="Available Field Types" className="mt-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fieldTypes.map((type) => (
              <Card key={type.name}>
                <CardHeader>
                  <CardTitle className="text-base">{type.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {type.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  );
}

const fieldTypes = [
  { name: "Text", description: "text, textarea, email, url, tel" },
  { name: "Number", description: "number, currency, percentage" },
  { name: "Select", description: "single, multi-select" },
  { name: "Async Select", description: "API-driven options" },
  { name: "Creatable Select", description: "User-created options" },
  { name: "Checkbox", description: "single, checkbox-group" },
  { name: "Radio", description: "radio group" },
  { name: "Switch", description: "toggle switch" },
  { name: "Date", description: "date, datetime, daterange" },
  { name: "File Upload", description: "single, multiple with preview" },
  { name: "Image Picker", description: "gallery + URL" },
  { name: "Rich Text", description: "WYSIWYG editor" },
  { name: "Color", description: "color picker" },
  { name: "Slider", description: "range slider" },
  { name: "Password", description: "with strength indicator" },
];
```

---

## ✅ Verification Checklist

### All Field Types Working

```bash
npm run dev
# Visit http://localhost:3000/forms-showcase
```

- [ ] User form renders correctly
- [ ] Product form shows all field types
- [ ] Settings form with radio/checkbox works
- [ ] Text fields accept input
- [ ] Number fields validate min/max
- [ ] Select dropdowns work
- [ ] Creatable select creates new options
- [ ] Image picker opens (if implemented)
- [ ] Date picker calendar opens
- [ ] File upload accepts files
- [ ] Password field shows strength
- [ ] Switch toggles correctly
- [ ] Form validation works
- [ ] Error messages display
- [ ] Form submission works
- [ ] Dark mode compatible

### TypeScript Check

```bash
npm run type-check
```

- [ ] No TypeScript errors
- [ ] All types properly defined

---

## 📦 Output Files Summary

### Core System

- ✅ `lib/dynamic-forms/types.ts` - Complete type system
- ✅ `lib/dynamic-forms/validation.ts` - Zod utilities
- ✅ `components/forms/DynamicForm.tsx` - Main wrapper
- ✅ `components/forms/DynamicField.tsx` - Field router

### Field Components (15 files)

- ✅ `components/forms/fields/TextField.tsx`
- ✅ `components/forms/fields/NumberField.tsx`
- ✅ `components/forms/fields/SelectField.tsx`
- ✅ `components/forms/fields/CheckboxField.tsx`
- ✅ `components/forms/fields/RadioField.tsx`
- ✅ `components/forms/fields/SwitchField.tsx`
- ✅ `components/forms/fields/DateField.tsx`
- ✅ `components/forms/fields/AsyncSelectField.tsx`
- ✅ `components/forms/fields/CreatableSelectField.tsx`
- ✅ `components/forms/fields/ImagePickerField.tsx`
- ✅ `components/forms/fields/FileUploadField.tsx`
- ✅ `components/forms/fields/RichTextField.tsx`
- ✅ `components/forms/fields/ColorField.tsx`
- ✅ `components/forms/fields/SliderField.tsx`
- ✅ `components/forms/fields/PasswordField.tsx`

### Showcase

- ✅ `app/forms-showcase/page.tsx` - Interactive examples

---

## 🚀 Next Steps

After completing Phase 3:

1. **Test all forms** - Try every field type
2. **Test validation** - Submit empty/invalid forms
3. **Test dark mode** - Toggle theme
4. **Commit your work** - `git commit -m "feat: complete Phase 3 dynamic forms"`
5. **Move to Phase 4** - [Authentication & Layout](./phase-4-auth-layout.md)

---

## 💡 Usage in Next Phases

### Phase 5 (Products)

```typescript
const productConfig: FormConfig = {
  fields: [
    { name: "name", type: "text", label: "Product Name", required: true },
    { name: "price", type: "currency", label: "Price", prefix: "$" },
    { name: "images", type: "imagepicker", label: "Images", maxImages: 5 },
  ],
};
```

### Phase 6 (Orders)

```typescript
const orderConfig: FormConfig = {
  fields: [
    { name: "customer", type: "async-select", apiEndpoint: "/api/customers" },
    { name: "status", type: "select", options: statusOptions },
    { name: "notes", type: "textarea", rows: 4 },
  ],
};
```

---

## 🎯 Success Criteria

Phase 3 is complete when:

- ✅ All 15 field types implemented
- ✅ Forms showcase page functional
- ✅ 3+ example forms working
- ✅ Validation errors display correctly
- ✅ Form submission works
- ✅ Dark mode compatible
- ✅ Mobile responsive
- ✅ No TypeScript errors
- ✅ Committed to Git

**Showcase URL:** http://localhost:3000/forms-showcase

---

**Status:** Complete  
**Total Time:** 10-12 days (2 weeks)  
**Next Phase:** [Phase 4: Authentication & Layout →](./phase-4-auth-layout.md)

Let's build powerful forms! 🚀
