# Dynamic Forms - Implementation Roadmap

> **Phân chia công việc thành các phase có thể implement từng bước**

---

## 📊 Overview

Tài liệu này tổng hợp toàn bộ hệ thống Dynamic Forms và chia thành **5 Phases** để triển khai từ đơn giản đến phức tạp.

### 🎯 Mục tiêu

- **Phase 1**: Core infrastructure + Basic fields (có thể dùng được ngay)
- **Phase 2**: Advanced field types (tăng khả năng)
- **Phase 3**: Validation + Logic (business rules)
- **Phase 4**: Advanced features (conditional, dependent)
- **Phase 5**: Optimization + Polish (production-ready)

### ⏱️ Thời gian ước tính

- **Phase 1**: 3-4 ngày (foundation)
- **Phase 2**: 2-3 ngày (expand fields)
- **Phase 3**: 2 ngày (validation)
- **Phase 4**: 3-4 ngày (advanced)
- **Phase 5**: 2 ngày (polish)

**Tổng**: ~12-15 ngày làm việc

---

## 🏗️ Phase 1: Core Foundation (3-4 days)

> **Mục tiêu**: Xây dựng hạ tầng cơ bản + 5 field types đơn giản nhất để có thể dùng ngay

### 1.1. Core Types & Interfaces (0.5 day)

**File**: `lib/dynamic-forms/types.ts`

```typescript
// ✅ Implement
export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox";
// Add more later

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // ... core properties
}

export interface FormConfig {
  fields: FieldConfig[];
  submitLabel?: string;
  resetLabel?: string;
}
```

**Deliverable**: Complete TypeScript definitions

---

### 1.2. DynamicForm Component (1 day)

**File**: `components/dynamic-forms/DynamicForm.tsx`

