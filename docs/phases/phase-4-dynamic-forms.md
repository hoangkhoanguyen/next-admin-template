# Phase 4: Core Dynamic Forms System

> **Goal:** Build a complete reusable form system with 12+ field types
>
> **Duration:** 2 weeks (10-14 days)  
> **Dependencies:** Phase 1 (Foundation), Phase 2 (UI Components)  
> **Next Phase:** [Phase 5: Data Tables](./phase-5-data-tables.md)

---

## 📋 Overview

This phase builds the most important system in the admin template: **Dynamic Forms**. Instead of creating forms manually for each page, we build a configuration-driven system where you define forms using JSON/TypeScript config.

**Why Dynamic Forms?**

- ✅ **Consistent** - All forms look and behave the same
- ✅ **Fast** - Create forms 10x faster (10 lines vs 100 lines)
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Validation** - Automatic Zod validation
- ✅ **Reusable** - Use same field across multiple forms
- ✅ **Maintainable** - Change validation in one place

**Example:**

```typescript
// Instead of 100 lines of JSX, you write:
const formConfig: FormConfig = {
  fields: [
    { name: 'name', type: 'text', label: 'Product Name', required: true },
    { name: 'price', type: 'number', label: 'Price', min: 0 },
    { name: 'category', type: 'select', label: 'Category', options: [...] },
    { name: 'images', type: 'imagepicker', label: 'Images', multiple: true },
  ],
};

<DynamicForm config={formConfig} onSubmit={handleSubmit} />
```

---

## 🎯 Deliverables Checklist

### Week 1: Foundation + Basic Fields (5-7 days)

#### Core System

- [ ] TypeScript types (`form.types.ts`)
- [ ] DynamicForm component
- [ ] DynamicField router
- [ ] Zod validation schema generator
- [ ] Form utilities

#### Basic Field Types (5 fields)

- [ ] TextField (text, textarea, email, url)
- [ ] NumberField (number, currency)
- [ ] SelectField (single, multi-select)
- [ ] CheckboxField (boolean, switch)
- [ ] DateField (date, datetime, daterange)

### Week 2: Advanced Fields (5-7 days)

#### Advanced Field Types (7 fields)

- [ ] AsyncSelectField (API-driven)
- [ ] CreatableSelectField (user-created options)
- [ ] ImagePickerField (gallery + URL)
- [ ] FileUploadField (single, multiple)
- [ ] RichTextField (WYSIWYG editor)
- [ ] ColorField (color picker)
- [ ] SliderField (range, slider)

#### Final Steps

- [ ] Form showcase page
- [ ] Complete examples
- [ ] Error handling
- [ ] Loading states

---

## 🛠️ Week 1: Foundation + Basic Fields

### Day 1: Core Types & Setup (1 day)

#### Step 1.1: Create Type Definitions (2 hours)

**File:** `lib/dynamic-forms/types.ts`

```typescript
import { z } from "zod";

// ==========================================
// Field Types
// ==========================================

export type FieldType =
  // Basic types
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "password"
  | "number"
  | "currency"
  // Selection types
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "switch"
  // Date/Time types
  | "date"
  | "datetime"
  | "daterange"
  // Advanced types
  | "asyncselect"
  | "creatable"
  | "imagepicker"
  | "file"
  | "richtext"
  | "color"
  | "slider";

// ==========================================
// Option Types
// ==========================================

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
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
  metadata?: Record<string, any>;
}

// ==========================================
// Field Configuration
// ==========================================

export interface FieldConfig {
  // Basic properties
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: any;

  // Validation
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;

  // Text field
  rows?: number; // For textarea
  maxRows?: number;

  // Number field
  step?: number;
  prefix?: string; // For currency
  suffix?: string;

  // Select field
  options?: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;

  // Async select
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  queryKey?: string[];

  // Creatable select
  allowCreate?: boolean;
  onCreate?: (value: string) => void | Promise<void>;

  // Image picker
  allowGallery?: boolean;
  allowUrl?: boolean;
  allowUpload?: boolean;
  maxImages?: number;
  minImages?: number;
  galleryEndpoint?: string;
  acceptedFormats?: string[];
  maxFileSize?: number;

  // File upload
  accept?: string;
  maxFiles?: number;

  // Rich text
  toolbar?: string[];

  // Color picker
  format?: "hex" | "rgb" | "hsl";

  // Slider
  minValue?: number;
  maxValue?: number;
  marks?: Record<number, string>;

  // Layout
  className?: string;
  width?: "full" | "half" | "third";
  order?: number;

  // Conditional rendering
  showWhen?: {
    field: string;
    is?: any;
    isNot?: any;
    condition?: (formValues: any) => boolean;
  };

  // Callbacks
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// ==========================================
// Form Configuration
// ==========================================

export interface FormConfig {
  fields: FieldConfig[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3 | 4;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
}

// ==========================================
// Form Props
// ==========================================

export interface DynamicFormProps {
  config: FormConfig;
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface DynamicFieldProps {
  field: FieldConfig;
  control: any; // React Hook Form control
  errors: any;
}
```

