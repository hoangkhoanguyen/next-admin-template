# Dynamic Forms System - MIGRATED TO MODULAR DOCS

> **⚠️ This file has been split into modular documentation**
>
> **📁 New Location:** `/docs/dynamic-forms/`
>
> **📖 Start Here:** [Dynamic Forms README](./dynamic-forms/README.md)

---

## 🔄 Migration Notice

This monolithic document (3500+ lines) has been **refactored into ~30 smaller, focused files** for better maintainability and discoverability.

---

## 🚀 Quick Navigation

### 📖 Start Here

👉 **[Dynamic Forms Documentation →](./dynamic-forms/README.md)**

### Core Concepts

- [Overview & Architecture](./dynamic-forms/01-overview.md) - Understand the system
- [Type Definitions](./dynamic-forms/02-types.md) - TypeScript interfaces

### Popular Field Types

- [Select & Multi-Select](./dynamic-forms/fields/07-select-fields.md) - Basic dropdowns
- [Async Select](./dynamic-forms/fields/08-async-select.md) - API-driven options
- [Searchable Select](./dynamic-forms/fields/09-searchable-select.md) - Large lists
- **[Creatable Select](./dynamic-forms/fields/10-creatable-select.md)** - User-created options ⭐

### Advanced Features

- [Conditional Logic](./dynamic-forms/advanced/19-conditional-logic.md) - Show/hide fields
- [Dependent Fields](./dynamic-forms/advanced/20-dependent-fields.md) - Cascading selects

---

## 📁 New Documentation Structure

```
docs/dynamic-forms/
├── README.md                          # Main entry point
├── 01-overview.md                     # Architecture
├── 02-types.md                        # TypeScript types
│
├── fields/                            # Field-specific docs
│   ├── 07-select-fields.md
│   ├── 08-async-select.md
│   ├── 09-searchable-select.md
│   ├── 10-creatable-select.md        # NEW! ⭐
│   └── ... (15+ more)
│
├── advanced/                          # Advanced features
│   ├── 19-conditional-logic.md
│   ├── 20-dependent-fields.md
│   └── ...
│
├── implementation/                    # Implementation guides
│   ├── 24-dynamic-form.md
│   └── ...
│
└── examples/                          # Real-world examples
    ├── 27-user-form.md
    └── ...
```

---

## 📖 Benefits of Modular Docs

### Before (Monolithic - This File)

- ❌ 3580 lines in single file
- ❌ Hard to navigate
- ❌ Difficult to update
- ❌ Poor discoverability

### After (Modular)

- ✅ ~30 focused files (~100-300 lines each)
- ✅ Easy navigation
- ✅ Update independently
- ✅ Better search & discovery

---

## 🗺️ Content Mapping

| Old Section (This File) | New Location                                                                |
| ----------------------- | --------------------------------------------------------------------------- |
| Type Definitions        | [02-types.md](./dynamic-forms/02-types.md)                                  |
| Basic Select            | [07-select-fields.md](./dynamic-forms/fields/07-select-fields.md)           |
| Async Select            | [08-async-select.md](./dynamic-forms/fields/08-async-select.md)             |
| Searchable Select       | [09-searchable-select.md](./dynamic-forms/fields/09-searchable-select.md)   |
| Creatable Select        | [10-creatable-select.md](./dynamic-forms/fields/10-creatable-select.md)     |
| Conditional Logic       | [19-conditional-logic.md](./dynamic-forms/advanced/19-conditional-logic.md) |

---

## ⚠️ Deprecation Timeline

- **Now:** This file is deprecated (kept for reference)
- **Sprint 2:** Will be removed after verifying all links
- **Action Required:** Update bookmarks to use new docs

---

**👉 Continue to:** [Dynamic Forms Documentation →](./dynamic-forms/README.md)

---

---

---

# ⬇️ ARCHIVED CONTENT (For Reference Only)

> **📌 Content below is ARCHIVED. Use new modular docs above.**

---

# Dynamic Forms - Complete Guide (ARCHIVED)

