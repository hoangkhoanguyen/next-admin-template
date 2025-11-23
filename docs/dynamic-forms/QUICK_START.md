# Quick Start Guide

> **Bắt đầu với Dynamic Forms trong 10 phút**

---

## 🎯 Mục tiêu

Sau guide này bạn sẽ:

- ✅ Hiểu cách Dynamic Forms hoạt động
- ✅ Tạo được form đầu tiên
- ✅ Biết cách mở rộng với field types khác

---

## 📦 Phase 1: Core Foundation (Ưu tiên cao nhất)

### Day 1-2: Basic Infrastructure

#### 1. Cài đặt dependencies

```bash
# Core form libraries
npm install react-hook-form zod

# Shadcn UI components
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add button
npx shadcn@latest add checkbox
npx shadcn@latest add label
```

#### 2. Tạo Type Definitions

**File**: `lib/dynamic-forms/types.ts`

```typescript
export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox";
// Thêm dần các types khác sau

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;

  // For select
  options?: SelectOption[];

  // For number
  min?: number;
  max?: number;
  step?: number;
}

export interface FormConfig {
  fields: FieldConfig[];
  submitLabel?: string;
  resetLabel?: string;
}
```

#### 3. Tạo Schema Generator (Auto-validation)

**File**: `lib/dynamic-forms/schema-generator.ts`

```typescript
import { z } from "zod";
import type { FormConfig } from "./types";

export function generateSchema(config: FormConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  config.fields.forEach((field) => {
    // Skip hidden fields
    if (field.hidden) return;

    let schema: z.ZodTypeAny;

    // Create base schema based on type
    switch (field.type) {
      case "text":
      case "textarea":
        schema = z.string();
        break;

      case "number":
        schema = z.number();
        if (field.min !== undefined) {
          schema = schema.min(field.min, `Minimum value is ${field.min}`);
        }
        if (field.max !== undefined) {
          schema = schema.max(field.max, `Maximum value is ${field.max}`);
        }
        break;

      case "select":
        schema = z.string();
        break;

      case "checkbox":
        schema = z.boolean();
        break;

      default:
        schema = z.any();
    }

    // Add required validation
    if (field.required) {
      if (field.type === "checkbox") {
        schema = z.literal(true, {
          errorMap: () => ({ message: `${field.label} must be checked` }),
        });
      } else {
        schema = schema.min(1, `${field.label} is required`);
      }
    } else {
      schema = schema.optional();
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
```

#### 4. Tạo DynamicForm Component

**File**: `components/dynamic-forms/DynamicForm.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DynamicField } from "./DynamicField";
import { generateSchema } from "@/lib/dynamic-forms/schema-generator";
import type { FormConfig } from "@/lib/dynamic-forms/types";

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: any) => void | Promise<void>;
  defaultValues?: Record<string, any>;
  isLoading?: boolean;
}

export function DynamicForm({
  config,
  onSubmit,
  defaultValues,
  isLoading = false,
}: DynamicFormProps) {
  const schema = generateSchema(config);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {config.fields.map((field) => {
          if (field.hidden) return null;

          return <DynamicField key={field.name} config={field} />;
        })}

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : config.submitLabel || "Submit"}
          </Button>

          {config.resetLabel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              {config.resetLabel}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
```

#### 5. Tạo DynamicField Router

**File**: `components/dynamic-forms/DynamicField.tsx`

```typescript
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { NumberField } from "./fields/NumberField";
import { TextareaField } from "./fields/TextareaField";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface DynamicFieldProps {
  config: FieldConfig;
}

export function DynamicField({ config }: DynamicFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={config.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>{renderFieldByType(config, field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFieldByType(config: FieldConfig, field: any) {
  switch (config.type) {
    case "text":
      return <TextField config={config} field={field} />;

    case "textarea":
      return <TextareaField config={config} field={field} />;

    case "number":
      return <NumberField config={config} field={field} />;

    case "select":
      return <SelectField config={config} field={field} />;

    case "checkbox":
      return <CheckboxField config={config} field={field} />;

    default:
      return <div>Unsupported field type: {config.type}</div>;
  }
}
```

#### 6. Tạo Field Components

**File**: `components/dynamic-forms/fields/TextField.tsx`

```typescript
import { Input } from "@/components/ui/input";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface FieldProps {
  config: FieldConfig;
  field: any;
}

export function TextField({ config, field }: FieldProps) {
  return (
    <Input
      {...field}
      placeholder={config.placeholder}
      disabled={config.disabled}
    />
  );
}
```

**File**: `components/dynamic-forms/fields/TextareaField.tsx`

```typescript
import { Textarea } from "@/components/ui/textarea";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface FieldProps {
  config: FieldConfig;
  field: any;
}

export function TextareaField({ config, field }: FieldProps) {
  return (
    <Textarea
      {...field}
      placeholder={config.placeholder}
      disabled={config.disabled}
      rows={4}
    />
  );
}
```

**File**: `components/dynamic-forms/fields/NumberField.tsx`

```typescript
import { Input } from "@/components/ui/input";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface FieldProps {
  config: FieldConfig;
  field: any;
}

export function NumberField({ config, field }: FieldProps) {
  return (
    <Input
      {...field}
      type="number"
      placeholder={config.placeholder}
      disabled={config.disabled}
      min={config.min}
      max={config.max}
      step={config.step}
      onChange={(e) => field.onChange(Number(e.target.value))}
    />
  );
}
```

**File**: `components/dynamic-forms/fields/SelectField.tsx`

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface FieldProps {
  config: FieldConfig;
  field: any;
}