**What this includes:**

- ✅ All 17+ field types
- ✅ Complete field configuration
- ✅ Type-safe props
- ✅ Conditional rendering support
- ✅ Validation options

---

#### Step 1.2: Create Validation Utilities (1 hour)

**File:** `lib/dynamic-forms/validation.ts`

```typescript
import { z } from "zod";
import { FieldConfig } from "./types";

/**
 * Generate Zod schema from field config
 */
export function generateFieldSchema(field: FieldConfig): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base schema by type
  switch (field.type) {
    case "text":
    case "textarea":
    case "email":
    case "url":
    case "password":
      schema = z.string();
      break;

    case "number":
    case "currency":
    case "slider":
      schema = z.number();
      break;

    case "checkbox":
    case "switch":
      schema = z.boolean();
      break;

    case "date":
    case "datetime":
      schema = z.date();
      break;

    case "daterange":
      schema = z.object({
        from: z.date(),
        to: z.date(),
      });
      break;

    case "select":
    case "radio":
    case "asyncselect":
    case "creatable":
      schema = field.multiple ? z.array(z.string()) : z.string();
      break;

    case "multiselect":
      schema = z.array(z.string());
      break;

    case "imagepicker":
      schema = field.multiple
        ? z.array(
            z.object({
              url: z.string(),
              source: z.enum(["gallery", "url", "upload"]),
            })
          )
        : z.object({
            url: z.string(),
            source: z.enum(["gallery", "url", "upload"]),
          });
      break;

    case "file":
      schema = field.multiple
        ? z.array(z.instanceof(File))
        : z.instanceof(File);
      break;

    case "richtext":
      schema = z.string();
      break;

    case "color":
      schema = z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format");
      break;

    default:
      schema = z.any();
  }

  // Apply validations
  if (field.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, `${field.label} is required`);
    } else if (schema instanceof z.ZodArray) {
      schema = schema.min(1, `${field.label} is required`);
    } else {
      schema = schema.refine((val) => val !== undefined && val !== null, {
        message: `${field.label} is required`,
      });
    }
  } else {
    schema = schema.optional();
  }

  // String validations
  if (schema instanceof z.ZodString) {
    if (field.minLength) {
      schema = schema.min(
        field.minLength,
        `Minimum ${field.minLength} characters`
      );
    }
    if (field.maxLength) {
      schema = schema.max(
        field.maxLength,
        `Maximum ${field.maxLength} characters`
      );
    }
    if (field.pattern) {
      schema = schema.regex(field.pattern, "Invalid format");
    }
    if (field.type === "email") {
      schema = schema.email("Invalid email address");
    }
    if (field.type === "url") {
      schema = schema.url("Invalid URL");
    }
  }

  // Number validations
  if (schema instanceof z.ZodNumber) {
    if (field.min !== undefined) {
      schema = schema.min(field.min, `Minimum value is ${field.min}`);
    }
    if (field.max !== undefined) {
      schema = schema.max(field.max, `Maximum value is ${field.max}`);
    }
  }

  // Array validations
  if (schema instanceof z.ZodArray) {
    if (field.minImages || field.minFiles) {
      const min = field.minImages || field.minFiles || 1;
      schema = schema.min(min, `Minimum ${min} items required`);
    }
    if (field.maxImages || field.maxFiles) {
      const max = field.maxImages || field.maxFiles || 10;
      schema = schema.max(max, `Maximum ${max} items allowed`);
    }
  }

  // Custom validation
  if (field.validate) {
    schema = schema.refine(field.validate, {
      message: "Validation failed",
    });
  }

  return schema;
}

/**
 * Generate complete form schema
 */
export function generateFormSchema(config: FormConfig): z.ZodObject<any> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  config.fields.forEach((field) => {
    schemaShape[field.name] = generateFieldSchema(field);
  });

  return z.object(schemaShape);
}
```