1. [Tổng Quan](#tổng-quan)
2. [Architecture](#architecture)
3. [Type Definitions](#type-definitions)
4. [Core Components](#core-components)
5. [Form Schema Generator](#form-schema-generator)
6. [Advanced Layout System](#advanced-layout-system)
7. [Dynamic Options for Select Fields](#dynamic-options-for-select-fields)
8. [Form Configs Examples](#form-configs-examples)
9. [Advanced Features](#advanced-features)
10. [Best Practices](#best-practices)
11. [API-Driven Forms](#api-driven-forms)

---

## Tổng Quan

### ❓ Dynamic Form là gì?

**Dynamic Form** là hệ thống form được generate tự động từ **configuration object** thay vì hard-code từng field.

### ✅ Lợi ích trong Admin Dashboard

| Benefit               | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| **Reusability**       | Một component cho tất cả forms (User, Product, Order, etc.)  |
| **Maintainability**   | Thay đổi form chỉ cần sửa config, không touch component code |
| **Consistency**       | All forms có same styling, validation, behavior              |
| **Flexibility**       | Dễ dàng add/remove fields, change layout                     |
| **API-Driven**        | Form config có thể fetch từ backend (CMS)                    |
| **Conditional Logic** | Show/hide fields based on other field values                 |
| **Multi-tenant**      | Different form configs cho different tenants                 |

### 🎯 Use Cases trong Toy Store Admin

- ✅ User management forms (Create/Edit User)
- ✅ Product management forms (Create/Edit Product)
- ✅ Order forms
- ✅ Category forms
- ✅ Settings forms
- ✅ Custom forms từ CMS

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Form Configuration                      │
│  (JSON/Object - có thể fetch từ API)                     │
│                                                           │
│  {                                                        │
│    fields: [                                             │
│      { name: 'name', type: 'text', label: '...', ... }  │
│      { name: 'email', type: 'email', ... }              │
│    ]                                                      │
│  }                                                        │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│          Form Schema Generator (Zod)                      │
│  Auto-generate Zod schema từ field configs               │
│                                                           │
│  generateFormSchema(fields) =>                           │
│    z.object({                                            │
│      name: z.string().min(1),                           │
│      email: z.string().email(),                         │
│    })                                                    │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│               DynamicForm Component                       │
│  - Initialize React Hook Form với Zod schema            │
│  - Render fields dựa trên config                        │
│  - Handle conditional logic                             │
│  - Layout management (grid, sections)                   │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│              DynamicField Component                       │
│  Map field type → Shadcn UI component                   │
│  - text → Input                                         │
│  - select → Select                                      │
│  - checkbox → Checkbox                                  │
│  - date → DatePicker                                    │
│  - etc.                                                 │
└──────────────────────────────────────────────────────────┘
```

### Flow Diagram

```
User edits field
      ↓
React Hook Form detects change
      ↓
Zod validation (runtime)
      ↓
Update form state
      ↓
Re-render affected fields
      ↓
Check conditional logic
      ↓
Show/hide dependent fields
      ↓
Submit → Validated data
```

---

## Type Definitions

### File: `lib/types/dynamic-form.types.ts`

```typescript
import { z } from "zod";

// ========================================
// Field Types
// ========================================
export type FieldType =
  | "text" // Text input
  | "email" // Email input với validation
  | "password" // Password input
  | "number" // Number input
  | "textarea" // Textarea (multi-line)
  | "select" // Single select dropdown
  | "multiselect" // Multiple select
  | "checkbox" // Single checkbox
  | "radio" // Radio group
  | "switch" // Toggle switch
  | "date" // Date picker
  | "datetime" // Date + Time picker
  | "time" // Time picker
  | "file" // File upload
  | "image" // Image upload với preview
  | "richtext"; // Rich text editor (optional)

// ========================================
// Select Options
// ========================================
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

// ========================================
// Conditional Logic
// ========================================
export type ConditionalOperator =
  | "equals" // field === value
  | "notEquals" // field !== value
  | "includes" // field.includes(value) - for arrays
  | "notIncludes" // !field.includes(value)
  | "greaterThan" // field > value
  | "lessThan" // field < value
  | "isEmpty" // !field || field.length === 0
  | "isNotEmpty"; // field && field.length > 0

export interface ConditionalLogic {
  field: string; // Field name to watch
  operator: ConditionalOperator; // Comparison operator
  value?: any; // Value to compare (optional for isEmpty/isNotEmpty)
}

// ========================================
// Field Configuration
// ========================================
export interface FieldConfig {
  // Basic
  name: string; // Field name (unique)
  type: FieldType; // Field type
  label: string; // Field label
  placeholder?: string; // Placeholder text
  description?: string; // Helper text below field
  defaultValue?: any; // Default value

  // Validation
  required?: boolean; // Is required?
  validation?: z.ZodType<any>; // Custom Zod schema (override auto-generation)

  // Conditional Rendering
  showWhen?: ConditionalLogic; // Show field when condition is met
  hideWhen?: ConditionalLogic; // Hide field when condition is met

  // Type-specific Options
  options?: SelectOption[]; // For select, radio, multiselect
  loadOptions?: () => Promise<SelectOption[]>; // Async load options
  optionsEndpoint?: string; // API endpoint to fetch options
  optionsQueryKey?: string[]; // React Query key for options
  searchable?: boolean; // Enable search/filter in select
  creatable?: boolean; // Allow creating new options
  clearable?: boolean; // Allow clearing selection
  accept?: string; // For file/image upload (e.g., 'image/*')
  multiple?: boolean; // For file upload, select
  rows?: number; // For textarea
  min?: number; // For number, date
  max?: number; // For number, date
  step?: number; // For number
  maxLength?: number; // For text, textarea
  minLength?: number; // For text, textarea
  pattern?: string; // Regex pattern for validation

  // Layout Control (Advanced Grid)
  className?: string; // Custom CSS classes
  gridColumn?: string; // CSS grid-column value (e.g., 'span 2', '1 / 3')
  gridRow?: string; // CSS grid-row value (e.g., 'span 2', '1 / 3')
  colSpan?: number; // Số columns chiếm (1-12) - Simple API
  rowSpan?: number; // Số rows chiếm (1-n) - Simple API
  colStart?: number; // Vị trí bắt đầu column (1-12)
  colEnd?: number; // Vị trí kết thúc column (1-13)
  rowStart?: number; // Vị trí bắt đầu row
  rowEnd?: number; // Vị trí kết thúc row
  order?: number; // Order trong flexbox/grid
  fullWidth?: boolean; // Take full width (alias for colSpan: max)

  // State
  disabled?: boolean; // Disable field
  readOnly?: boolean; // Read-only field

  // Custom Rendering
  render?: (props: {
    // Custom render function
    value: any;
    onChange: (value: any) => void;
    error?: string;
  }) => React.ReactNode;
}

// ========================================
// Form Section
// ========================================
export interface FormSection {
  title?: string; // Section title
  description?: string; // Section description
  fields: FieldConfig[]; // Fields in this section
  collapsible?: boolean; // Can collapse section?
  defaultCollapsed?: boolean; // Is collapsed by default?
  className?: string; // Custom CSS classes
}

// ========================================
// Form Configuration
// ========================================
export interface FormConfig {
  // Structure
  sections?: FormSection[]; // Form với sections
  fields?: FieldConfig[]; // Simple form (no sections)

  // Layout
  layout?: "vertical" | "horizontal" | "grid" | "flex";
  columns?: number; // For grid layout (default: 2, max: 12)
  rows?: number; // For grid layout (auto by default)
  spacing?: "compact" | "normal" | "comfortable";
  gap?: number; // Custom gap value (in tailwind units: 0-12)
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";

  // Actions
  submitLabel?: string; // Submit button label
  resetLabel?: string; // Reset button label
  showReset?: boolean; // Show reset button?
  cancelLabel?: string; // Cancel button label
  onCancel?: () => void; // Cancel handler

  // Behavior
  resetOnSubmit?: boolean; // Reset form after submit?
  focusFirstError?: boolean; // Focus first error on submit?

  // Styling
  className?: string; // Custom CSS classes
}

// ========================================
// Form Submission Data
// ========================================
export type FormSubmitHandler<T = any> = (
  data: T,
  event?: React.BaseSyntheticEvent
) => void | Promise<void>;
```

---

## Core Components

### 1. Form Schema Generator

**File**: `lib/utils/form-schema-generator.ts`

```typescript
import { z } from "zod";
import { type FieldConfig } from "@/lib/types/dynamic-form.types";

/**
 * Auto-generate Zod schema từ field configs
 * Tận dụng Zod để validate runtime và infer types
 */
export function generateFormSchema(fields: FieldConfig[]) {
  const schemaObject: Record<string, z.ZodType<any>> = {};

  fields.forEach((field) => {
    // Nếu field có custom validation schema, dùng nó
    if (field.validation) {
      schemaObject[field.name] = field.validation;
      return;
    }

    // Auto-generate schema dựa trên field type
    let schema: z.ZodType<any> = getBaseSchema(field);

    // Apply additional validation rules
    schema = applyValidationRules(schema, field);

    // Make optional if not required
    if (!field.required) {
      schema = schema.optional();
    }

    schemaObject[field.name] = schema;
  });

  return z.object(schemaObject);
}

/**
 * Get base Zod schema for field type
 */
function getBaseSchema(field: FieldConfig): z.ZodType<any> {
  switch (field.type) {
    case "text":
    case "textarea":
    case "password":
      return z.string();

    case "email":
      return z.string().email("Invalid email address");

    case "number":
      return z.coerce.number(); // Coerce string to number

    case "select":
    case "radio":
      if (field.options && field.options.length > 0) {
        const values = field.options.map((opt) => String(opt.value));
        return z.enum(values as [string, ...string[]]);
      }
      return z.string();

    case "multiselect":
      return z.array(z.string());

    case "checkbox":
    case "switch":
      return z.boolean().default(false);

    case "date":
    case "datetime":
    case "time":
      return z.date();

    case "file":
    case "image":
      if (field.multiple) {
        return z.array(z.instanceof(File));
      }
      return z.instanceof(File);

    case "richtext":
      return z.string();

    default:
      return z.any();
  }
}

/**
 * Apply additional validation rules
 */
function applyValidationRules(
  schema: z.ZodType<any>,
  field: FieldConfig
): z.ZodType<any> {
  // String validations
  if (schema instanceof z.ZodString) {
    if (field.required) {
      schema = schema.min(1, `${field.label} is required`);
    }

    if (field.minLength) {
      schema = schema.min(
        field.minLength,
        `Must be at least ${field.minLength} characters`
      );
    }

    if (field.maxLength) {
      schema = schema.max(
        field.maxLength,
        `Must be at most ${field.maxLength} characters`
      );
    }

    if (field.pattern) {
      schema = schema.regex(new RegExp(field.pattern), "Invalid format");
    }
  }

  // Number validations
  if (schema instanceof z.ZodNumber) {
    if (field.min !== undefined) {
      schema = schema.min(field.min, `Must be at least ${field.min}`);
    }

    if (field.max !== undefined) {
      schema = schema.max(field.max, `Must be at most ${field.max}`);
    }
  }

  return schema;
}

/**
 * Infer TypeScript type từ form config
 */
export type InferFormData<T extends FieldConfig[]> = z.infer<
  ReturnType<typeof generateFormSchema>
>;
```

### 2. DynamicField Component

**File**: `components/forms/DynamicField.tsx`

```typescript
"use client";

import { type Control } from "react-hook-form";
import { type FieldConfig } from "@/lib/types/dynamic-form.types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DynamicFieldProps {
  field: FieldConfig;
  control: Control<any>;
  className?: string;
}

export function DynamicField({ field, control, className }: DynamicFieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn(className, field.className)}>
          {/* Label */}
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>

          {/* Field Input */}
          <FormControl>
            {field.render
              ? // Custom render function
                field.render({
                  value: formField.value,
                  onChange: formField.onChange,
                })
              : // Default render based on type
                renderFieldByType(field, formField)}
          </FormControl>

          {/* Description */}
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}

          {/* Error Message */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Render field based on type
 */
function renderFieldByType(config: FieldConfig, formField: any) {
  const commonProps = {
    disabled: config.disabled,
    readOnly: config.readOnly,
  };

  switch (config.type) {
    // ========================================
    // TEXT INPUTS
    // ========================================
    case "text":
    case "email":
    case "password":
      return (
        <Input
          type={config.type}
          placeholder={config.placeholder}
          maxLength={config.maxLength}
          {...commonProps}
          {...formField}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={config.placeholder}
          min={config.min}
          max={config.max}
          step={config.step}
          {...commonProps}
          {...formField}
          onChange={(e) => formField.onChange(Number(e.target.value))}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={config.placeholder}
          rows={config.rows || 4}
          maxLength={config.maxLength}
          {...commonProps}
          {...formField}
        />
      );

    // ========================================
    // SELECT
    // ========================================
    case "select":
      return (
        <Select
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          disabled={config.disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={config.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                disabled={option.disabled}
              >
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className="h-4 w-4" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    // ========================================
    // CHECKBOX & SWITCH
    // ========================================
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formField.value}
            onCheckedChange={formField.onChange}
            disabled={config.disabled}
          />
        </div>
      );

    case "switch":
      return (
        <Switch
          checked={formField.value}
          onCheckedChange={formField.onChange}
          disabled={config.disabled}
        />
      );

    // ========================================
    // RADIO
    // ========================================
    case "radio":
      return (
        <RadioGroup
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          disabled={config.disabled}
        >
          {config.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                disabled={option.disabled}
              />
              <label className="text-sm font-normal">{option.label}</label>
            </div>
          ))}
        </RadioGroup>
      );

    // ========================================
    // DATE PICKER
    // ========================================
    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formField.value && "text-muted-foreground"
              )}
              disabled={config.disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formField.value ? (
                format(formField.value, "PPP")
              ) : (
                <span>{config.placeholder || "Pick a date"}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formField.value}
              onSelect={formField.onChange}
              disabled={config.disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );

    // ========================================
    // DEFAULT
    // ========================================
    default:
      return (
        <Input
          placeholder={config.placeholder}
          {...commonProps}
          {...formField}
        />
      );
  }
}
```

### 3. DynamicForm Component

**File**: `components/forms/DynamicForm.tsx`

```typescript
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FormConfig,
  type FieldConfig,
  type FormSubmitHandler,
} from "@/lib/types/dynamic-form.types";
import { generateFormSchema } from "@/lib/utils/form-schema-generator";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DynamicField } from "./DynamicField";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: FormSubmitHandler;
  defaultValues?: Record<string, any>;
  isLoading?: boolean;
  className?: string;
}

export function DynamicForm({
  config,
  onSubmit,
  defaultValues = {},
  isLoading = false,
  className,
}: DynamicFormProps) {
  // ========================================
  // Get all fields từ config
  // ========================================
  const allFields = React.useMemo(() => {
    if (config.sections) {
      return config.sections.flatMap((section) => section.fields);
    }
    return config.fields || [];
  }, [config]);

  // ========================================
  // Generate Zod schema
  // ========================================
  const schema = React.useMemo(
    () => generateFormSchema(allFields),
    [allFields]
  );

  // ========================================
  // Initialize React Hook Form
  // ========================================
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...allFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue ?? defaultValues[field.name],
        }),
        {}
      ),
    },
  });

  // ========================================
  // Watch all values for conditional logic
  // ========================================
  const watchedValues = form.watch();

  // ========================================
  // Check if field should be shown
  // ========================================
  const shouldShowField = React.useCallback(
    (field: FieldConfig): boolean => {
      // Check showWhen condition
      if (field.showWhen) {
        const dependentValue = watchedValues[field.showWhen.field];
        const shouldShow = evaluateCondition(
          dependentValue,
          field.showWhen.operator,
          field.showWhen.value
        );
        if (!shouldShow) return false;
      }

      // Check hideWhen condition
      if (field.hideWhen) {
        const dependentValue = watchedValues[field.hideWhen.field];
        const shouldHide = evaluateCondition(
          dependentValue,
          field.hideWhen.operator,
          field.hideWhen.value
        );
        if (shouldHide) return false;
      }

      return true;
    },
    [watchedValues]
  );

  // ========================================
  // Handle submit
  // ========================================
  const handleSubmit = async (data: any, event?: React.BaseSyntheticEvent) => {
    await onSubmit(data, event);

    if (config.resetOnSubmit) {
      form.reset();
    }
  };

  // ========================================
  // Render fields
  // ========================================
  const renderFields = (fields: FieldConfig[]) => {
    return fields
      .filter(shouldShowField)
      .map((field) => (
        <DynamicField
          key={field.name}
          field={field}
          control={form.control}
          className={field.gridColumn ? `col-span-${field.gridColumn}` : ""}
        />
      ));
  };

  // ========================================
  // Get grid columns class
  // ========================================
  const getGridClass = () => {
    if (config.layout !== "grid") return "";
    const cols = config.columns || 2;
    return `grid grid-cols-1 md:grid-cols-${cols} gap-4`;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", className)}
      >
        {/* ========================================
            SECTIONS LAYOUT
            ======================================== */}
        {config.sections ? (
          config.sections.map((section, index) => {
            const [isOpen, setIsOpen] = React.useState(
              !section.defaultCollapsed
            );

            const content = (
              <div className={cn(getGridClass(), section.className)}>
                {renderFields(section.fields)}
              </div>
            );

            return (
              <div key={index} className="space-y-4">
                {/* Section Header */}
                {(section.title || section.description) && (
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Section Content */}
                {section.collapsible ? (
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="mb-2">
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                        {isOpen ? "Collapse" : "Expand"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>{content}</CollapsibleContent>
                  </Collapsible>
                ) : (
                  content
                )}
              </div>
            );
          })
        ) : (
          /* ========================================
              SIMPLE FIELDS LAYOUT
              ======================================== */
          <div className={getGridClass()}>{renderFields(allFields)}</div>
        )}

        {/* ========================================
            FORM ACTIONS
            ======================================== */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : config.submitLabel || "Submit"}
          </Button>

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

          {config.onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={config.onCancel}
              disabled={isLoading}
            >
              {config.cancelLabel || "Cancel"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

/**
 * Evaluate conditional logic
 */
function evaluateCondition(
  value: any,
  operator: string,
  compareValue?: any
): boolean {
  switch (operator) {
    case "equals":
      return value === compareValue;
    case "notEquals":
      return value !== compareValue;
    case "includes":
      return Array.isArray(value) && value.includes(compareValue);
    case "notIncludes":
      return Array.isArray(value) && !value.includes(compareValue);
    case "greaterThan":
      return Number(value) > Number(compareValue);
    case "lessThan":
      return Number(value) < Number(compareValue);
    case "isEmpty":
      return !value || (Array.isArray(value) && value.length === 0);
    case "isNotEmpty":
      return !!value && (!Array.isArray(value) || value.length > 0);
    default:
      return true;
  }
}
```

---

## Advanced Layout System

### 🎨 Tổng quan Layout Control

Dynamic Form hỗ trợ **nhiều cấp độ** control layout:

1. **Form-level**: Layout cho toàn bộ form
2. **Section-level**: Layout riêng cho từng section
3. **Field-level**: Control chi tiết từng field (column span, row span, position)

### 📐 Grid System

Sử dụng **CSS Grid** với 12-column system (như Bootstrap, Tailwind):

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │ 12  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

### 🔧 Layout APIs

#### 1. Simple API (Recommended)

```typescript
{
  name: 'title',
  type: 'text',
  label: 'Title',
  colSpan: 2,        // Chiếm 2 columns
  rowSpan: 1,        // Chiếm 1 row (default)
}
```

#### 2. Advanced API (Full Control)

```typescript
{
  name: 'description',
  type: 'textarea',
  label: 'Description',
  colStart: 1,       // Bắt đầu từ column 1
  colEnd: 13,        // Kết thúc ở column 13 (full width)
  rowStart: 2,       // Bắt đầu từ row 2
  rowEnd: 4,         // Kết thúc ở row 4 (span 2 rows)
}
```

#### 3. CSS Grid API (Maximum Control)

```typescript
{
  name: 'featured',
  type: 'switch',
  label: 'Featured',
  gridColumn: '1 / -1',    // Full width
  gridRow: 'span 2',       // Span 2 rows
}
```

### 📋 Layout Examples

#### Example 1: Basic Grid Layout

```typescript
const basicGridConfig: FormConfig = {
  layout: "grid",
  columns: 3, // 3 columns
  gap: 4, // gap-4
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      colSpan: 1, // 1 column
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      colSpan: 1, // 1 column
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      colSpan: 1, // 1 column
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      colSpan: 3, // Full width (3/3 columns)
    },
  ],
};

// Visual result:
// ┌─────────────┬─────────────┬─────────────┐
// │ First Name  │ Last Name   │   Email     │
// ├─────────────┴─────────────┴─────────────┤
// │           Address (full width)          │
// └─────────────────────────────────────────┘
```

#### Example 2: Complex Layout với Row Span

```typescript
const complexLayoutConfig: FormConfig = {
  layout: "grid",
  columns: 4,
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      colSpan: 3, // Chiếm 3 columns
      rowSpan: 1,
    },
    {
      name: "featured",
      type: "switch",
      label: "Featured",
      colSpan: 1, // Chiếm 1 column
      rowSpan: 2, // Chiếm 2 rows (span xuống dòng dưới)
    },
    {
      name: "subtitle",
      type: "text",
      label: "Subtitle",
      colSpan: 3, // Chiếm 3 columns
      rowSpan: 1,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      colSpan: 4, // Full width
      rowSpan: 1,
    },
  ],
};

// Visual result:
// ┌─────────────────────────────────┬───────────┐
// │           Title (col 1-3)       │ Featured  │
// ├─────────────────────────────────┤ (row 1-2) │
// │         Subtitle (col 1-3)      │           │
// ├─────────────────────────────────┴───────────┤
// │       Description (full width)              │
// └─────────────────────────────────────────────┘
```

#### Example 3: Asymmetric Layout

```typescript
const asymmetricConfig: FormConfig = {
  layout: "grid",
  columns: 6,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Product Name",
      colSpan: 4, // 4/6 columns
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
      colSpan: 2, // 2/6 columns
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      colSpan: 2, // 2/6 columns
    },
    {
      name: "price",
      type: "number",
      label: "Price",
      colSpan: 2, // 2/6 columns
    },
    {
      name: "stock",
      type: "number",
      label: "Stock",
      colSpan: 2, // 2/6 columns
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      colSpan: 6, // Full width
      rows: 5,
    },
  ],
};

