# Dynamic Forms - Overview & Architecture

## 🎯 What is Dynamic Forms?

**Dynamic Forms** là hệ thống form **config-driven** cho phép bạn tạo forms phức tạp bằng cách định nghĩa **configuration object** thay vì viết JSX thủ công.

### Traditional Approach (Manual JSX)

```tsx
function UserForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Repeat for 20+ fields... */}
    </Form>
  );
}
```

**Problems:**

- ❌ Repetitive boilerplate code
- ❌ Hard to maintain large forms
- ❌ No reusability across projects
- ❌ Difficult to generate forms dynamically

---

### Dynamic Forms Approach (Config-Driven)

```tsx
const formConfig: FormConfig = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    },
  ],
};

function UserForm() {
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

**Benefits:**

- ✅ No boilerplate code
- ✅ Configuration can come from API/database
- ✅ Fully reusable across projects
- ✅ Easy to maintain and extend
- ✅ Type-safe with TypeScript
- ✅ Automatic validation with Zod

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────┐
│                   FormConfig                        │
│  (Configuration object defining all fields)         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              DynamicForm Component                  │
│  • Generates Zod schema from config                 │
│  • Initializes React Hook Form                      │
│  • Handles form submission                          │
│  • Manages form state                               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            DynamicField Component                   │
│  • Routes to correct field component based on type  │
│  • Applies layout classes (grid, colSpan)          │
│  • Handles conditional logic (show/hide)           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ TextField    │      │ SelectField  │
│ NumberField  │      │ AsyncSelect  │
│ DatePicker   │      │ FileUpload   │
│ ...          │      │ ...          │
└──────────────┘      └──────────────┘
  Individual Field Components
```

---

## 📦 Core Concepts

### 1. Form Configuration

The heart of the system - a JavaScript object that defines your entire form:

```typescript
interface FormConfig {
  fields: FieldConfig[]; // Array of field definitions
  layout?: "vertical" | "grid"; // Layout mode
  columns?: number; // Grid columns (default: 12)
  defaultValues?: Record<string, any>; // Initial values
  onSubmit?: (data: any) => void; // Submit handler
}
```

### 2. Field Configuration

Each field is defined by a config object:

```typescript
interface FieldConfig {
  name: string; // Field name (form key)
  type: FieldType; // Field type (text, select, etc.)
  label?: string; // Display label
  placeholder?: string; // Placeholder text
  required?: boolean; // Required validation
  disabled?: boolean; // Disabled state
  description?: string; // Help text

  // Layout
  colSpan?: number; // Column span (1-12)
  colStart?: number; // Start column

  // Conditional
  showWhen?: ConditionalLogic; // Show/hide logic

  // Validation
  min?: number; // Min value/length
  max?: number; // Max value/length
  pattern?: string; // Regex pattern
  validate?: (value: any) => boolean | string; // Custom validator

  // Field-specific options
  options?: SelectOption[]; // For select fields
  multiple?: boolean; // For multi-select
  accept?: string; // For file upload
  // ... more options per field type
}
```

### 3. Schema Generation

Automatically generates Zod schema from configuration:

```typescript
const schema = generateFormSchema(formConfig.fields);

// Generated schema:
z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18+"),
});
```

### 4. Field Routing

DynamicField component routes to the correct field implementation:

```typescript
function DynamicField({ config, form }) {
  switch (config.type) {
    case "text":
    case "email":
    case "url":
      return <TextField config={config} form={form} />;

    case "select":
      return <SelectField config={config} form={form} />;

    case "date":
      return <DatePicker config={config} form={form} />;

    // ... more field types
  }
}
```

---

## 🎨 Field Types

### Basic Input Fields

- `text` - Single-line text input
- `textarea` - Multi-line text
- `email` - Email with validation
- `url` - URL with validation
- `tel` - Phone number
- `password` - Password with toggle visibility

### Number Fields

- `number` - Generic number input
- `currency` - Currency with formatting
- `percentage` - Percentage (0-100)

### Selection Fields

- `select` - Single select dropdown
- `multiselect` - Multiple selection
- `radio` - Radio buttons
- `checkbox` - Single checkbox
- `switch` - Toggle switch

### Date/Time Fields

- `date` - Date picker
- `datetime` - Date + Time picker
- `time` - Time picker
- `daterange` - Date range picker

### Advanced Fields

- `file` - File upload (single/multiple)
- `image` - Image upload with preview
- `richtext` - Rich text editor (WYSIWYG)
- `color` - Color picker
- `slider` - Slider input
- `range` - Range slider (min/max)

### Special Fields