**What this does:**

- ✅ Auto-generate Zod schema from config
- ✅ Handle all field types
- ✅ Apply validation rules
- ✅ Custom validation support

---

#### Step 1.3: Create Form Utilities (1 hour)

**File:** `lib/dynamic-forms/utils.ts`

```typescript
import { FieldConfig, FormConfig } from "./types";

/**
 * Get default values from form config
 */
export function getDefaultValues(config: FormConfig): Record<string, any> {
  const defaults: Record<string, any> = {};

  config.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      // Set appropriate default based on type
      switch (field.type) {
        case "checkbox":
        case "switch":
          defaults[field.name] = false;
          break;
        case "multiselect":
        case "imagepicker":
        case "file":
          if (field.multiple) {
            defaults[field.name] = [];
          }
          break;
        default:
          defaults[field.name] = "";
      }
    }
  });

  return defaults;
}

/**
 * Check if field should be shown based on condition
 */
export function shouldShowField(
  field: FieldConfig,
  formValues: Record<string, any>
): boolean {
  if (!field.showWhen) return true;

  const { field: fieldName, is, isNot, condition } = field.showWhen;
  const fieldValue = formValues[fieldName];

  if (condition) {
    return condition(formValues);
  }

  if (is !== undefined) {
    return fieldValue === is;
  }

  if (isNot !== undefined) {
    return fieldValue !== isNot;
  }

  return true;
}

/**
 * Get field width class
 */
export function getFieldWidthClass(width?: "full" | "half" | "third"): string {
  switch (width) {
    case "half":
      return "md:col-span-6";
    case "third":
      return "md:col-span-4";
    default:
      return "md:col-span-12";
  }
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  prefix = "$",
  suffix = ""
): string {
  return `${prefix}${value.toFixed(2)}${suffix}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}
```

---

### Day 2-3: DynamicForm Component (2 days)

#### Step 1.4: Create Main Form Component (4 hours)

**File:** `components/forms/DynamicForm.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { DynamicField } from "./DynamicField";
import { DynamicFormProps } from "@/lib/dynamic-forms/types";
import { generateFormSchema } from "@/lib/dynamic-forms/validation";
import { getDefaultValues, shouldShowField } from "@/lib/dynamic-forms/utils";
import { cn } from "@/lib/utils";

export function DynamicForm({
  config,
  defaultValues,
  onSubmit,
  loading = false,
  className,
}: DynamicFormProps) {
  // Generate Zod schema from config
  const schema = generateFormSchema(config);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || getDefaultValues(config),
  });

  // Watch all values for conditional fields
  const formValues = form.watch();

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  });

  // Get layout classes
  const getLayoutClass = () => {
    if (config.layout === "grid") {
      return `grid grid-cols-12 gap-4`;
    }
    return "space-y-4";
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
        {/* Fields */}
        <div className={getLayoutClass()}>
          {config.fields
            .filter((field) => shouldShowField(field, formValues))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                control={form.control}
                errors={form.formState.errors}
              />
            ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {config.submitLabel || "Submit"}
          </Button>

          {config.showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={config.onCancel}
              disabled={loading}
            >
              {config.cancelLabel || "Cancel"}
            </Button>
          )}

          {config.showReset && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset();
                config.onReset?.();
              }}
              disabled={loading}
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
```

**What this does:**

- ✅ Auto-generate Zod validation
- ✅ Handle form submission
- ✅ Conditional field rendering
- ✅ Loading states
- ✅ Grid/vertical layouts
- ✅ Reset functionality

---

#### Step 1.5: Create Field Router (2 hours)

**File:** `components/forms/DynamicField.tsx`

```typescript
"use client";