// Visual result:
// ┌───────────────────────────────────┬─────────────┐
// │      Product Name (4 cols)        │  SKU (2)    │
// ├─────────────┬─────────────┬───────┴─────────────┤
// │ Category(2) │  Price (2)  │    Stock (2)        │
// ├─────────────┴─────────────┴─────────────────────┤
// │         Description (full width)                │
// └─────────────────────────────────────────────────┘
```

#### Example 4: Responsive Layout (Mobile-First)

```typescript
const responsiveConfig: FormConfig = {
  layout: "grid",
  columns: 1, // 1 column on mobile
  // Sẽ override trong component với responsive classes
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      className: "md:col-span-2", // 2 columns on tablet+
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      className: "md:col-span-2", // 2 columns on tablet+
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
      className: "md:col-span-1", // 1 column on tablet+
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      className: "md:col-span-3", // Full width on tablet+
    },
  ],
};

// Responsive behavior:
// Mobile (1 col):     Tablet/Desktop (3 cols):
// ┌─────────────┐     ┌───────────┬───────────┬───────────┐
// │    Name     │     │   Name (span 2)       │  Phone    │
// ├─────────────┤     ├───────────────────────┴───────────┤
// │    Email    │     │   Email (span 2)      │           │
// ├─────────────┤     ├───────────────────────────────────┤
// │    Phone    │     │      Address (full width)         │
// ├─────────────┤     └───────────────────────────────────┘
// │   Address   │
// └─────────────┘
```

#### Example 5: Dashboard-style Layout

```typescript
const dashboardFormConfig: FormConfig = {
  layout: "grid",
  columns: 12, // 12-column grid (like Bootstrap)
  gap: 4,
  fields: [
    // Header row
    {
      name: "title",
      type: "text",
      label: "Dashboard Title",
      colSpan: 8, // 8/12 columns
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      colSpan: 4, // 4/12 columns
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
      ],
    },

    // Stats row
    {
      name: "totalViews",
      type: "number",
      label: "Total Views",
      colSpan: 3, // Quarter width
      disabled: true,
    },
    {
      name: "totalClicks",
      type: "number",
      label: "Total Clicks",
      colSpan: 3,
      disabled: true,
    },
    {
      name: "conversionRate",
      type: "number",
      label: "Conversion Rate",
      colSpan: 3,
      disabled: true,
    },
    {
      name: "revenue",
      type: "number",
      label: "Revenue",
      colSpan: 3,
      disabled: true,
    },

    // Content area
    {
      name: "content",
      type: "textarea",
      label: "Content",
      colSpan: 8, // Main content area
      rowSpan: 3, // Tall content area
      rows: 10,
    },

    // Sidebar
    {
      name: "tags",
      type: "text",
      label: "Tags",
      colSpan: 4, // Sidebar
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      colSpan: 4,
      options: [],
    },
    {
      name: "featured",
      type: "switch",
      label: "Featured",
      colSpan: 4,
    },
  ],
};

