# Type Definitions

> **Complete TypeScript definitions for Dynamic Forms system**

---

## 📋 Core Types

### FormConfig

Main configuration object for the entire form:

```typescript
// lib/types/dynamic-form.types.ts

export interface FormConfig {
  /** Array of field configurations */
  fields: FieldConfig[];

  /** Layout mode */
  layout?: "vertical" | "grid";

  /** Number of columns for grid layout (default: 12) */
  columns?: number;

  /** Gap between fields in grid (Tailwind class) */
  gap?: string;

  /** Default values for form fields */
  defaultValues?: Record<string, any>;

  /** Form submission handler */
  onSubmit?: (data: any, form: UseFormReturn) => void | Promise<void>;

  /** Form validation mode */
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";

  /** Revalidate mode */
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";

  /** Custom CSS classes for form */
  className?: string;

  /** Loading state */
  isLoading?: boolean;

  /** Disabled state (all fields) */
  disabled?: boolean;
}
```

---

### FieldConfig

Configuration for individual fields:

```typescript
export interface FieldConfig {
  // ========================================
  // Basic Properties
  // ========================================

  /** Field name (form key) */
  name: string;

  /** Field type */
  type: FieldType;

  /** Display label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Help text / description */
  description?: string;

  /** Default value */
  defaultValue?: any;

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readOnly?: boolean;

  /** Custom CSS classes */
  className?: string;

  // ========================================
  // Validation
  // ========================================

  /** Required field */
  required?: boolean;

  /** Custom required message */
  requiredMessage?: string;

  /** Minimum value/length */
  min?: number;

  /** Maximum value/length */
  max?: number;

  /** Minimum length (strings) */
  minLength?: number;

  /** Maximum length (strings) */
  maxLength?: number;

  /** Regex pattern */
  pattern?: string | RegExp;

  /** Pattern error message */
  patternMessage?: string;

  /** Custom validation function */
  validate?: (
    value: any,
    formValues: any
  ) => boolean | string | Promise<boolean | string>;

  /** Multiple custom validators */
  validators?: Array<{
    validate: (value: any) => boolean | string;
    message?: string;
  }>;

  // ========================================
  // Layout & Grid
  // ========================================

  /** Column span (1-12) */
  colSpan?: number;

  /** Start column (1-12) */
  colStart?: number;

  /** End column (1-13) */
  colEnd?: number;

  /** Row span */
  rowSpan?: number;

  /** Order in flex/grid */
  order?: number;

  /** Responsive column spans */
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  // ========================================
  // Conditional Logic
  // ========================================

  /** Show field conditionally */
  showWhen?: ConditionalLogic;

  /** Disable field conditionally */
  disableWhen?: ConditionalLogic;

  /** Make field required conditionally */
  requiredWhen?: ConditionalLogic;

  // ========================================
  // Select Field Options
  // ========================================

  /** Options for select/radio/checkbox fields */
  options?: SelectOption[];

  /** Load options asynchronously */
  loadOptions?: () => Promise<SelectOption[]>;

  /** API endpoint for options */
  optionsEndpoint?: string;

  /** React Query key for options */
  optionsQueryKey?: string[];

  /** Searchable select (for large lists) */
  searchable?: boolean;

  /** Allow creating new options */
  creatable?: boolean;

  /** Label for create option */
  createLabel?: string;

  /** Allow multiple selection */
  multiple?: boolean;

  /** Allow clearing selection */
  clearable?: boolean;

  /** Show option icons */
  showIcons?: boolean;

  /** Callback when option is created */
  onCreateOption?: (option: SelectOption) => void;

  /** Allow duplicate options when creating */
  allowDuplicates?: boolean;

  /** Validate before creating option */
  validateCreate?: (
    value: string
  ) => boolean | string | Promise<boolean | string>;

  /** Transform input before creating option */
  transformCreate?: (value: string) => SelectOption;

  /** Dependent field (for cascading selects) */
  dependsOn?: string;

  /** Load dependent options */
  loadDependentOptions?: (parentValue: any) => Promise<SelectOption[]>;

  // ========================================
  // Number Field Options
  // ========================================

  /** Step increment for number inputs */
  step?: number;

  /** Decimal places for currency/number */
  decimals?: number;

  /** Currency symbol */
  currency?: string;

  /** Thousand separator */
  thousandSeparator?: string;

  /** Decimal separator */
  decimalSeparator?: string;

  /** Prefix (e.g., "$", "#") */
  prefix?: string;

  /** Suffix (e.g., "%", "kg") */
  suffix?: string;

  // ========================================
  // Date Field Options
  // ========================================

  /** Date format */
  dateFormat?: string;

  /** Min date */
  minDate?: Date | string;

  /** Max date */
  maxDate?: Date | string;

  /** Disabled dates */
  disabledDates?: Date[] | ((date: Date) => boolean);

  /** Show time picker */
  showTime?: boolean;

  /** Time format */
  timeFormat?: "12h" | "24h";

  /** Time interval (minutes) */
  timeInterval?: number;

  // ========================================
  // File Upload Options
  // ========================================

  /** Accepted file types */
  accept?: string;

  /** Max file size (bytes) */
  maxFileSize?: number;

  /** Max number of files */
  maxFiles?: number;

  /** Allow multiple files */
  multipleFiles?: boolean;

  /** Show file preview */
  showPreview?: boolean;

  /** Upload URL */
  uploadUrl?: string;

  /** Custom upload handler */
  onUpload?: (files: File[]) => Promise<string[]>;

  // ========================================
  // Image Picker Options
  // ========================================

  /** Allow multiple images */
  multiple?: boolean;

  /** Max number of images */
  maxImages?: number;

  /** Min number of images */
  minImages?: number;

  /** Allow selecting from gallery */
  allowGallery?: boolean;

  /** Allow pasting URL */
  allowUrl?: boolean;

  /** Allow direct upload */
  allowUpload?: boolean;

  /** Gallery API endpoint */
  galleryEndpoint?: string;

  /** React Query key for gallery */
  galleryQueryKey?: string[];

  /** Gallery filters */
  galleryFilters?: {
    category?: string;
    tags?: string[];
    minWidth?: number;
    minHeight?: number;
    format?: string[];
  };

  /** Accepted image formats */
  acceptedFormats?: string[];

  /** Min image width */
  minWidth?: number;

  /** Min image height */
  minHeight?: number;

  /** Required aspect ratio */
  aspectRatio?: number;

  /** Show image preview */
  showImagePreview?: boolean;

  /** Preview size */
  previewSize?: "sm" | "md" | "lg";

  /** Show image info (dimensions, size) */
  showImageInfo?: boolean;

  /** Show dimensions */
  showDimensions?: boolean;

  /** Validate URL is image */
  validateUrl?: boolean;

  /** URL input placeholder */
  urlPlaceholder?: string;

  /** Callback when image selected */
  onImageSelect?: (image: ImageData) => void;

  /** Callback when image removed */
  onImageRemove?: (image: ImageData) => void;

  /** Callback when URL pasted */
  onUrlPaste?: (url: string) => void;
  maxFiles?: number;

  /** Allow multiple files */
  multipleFiles?: boolean;

  /** Show file preview */
  showPreview?: boolean;

  /** Upload URL */
  uploadUrl?: string;

  /** Custom upload handler */
  onUpload?: (files: File[]) => Promise<string[]>;

  // ========================================
  // Text Field Options
  // ========================================

  /** Rows for textarea */
  rows?: number;

  /** Auto-resize textarea */
  autoResize?: boolean;

  /** Show character count */
  showCount?: boolean;

  /** Mask for input (e.g., phone number) */
  mask?: string;

  /** Input mode for mobile keyboards */
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";

  // ========================================
  // Rich Text Options
  // ========================================

  /** Rich text editor toolbar options */
  toolbar?: string[];

  /** Min height for editor */
  minHeight?: number;

  /** Max height for editor */
  maxHeight?: number;

  // ========================================
  // Slider Options
  // ========================================

  /** Show value label */
  showValue?: boolean;

  /** Value formatter */
  formatValue?: (value: number) => string;

  /** Marks on slider */
  marks?: Array<{ value: number; label: string }>;

  // ========================================
  // Callback Handlers
  // ========================================

  /** Called when field value changes */
  onChange?: (value: any, formValues: any) => void;

  /** Called on blur */
  onBlur?: (event: any) => void;

  /** Called on focus */
  onFocus?: (event: any) => void;

  // ========================================
  // Advanced
  // ========================================

  /** Custom render function */
  render?: (props: RenderProps) => React.ReactNode;

  /** Additional props to pass to field component */
  componentProps?: Record<string, any>;

  /** Field metadata */
  metadata?: Record<string, any>;
}
```