import { Controller } from "react-hook-form";
import { DynamicFieldProps } from "@/lib/dynamic-forms/types";
import { getFieldWidthClass } from "@/lib/dynamic-forms/utils";
import { cn } from "@/lib/utils";

// Import field components (we'll create these next)
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { DateField } from "./fields/DateField";
import { AsyncSelectField } from "./fields/AsyncSelectField";
import { CreatableSelectField } from "./fields/CreatableSelectField";
import { ImagePickerField } from "./fields/ImagePickerField";
import { FileUploadField } from "./fields/FileUploadField";
import { RichTextField } from "./fields/RichTextField";
import { ColorField } from "./fields/ColorField";
import { SliderField } from "./fields/SliderField";

export function DynamicField({ field, control, errors }: DynamicFieldProps) {
  const error = errors[field.name];
  const widthClass = getFieldWidthClass(field.width);

  return (
    <div className={cn(widthClass, field.className)}>
      <Controller
        name={field.name}
        control={control}
        render={({ field: formField }) => {
          // Route to appropriate field component
          switch (field.type) {
            case "text":
            case "textarea":
            case "email":
            case "url":
            case "password":
              return (
                <TextField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  onBlur={formField.onBlur}
                  error={error?.message}
                />
              );

            case "number":
            case "currency":
              return (
                <NumberField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  onBlur={formField.onBlur}
                  error={error?.message}
                />
              );

            case "select":
            case "multiselect":
            case "radio":
              return (
                <SelectField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "checkbox":
            case "switch":
              return (
                <CheckboxField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "date":
            case "datetime":
            case "daterange":
              return (
                <DateField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "asyncselect":
              return (
                <AsyncSelectField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "creatable":
              return (
                <CreatableSelectField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "imagepicker":
              return (
                <ImagePickerField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "file":
              return (
                <FileUploadField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "richtext":
              return (
                <RichTextField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "color":
              return (
                <ColorField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            case "slider":
              return (
                <SliderField
                  field={field}
                  value={formField.value}
                  onChange={formField.onChange}
                  error={error?.message}
                />
              );

            default:
              return (
                <div className="text-red-500">
                  Unknown field type: {field.type}
                </div>
              );
          }
        }}
      />
    </div>
  );
}
```

**What this does:**

- ✅ Route to correct field component
- ✅ Handle React Hook Form integration
- ✅ Pass error messages
- ✅ Apply width classes
- ✅ Support all 17+ field types

---

### Day 3-5: Basic Field Components (3 days)

Now we create the actual field components. I'll show 2 complete examples, then summarize the rest.

#### Step 1.6: TextField Component (Complete Example)

**File:** `components/forms/fields/TextField.tsx`

```typescript
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/lib/dynamic-forms/types";

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: TextFieldProps) {
  const isTextarea = field.type === "textarea";

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}

      {isTextarea ? (
        <Textarea
          id={field.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={field.disabled}
          readOnly={field.readOnly}
          rows={field.rows || 4}
          className={error ? "border-destructive" : ""}
        />
      ) : (
        <Input
          id={field.name}
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={field.disabled}
          readOnly={field.readOnly}
          className={error ? "border-destructive" : ""}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

---

#### Step 1.7: SelectField Component (Complete Example)

**File:** `components/forms/fields/SelectField.tsx`

```typescript
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldConfig } from "@/lib/dynamic-forms/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SelectFieldProps {
  field: FieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

export function SelectField({
  field,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  // Radio Group
  if (field.type === "radio") {
    return (
      <div className="space-y-2">
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        <RadioGroup
          value={value as string}
          onValueChange={onChange}
          disabled={field.disabled}
        >
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`${field.name}-${option.value}`}
                disabled={option.disabled}
              />
              <Label
                htmlFor={`${field.name}-${option.value}`}
                className="font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  // Multi-select with checkboxes
  if (field.multiple || field.type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleToggle = (optionValue: string) => {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    };

    const removeValue = (optionValue: string) => {
      onChange(selectedValues.filter((v) => v !== optionValue));
    };

    return (
      <div className="space-y-2">
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}

        {/* Selected badges */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((val) => {
              const option = field.options?.find(
                (o) => String(o.value) === val
              );
              return (
                <Badge key={val} variant="secondary">
                  {option?.label || val}
                  <button
                    type="button"
                    onClick={() => removeValue(val)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Checkbox list */}
        <div className="space-y-2 rounded-md border p-4">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option.value}`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleToggle(String(option.value))}
                disabled={field.disabled || option.disabled}
              />
              <Label
                htmlFor={`${field.name}-${option.value}`}
                className="font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  // Single select dropdown
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <Select
        value={value as string}
        onValueChange={onChange}
        disabled={field.disabled}
      >
        <SelectTrigger
          id={field.name}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

---

#### Remaining Basic Fields (Summary)

**Day 3-5 continue with:**

**File:** `components/forms/fields/NumberField.tsx`

- Number input with step
- Currency format (prefix/suffix)
- Min/max validation
- Uses Phase 2 Input component

**File:** `components/forms/fields/CheckboxField.tsx`

- Checkbox for boolean
- Switch component
- Label with description
- Uses Phase 2 Checkbox/Switch

**File:** `components/forms/fields/DateField.tsx`

- Date picker (install `react-day-picker`)
- DateTime picker
- Date range picker
- Uses Phase 2 Popover + Calendar

```bash
# Install date picker
npx shadcn@latest add calendar
npx shadcn@latest add popover
```

**Test after Day 5:**

```typescript
// Test basic fields
const config: FormConfig = {
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'price', type: 'currency', label: 'Price', min: 0 },
    { name: 'category', type: 'select', label: 'Category', options: [...] },
    { name: 'tags', type: 'multiselect', label: 'Tags', options: [...] },
    { name: 'active', type: 'switch', label: 'Active' },
    { name: 'publishDate', type: 'date', label: 'Publish Date' },
  ],
};

<DynamicForm config={config} onSubmit={console.log} />
```

---

## 🛠️ Week 2: Advanced Fields

### Day 6-10: Advanced Field Components (5 days)

I'll provide summaries since these build on the same patterns:

#### Day 6: AsyncSelect & Creatable (1 day)

**File:** `components/forms/fields/AsyncSelectField.tsx`

- Uses TanStack Query for data fetching
- Searchable dropdown
- Loading state
- Error handling

```bash
# Already installed in Phase 1
@tanstack/react-query
```

**File:** `components/forms/fields/CreatableSelectField.tsx`

- Allow creating new options
- Validation before create
- Success toast
- Refer to `/docs/dynamic-forms/fields/10-creatable-select.md`

---

#### Day 7: ImagePicker (1 day)

**File:** `components/forms/fields/ImagePickerField.tsx`

- Gallery browser (React Query)
- URL paste input
- Multiple selection
- Preview thumbnails
- Refer to `/docs/dynamic-forms/fields/11-imagepicker-field.md`

```bash
# Install dialog and tabs
npx shadcn@latest add dialog
npx shadcn@latest add tabs
```

---

#### Day 8: FileUpload & RichText (1 day)

**File:** `components/forms/fields/FileUploadField.tsx`

- Drag & drop zone
- Multiple files
- Preview
- Progress bar

```bash
# Install file upload
npm install react-dropzone
```

**File:** `components/forms/fields/RichTextField.tsx`

- WYSIWYG editor
- Toolbar customization
- Image upload

```bash
# Install rich text editor
npm install @tiptap/react @tiptap/starter-kit
```

---

#### Day 9: Color & Slider (1 day)

**File:** `components/forms/fields/ColorField.tsx`

- Color picker
- HEX/RGB/HSL formats
- Preview swatch

```bash
# Install color picker
npm install react-colorful
```

**File:** `components/forms/fields/SliderField.tsx`

- Range slider
- Marks/labels
- Step control

```bash
npx shadcn@latest add slider
```

---

#### Day 10: Form Showcase & Examples (1 day)

**File:** `app/forms-showcase/page.tsx`

Create comprehensive showcase page similar to UI showcase but for forms:

```typescript
// Show all field types
// Show validation
// Show conditional fields
// Show different layouts
```

---

## ✅ Verification Checklist

### Week 1 Checklist

```bash
npm run dev
# Test basic form
```

- [ ] TypeScript types compile without errors
- [ ] DynamicForm renders correctly
- [ ] TextField works (text, textarea, email)
- [ ] NumberField works (number, currency)
- [ ] SelectField works (single, multi, radio)
- [ ] CheckboxField works (checkbox, switch)
- [ ] DateField works (date, datetime, range)
- [ ] Validation errors display
- [ ] Form submission works
- [ ] Reset button clears form

### Week 2 Checklist

- [ ] AsyncSelect loads options from API
- [ ] CreatableSelect creates new options
- [ ] ImagePicker shows gallery and URL input
- [ ] FileUpload accepts drag & drop
- [ ] RichText editor renders
- [ ] ColorField shows color picker
- [ ] SliderField displays range
- [ ] Forms showcase page complete
- [ ] All examples working
- [ ] No TypeScript errors

---

## 📦 Output Files Summary

### Core System

- ✅ `lib/dynamic-forms/types.ts` - TypeScript types
- ✅ `lib/dynamic-forms/validation.ts` - Zod schema generation
- ✅ `lib/dynamic-forms/utils.ts` - Helper functions
- ✅ `components/forms/DynamicForm.tsx` - Main form component
- ✅ `components/forms/DynamicField.tsx` - Field router

### Field Components (12 files)

- ✅ `components/forms/fields/TextField.tsx`
- ✅ `components/forms/fields/NumberField.tsx`
- ✅ `components/forms/fields/SelectField.tsx`
- ✅ `components/forms/fields/CheckboxField.tsx`
- ✅ `components/forms/fields/DateField.tsx`
- ✅ `components/forms/fields/AsyncSelectField.tsx`
- ✅ `components/forms/fields/CreatableSelectField.tsx`
- ✅ `components/forms/fields/ImagePickerField.tsx`
- ✅ `components/forms/fields/FileUploadField.tsx`
- ✅ `components/forms/fields/RichTextField.tsx`
- ✅ `components/forms/fields/ColorField.tsx`
- ✅ `components/forms/fields/SliderField.tsx`

### Showcase

- ✅ `app/forms-showcase/page.tsx` - Form examples

---

## 🚀 Usage Examples

### Simple Product Form

```typescript
const productForm: FormConfig = {
  fields: [
    { name: "name", type: "text", label: "Product Name", required: true },
    { name: "sku", type: "text", label: "SKU", required: true },
    { name: "description", type: "richtext", label: "Description" },
    { name: "price", type: "currency", label: "Price", min: 0 },
    {
      name: "category",
      type: "asyncselect",
      label: "Category",
      loadOptions: async (search) => {
        const res = await fetch(`/api/categories?search=${search}`);
        return res.json();
      },
    },
    { name: "tags", type: "creatable", label: "Tags", multiple: true },
    {
      name: "images",
      type: "imagepicker",
      label: "Images",
      multiple: true,
      maxImages: 5,
      galleryEndpoint: "/api/media/images",
    },
    { name: "active", type: "switch", label: "Active" },
  ],
  submitLabel: "Create Product",
};

<DynamicForm config={productForm} onSubmit={handleCreate} />;
```

### Form with Conditional Fields

```typescript
const config: FormConfig = {
  fields: [
    {
      name: "type",
      type: "select",
      label: "Product Type",
      options: [
        { label: "Physical", value: "physical" },
        { label: "Digital", value: "digital" },
      ],
    },
    {
      name: "weight",
      type: "number",
      label: "Weight (kg)",
      showWhen: { field: "type", is: "physical" },
    },
    {
      name: "downloadUrl",
      type: "url",
      label: "Download URL",
      showWhen: { field: "type", is: "digital" },
    },
  ],
};
```

---

## 🎯 Success Criteria

Phase 4 is complete when:

- ✅ All 12 field types implemented
- ✅ DynamicForm component works
- ✅ Validation with Zod functional
- ✅ Conditional fields render correctly
- ✅ Forms showcase page complete
- ✅ All examples working
- ✅ TypeScript errors = 0
- ✅ Can create product form in 10 lines
- ✅ Committed to Git

---

**Status:** Ready to implement  
**Estimated Time:** 2 weeks (10-14 days)  
**Next Phase:** [Phase 5: Data Tables →](./phase-5-data-tables.md)

Let's build the most powerful form system! 🚀
