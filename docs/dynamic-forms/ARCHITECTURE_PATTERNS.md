# Creatable Select - Architecture Patterns

> **Best practices for structuring creatable select components with modals**

---

## 🏗️ Architecture Decision: Should Modal Be Separate?

### ✅ YES - Always Separate Modal from Select

**TL;DR:** Modal component should be **separate file/component**, not inside select component.

---

## ❌ Anti-Pattern: Monolithic Component

### Bad Example

```typescript
// ❌ DON'T: Everything in one file
// components/forms/fields/CreatableSelectWithModal.tsx (500+ lines!)

export function CreatableSelectWithModal({ field, formField }) {
  // Select state
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "",
    parentId: "",
  });

  // Select handlers
  const handleSelectChange = () => {
    /* ... */
  };
  const handleSelectOpen = () => {
    /* ... */
  };

  // Modal handlers
  const handleModalSubmit = () => {
    /* ... */
  };
  const handleModalCancel = () => {
    /* ... */
  };
  const handleModalFieldChange = () => {
    /* ... */
  };

  // Validation
  const validateModalData = () => {
    /* ... */
  };

  return (
    <>
      {/* 100 lines of Select JSX */}
      <Select>{/* ... */}</Select>

      {/* 200 lines of Modal JSX */}
      <Dialog open={showModal}>
        <DialogContent>{/* Complex form JSX */}</DialogContent>
      </Dialog>
    </>
  );
}
```

### Problems

| Problem              | Impact                                            |
| -------------------- | ------------------------------------------------- |
| **Too Complex**      | 500+ lines, hard to understand                    |
| **Mixed Concerns**   | Select logic + Modal logic together               |
| **Not Reusable**     | Can't use modal elsewhere                         |
| **Hard to Test**     | Must test everything together                     |
| **Poor Performance** | Re-renders entire component on any change         |
| **Team Conflicts**   | Multiple devs editing same file = merge conflicts |

---

## ✅ Best Practice: Separate Components

### Good Example - 3-File Architecture

```
components/
├── forms/
│   └── fields/
│       └── CreatableSelect.tsx          # 80 lines
├── modals/
│   └── CreateOptionModal.tsx            # 120 lines
└── hooks/
    └── useCreateOption.ts               # 40 lines
```

---

## 📁 Pattern 1: Basic Separation

### File 1: Modal Component (Reusable)

```typescript
// components/modals/CreateOptionModal.tsx
// ✅ Single responsibility: Handle option creation form

interface CreateOptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (option: SelectOption) => void;
  title?: string;
  description?: string;
  schema?: z.ZodSchema;
  fields?: FieldConfig[];
}

export function CreateOptionModal({
  open,
  onOpenChange,
  onSubmit,
  title = "Create New Option",
  description,
  schema,
  fields,
}: CreateOptionModalProps) {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const handleSubmit = (data: any) => {
    const option: SelectOption = {
      label: data.name,
      value: generateId(),
      ...data,
      isNew: true,
    };

    onSubmit(option);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Dynamic form fields based on `fields` prop */}
            {fields ? (
              <DynamicForm config={{ fields }} />
            ) : (
              // Default fields
              <>
                <FormField name="name" label="Name" required />
                <FormField name="description" label="Description" />
              </>
            )}

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### File 2: Select Component (Clean)

```typescript
// components/forms/fields/CreatableSelect.tsx
// ✅ Single responsibility: Handle selection + trigger modal

import { CreateOptionModal } from "@/components/modals/CreateOptionModal";

export function CreatableSelect({ field, formField }) {
  const [showModal, setShowModal] = useState(false);
  const [localOptions, setLocalOptions] = useState(field.options || []);

  const handleCreateOption = (newOption: SelectOption) => {
    setLocalOptions([...localOptions, newOption]);
    formField.onChange(newOption.value);
    field.onCreateOption?.(newOption);
    toast.success(`Created: ${newOption.label}`);
  };

  return (
    <>
      <Select value={formField.value} onValueChange={formField.onChange}>
        <SelectTrigger>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {localOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}

          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setShowModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </SelectContent>
      </Select>

      <CreateOptionModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleCreateOption}
        title={`Create New ${field.label}`}
        schema={field.createSchema}
        fields={field.createFields}
      />
    </>
  );
}
```

### File 3: Custom Hook (Optional)

```typescript
// hooks/useCreateOption.ts
// ✅ Single responsibility: Handle creation logic