---

### FieldType

All supported field types:

```typescript
export type FieldType =
  // Text inputs
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "tel"
  | "password"

  // Number inputs
  | "number"
  | "currency"
  | "percentage"

  // Selection
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "switch"

  // Date/Time
  | "date"
  | "datetime"
  | "time"
  | "daterange"

  // File
  | "file"
  | "image"
  | "imagepicker"

  // Advanced
  | "richtext"
  | "color"
  | "slider"
  | "range"

  // Special
  | "divider"
  | "heading"
  | "custom";
```

---

### SelectOption

Options for select fields:

```typescript
export interface SelectOption {
  /** Display label */
  label: string;

  /** Option value */
  value: string | number | boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Option description */
  description?: string;

  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;

  /** Mark as newly created (for creatable selects) */
  isNew?: boolean;

  /** Additional metadata */
  metadata?: any;

  /** Group (for grouped options) */
  group?: string;
}
```

---

### ImageData

Data structure for image picker field:

```typescript
export interface ImageData {
  /** Image ID (from gallery) */
  id?: string;

  /** Image URL (full size) */
  url: string;

  /** Thumbnail URL */
  thumbnail?: string;

  /** Alt text */
  alt?: string;

  /** Image width in pixels */
  width?: number;

  /** Image height in pixels */
  height?: number;

  /** File size in bytes */
  size?: number;

  /** Image format (jpeg, png, webp, etc.) */
  format?: string;

  /** Source type */
  source?: "gallery" | "url" | "upload";

  /** Additional metadata */
  metadata?: {
    category?: string;
    tags?: string[];
    uploadedAt?: string;
    uploadedBy?: string;
    [key: string]: any;
  };
}
```