// Visual result:
// ┌─────────────────────────────────────────┬─────────────────┐
// │        Dashboard Title (8 cols)         │  Status (4)     │
// ├───────────┬───────────┬───────────┬─────┴─────────────────┤
// │ Views (3) │ Clicks(3) │ Conv.(3)  │   Revenue (3)         │
// ├───────────┴───────────┴───────────┴───────┬───────────────┤
// │                                            │   Tags (4)    │
// │         Content (8 cols)                   ├───────────────┤
// │         (3 rows tall)                      │ Category (4)  │
// │                                            ├───────────────┤
// │                                            │ Featured (4)  │
// └────────────────────────────────────────────┴───────────────┘
```

### 🔨 Implementation Updates

#### Updated DynamicField Component

```typescript
// components/forms/DynamicField.tsx

export function DynamicField({ field, control, className }: DynamicFieldProps) {
  // Generate grid classes from field config
  const gridClasses = getGridClasses(field);

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn(className, field.className, gridClasses)}>
          {/* ... rest of component */}
        </FormItem>
      )}
    />
  );
}

/**
 * Generate Tailwind grid classes from field config
 */
function getGridClasses(field: FieldConfig): string {
  const classes: string[] = [];

  // Column span (simple API)
  if (field.colSpan) {
    classes.push(`col-span-${field.colSpan}`);
  }

  // Row span (simple API)
  if (field.rowSpan && field.rowSpan > 1) {
    classes.push(`row-span-${field.rowSpan}`);
  }

  // Column start/end (advanced API)
  if (field.colStart) {
    classes.push(`col-start-${field.colStart}`);
  }
  if (field.colEnd) {
    classes.push(`col-end-${field.colEnd}`);
  }

  // Row start/end (advanced API)
  if (field.rowStart) {
    classes.push(`row-start-${field.rowStart}`);
  }
  if (field.rowEnd) {
    classes.push(`row-end-${field.rowEnd}`);
  }

  // Order
  if (field.order) {
    classes.push(`order-${field.order}`);
  }

  // Full width shortcut
  if (field.fullWidth) {
    classes.push("col-span-full");
  }

  return classes.join(" ");
}
```

#### Updated DynamicForm Component

```typescript
// components/forms/DynamicForm.tsx

export function DynamicForm({ config, ... }: DynamicFormProps) {
  // ... existing code

  // Get grid classes for form/section
  const getGridClass = (sectionConfig?: FormSection) => {
    const layoutConfig = sectionConfig || config;

    if (layoutConfig.layout !== 'grid') {
      return '';
    }

    const cols = layoutConfig.columns || 2;
    const gap = layoutConfig.gap || 4;

    let classes = `grid gap-${gap}`;

    // Grid columns (responsive)
    classes += ` grid-cols-1 md:grid-cols-${Math.min(cols, 6)} lg:grid-cols-${cols}`;

    // Rows (if specified)
    if (layoutConfig.rows) {
      classes += ` grid-rows-${layoutConfig.rows}`;
    } else {
      classes += ' auto-rows-auto';
    }

    // Alignment
    if (layoutConfig.alignItems) {
      classes += ` items-${layoutConfig.alignItems}`;
    }

    if (layoutConfig.justifyContent) {
      const justifyMap = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      };
      classes += ` ${justifyMap[layoutConfig.justifyContent]}`;
    }

    return classes;
  };

  // ... rest of component
}
```

### 📱 Responsive Layout Strategy

```typescript
// Tailwind safelist trong tailwind.config.ts
// Ensure these classes are not purged

module.exports = {
  safelist: [
    // Column spans
    "col-span-1",
    "col-span-2",
    "col-span-3",
    "col-span-4",
    "col-span-5",
    "col-span-6",
    "col-span-7",
    "col-span-8",
    "col-span-9",
    "col-span-10",
    "col-span-11",
    "col-span-12",
    "col-span-full",

    // Row spans
    "row-span-1",
    "row-span-2",
    "row-span-3",
    "row-span-4",
    "row-span-5",
    "row-span-6",

    // Column start/end
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
    "col-start-8",
    "col-start-9",
    "col-start-10",
    "col-start-11",
    "col-start-12",
    "col-end-1",
    "col-end-2",
    "col-end-3",
    "col-end-4",
    "col-end-5",
    "col-end-6",
    "col-end-7",
    "col-end-8",
    "col-end-9",
    "col-end-10",
    "col-end-11",
    "col-end-12",
    "col-end-13",

    // Grid columns
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12",

    // Gaps
    "gap-0",
    "gap-1",
    "gap-2",
    "gap-3",
    "gap-4",
    "gap-5",
    "gap-6",
    "gap-7",
    "gap-8",
  ],
};
```

### 🎯 Layout Best Practices

#### ✅ DO

```typescript
// 1. Use colSpan for simple layouts
{
  colSpan: 2,  // Easy to understand
}

// 2. Use responsive classes in className
{
  className: 'col-span-1 md:col-span-2 lg:col-span-3',
}

// 3. Group related fields
{
  sections: [
    {
      title: 'Personal Info',
      fields: [/* related fields */],
    }
  ]
}

// 4. Full width for important fields
{
  name: 'description',
  type: 'textarea',
  fullWidth: true,  // or colSpan: max
}
```

#### ❌ DON'T

```typescript
// 1. Don't over-complicate
{
  colStart: 3,
  colEnd: 7,
  rowStart: 2,
  rowEnd: 5,
  // Too complex, use colSpan/rowSpan instead
}

// 2. Don't use inconsistent columns
// Form has columns: 3, but field has colSpan: 4 ❌

// 3. Don't forget mobile
// Always think mobile-first
{
  className: 'col-span-6',  // Will break on mobile
  // Better:
  className: 'col-span-1 md:col-span-6',
}
```

### 🌟 Pro Tips

1. **Visual Grid Helper** (Development)

```typescript
// Add to form during development
<div className="grid grid-cols-12 gap-4 border border-dashed">
  {[...Array(12)].map((_, i) => (
    <div key={i} className="border bg-gray-100 p-2 text-center">
      {i + 1}
    </div>
  ))}