```typescript
// ✅ Implement
interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: any) => void | Promise<void>;
  defaultValues?: Record<string, any>;
}

export function DynamicForm({
  config,
  onSubmit,
  defaultValues,
}: DynamicFormProps) {
  const form = useForm({
    resolver: zodResolver(generateSchema(config)),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {config.fields.map((field) => (
          <DynamicField key={field.name} config={field} />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

**Dependencies**:

- React Hook Form
- Zod
- Shadcn Form components

**Deliverable**: Working form wrapper with validation

---

### 1.3. DynamicField Router (0.5 day)

**File**: `components/dynamic-forms/DynamicField.tsx`

```typescript
// ✅ Implement
export function DynamicField({ config }: { config: FieldConfig }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={config.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
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
    case "select":
      return <SelectField config={config} field={field} />;
    // ... other types
  }
}
```

**Deliverable**: Field type dispatcher

---

### 1.4. Basic Field Components (2 days)

#### TextField Component

**File**: `components/dynamic-forms/fields/TextField.tsx`

```typescript
// ✅ Implement
export function TextField({ config, field }: FieldProps) {
  return (
    <Input
      {...field}
      type={config.inputType || "text"}
      placeholder={config.placeholder}
      disabled={config.disabled}
    />
  );
}
```

#### SelectField Component

**File**: `components/dynamic-forms/fields/SelectField.tsx`

```typescript
// ✅ Implement
export function SelectField({ config, field }: FieldProps) {
  return (
    <Select onValueChange={field.onChange} value={field.value}>
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

#### Other Basic Fields

- **CheckboxField**: Simple checkbox
- **NumberField**: Number input with min/max
- **TextareaField**: Multi-line text

**Deliverable**: 5 working field components

---

### 1.5. Schema Generator (0.5 day)

**File**: `lib/dynamic-forms/schema-generator.ts`

```typescript
// ✅ Implement
export function generateSchema(config: FormConfig): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  config.fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "text":
        schema = z.string();
        break;
      case "number":
        schema = z.number();
        break;
      // ... other types
    }

    if (field.required) {
      schema = schema.min(1, `${field.label} is required`);
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
```

**Deliverable**: Auto-generate Zod schema from config

---

### 1.6. Test Implementation (0.5 day)

**File**: `app/test/dynamic-form/page.tsx`

```typescript
// ✅ Implement
const testConfig: FormConfig = {
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
      options: [
        { label: "Toys", value: "toys" },
        { label: "Games", value: "games" },
      ],
    },
  ],
};

export default function TestPage() {
  return (
    <DynamicForm config={testConfig} onSubmit={(data) => console.log(data)} />
  );
}
```

**Deliverable**: Working test page

---

### ✅ Phase 1 Checklist

- [ ] Types & interfaces defined
- [ ] DynamicForm component working
- [ ] DynamicField router working
- [ ] TextField implemented
- [ ] SelectField implemented
- [ ] CheckboxField implemented
- [ ] NumberField implemented
- [ ] TextareaField implemented
- [ ] Schema generator working
- [ ] Test page created
- [ ] Basic validation working

**Exit Criteria**: Có thể tạo form đơn giản với 5 field types và submit được data

---

## 🚀 Phase 2: Advanced Field Types (2-3 days)

> **Mục tiêu**: Thêm các field types phức tạp hơn (API-driven, file, image, date)

### 2.1. Async Select (API-driven) (0.5 day)

**File**: `components/dynamic-forms/fields/AsyncSelectField.tsx`

```typescript
// ✅ Implement
export function AsyncSelectField({ config, field }: FieldProps) {
  const { data: options, isLoading } = useQuery({
    queryKey: [config.apiEndpoint],
    queryFn: () => fetchOptions(config.apiEndpoint!),
    enabled: !!config.apiEndpoint,
  });

  return (
    <Select onValueChange={field.onChange} value={field.value}>
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && <div>Loading...</div>}
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Dependencies**: TanStack React Query

**Deliverable**: Select loading options from API

---

### 2.2. Multi-Select Field (0.5 day)

**File**: `components/dynamic-forms/fields/MultiSelectField.tsx`

```typescript
// ✅ Implement
export function MultiSelectField({ config, field }: FieldProps) {
  const [selected, setSelected] = useState<string[]>(field.value || []);

  return (
    <MultiSelect
      options={config.options || []}
      selected={selected}
      onChange={(values) => {
        setSelected(values);
        field.onChange(values);
      }}
      placeholder={config.placeholder}
      maxSelected={config.maxSelections}
    />
  );
}
```

**Deliverable**: Multiple selection support

---

### 2.3. Creatable Select (1 day)

**File**: `components/dynamic-forms/fields/CreatableSelectField.tsx`

```typescript
// ✅ Implement with modal pattern
export function CreatableSelectField({ config, field }: FieldProps) {
  const [options, setOptions] = useState(config.options || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (newOption: SelectOption) => {
    if (config.onCreate) {
      const created = await config.onCreate(newOption);
      setOptions([...options, created]);
      field.onChange(created.value);
    }
  };

  return (
    <>
      <Select value={field.value} onValueChange={field.onChange}>
        {/* ... select UI */}
      </Select>

      <Button onClick={() => setIsModalOpen(true)}>+ Create New</Button>

      <CreateOptionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}
```

**Deliverable**: User-created options with modal

---

### 2.4. Image Picker (1 day)

**File**: `components/dynamic-forms/fields/ImagePickerField.tsx`

```typescript
// ✅ Implement dual-mode (gallery + URL)
export function ImagePickerField({ config, field }: FieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"gallery" | "url">("gallery");

  const { data: galleryImages } = useQuery({
    queryKey: [config.galleryQueryKey],
    queryFn: () => fetchGallery(config.galleryEndpoint!),
    enabled: config.allowGallery && !!config.galleryEndpoint,
  });

  return (
    <>
      {/* Preview */}
      {field.value && (
        <div className="relative">
          <img src={field.value.url} alt="" className="w-32 h-32" />
          <Button onClick={() => field.onChange(null)}>Remove</Button>
        </div>
      )}

      <Button onClick={() => setIsOpen(true)}>Select Image</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList>
            {config.allowGallery && (
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            )}
            {config.allowUrl && <TabsTrigger value="url">URL</TabsTrigger>}
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="grid grid-cols-4 gap-2">
              {galleryImages?.map((image) => (
                <img
                  key={image.id}
                  src={image.thumbnail}
                  onClick={() => {
                    field.onChange(image);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* URL Tab */}
          <TabsContent value="url">
            <Input
              placeholder="Paste image URL"
              onBlur={(e) => {
                field.onChange({ url: e.target.value, source: "url" });
                setIsOpen(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </Dialog>
    </>
  );
}
```

**Deliverable**: Image selection with gallery + URL

---

### 2.5. Date & DateTime Picker (0.5 day)

**File**: `components/dynamic-forms/fields/DatePickerField.tsx`

```typescript
// ✅ Implement with date-fns
export function DatePickerField({ config, field }: FieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {field.value ? format(field.value, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => {
            if (config.minDate && date < config.minDate) return true;
            if (config.maxDate && date > config.maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
```

**Dependencies**: date-fns, react-day-picker

**Deliverable**: Date picker with min/max

---

### 2.6. File Upload (0.5 day)

**File**: `components/dynamic-forms/fields/FileUploadField.tsx`

```typescript
// ✅ Implement with drag-drop
export function FileUploadField({ config, field }: FieldProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: config.acceptedFormats,
    maxSize: config.maxFileSize,
    multiple: config.multiple,
    onDrop: (files) => {
      field.onChange(config.multiple ? files : files[0]);
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-4">
      <input {...getInputProps()} />
      <p>Drag & drop or click to upload</p>

      {field.value && (
        <div className="mt-2">
          {Array.isArray(field.value) ? (
            field.value.map((file) => (
              <FilePreview key={file.name} file={file} />
            ))
          ) : (
            <FilePreview file={field.value} />
          )}
        </div>
      )}
    </div>
  );
}
```

**Dependencies**: react-dropzone

**Deliverable**: File upload with drag-drop

---

### ✅ Phase 2 Checklist

- [ ] AsyncSelect implemented
- [ ] MultiSelect implemented
- [ ] CreatableSelect implemented
- [ ] ImagePicker implemented
- [ ] DatePicker implemented
- [ ] FileUpload implemented
- [ ] All fields integrated with DynamicField router
- [ ] Test page updated with new fields

**Exit Criteria**: Tất cả 11 field types chính hoạt động tốt

---

## 🎨 Phase 3: Validation & Error Handling (2 days)

> **Mục tiêu**: Tăng cường validation logic và xử lý lỗi chuyên nghiệp

### 3.1. Advanced Schema Generation (0.5 day)

**File**: `lib/dynamic-forms/schema-generator.ts` (enhance)

```typescript
// ✅ Enhance
export function generateSchema(config: FormConfig): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  config.fields.forEach((field) => {
    let schema = getBaseSchema(field);

    // Required validation
    if (field.required) {
      schema = addRequiredValidation(schema, field);
    }

    // Min/Max validation
    if (field.min !== undefined || field.max !== undefined) {
      schema = addRangeValidation(schema, field);
    }

    // Pattern validation
    if (field.pattern) {
      schema = schema.regex(new RegExp(field.pattern), field.patternMessage);
    }

    // Custom validation
    if (field.customValidation) {
      schema = schema.refine(field.customValidation, {
        message: field.validationMessage,
      });
    }

    // Async validation
    if (field.asyncValidation) {
      schema = schema.refine(
        async (value) => await field.asyncValidation!(value),
        { message: field.validationMessage }
      );
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
```

**Deliverable**: Comprehensive validation support

---

### 3.2. Custom Validation Rules (0.5 day)

**File**: `lib/dynamic-forms/validation-rules.ts`

```typescript
// ✅ Implement
export const validationRules = {
  email: (value: string) => z.string().email().safeParse(value).success,

  phone: (value: string) => /^\+?[\d\s\-()]+$/.test(value),

  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  uniqueInArray: (value: any, array: any[], key: string) => {
    return !array.some((item) => item[key] === value);
  },

  fileSize: (file: File, maxSize: number) => {
    return file.size <= maxSize;
  },

  imageRatio: (image: HTMLImageElement, ratio: number) => {
    return Math.abs(image.width / image.height - ratio) < 0.01;
  },
};
```

**Deliverable**: Reusable validation functions

---

### 3.3. Error Display Component (0.5 day)

**File**: `components/dynamic-forms/ErrorDisplay.tsx`

```typescript
// ✅ Implement
export function ErrorDisplay({ errors }: { errors: FieldErrors }) {
  if (Object.keys(errors).length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4">
          {Object.entries(errors).map(([field, error]) => (
            <li key={field}>
              <strong>{field}</strong>: {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
```

**Deliverable**: Centralized error display

---

### 3.4. Async Validation (0.5 day)

**File**: `lib/dynamic-forms/async-validators.ts`

```typescript
// ✅ Implement
export const asyncValidators = {
  checkUsernameAvailable: async (username: string): Promise<boolean> => {
    const response = await fetch(`/api/check-username?username=${username}`);
    const { available } = await response.json();
    return available;
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { exists } = await response.json();
    return !exists;
  },

  validateImageUrl: async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  },
};
```

**Deliverable**: Server-side validation helpers

---

### ✅ Phase 3 Checklist

- [ ] Enhanced schema generator
- [ ] Custom validation rules
- [ ] Error display component
- [ ] Async validation support
- [ ] Field-level error messages
- [ ] Form-level error summary
- [ ] Test cases for all validations

**Exit Criteria**: Validation hoàn chỉnh với custom rules và async checks

---

## 🧩 Phase 4: Advanced Features (3-4 days)

> **Mục tiêu**: Conditional logic, dependent fields, field arrays

### 4.1. Conditional Logic (1 day)

**File**: `lib/dynamic-forms/conditional-logic.ts`

```typescript
// ✅ Implement
export interface ConditionalLogic {
  when: string; // field name
  is: any; // value to match
  then: "show" | "hide" | "enable" | "disable" | "require";
}

export function evaluateCondition(
  condition: ConditionalLogic,
  formValues: Record<string, any>
): boolean {
  const fieldValue = formValues[condition.when];

  // Simple equality check
  if (condition.is !== undefined) {
    return fieldValue === condition.is;
  }

  // Add more complex conditions (gt, lt, contains, etc.)
  return false;
}

export function applyConditionalLogic(
  field: FieldConfig,
  formValues: Record<string, any>
): FieldConfig {
  if (!field.showWhen && !field.hideWhen) {
    return field;
  }

  const shouldShow = field.showWhen
    ? evaluateCondition(field.showWhen, formValues)
    : true;

  const shouldHide = field.hideWhen
    ? evaluateCondition(field.hideWhen, formValues)
    : false;

  return {
    ...field,
    hidden: shouldHide || !shouldShow,
  };
}
```

**Usage**:

```typescript
{
  name: 'otherCategory',
  type: 'text',
  label: 'Specify Other',
  showWhen: { when: 'category', is: 'other' },
}
```

**Deliverable**: Show/hide fields conditionally

---

### 4.2. Dependent Fields (1 day)

**File**: `components/dynamic-forms/fields/DependentSelectField.tsx`

```typescript
// ✅ Implement
export function DependentSelectField({ config, field }: FieldProps) {
  const { watch } = useFormContext();
  const parentValue = watch(config.dependsOn!);

  const { data: options } = useQuery({
    queryKey: [config.apiEndpoint, parentValue],
    queryFn: () => fetchDependentOptions(config.apiEndpoint!, parentValue),
    enabled: !!parentValue && !!config.apiEndpoint,
  });

  // Reset value when parent changes
  useEffect(() => {
    if (field.value) {
      field.onChange(undefined);
    }
  }, [parentValue]);

  return (
    <Select
      value={field.value}
      onValueChange={field.onChange}
      disabled={!parentValue}
    >
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Usage**:

```typescript
[
  {
    name: "category",
    type: "select",
    label: "Category",
    options: [
      /* categories */
    ],
  },
  {
    name: "subcategory",
    type: "select",
    label: "Subcategory",
    dependsOn: "category",
    apiEndpoint: "/api/subcategories",
  },
];
```

**Deliverable**: Cascading selects

---

### 4.3. Field Arrays (1-2 days)

**File**: `components/dynamic-forms/FieldArray.tsx`

```typescript
// ✅ Implement
export function FieldArray({ config }: { config: FieldArrayConfig }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: config.name,
  });

  return (
    <div>
      <label>{config.label}</label>

      {fields.map((item, index) => (
        <div key={item.id} className="flex gap-2 items-start">
          {config.fields.map((fieldConfig) => (
            <DynamicField
              key={fieldConfig.name}
              config={{
                ...fieldConfig,
                name: `${config.name}.${index}.${fieldConfig.name}`,
              }}
            />
          ))}

          <Button type="button" variant="ghost" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}

      <Button type="button" onClick={() => append(config.defaultValue || {})}>
        + Add {config.label}
      </Button>
    </div>
  );
}
```

**Usage**:

```typescript
{
  name: 'variants',
  type: 'array',
  label: 'Product Variants',
  fields: [
    { name: 'size', type: 'text', label: 'Size' },
    { name: 'price', type: 'number', label: 'Price' },
    { name: 'stock', type: 'number', label: 'Stock' },
  ],
  minItems: 1,
  maxItems: 10,
}
```

**Deliverable**: Repeatable field groups

---

### ✅ Phase 4 Checklist

- [ ] Conditional logic system
- [ ] Show/hide based on values
- [ ] Dependent select fields
- [ ] Field arrays implementation
- [ ] Add/remove array items
- [ ] Nested field validation
- [ ] Test complex scenarios

**Exit Criteria**: Support conditional logic và field arrays

---

## 🎯 Phase 5: Optimization & Polish (2 days)

> **Mục tiêu**: Performance, UX improvements, production-ready

### 5.1. Performance Optimization (0.5 day)

**Optimizations**:

```typescript
// ✅ Memoize field renders
const MemoizedDynamicField = React.memo(DynamicField, (prev, next) => {
  return (
    prev.config.name === next.config.name &&
    prev.config.type === next.config.type &&
    JSON.stringify(prev.config) === JSON.stringify(next.config)
  );
});

// ✅ Debounce async validation
const debouncedValidate = useMemo(
  () => debounce(asyncValidators.checkUsername, 500),
  []
);

// ✅ Virtual scrolling for large option lists
import { useVirtualizer } from "@tanstack/react-virtual";

// ✅ Lazy load field components
const ImagePickerField = lazy(() => import("./fields/ImagePickerField"));
const RichTextEditor = lazy(() => import("./fields/RichTextEditor"));
```

**Deliverable**: Optimized renders and validation

---

### 5.2. Loading & Error States (0.5 day)

**File**: `components/dynamic-forms/LoadingState.tsx`

```typescript
// ✅ Implement
export function LoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 p-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message || "Loading..."}</span>
    </div>
  );
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="text-center p-8">
      <p className="text-muted-foreground">{message}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

**Deliverable**: Better UX for async operations

---

### 5.3. Accessibility (0.5 day)

```typescript
// ✅ Add ARIA labels
<Input
  {...field}
  aria-label={config.label}
  aria-required={config.required}
  aria-invalid={!!error}
  aria-describedby={error ? `${config.name}-error` : undefined}
/>

// ✅ Keyboard navigation
<button
  onClick={handleAction}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
/>

// ✅ Focus management
const firstErrorField = Object.keys(errors)[0];
if (firstErrorField) {
  document.querySelector(`[name="${firstErrorField}"]`)?.focus();
}
```

**Deliverable**: WCAG 2.1 AA compliance

---

### 5.4. Documentation & Examples (0.5 day)

**Create**:

- Storybook stories for each field
- Usage examples in test page
- JSDoc comments
- README with quick start

**File**: `components/dynamic-forms/README.md`

```markdown
# Dynamic Forms

## Quick Start

\`\`\`typescript
import { DynamicForm } from '@/components/dynamic-forms';

const config = {
fields: [
{ name: 'name', type: 'text', label: 'Name', required: true },
],
};

<DynamicForm config={config} onSubmit={handleSubmit} />
\`\`\`

## Field Types

- Text, Textarea, Number
- Select, MultiSelect, AsyncSelect, CreatableSelect
- Checkbox, Radio, Switch
- DatePicker, TimePicker
- FileUpload, ImagePicker
- RichText, ColorPicker, Slider

## Advanced Features

- Conditional Logic
- Dependent Fields
- Field Arrays
- Async Validation
- Custom Validation

## API Reference

See [types.ts](./types.ts) for full API
```

**Deliverable**: Complete documentation

---

### ✅ Phase 5 Checklist

- [ ] Performance optimized
- [ ] Loading states added
- [ ] Error states added
- [ ] Accessibility implemented
- [ ] Documentation complete
- [ ] Storybook stories
- [ ] Example forms
- [ ] Production build tested

**Exit Criteria**: Production-ready với docs đầy đủ

---

## 📦 Dependencies Summary

### Core Dependencies

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-table": "^8.10.0",
    "date-fns": "^2.30.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.294.0"
  }
}
```

### Shadcn UI Components

```bash
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add alert
```

### Optional Dependencies

```json
{
  "dependencies": {
    "react-dropzone": "^14.2.0",
    "@tanstack/react-virtual": "^3.0.0",
    "react-day-picker": "^8.9.0"
  }
}
```

---

## 🗂️ File Structure

```
components/
  dynamic-forms/
    DynamicForm.tsx              # Phase 1
    DynamicField.tsx             # Phase 1
    FieldArray.tsx               # Phase 4
    ErrorDisplay.tsx             # Phase 3
    LoadingState.tsx             # Phase 5
    README.md                    # Phase 5

    fields/
      TextField.tsx              # Phase 1
      SelectField.tsx            # Phase 1
      CheckboxField.tsx          # Phase 1
      NumberField.tsx            # Phase 1
      TextareaField.tsx          # Phase 1
      AsyncSelectField.tsx       # Phase 2
      MultiSelectField.tsx       # Phase 2
      CreatableSelectField.tsx   # Phase 2
      ImagePickerField.tsx       # Phase 2
      DatePickerField.tsx        # Phase 2
      FileUploadField.tsx        # Phase 2
      DependentSelectField.tsx   # Phase 4

lib/
  dynamic-forms/
    types.ts                     # Phase 1
    schema-generator.ts          # Phase 1, enhanced Phase 3
    conditional-logic.ts         # Phase 4
    validation-rules.ts          # Phase 3
    async-validators.ts          # Phase 3
    utils.ts                     # As needed

docs/
  dynamic-forms/
    (existing documentation)
```

---

## 📊 Testing Strategy

### Phase 1 Testing

```typescript
// Basic form submission
describe("DynamicForm", () => {
  it("should render all fields", () => {});
  it("should validate required fields", () => {});
  it("should submit form data", () => {});
});
```

### Phase 2 Testing

```typescript
// Async operations
describe("AsyncSelectField", () => {
  it("should load options from API", () => {});
  it("should show loading state", () => {});
});
```

### Phase 3 Testing

```typescript
// Validation
describe("Schema Generator", () => {
  it("should generate required validation", () => {});
  it("should handle async validation", () => {});
});
```

### Phase 4 Testing

```typescript
// Complex interactions
describe("Conditional Logic", () => {
  it("should show field when condition met", () => {});
  it("should hide field when condition not met", () => {});
});
```

---

## 🎯 Success Metrics

### Phase 1

- ✅ 5 basic field types working
- ✅ Form submission successful
- ✅ Basic validation working

### Phase 2

- ✅ 11 field types total
- ✅ API-driven fields working
- ✅ File/image upload working

### Phase 3

- ✅ Custom validation rules
- ✅ Async validation
- ✅ Error handling complete

### Phase 4

- ✅ Conditional logic working
- ✅ Dependent fields working
- ✅ Field arrays working

### Phase 5

- ✅ Performance optimized (< 100ms render)
- ✅ Accessibility score > 90
- ✅ Documentation complete

---

## 🚀 Quick Start Guide

### Day 1: Setup Core

```bash
# Install dependencies
npm install react-hook-form zod

# Add Shadcn components
npx shadcn@latest add form input button

# Create types.ts
# Create DynamicForm.tsx
# Create TextField.tsx
```

### Day 2: Basic Fields

```bash
# Implement SelectField
# Implement CheckboxField
# Implement NumberField
# Test basic form
```

### Day 3: Schema & Validation

```bash
# Implement schema-generator.ts
# Add validation
# Test validation
```

### Week 2: Advanced Fields

```bash
# Implement Phase 2 fields
# Add TanStack Query
# Test async operations
```

### Week 3: Advanced Features

```bash
# Implement conditional logic
# Implement dependent fields
# Implement field arrays
```

---

## 📚 Reference Documentation

- [Overview](./01-overview.md)
- [TypeScript Types](./02-types.md)
- [Select Fields](./fields/07-select-fields.md)
- [Creatable Select](./fields/10-creatable-select.md)
- [Image Picker](./fields/11-imagepicker-field.md)
- [UX Patterns](./UX_PATTERNS.md)
- [Architecture Patterns](./ARCHITECTURE_PATTERNS.md)

---

## 💡 Tips

1. **Start Small**: Implement Phase 1 completely before moving to Phase 2
2. **Test Early**: Write tests as you implement features
3. **Document As You Go**: Add JSDoc comments while coding
4. **Use TypeScript**: Type everything for better DX
5. **Reuse Components**: Extract common patterns into utilities
6. **Performance**: Use React.memo and useMemo strategically
7. **Accessibility**: Test with keyboard and screen readers

---

**Last Updated**: November 22, 2025  
**Status**: Ready for Implementation  
**Estimated Time**: 12-15 days