export function SelectField({ config, field }: FieldProps) {
  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      disabled={config.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**File**: `components/dynamic-forms/fields/CheckboxField.tsx`

```typescript
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldConfig } from "@/lib/dynamic-forms/types";

interface FieldProps {
  config: FieldConfig;
  field: any;
}

export function CheckboxField({ config, field }: FieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={config.disabled}
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {config.label}
      </label>
    </div>
  );
}
```

#### 7. Tạo Test Page

**File**: `app/test/dynamic-form/page.tsx`

```typescript
"use client";

import { DynamicForm } from "@/components/dynamic-forms/DynamicForm";
import type { FormConfig } from "@/lib/dynamic-forms/types";

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
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Enter product description",
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      placeholder: "Select a category",
      required: true,
      options: [
        { label: "Action Figures", value: "action-figures" },
        { label: "Board Games", value: "board-games" },
        { label: "Puzzles", value: "puzzles" },
        { label: "Educational", value: "educational" },
      ],
    },
    {
      name: "price",
      type: "number",
      label: "Price ($)",
      placeholder: "0.00",
      required: true,
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
      name: "featured",
      type: "checkbox",
      label: "Feature this product on homepage",
    },
  ],
  submitLabel: "Create Product",
  resetLabel: "Reset Form",
};

export default function TestDynamicFormPage() {
  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Product created successfully!");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <DynamicForm config={productFormConfig} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
```

---

## ✅ Kiểm tra Phase 1

Sau khi hoàn thành Day 1-2, bạn phải:

1. **Run test page**

```bash
npm run dev
# Mở http://localhost:3000/test/dynamic-form
```

2. **Test các tính năng**:

- [ ] Hiển thị đầy đủ 6 fields (name, description, category, price, stock, featured)
- [ ] Required validation hoạt động (name, category, price, stock)
- [ ] Number validation hoạt động (min value, step)
- [ ] Submit form hiển thị data trong console
- [ ] Reset button xóa form

3. **Expected output khi submit**:

```json
{
  "name": "LEGO Star Wars",
  "description": "Build your own Millennium Falcon",
  "category": "action-figures",
  "price": 99.99,
  "stock": 50,
  "featured": true
}
```

---

## 🎉 Hoàn thành Phase 1!

Bây giờ bạn đã có:

- ✅ **Core infrastructure** hoạt động
- ✅ **5 field types** cơ bản (text, textarea, number, select, checkbox)
- ✅ **Auto-validation** với Zod
- ✅ **Type-safe** với TypeScript
- ✅ **Reusable** cho mọi form

---

## 🚀 Next Steps

### Phase 2: Advanced Fields (2-3 days)

Thêm các field types phức tạp hơn:

- **AsyncSelect**: Load options từ API
- **MultiSelect**: Chọn nhiều options
- **CreatableSelect**: User tạo options mới
- **ImagePicker**: Chọn hình từ gallery hoặc URL
- **DatePicker**: Chọn ngày
- **FileUpload**: Upload files

👉 [Xem Implementation Roadmap đầy đủ](./IMPLEMENTATION_ROADMAP.md)

### Phase 3: Validation (2 days)

- Custom validation rules
- Async validation (check username, email)
- Error display improvements

### Phase 4: Advanced Features (3-4 days)

- Conditional logic (show/hide fields)
- Dependent fields (cascading selects)
- Field arrays (repeatable groups)

### Phase 5: Polish (2 days)

- Performance optimization
- Accessibility
- Documentation

---

## 💡 Tips

### 1. Test từng bước

```typescript
// Thêm console.log để debug
console.log("Form values:", form.watch());
console.log("Form errors:", form.formState.errors);
```

### 2. Sử dụng TypeScript

```typescript
// Type-safe form data
interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  featured?: boolean;
}

const handleSubmit = (data: ProductFormData) => {
  // data is fully typed!
};
```

### 3. Tái sử dụng config

```typescript
// configs/product-form.ts
export const productFormConfig: FormConfig = {
  // ... field definitions
};

// Dùng ở nhiều nơi
import { productFormConfig } from "@/configs/product-form";
```

### 4. Thêm field types dần dần

```typescript
// Chỉ cần thêm vào types.ts
export type FieldType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'date'      // NEW!
  | 'file';     // NEW!

// Tạo component mới
// components/dynamic-forms/fields/DatePickerField.tsx

// Thêm vào router
// components/dynamic-forms/DynamicField.tsx
case 'date':
  return <DatePickerField config={config} field={field} />;
```

---

## 📊 File Structure Checklist

```
lib/
  dynamic-forms/
    ✅ types.ts                  # Type definitions
    ✅ schema-generator.ts       # Zod schema generator

components/
  dynamic-forms/
    ✅ DynamicForm.tsx           # Main form component
    ✅ DynamicField.tsx          # Field router

    fields/
      ✅ TextField.tsx           # Text input
      ✅ TextareaField.tsx       # Multi-line text
      ✅ NumberField.tsx         # Number input
      ✅ SelectField.tsx         # Dropdown select
      ✅ CheckboxField.tsx       # Checkbox

app/
  test/
    dynamic-form/
      ✅ page.tsx                # Test page

```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module '@/components/ui/form'"

```bash
# Cài Shadcn Form component
npx shadcn@latest add form
```

### Lỗi: "zodResolver is not a function"

```bash
# Cài đặt resolver
npm install @hookform/resolvers
```

### Form không submit

```typescript
// Check validation errors
const { errors } = form.formState;
console.log("Validation errors:", errors);
```

### TypeScript errors

```typescript
// Đảm bảo import đúng types
import type { FieldConfig, FormConfig } from "@/lib/dynamic-forms/types";
```

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Full Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)
- [Architecture Overview](./01-overview.md)

---

**Ready to start?** Bắt đầu với Day 1 ngay! 🚀
