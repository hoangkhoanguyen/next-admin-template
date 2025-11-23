# Dynamic Forms System - Documentation

> **Hệ thống form động config-driven với validation, layout control, và 20+ field types**

---

## 📚 Table of Contents

### 🚀 Getting Started

- **[⭐ Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Tổng quan toàn bộ hệ thống để bắt đầu ngay
- **[Quick Start Guide](./QUICK_START.md)** - Bắt đầu coding trong 10 phút (Phase 1 - Day 1-2)
- **[Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)** - Phân chia 5 phases cho quá trình coding (12-15 ngày)
- **[Sprint Planning](./SPRINT_PLANNING.md)** - Kế hoạch chi tiết cho 3 sprints (15 ngày, daily tasks)

### Core Concepts

1. [Overview & Architecture](./01-overview.md)
2. [Type Definitions](./02-types.md)
3. [Form Schema Generator](./03-schema-generator.md)
4. [Layout System](./04-layout-system.md)

### Field Components

5. [Text & TextArea Fields](./fields/05-text-fields.md)
6. [Number & Currency Fields](./fields/06-number-fields.md)
7. [Select & Multi-Select](./fields/07-select-fields.md)
8. [Async Select (API-driven)](./fields/08-async-select.md)
9. [Searchable Select (Large Lists)](./fields/09-searchable-select.md)
10. [Creatable Select (User-Created Options)](./fields/10-creatable-select.md)
11. [Image Picker (Gallery + URL)](./fields/11-imagepicker-field.md) ⭐ NEW
12. [Date & DateTime Pickers](./fields/12-date-fields.md)
13. [Checkbox & Switch](./fields/13-checkbox-fields.md)
14. [Radio & Radio Group](./fields/14-radio-fields.md)
15. [File Upload](./fields/15-file-upload.md)
16. [Rich Text Editor](./fields/16-rich-text.md)
17. [Color Picker](./fields/17-color-picker.md)
18. [Slider & Range](./fields/18-slider-fields.md)
19. [Password Field](./fields/19-password-field.md)

### Advanced Features

20. [Conditional Logic (Show/Hide)](./advanced/20-conditional-logic.md)
21. [Dependent Fields (Cascading)](./advanced/21-dependent-fields.md)
22. [Dynamic Validation](./advanced/22-dynamic-validation.md)
23. [Field Arrays (Repeatable Groups)](./advanced/23-field-arrays.md)
24. [Custom Field Types](./advanced/24-custom-fields.md)

### Implementation

25. [DynamicForm Component](./implementation/25-dynamic-form.md)
26. [DynamicField Router](./implementation/26-dynamic-field.md)
27. [Form Hooks & Utils](./implementation/27-hooks-utils.md)

### Examples

28. [User Management Form](./examples/28-user-form.md)
29. [Product Management Form](./examples/29-product-form.md)
30. [E-commerce Order Form](./examples/30-order-form.md)
31. [Settings & Preferences](./examples/31-settings-form.md)

---

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install react-hook-form zod @hookform/resolvers

# Install Shadcn UI components
npx shadcn@latest add form input textarea select checkbox radio-group switch button calendar popover command badge
```

### 2. Basic Usage

```typescript
import { DynamicForm } from "@/components/forms/DynamicForm";
import type { FormConfig } from "@/lib/types/dynamic-form.types";

const formConfig: FormConfig = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
      placeholder: "Enter your name...",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};

function MyForm() {
  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

### 3. With Layout Control

```typescript
const formConfig: FormConfig = {
  layout: "grid",
  columns: 12,
  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      colSpan: 12, // Full width
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      colSpan: 6, // Half width
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone",
      colSpan: 6, // Half width
    },
  ],
};
```

---

## 📁 File Structure

```
components/
├── forms/
│   ├── DynamicForm.tsx           # Main form component
│   ├── DynamicField.tsx          # Field router/renderer
│   │
│   ├── fields/                   # Individual field components
│   │   ├── TextField.tsx
│   │   ├── SelectField.tsx
│   │   ├── AsyncSelect.tsx
│   │   ├── SearchableSelect.tsx
│   │   ├── CreatableSelect.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── DatePicker.tsx
│   │   ├── FileUpload.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── ...
│   │
│   └── utils/
│       ├── generateFormSchema.ts  # Zod schema generator
│       ├── getGridClasses.ts      # Layout helper
│       └── fieldValidators.ts     # Custom validators

lib/
└── types/
    └── dynamic-form.types.ts      # TypeScript definitions
```

---

## 🎯 Key Features

### ✅ 20+ Field Types

- Text, Email, Number, Currency, Password
- Select, Multi-Select, Searchable, Creatable
- Date, DateTime, Time
- Checkbox, Switch, Radio
- File Upload (Single/Multiple)
- Rich Text Editor
- Color Picker, Slider, Range

### ✅ Advanced Layout System

- 12-column grid system (like Bootstrap/Tailwind)
- `colSpan`, `colStart`, `colEnd` control
- Responsive breakpoints
- Section grouping with dividers

### ✅ Dynamic Options (Select Fields)

- Static hardcoded arrays
- Dynamic props from parent
- Async fetch with `loadOptions()`
- API endpoint with React Query
- Searchable (200+ items with filtering)
- Creatable (user-generated options)
- Dependent/Cascading (Category → Subcategory)
- With icons

### ✅ Validation

- Automatic Zod schema generation
- Built-in validators (required, min, max, email, url, etc.)
- Custom validation functions
- Async validation (API checks)
- Cross-field validation

### ✅ Conditional Logic

- Show/hide based on other field values
- Disable based on conditions
- Dynamic options based on dependencies

### ✅ Developer Experience

- Full TypeScript support with type inference
- Automatic form state management
- Built-in error handling
- Loading states
- Submission handling

---

## 🔗 Navigation

**Start with:**

1. [Overview & Architecture](./01-overview.md) - Understand the system
2. [Type Definitions](./02-types.md) - Learn the types
3. [Select Fields](./fields/07-select-fields.md) - Most common use case

**Then explore:**

- Specific field types you need
- Advanced features (conditional logic, validation)
- Real-world examples

---

## 📖 Documentation Structure

Each document follows this pattern:

1. **Overview** - What the field does
2. **Type Definition** - TypeScript interface
3. **Basic Implementation** - Simple example
4. **Advanced Features** - Extra capabilities
5. **Usage Examples** - Real-world scenarios
6. **Best Practices** - Do's and Don'ts

---

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **TanStack React Query** - Async data (for API-driven selects)

---

## 📝 Contributing

When adding new field types:

1. Create new file in `docs/dynamic-forms/fields/`
2. Follow existing document structure
3. Update this README with new field
4. Add examples to examples section
5. Update type definitions if needed

---

## 🎓 Learning Path

### Beginner

1. Read Overview
2. Study Type Definitions
3. Implement basic text/select fields
4. Try simple examples

### Intermediate

1. Learn Layout System
2. Add conditional logic
3. Implement async selects
4. Use field arrays

### Advanced

1. Create custom field types
2. Implement complex validation
3. Build reusable form templates
4. Optimize performance

---

Last Updated: November 22, 2025