---

### ConditionalLogic

Configuration for conditional field visibility:

```typescript
export interface ConditionalLogic {
  /** Field name to watch */
  field: string;

  /** Comparison operator */
  operator: ConditionalOperator;

  /** Value to compare against */
  value?: any;

  /** Multiple conditions (AND/OR) */
  conditions?: Array<{
    field: string;
    operator: ConditionalOperator;
    value?: any;
  }>;

  /** Logic type for multiple conditions */
  logic?: "AND" | "OR";
}

export type ConditionalOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "contains"
  | "notContains"
  | "isEmpty"
  | "isNotEmpty"
  | "in"
  | "notIn";
```

---

### RenderProps

Props passed to custom render functions:

```typescript
export interface RenderProps {
  /** Field configuration */
  field: FieldConfig;

  /** React Hook Form field props */
  formField: ControllerRenderProps;

  /** Form instance */
  form: UseFormReturn;

  /** Field state */
  fieldState: ControllerFieldState;

  /** Current field value */
  value: any;

  /** Change handler */
  onChange: (value: any) => void;

  /** Blur handler */
  onBlur: () => void;

  /** Is field disabled */
  disabled: boolean;

  /** Is field required */
  required: boolean;

  /** Error message */
  error?: string;
}
```

---

## 🎯 Usage Examples

### Basic Form Config

```typescript
import type { FormConfig } from "@/lib/types/dynamic-form.types";

const userFormConfig: FormConfig = {
  layout: "grid",
  columns: 12,
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      required: true,
      colSpan: 6,
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      required: true,
      colSpan: 6,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
      colSpan: 12,
    },
  ],
};
```

### With Type Inference

```typescript
import { z } from "zod";
import { generateFormSchema } from "@/lib/utils/generateFormSchema";

const formConfig: FormConfig = {
  fields: [
    { name: "name", type: "text", required: true },
    { name: "age", type: "number", min: 18 },
  ],
};

// Generate schema
const schema = generateFormSchema(formConfig.fields);

// Infer type from schema
type FormData = z.infer<typeof schema>;
// Result: { name: string; age: number }

// Type-safe submit handler
const handleSubmit = (data: FormData) => {
  console.log(data.name); // ✅ TypeScript knows this is string
  console.log(data.age); // ✅ TypeScript knows this is number
};
```

### Complex Field Config

```typescript
const productFormConfig: FormConfig = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Product Name",
      required: true,
      minLength: 3,
      maxLength: 100,
      showCount: true,
      colSpan: 8,
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
      required: true,
      pattern: /^[A-Z0-9-]+$/,
      patternMessage:
        "SKU must contain only uppercase letters, numbers, and hyphens",
      colSpan: 4,
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      required: true,
      searchable: true,
      clearable: true,
      loadOptions: async () => {
        const res = await fetch("/api/categories");
        return res.json();
      },
      colSpan: 6,
    },
    {
      name: "subcategory",
      type: "select",
      label: "Subcategory",
      dependsOn: "category",
      loadDependentOptions: async (categoryId) => {
        const res = await fetch(`/api/categories/${categoryId}/subcategories`);
        return res.json();
      },
      showWhen: {
        field: "category",
        operator: "isNotEmpty",
      },
      colSpan: 6,
    },
    {
      name: "price",
      type: "currency",
      label: "Price",
      required: true,
      min: 0,
      currency: "USD",
      colSpan: 6,
    },
    {
      name: "stock",
      type: "number",
      label: "Stock",
      required: true,
      min: 0,
      step: 1,
      colSpan: 6,
    },
    {
      name: "tags",
      type: "multiselect",
      label: "Tags",
      creatable: true,
      clearable: true,
      placeholder: "Select or create tags...",
      options: [
        { label: "New", value: "new" },
        { label: "Sale", value: "sale" },
        { label: "Featured", value: "featured" },
      ],
      validateCreate: (value: string) => {
        if (value.length < 2) return "Tag too short";
        if (value.length > 20) return "Tag too long";
        return true;
      },
      colSpan: 12,
    },
    {
      name: "description",
      type: "richtext",
      label: "Description",
      minHeight: 200,
      toolbar: [
        "bold",
        "italic",
        "underline",
        "link",
        "bulletList",
        "orderedList",
      ],
      colSpan: 12,
    },
  ],
};
```

---

## 🔗 Related

- [Overview & Architecture](./01-overview.md)
- [Form Schema Generator](./03-schema-generator.md)
- [Layout System](./04-layout-system.md)

---

**Next:** [Form Schema Generator →](./03-schema-generator.md)