export function useCreateOption(
  initialOptions: SelectOption[],
  onCreateCallback?: (option: SelectOption) => void
) {
  const [localOptions, setLocalOptions] = useState(initialOptions);
  const [showModal, setShowModal] = useState(false);

  const createOption = (data: any) => {
    const newOption: SelectOption = {
      label: data.name,
      value: generateId(),
      ...data,
      isNew: true,
      createdAt: new Date().toISOString(),
    };

    setLocalOptions((prev) => [...prev, newOption]);
    onCreateCallback?.(newOption);
    toast.success(`Created: ${newOption.label}`);

    return newOption;
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return {
    localOptions,
    showModal,
    openModal,
    closeModal,
    createOption,
  };
}

// Usage in Select component
function CreatableSelect({ field, formField }) {
  const { localOptions, showModal, openModal, closeModal, createOption } =
    useCreateOption(field.options, field.onCreateOption);

  const handleSubmit = (newOption: SelectOption) => {
    const option = createOption(newOption);
    formField.onChange(option.value);
    closeModal();
  };

  return (
    <>
      <Select>{/* ... */}</Select>
      <CreateOptionModal
        open={showModal}
        onOpenChange={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

---

## 🚀 Pattern 2: Context-Based (Global Modal)

For apps with many creatable selects, use a global modal provider.

### File 1: Context Provider

```typescript
// contexts/CreateModalContext.tsx

interface ModalConfig {
  title: string;
  fields: FieldConfig[];
  schema?: z.ZodSchema;
  onSubmit: (option: SelectOption) => void;
}

interface CreateModalContextValue {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const CreateModalContext = createContext<CreateModalContextValue | null>(null);

export function CreateModalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = (config: ModalConfig) => setConfig(config);
  const closeModal = () => setConfig(null);

  const handleSubmit = (option: SelectOption) => {
    config?.onSubmit(option);
    closeModal();
  };

  return (
    <CreateModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Single global modal instance */}
      {config && (
        <CreateOptionModal
          open={true}
          onOpenChange={closeModal}
          onSubmit={handleSubmit}
          title={config.title}
          fields={config.fields}
          schema={config.schema}
        />
      )}
    </CreateModalContext.Provider>
  );
}

export const useCreateModal = () => {
  const context = useContext(CreateModalContext);
  if (!context) throw new Error("Must be within CreateModalProvider");
  return context;
};
```

### File 2: Select Component (Minimal)

```typescript
// components/forms/fields/CreatableSelect.tsx

import { useCreateModal } from "@/contexts/CreateModalContext";

export function CreatableSelect({ field, formField }) {
  const { openModal } = useCreateModal();
  const [localOptions, setLocalOptions] = useState(field.options || []);

  const handleCreateClick = () => {
    openModal({
      title: `Create New ${field.label}`,
      fields: field.createFields || [
        { name: "name", type: "text", label: "Name", required: true },
        { name: "description", type: "textarea", label: "Description" },
      ],
      schema: field.createSchema,
      onSubmit: (newOption) => {
        setLocalOptions([...localOptions, newOption]);
        formField.onChange(newOption.value);
        field.onCreateOption?.(newOption);
      },
    });
  };

  return (
    <Select>
      {/* ... options ... */}
      <Button onClick={handleCreateClick}>
        <Plus /> Create New
      </Button>
    </Select>
  );
}
```

### File 3: App Setup

```typescript
// app/layout.tsx or app/providers.tsx

import { CreateModalProvider } from "@/contexts/CreateModalContext";

export function Providers({ children }: { children: ReactNode }) {
  return <CreateModalProvider>{children}</CreateModalProvider>;
}
```

---

## 📊 Architecture Comparison

| Approach             | Files | Reusability | Complexity | Best For         |
| -------------------- | ----- | ----------- | ---------- | ---------------- |
| **Monolithic**       | 1     | ❌ Low      | 🔴 High    | Quick prototypes |
| **Basic Separation** | 2-3   | ✅ Medium   | 🟡 Medium  | Most projects    |
| **Context-Based**    | 3-4   | ✅✅ High   | 🟡 Medium  | Large apps       |
| **With Custom Hook** | 3-4   | ✅✅ High   | 🟢 Low     | Cleanest code    |

---

## 🎯 Benefits of Separation

### 1. Reusability

```typescript
// ✅ Use same modal for different selects

// Category select
<CreatableSelect field={categoryField} />

// Tag select
<CreatableSelect field={tagField} />

// Brand select
<CreatableSelect field={brandField} />

// All use the same CreateOptionModal component! 🎉
```

### 2. Testability

```typescript
// ✅ Test modal independently
describe("CreateOptionModal", () => {
  it("validates required fields", () => {
    render(<CreateOptionModal open={true} onSubmit={vi.fn()} />);
    // Test modal logic in isolation
  });
});

// ✅ Test select independently
describe("CreatableSelect", () => {
  it("opens modal on create button click", () => {
    render(<CreatableSelect field={field} />);
    // Test select logic in isolation
  });
});
```

### 3. Maintainability

```typescript
// ✅ Change modal styling → Edit one file
// components/modals/CreateOptionModal.tsx

// ✅ Add validation → Edit one file
// components/modals/CreateOptionModal.tsx

// ✅ Select component stays simple
// components/forms/fields/CreatableSelect.tsx
```

### 4. Team Collaboration

```
Developer A: Works on modal styling
           → edits CreateOptionModal.tsx

Developer B: Works on select dropdown
           → edits CreatableSelect.tsx

No merge conflicts! ✅
```

---

## 📝 Configuration Examples

### Example 1: Simple Tag Creation

```typescript
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  creatable: true,
  createFields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tag Name',
      required: true,
      maxLength: 20,
    },
  ],
}
```

### Example 2: Complex Category Creation

```typescript
{
  name: 'category',
  type: 'select',
  label: 'Category',
  creatable: true,
  createFields: [
    {
      name: 'name',
      type: 'text',
      label: 'Category Name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'custom',
      label: 'Icon',
      render: ({ field }) => <IconPicker {...field} />,
    },
    {
      name: 'parentId',
      type: 'select',
      label: 'Parent Category',
      options: parentCategories,
    },
    {
      name: 'isActive',
      type: 'switch',
      label: 'Active',
      defaultValue: true,
    },
  ],
  createSchema: z.object({
    name: z.string().min(2).max(50),
    description: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
}
```

---

## 🔗 File Structure

### Recommended Structure

```
src/
├── components/
│   ├── forms/
│   │   └── fields/
│   │       ├── SelectField.tsx
│   │       ├── CreatableSelect.tsx           # ✅ Select component
│   │       ├── CreatableSelectInline.tsx     # Inline variant
│   │       └── CreatableSelectWithModal.tsx  # Modal variant
│   │
│   └── modals/
│       ├── CreateOptionModal.tsx             # ✅ Generic modal
│       ├── CreateCategoryModal.tsx           # Specialized modal
│       └── CreateTagModal.tsx                # Specialized modal
│
├── contexts/
│   └── CreateModalContext.tsx                # ✅ Global modal provider
│
├── hooks/
│   ├── useCreateOption.ts                    # ✅ Creation logic
│   └── useCreateModal.ts                     # ✅ Modal control
│
└── lib/
    └── utils/
        └── generateId.ts                     # Helper functions
```

---

## ✅ Summary

### Key Principles

1. **Separation of Concerns**

   - Select = Dropdown logic
   - Modal = Creation form logic
   - Hook = State management logic

2. **Single Responsibility**

   - Each file does ONE thing well

3. **Reusability**

   - Modal works with any select
   - Hook works with any modal

4. **Testability**

   - Test each piece independently

5. **Maintainability**
   - Easy to find and fix bugs
   - Easy to add features

---

### When to Use Each Pattern

| Pattern              | When to Use                         |
| -------------------- | ----------------------------------- |
| **Basic Separation** | Most projects (recommended default) |
| **Context-Based**    | 5+ creatable selects in app         |
| **With Custom Hook** | Complex creation logic              |
| **Monolithic**       | ❌ Never (prototypes only)          |

---

**Recommended:** Start with **Basic Separation** (2 files), add **Custom Hook** if logic grows complex.