</div>
```

2. **Grid Template Areas** (CSS Grid Advanced)

```typescript
// For complex layouts, consider using grid-template-areas
// in custom CSS with className
```

3. **Auto-fit / Auto-fill**

```typescript
// For dynamic number of columns
className: "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]";
```

---

## Dynamic Options for Select Fields

### 🎯 Tổng quan

Select/Multi-select fields hỗ trợ **nhiều cách** để load options:

1. **Static Options** - Hard-coded trong config
2. **Dynamic Options** - Passed từ component props
3. **Async Options** - Fetch từ API với React Query
4. **Searchable Options** - Search/filter trong large lists
5. **Creatable Options** - Cho phép user tạo option mới
6. **Dependent Options** - Options thay đổi dựa trên field khác

### 📋 Method 1: Static Options (Simple)

```typescript
// Hardcoded options trong config
const formConfig: FormConfig = {
  fields: [
    {
      name: "role",
      type: "select",
      label: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
    },
  ],
};
```

**Use case**: Fixed options (status, role, enum values)

---

### 📋 Method 2: Dynamic Options from Props

```typescript
// ========================================
// Pass options từ component
// ========================================
function UserForm() {
  const { data: roles } = useRoles(); // Fetch from API

  const formConfig: FormConfig = {
    fields: [
      {
        name: "role",
        type: "select",
        label: "Role",
        options:
          roles?.map((role) => ({
            label: role.name,
            value: role.id,
          })) || [],
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

**Use case**: Options cần fetch từ API, thay đổi runtime

---

### 📋 Method 3: Async Options with React Query

```typescript
// ========================================
// Built-in async loading trong DynamicField
// ========================================

// 1. Field config với loadOptions
{
  name: 'category',
  type: 'select',
  label: 'Category',
  loadOptions: async () => {
    const categories = await fetchCategories();
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  },
}

// 2. Hoặc dùng endpoint + React Query
{
  name: 'category',
  type: 'select',
  label: 'Category',
  optionsEndpoint: '/api/categories',
  optionsQueryKey: ['categories'],
}
```

**Implementation trong DynamicField**:

```typescript
// components/forms/DynamicField.tsx

function SelectFieldWithAsyncOptions({ field, formField }: any) {
  const [options, setOptions] = React.useState<SelectOption[]>(
    field.options || []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Method 1: loadOptions function
  React.useEffect(() => {
    if (field.loadOptions && !field.options) {
      setIsLoading(true);
      field
        .loadOptions()
        .then((opts: SelectOption[]) => {
          setOptions(opts);
          setIsLoading(false);
        })
        .catch((error: Error) => {
          console.error("Failed to load options:", error);
          setIsLoading(false);
        });
    }
  }, [field.loadOptions]);

  // Method 2: React Query với endpoint
  const { data: apiOptions } = useQuery({
    queryKey: field.optionsQueryKey || ["select-options", field.name],
    queryFn: () => apiClient.get(field.optionsEndpoint).then((res) => res.data),
    enabled: !!field.optionsEndpoint,
  });

  // Merge options
  const finalOptions = field.options || apiOptions || options;

  return (
    <Select
      onValueChange={formField.onChange}
      defaultValue={formField.value}
      disabled={field.disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            isLoading ? "Loading..." : field.placeholder || "Select..."
          }
        />
      </SelectTrigger>
      <SelectContent>
        {finalOptions?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Use case**: Large datasets, fresh data from API

---

### 📋 Method 4: Searchable Select (Combobox)

```typescript
// ========================================
// Searchable select cho large lists
// ========================================
{
  name: 'country',
  type: 'select',
  label: 'Country',
  searchable: true,
  options: countries, // Large list (200+ items)
  placeholder: 'Search country...',
}
```

**Implementation với Shadcn Combobox**:

```typescript
// components/forms/SearchableSelect.tsx
import { Combobox } from "@/components/ui/combobox";
import { Check, ChevronsUpDown } from "lucide-react";

function SearchableSelect({ field, formField }: any) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return field.options;
    return field.options.filter((option: SelectOption) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [field.options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {formField.value
            ? field.options.find(
                (opt: SelectOption) => opt.value === formField.value
              )?.label
            : field.placeholder || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${field.label.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredOptions.map((option: SelectOption) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  formField.onChange(option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    formField.value === option.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

**Use case**: Countries, cities, large category lists

---

### 📋 Method 5: Creatable Select

```typescript
// ========================================
// Allow user to create new options
// ========================================
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  creatable: true,
  options: existingTags,
  placeholder: 'Select or create tags...',
}
```

**Implementation**:

```typescript
function CreatableSelect({ field, formField }: any) {
  const [options, setOptions] = React.useState<SelectOption[]>(
    field.options || []
  );

  const handleCreate = (inputValue: string) => {
    const newOption = {
      label: inputValue,
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
    };

    setOptions([...options, newOption]);

    // Update form value
    if (field.multiple) {
      formField.onChange([...(formField.value || []), newOption.value]);
    } else {
      formField.onChange(newOption.value);
    }
  };

  return (
    <Combobox
      options={options}
      value={formField.value}
      onChange={formField.onChange}
      onCreateOption={handleCreate}
      isMulti={field.multiple}
    />
  );
}
```

**Use case**: Tags, custom categories, flexible inputs

---

### 📋 Method 5.1: Enhanced Creatable Select (Advanced Features)

**Tính năng nâng cao**: Thêm **validation, callbacks, duplicate prevention, local persistence** cho Creatable Select.

#### Extended Type Definition

```typescript
// lib/types/dynamic-form.types.ts

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isNew?: boolean; // Mark as locally created
  metadata?: any; // Additional data
}

export interface FieldConfig {
  // ... existing fields

  // Creatable options (Advanced)
  creatable?: boolean; // Enable creation
  createLabel?: string; // Label template (e.g., 'Create "{value}"')
  onCreateOption?: (option: SelectOption) => void; // Callback when option created
  allowDuplicates?: boolean; // Allow duplicate labels (default: false)
  validateCreate?: (value: string) => boolean | string; // Validation before create
  transformCreate?: (value: string) => SelectOption; // Transform input before create
}
```

---

#### Advanced Implementation: Creatable Multi-Select with Validation

```typescript
// components/forms/CreatableMultiSelect.tsx
"use client";

import * as React from "react";
import { X, Plus, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type SelectOption } from "@/lib/types/dynamic-form.types";
import { toast } from "sonner";

interface CreatableMultiSelectProps {
  field: any;
  formField: any;
}

export function CreatableMultiSelect({
  field,
  formField,
}: CreatableMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [localOptions, setLocalOptions] = React.useState<SelectOption[]>(
    field.options || []
  );

  const selectedValues: string[] = formField.value || [];

  // Check if search value exists
  const searchValueExists = localOptions.some(
    (opt) => opt.label.toLowerCase() === search.toLowerCase()
  );

  // Handle creating new option
  const handleCreateOption = async () => {
    if (!search.trim()) return;

    // 1. Run validation if provided
    if (field.validateCreate) {
      const validationResult = await field.validateCreate(search);

      if (validationResult !== true) {
        toast.error(
          typeof validationResult === "string"
            ? validationResult
            : "Invalid input"
        );
        return;
      }
    }

    // 2. Check for duplicates (if not allowed)
    if (!field.allowDuplicates) {
      const duplicate = localOptions.find(
        (opt) => opt.label.toLowerCase() === search.toLowerCase()
      );

      if (duplicate) {
        toast.error("This option already exists");
        return;
      }
    }

    // 3. Create option (with custom transform if provided)
    const newOption = field.transformCreate
      ? field.transformCreate(search)
      : {
          label: search.trim(),
          value: search.toLowerCase().trim().replace(/\s+/g, "-"),
          isNew: true,
        };

    // 4. Add to local options
    setLocalOptions([...localOptions, newOption]);

    // 5. Add to selected values
    formField.onChange([...selectedValues, newOption.value]);

    // 6. Clear search
    setSearch("");

    // 7. Call callback
    field.onCreateOption?.(newOption);

    toast.success(`Created: ${newOption.label}`);
  };

  // Toggle option selection
  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    formField.onChange(newValues);
  };

  // Remove option from selection
  const removeOption = (optionValue: string) => {
    formField.onChange(selectedValues.filter((v) => v !== optionValue));
  };

  // Get selected options for display
  const selectedOptions = selectedValues
    .map((value) => localOptions.find((opt) => opt.value === value))
    .filter(Boolean) as SelectOption[];

  return (
    <div className="space-y-2">
      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant={option.isNew ? "default" : "secondary"}
              className="gap-1"
            >
              {option.label}
              {option.isNew && (
                <span className="text-xs opacity-70">(new)</span>
              )}
              <button
                type="button"
                onClick={() => removeOption(option.value)}
                className="ml-1 rounded-full hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selectedValues.length === 0 && "text-muted-foreground"
            )}
            disabled={field.disabled}
          >
            <span className="truncate">
              {selectedValues.length === 0
                ? field.placeholder || "Select..."
                : `${selectedValues.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search or create ${
                field.label?.toLowerCase() || "options"
              }...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>
              {search && !searchValueExists ? (
                <button
                  type="button"
                  onClick={handleCreateOption}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {field.createLabel?.replace("{value}", search) ||
                      `Create "${search}"`}
                  </span>
                </button>
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {localOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{option.label}</span>
                    {option.isNew && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        new
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear all button */}
      {selectedValues.length > 0 && field.clearable && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formField.onChange([])}
          className="h-8 px-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
```

---

#### Usage Examples with Advanced Features

##### Example 1: Tags with Validation

```typescript
const blogFormConfig: FormConfig = {
  fields: [
    {
      name: "tags",
      type: "multiselect",
      label: "Tags",
      creatable: true,
      clearable: true,
      placeholder: "Select or create tags...",
      createLabel: 'Create tag "{value}"',
      options: [
        { label: "React", value: "react" },
        { label: "Next.js", value: "nextjs" },
        { label: "TypeScript", value: "typescript" },
      ],

      // Validation
      validateCreate: (value: string) => {
        if (value.length < 2) {
          return "Tag must be at least 2 characters";
        }
        if (value.length > 20) {
          return "Tag must be less than 20 characters";
        }
        if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
          return "Tag can only contain letters, numbers, spaces, and hyphens";
        }
        return true;
      },

      description: "Add existing tags or create new ones",
    },
  ],
};
```

##### Example 2: Custom Transform & Callback

```typescript
{
  name: 'customLabels',
  type: 'multiselect',
  label: 'Custom Labels',
  creatable: true,
  options: existingLabels,

  // Transform before creating
  transformCreate: (value: string) => ({
    label: value.trim(),
    value: `custom-${Date.now()}`, // Generate unique ID
    isNew: true,
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    },
  }),

  // Callback when created
  onCreateOption: (option: SelectOption) => {
    console.log('New option created:', option);

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem('custom-labels') || '[]');
    localStorage.setItem('custom-labels', JSON.stringify([...stored, option]));

    // Show notification
    toast.success(`Created new label: ${option.label}`);
  },
}
```

##### Example 3: Email Recipients with Validation

```typescript
import { Mail } from 'lucide-react';

{
  name: 'recipients',
  type: 'multiselect',
  label: 'Recipients',
  creatable: true,
  placeholder: 'Add email addresses...',
  options: recentContacts,

  // Validate email format
  validateCreate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return true;
  },

  // Transform to email format
  transformCreate: (value: string) => ({
    label: value.toLowerCase(),
    value: value.toLowerCase(),
    icon: Mail,
    isNew: true,
  }),

  createLabel: 'Add "{value}"',
  description: 'Select from contacts or enter new email addresses',
}
```

##### Example 4: Persist to LocalStorage

```typescript
function DynamicFormWithPersistence() {
  const [localOptions, setLocalOptions] = React.useState<
    Record<string, SelectOption[]>
  >(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem("dynamic-form-options");
    return stored ? JSON.parse(stored) : {};
  });

  // Save to localStorage when options change
  React.useEffect(() => {
    localStorage.setItem("dynamic-form-options", JSON.stringify(localOptions));
  }, [localOptions]);

  const formConfig: FormConfig = {
    fields: [
      {
        name: "tags",
        type: "multiselect",
        creatable: true,
        options: [...defaultTags, ...(localOptions["tags"] || [])],
        onCreateOption: (option: SelectOption) => {
          setLocalOptions((prev) => ({
            ...prev,
            tags: [...(prev.tags || []), option],
          }));
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

##### Example 5: Merge Local + API Options

```typescript
function ProductForm() {
  const { data: apiCategories } = useCategories();
  const [localCategories, setLocalCategories] = React.useState<SelectOption[]>(
    []
  );

  // Merge options: API + Local (filter duplicates)
  const allCategories = React.useMemo(() => {
    const apiOpts =
      apiCategories?.map((cat) => ({
        label: cat.name,
        value: cat.id,
      })) || [];

    const localOpts = localCategories.filter(
      (local) => !apiOpts.some((api) => api.value === local.value)
    );

    return [...apiOpts, ...localOpts];
  }, [apiCategories, localCategories]);

  const formConfig: FormConfig = {
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        creatable: true,
        searchable: true,
        options: allCategories,
        createLabel: 'Create category "{value}"',
        onCreateOption: (option: SelectOption) => {
          setLocalCategories((prev) => [...prev, option]);
          toast.info(
            `Category "${option.label}" created locally. Save the form to persist.`
          );
        },
      },
    ],
  };

  const handleSubmit = async (data: any) => {
    // Include locally created categories in submission
    console.log("Form data:", data);
    console.log("New categories:", localCategories);

    // Send to backend to persist
    await api.post("/categories/bulk", { categories: localCategories });
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

---

#### Best Practices for Creatable Options

**✅ DO:**

- ✅ **Validate input** before creating (length, format, regex)
- ✅ **Show "new" badge** for locally created options
- ✅ **Prevent duplicates** unless explicitly allowed
- ✅ **Save to localStorage** for persistence across sessions
- ✅ **Show toast notification** when creating
- ✅ **Transform input** to consistent format (lowercase, trim, slug)
- ✅ **Include created options** in form submission data
- ✅ **Use callbacks** to track/log created options
- ✅ **Merge local + API** options properly

**❌ DON'T:**

- ❌ Allow empty or whitespace-only values
- ❌ Create without any validation
- ❌ Forget to handle duplicate prevention
- ❌ Lose created options on page refresh (use persistence)
- ❌ Create silently without user feedback
- ❌ Mix local and API options without tracking `isNew` flag

---

#### Summary: Creatable Options Features

| Feature             | Implementation                             | Benefits         |
| ------------------- | ------------------------------------------ | ---------------- |
| **Basic Creation**  | `creatable: true`                          | Quick data entry |
| **Custom Label**    | `createLabel: 'Create "{value}"'`          | Better UX        |
| **Validation**      | `validateCreate: (v) => boolean \| string` | Data quality     |
| **Transform**       | `transformCreate: (v) => SelectOption`     | Consistency      |
| **Callback**        | `onCreateOption: (opt) => void`            | Tracking         |
| **Duplicate Check** | `allowDuplicates: false`                   | Data integrity   |
| **Mark as New**     | `isNew: true` in option                    | Visual feedback  |
| **Local Persist**   | `localStorage.setItem()`                   | Cross-session    |
| **Merge Options**   | API + Local filtering                      | Flexibility      |

---

Bây giờ Dynamic Form có **full support** cho creatable select/multi-select với validation, callbacks, persistence, và best practices! 🎉

---

### 📋 Method 6: Dependent Options

```typescript
// ========================================
// Options thay đổi dựa trên field khác
// ========================================

function ProductForm() {
  const [selectedCategory, setSelectedCategory] = React.useState("");

  // Fetch subcategories based on category
  const { data: subcategories } = useSubcategories(selectedCategory);

  const formConfig: FormConfig = {
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        options: categories,
        onChange: (value) => setSelectedCategory(value),
      },
      {
        name: "subcategory",
        type: "select",
        label: "Subcategory",
        options:
          subcategories?.map((sub) => ({
            label: sub.name,
            value: sub.id,
          })) || [],
        disabled: !selectedCategory,
        showWhen: {
          field: "category",
          operator: "isNotEmpty",
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

**Alternative: Built-in dependent options**:

```typescript
{
  name: 'subcategory',
  type: 'select',
  label: 'Subcategory',
  dependsOn: 'category', // Watch this field
  loadOptions: async (dependentValue) => {
    // Fetch options based on dependent field value
    const subcategories = await fetchSubcategories(dependentValue);
    return subcategories.map(sub => ({
      label: sub.name,
      value: sub.id,
    }));
  },
}
```

**Use case**: Country → Cities, Category → Subcategories

---

### 📋 Method 7: Options with Icons

```typescript
// ========================================
// Rich options với icons, avatars, etc.
// ========================================
import { Users, Shield, Eye } from 'lucide-react';

{
  name: 'role',
  type: 'select',
  label: 'Role',
  options: [
    {
      label: 'Admin',
      value: 'admin',
      icon: Shield,
    },
    {
      label: 'User',
      value: 'user',
      icon: Users,
    },
    {
      label: 'Guest',
      value: 'guest',
      icon: Eye,
    },
  ],
}
```

**Render trong DynamicField**:

```typescript
<SelectItem value={String(option.value)}>
  <div className="flex items-center gap-2">
    {option.icon && <option.icon className="h-4 w-4" />}
    {option.label}
  </div>
</SelectItem>
```

---

### 📋 Method 8: Multi-Select với React Query

```typescript
// ========================================
// Multi-select với async loading
// ========================================

{
  name: 'permissions',
  type: 'multiselect',
  label: 'Permissions',
  optionsEndpoint: '/api/permissions',
  optionsQueryKey: ['permissions'],
  placeholder: 'Select permissions...',
}
```

**Implementation với Multiple Select**:

```typescript
// components/ui/multi-select.tsx (Custom Shadcn extension)

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function MultiSelect({ field, formField }: any) {
  const { data: options, isLoading } = useQuery({
    queryKey: field.optionsQueryKey,
    queryFn: () => apiClient.get(field.optionsEndpoint).then((res) => res.data),
  });

  const selectedValues = formField.value || [];

  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v: string) => v !== optionValue)
      : [...selectedValues, optionValue];
    formField.onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {/* Selected items */}
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((value: string) => {
          const option = options?.find(
            (opt: SelectOption) => opt.value === value
          );
          return (
            <Badge key={value} variant="secondary">
              {option?.label}
              <button
                type="button"
                onClick={() => toggleOption(value)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      {/* Dropdown */}
      <Select onValueChange={toggleOption} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading ? "Loading..." : field.placeholder || "Select..."
            }
          />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option: SelectOption) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              disabled={selectedValues.includes(option.value)}
            >
              <div className="flex items-center gap-2">
                {selectedValues.includes(option.value) && (
                  <Check className="h-4 w-4" />
                )}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

### 🔄 Real-world Examples

#### Example 1: E-commerce Product Form

```typescript
function ProductForm() {
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const { data: brands } = useBrands();

  const formConfig: FormConfig = {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Product Name",
        required: true,
      },
      {
        name: "category",
        type: "select",
        label: "Category",
        required: true,
        searchable: true,
        options:
          categories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
            icon: cat.icon,
          })) || [],
      },
      {
        name: "subcategory",
        type: "select",
        label: "Subcategory",
        loadOptions: async () => {
          if (!selectedCategory) return [];
          const subs = await fetchSubcategories(selectedCategory);
          return subs.map((sub) => ({
            label: sub.name,
            value: sub.id,
          }));
        },
        showWhen: {
          field: "category",
          operator: "isNotEmpty",
        },
      },
      {
        name: "brand",
        type: "select",
        label: "Brand",
        creatable: true,
        options:
          brands?.map((brand) => ({
            label: brand.name,
            value: brand.id,
          })) || [],
      },
      {
        name: "tags",
        type: "multiselect",
        label: "Tags",
        creatable: true,
        optionsEndpoint: "/api/tags",
        optionsQueryKey: ["tags"],
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

#### Example 2: User Management Form

```typescript
function UserForm() {
  const { data: departments } = useDepartments();
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();

  const formConfig: FormConfig = {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        required: true,
      },
      {
        name: "department",
        type: "select",
        label: "Department",
        searchable: true,
        clearable: true,
        options:
          departments?.map((dept) => ({
            label: dept.name,
            value: dept.id,
            icon: dept.icon,
          })) || [],
      },
      {
        name: "role",
        type: "select",
        label: "Role",
        required: true,
        options:
          roles?.map((role) => ({
            label: role.name,
            value: role.id,
            icon: getRoleIcon(role.name),
          })) || [],
      },
      {
        name: "permissions",
        type: "multiselect",
        label: "Additional Permissions",
        options:
          permissions?.map((perm) => ({
            label: perm.name,
            value: perm.id,
          })) || [],
        showWhen: {
          field: "role",
          operator: "equals",
          value: "admin",
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

#### Example 3: Location Form (Dependent Selects)

```typescript
function LocationForm() {
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [selectedProvince, setSelectedProvince] = React.useState("");

  const { data: countries } = useCountries();
  const { data: provinces } = useProvinces(selectedCountry);
  const { data: cities } = useCities(selectedProvince);

  const formConfig: FormConfig = {
    fields: [
      {
        name: "country",
        type: "select",
        label: "Country",
        required: true,
        searchable: true,
        options:
          countries?.map((c) => ({
            label: c.name,
            value: c.code,
          })) || [],
      },
      {
        name: "province",
        type: "select",
        label: "Province/State",
        required: true,
        searchable: true,
        options:
          provinces?.map((p) => ({
            label: p.name,
            value: p.id,
          })) || [],
        disabled: !selectedCountry,
        showWhen: {
          field: "country",
          operator: "isNotEmpty",
        },
      },
      {
        name: "city",
        type: "select",
        label: "City",
        required: true,
        searchable: true,
        options:
          cities?.map((c) => ({
            label: c.name,
            value: c.id,
          })) || [],
        disabled: !selectedProvince,
        showWhen: {
          field: "province",
          operator: "isNotEmpty",
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

---

### 🎨 Enhanced DynamicField Component

**Updated to support all dynamic options methods**:

```typescript
// components/forms/DynamicField.tsx

export function DynamicField({ field, control, className }: DynamicFieldProps) {
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem
          className={cn(className, field.className, getGridClasses(field))}
        >
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>

          <FormControl>
            {field.render
              ? field.render({
                  value: formField.value,
                  onChange: formField.onChange,
                })
              : field.type === "select" || field.type === "multiselect"
              ? // Use appropriate select component based on field config
                renderSelectField(field, formField)
              : renderFieldByType(field, formField)}
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

function renderSelectField(config: FieldConfig, formField: any) {
  // Determine which select component to use
  if (config.searchable) {
    return <SearchableSelect field={config} formField={formField} />;
  }

  if (config.creatable) {
    return <CreatableSelect field={config} formField={formField} />;
  }

  if (config.type === "multiselect") {
    return <MultiSelect field={config} formField={formField} />;
  }

  if (config.loadOptions || config.optionsEndpoint) {
    return <AsyncSelect field={config} formField={formField} />;
  }

  // Default select
  return <BasicSelect field={config} formField={formField} />;
}
```

---

### 📦 Required Shadcn Components

```bash
# For searchable select
npx shadcn@latest add command

# For multi-select (if using custom implementation)
# Already have: select, badge, button, popover
```

---

### ✅ Best Practices

**✅ DO:**

- Use React Query cho API options (caching, refetch)
- Implement loading states khi fetch options
- Use searchable cho lists > 10 items
- Cache fetched options khi possible
- Show empty state khi no options
- Disable field khi options đang load

**❌ DON'T:**

- Fetch options trong render (use useEffect/React Query)
- Load all cities upfront (use dependent selects)
- Forget error handling cho async options
- Hardcode large option lists

---

### 🎯 Summary

| Method            | Use Case        | Implementation                    |
| ----------------- | --------------- | --------------------------------- |
| **Static**        | Fixed enums     | Hardcode in config                |
| **Dynamic Props** | Runtime data    | Pass from component               |
| **Async**         | API data        | `loadOptions` / `optionsEndpoint` |
| **Searchable**    | Large lists     | `searchable: true` + Combobox     |
| **Creatable**     | User-defined    | `creatable: true`                 |
| **Dependent**     | Cascading       | Watch other field + load          |
| **Icons**         | Rich options    | Add icon to SelectOption          |
| **Multi-select**  | Multiple values | `type: 'multiselect'`             |

Bây giờ Dynamic Form hỗ trợ **full-featured select fields** với mọi use case! 🚀

---

## Form Configs Examples

### Example 1: User Form

**File**: `lib/schemas/form-configs/user-form.config.ts`

```typescript
import { type FormConfig } from "@/lib/types/dynamic-form.types";
import { z } from "zod";

export const userFormConfig: FormConfig = {
  sections: [
    {
      title: "Personal Information",
      description: "Basic user information",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Full Name",
          placeholder: "Enter full name",
          required: true,
          minLength: 2,
          maxLength: 100,
        },
        {
          name: "email",
          type: "email",
          label: "Email",
          placeholder: "user@example.com",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Phone Number",
          placeholder: "+84 123 456 789",
          pattern:
            "^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$",
        },
        {
          name: "dateOfBirth",
          type: "date",
          label: "Date of Birth",
          max: new Date().getTime(), // Cannot be in future
        },
      ],
    },
    {
      title: "Account Settings",
      fields: [
        {
          name: "role",
          type: "select",
          label: "Role",
          required: true,
          options: [
            { label: "Admin", value: "admin" },
            { label: "Manager", value: "manager" },
            { label: "User", value: "user" },
            { label: "Guest", value: "guest" },
          ],
        },
        {
          name: "department",
          type: "select",
          label: "Department",
          placeholder: "Select department",
          options: [
            { label: "Sales", value: "sales" },
            { label: "Marketing", value: "marketing" },
            { label: "Engineering", value: "engineering" },
            { label: "Support", value: "support" },
          ],
          // Only show for admin and manager
          showWhen: {
            field: "role",
            operator: "includes",
            value: ["admin", "manager"],
          },
        },
        {
          name: "isActive",
          type: "switch",
          label: "Active",
          description: "Enable or disable this user account",
          defaultValue: true,
        },
        {
          name: "emailNotifications",
          type: "checkbox",
          label: "Email Notifications",
          description: "Receive notifications via email",
          defaultValue: true,
        },
      ],
    },
  ],
  layout: "grid",
  columns: 2,
  submitLabel: "Create User",
  showReset: true,
  resetOnSubmit: false,
};
```

### Example 2: Product Form

**File**: `lib/schemas/form-configs/product-form.config.ts`

```typescript
import { type FormConfig } from "@/lib/types/dynamic-form.types";

export const productFormConfig: FormConfig = {
  sections: [
    {
      title: "Basic Information",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Product Name",
          placeholder: "Enter product name",
          required: true,
          maxLength: 200,
        },
        {
          name: "sku",
          type: "text",
          label: "SKU",
          placeholder: "Product SKU",
          required: true,
          pattern: "^[A-Z0-9-]+$",
          description: "Use uppercase letters, numbers, and hyphens only",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          placeholder: "Enter product description",
          rows: 5,
          maxLength: 1000,
        },
        {
          name: "category",
          type: "select",
          label: "Category",
          required: true,
          options: [
            { label: "Action Figures", value: "action-figures" },
            { label: "Dolls", value: "dolls" },
            { label: "Board Games", value: "board-games" },
            { label: "Educational", value: "educational" },
            { label: "Puzzles", value: "puzzles" },
          ],
        },
      ],
    },
    {
      title: "Pricing & Inventory",
      fields: [
        {
          name: "price",
          type: "number",
          label: "Price (VND)",
          placeholder: "0",
          required: true,
          min: 0,
          step: 1000,
        },
        {
          name: "compareAtPrice",
          type: "number",
          label: "Compare at Price (VND)",
          placeholder: "0",
          min: 0,
          step: 1000,
          description: "Original price before discount",
        },
        {
          name: "cost",
          type: "number",
          label: "Cost per Item (VND)",
          placeholder: "0",
          min: 0,
          step: 1000,
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
          name: "trackInventory",
          type: "switch",
          label: "Track Inventory",
          description: "Automatically track stock levels",
          defaultValue: true,
        },
        {
          name: "lowStockAlert",
          type: "number",
          label: "Low Stock Alert",
          placeholder: "5",
          min: 0,
          description: "Alert when stock falls below this number",
          showWhen: {
            field: "trackInventory",
            operator: "equals",
            value: true,
          },
        },
      ],
    },
    {
      title: "Product Details",
      fields: [
        {
          name: "ageRange",
          type: "select",
          label: "Age Range",
          options: [
            { label: "0-2 years", value: "0-2" },
            { label: "3-5 years", value: "3-5" },
            { label: "6-8 years", value: "6-8" },
            { label: "9-12 years", value: "9-12" },
            { label: "13+ years", value: "13+" },
          ],
        },
        {
          name: "brand",
          type: "text",
          label: "Brand",
          placeholder: "Enter brand name",
        },
        {
          name: "weight",
          type: "number",
          label: "Weight (kg)",
          placeholder: "0",
          min: 0,
          step: 0.01,
        },
        {
          name: "dimensions",
          type: "text",
          label: "Dimensions",
          placeholder: "L x W x H (cm)",
        },
      ],
    },
    {
      title: "Status",
      fields: [
        {
          name: "status",
          type: "radio",
          label: "Product Status",
          required: true,
          defaultValue: "active",
          options: [
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ],
        },
        {
          name: "featured",
          type: "switch",
          label: "Featured Product",
          description: "Show in featured section",
          defaultValue: false,
        },
      ],
    },
  ],
  layout: "grid",
  columns: 2,
  submitLabel: "Save Product",
  showReset: true,
};
```

### Example 3: Settings Form with Conditional Logic

**File**: `lib/schemas/form-configs/settings-form.config.ts`

```typescript
import { type FormConfig } from "@/lib/types/dynamic-form.types";

export const settingsFormConfig: FormConfig = {
  sections: [
    {
      title: "Notification Settings",
      fields: [
        {
          name: "enableNotifications",
          type: "switch",
          label: "Enable Notifications",
          defaultValue: true,
        },
        {
          name: "notificationTypes",
          type: "multiselect",
          label: "Notification Types",
          options: [
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
            { label: "Push", value: "push" },
            { label: "In-App", value: "in-app" },
          ],
          showWhen: {
            field: "enableNotifications",
            operator: "equals",
            value: true,
          },
        },
        {
          name: "emailFrequency",
          type: "select",
          label: "Email Frequency",
          options: [
            { label: "Immediately", value: "immediate" },
            { label: "Daily Digest", value: "daily" },
            { label: "Weekly Digest", value: "weekly" },
          ],
          showWhen: {
            field: "notificationTypes",
            operator: "includes",
            value: "email",
          },
        },
      ],
    },
  ],
  submitLabel: "Save Settings",
};
```

---

## Advanced Features

### 1. Custom Field Renderer

```typescript
// Custom render function for special fields
{
  name: 'tags',
  type: 'text', // Base type
  label: 'Tags',
  render: ({ value, onChange }) => (
    <TagInput
      value={value || []}
      onChange={onChange}
      placeholder="Add tags..."
    />
  ),
}
```

### 2. Dynamic Options from API

```typescript
// Fetch options from API
function ProductForm() {
  const { data: categories } = useCategories();

  const formConfig: FormConfig = {
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        options:
          categories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
          })) || [],
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

### 3. Complex Validation

```typescript
import { z } from 'zod';

{
  name: 'password',
  type: 'password',
  label: 'Password',
  validation: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
}
```

### 4. Multi-Step Forms

```typescript
function MultiStepForm() {
  const [step, setStep] = useState(0);

  const steps: FormConfig[] = [
    {
      fields: [
        /* Step 1 fields */
      ],
    },
    {
      fields: [
        /* Step 2 fields */
      ],
    },
    {
      fields: [
        /* Step 3 fields */
      ],
    },
  ];

  const handleSubmit = async (data: any) => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Final submission
      await createUser(data);
    }
  };

  return (
    <div>
      <div className="mb-4">
        Step {step + 1} of {steps.length}
      </div>
      <DynamicForm config={steps[step]} onSubmit={handleSubmit} />
    </div>
  );
}
```

---

## Best Practices

### ✅ DO

1. **Use TypeScript**: Type-safe configs
2. **Modular configs**: Separate file cho mỗi form
3. **Reusable fields**: Common fields như email, phone
4. **Zod validation**: Leverage Zod cho complex rules
5. **Default values**: Provide sensible defaults
6. **Descriptions**: Help users với field descriptions
7. **Conditional logic**: Hide irrelevant fields
8. **Grid layout**: Use grid cho better UX

### ❌ DON'T

1. **Over-complicate**: Keep configs simple
2. **Duplicate logic**: Use shared validation schemas
3. **Ignore accessibility**: Always add labels, ARIA
4. **Forget error handling**: Handle validation errors properly
5. **Hardcode options**: Fetch from API when possible

---

## API-Driven Forms

### Backend API Structure

```typescript
// GET /api/forms/:formId/config
{
  "id": "user-form",
  "version": "1.0.0",
  "config": {
    "sections": [
      {
        "title": "User Information",
        "fields": [...]
      }
    ]
  }
}
```

### Frontend Implementation

```typescript
// Fetch form config from API
function DynamicFormPage({ formId }: { formId: string }) {
  const { data: formConfig, isLoading } = useQuery({
    queryKey: ["form-config", formId],
    queryFn: () => getFormConfig(formId),
  });

  const handleSubmit = async (data: any) => {
    await apiClient.post(`/forms/${formId}/submit`, data);
  };

  if (isLoading) return <Skeleton />;

  return <DynamicForm config={formConfig!} onSubmit={handleSubmit} />;
}
```

---

## Performance Optimization

### 1. Memoization

```typescript
const schema = React.useMemo(() => generateFormSchema(allFields), [allFields]);
```

### 2. Lazy Loading for Heavy Fields

```typescript
const RichTextEditor = lazy(() => import('./RichTextEditor'));

{
  name: 'content',
  type: 'richtext',
  render: ({ value, onChange }) => (
    <Suspense fallback={<Skeleton />}>
      <RichTextEditor value={value} onChange={onChange} />
    </Suspense>
  ),
}
```

### 3. Debounce for API Calls

```typescript
const debouncedSearch = useDebouncedCallback((value: string) => {
  // Fetch options from API
}, 300);
```

---

## Testing

### Unit Tests

```typescript
import { generateFormSchema } from "@/lib/utils/form-schema-generator";

describe("generateFormSchema", () => {
  it("should generate schema with required text field", () => {
    const fields = [
      { name: "name", type: "text", label: "Name", required: true },
    ];
    const schema = generateFormSchema(fields);

    expect(() => schema.parse({ name: "" })).toThrow();
    expect(schema.parse({ name: "John" })).toEqual({ name: "John" });
  });

  it("should generate schema with email validation", () => {
    const fields = [
      { name: "email", type: "email", label: "Email", required: true },
    ];
    const schema = generateFormSchema(fields);

    expect(() => schema.parse({ email: "invalid" })).toThrow();
    expect(schema.parse({ email: "test@example.com" })).toEqual({
      email: "test@example.com",
    });
  });
});
```

---

## Summary

### Key Benefits

✅ **Reusability**: One component cho all forms  
✅ **Type Safety**: Zod + TypeScript  
✅ **Validation**: Auto-generated schemas  
✅ **Flexibility**: API-driven configs  
✅ **Consistency**: Same UX everywhere  
✅ **Maintainability**: Easy to change  
✅ **Conditional Logic**: Smart field visibility

### Tech Stack Integration

- ✅ **React Hook Form**: Form state management
- ✅ **Zod**: Schema validation và type inference
- ✅ **Shadcn UI**: UI components
- ✅ **TypeScript**: Type safety
- ✅ **React Query**: API-driven forms (optional)

---

**Ready to use! 🚀**

Tham khảo các example configs trong `lib/schemas/form-configs/` để bắt đầu!