- `divider` - Visual separator
- `heading` - Section heading
- `custom` - Custom render function

---

## 🔄 Data Flow

```
User edits field
      ↓
React Hook Form captures change
      ↓
Validates against Zod schema
      ↓
Updates form state
      ↓
Re-renders affected fields
      ↓
User submits form
      ↓
Final validation
      ↓
Calls onSubmit with validated data
```

---

## 🎯 Key Features

### ✅ Automatic Validation

```typescript
{
  name: 'email',
  type: 'email',
  required: true,
  // Auto generates: z.string().email().min(1)
}
```

### ✅ Layout Control

```typescript
{
  name: 'firstName',
  type: 'text',
  colSpan: 6,  // Takes up 6/12 columns (50% width)
}
```

### ✅ Conditional Display

```typescript
{
  name: 'otherReason',
  type: 'textarea',
  showWhen: {
    field: 'reason',
    operator: 'equals',
    value: 'other',
  },
}
```

### ✅ Dynamic Options

```typescript
{
  name: 'country',
  type: 'select',
  loadOptions: async () => {
    const res = await fetch('/api/countries');
    return res.json();
  },
}
```

### ✅ Type Safety

```typescript
// Full TypeScript inference
const formConfig: FormConfig = {
  fields: [
    {
      name: "status",
      type: "select",
      options: [
        /* ... */
      ], // Type-checked
    },
  ],
};

// Submit handler has typed data
const handleSubmit = (data: z.infer<typeof schema>) => {
  console.log(data.status); // Autocomplete works!
};
```

---

## 📊 Comparison: Manual vs Dynamic

| Aspect                 | Manual Forms        | Dynamic Forms       |
| ---------------------- | ------------------- | ------------------- |
| **Lines of Code**      | ~30 lines per field | ~10 lines per field |
| **Boilerplate**        | High                | None                |
| **Reusability**        | Low                 | High                |
| **Maintainability**    | Hard                | Easy                |
| **Dynamic Generation** | Not possible        | Built-in            |
| **Type Safety**        | Manual typing       | Automatic inference |
| **Validation**         | Manual Zod schema   | Auto-generated      |
| **Layout Control**     | Manual CSS/Grid     | Config-based        |
| **Learning Curve**     | Medium              | Low                 |

---

## 🚀 Use Cases

### Perfect For:

- ✅ Admin dashboards with CRUD forms
- ✅ Multi-step wizards
- ✅ Form builders (user-created forms)
- ✅ Settings/preferences pages
- ✅ Dynamic forms from API/database
- ✅ Consistent form UX across app
- ✅ Forms with complex validation

### Not Ideal For:

- ❌ Very simple forms (1-2 fields)
- ❌ Highly custom/unique forms
- ❌ Forms with complex custom logic
- ❌ When you need fine-grained control over every detail

---

## 🔧 Tech Stack

### Required Dependencies

```json
{
  "react": "^19.0.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

### Optional Dependencies (Based on Field Types)

```json
{
  "date-fns": "^3.0.0", // For date fields
  "react-day-picker": "^8.10.0", // Date picker UI
  "@tanstack/react-query": "^5.0.0", // For async selects
  "lucide-react": "^0.300.0", // Icons
  "sonner": "^1.3.0" // Toast notifications
}
```

### Shadcn UI Components Needed

```bash
npx shadcn@latest add form input textarea select checkbox \
  radio-group switch button calendar popover command badge \
  slider separator label
```

---

## 📁 File Organization

```
components/forms/
├── DynamicForm.tsx              # Main component
├── DynamicField.tsx             # Field router
│
├── fields/                      # Field implementations
│   ├── TextField.tsx
│   ├── SelectField.tsx
│   ├── AsyncSelect.tsx
│   ├── SearchableSelect.tsx
│   ├── CreatableSelect.tsx
│   ├── MultiSelect.tsx
│   ├── DatePicker.tsx
│   ├── FileUpload.tsx
│   └── ...
│
└── utils/
    ├── generateFormSchema.ts    # Zod generator
    ├── getGridClasses.ts        # Layout helper
    └── fieldValidators.ts       # Custom validators
```

---

## 🎓 Next Steps

1. **[Type Definitions](./02-types.md)** - Learn the TypeScript interfaces
2. **[Form Schema Generator](./03-schema-generator.md)** - Understand validation
3. **[Layout System](./04-layout-system.md)** - Master grid layouts
4. **[Select Fields](./fields/07-select-fields.md)** - Most common field type

---

**Ready to dive deeper?** Start with [Type Definitions →](./02-types.md)
