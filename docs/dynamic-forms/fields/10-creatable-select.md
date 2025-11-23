# Creatable Select - User-Created Options

> **Allow users to create new options on-the-fly (local creation, no modal needed)**

---

## 📋 Overview

**Creatable Select** cho phép users tạo options mới **ngay trong dropdown** mà không cần API call hay modal popup.

### 🎨 UX Flow (No Modal Design)

```
1. User opens dropdown
2. Types search text (e.g., "New Tag")
3. If not found → "➕ Create 'New Tag'" button appears in dropdown
4. Click → Validate → Create → Add to selection
5. Done! (No modal, no extra clicks)
```

**Visual Example:**

```
┌─────────────────────────────────┐
│ Search tags...        ⌄         │ ← User types "Machine Learning"
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ ➕ Create "Machine Learning"    │ ← This button appears if not found
├─────────────────────────────────┤
│ ✓ React                         │ ← Existing options below
│   TypeScript                    │
│   Next.js                       │
└─────────────────────────────────┘
```

### Perfect For:

- Tags (blog posts, products)
- Custom labels (tasks, tickets)
- Quick data entry (no API roundtrip)
- Temporary categories
- Email addresses (with validation)

---

## 🎯 Features

- ✅ **Inline creation** (in dropdown, no modal popup)
- ✅ **Type-to-create** (search box doubles as input)
- ✅ **Validation** before creating (length, format, async)
- ✅ **Custom transformation** (auto-generate IDs, format)
- ✅ **Duplicate prevention** (smart checking)
- ✅ **Callbacks** for tracking/logging
- ✅ **Local persistence** (localStorage support)
- ✅ **Merge with API** options seamlessly
- ✅ **Visual badges** ("new" indicator)

---

## 📝 Configuration

### Basic Creatable Select

```typescript
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  creatable: true,
  clearable: true,
  placeholder: 'Select or create tags...',
  createLabel: 'Create tag "{value}"',
  options: [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
  ],
}
```

### With Validation

```typescript
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  creatable: true,
  options: existingTags,

  // Validate before creating
  validateCreate: (value: string) => {
    if (value.length < 2) return 'Tag must be at least 2 characters';
    if (value.length > 20) return 'Tag must be less than 20 characters';
    if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
      return 'Only letters, numbers, spaces, and hyphens allowed';
    }
    return true;
  },
}
```

### With Transform & Callback

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
      createdBy: userId,
    },
  }),

  // Callback when created
  onCreateOption: (option: SelectOption) => {
    console.log('Created:', option);

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem('labels') || '[]');
    localStorage.setItem('labels', JSON.stringify([...stored, option]));

    // Show notification
    toast.success(`Created: ${option.label}`);
  },
}
```

---

## 🔧 Configuration Options

```typescript
interface CreatableSelectConfig extends FieldConfig {
  /** Enable creation */
  creatable: boolean;

  /** Label template for create option */
  createLabel?: string; // Default: 'Create "{value}"'

  /** Callback when option created */
  onCreateOption?: (option: SelectOption) => void;

  /** Allow duplicate labels */
  allowDuplicates?: boolean; // Default: false

  /** Validate before creating */
  validateCreate?: (
    value: string
  ) => boolean | string | Promise<boolean | string>;

  /** Transform input before creating */
  transformCreate?: (value: string) => SelectOption;
}
```

---

## 💻 Implementation

### CreatableMultiSelect Component

```typescript
// components/forms/fields/CreatableMultiSelect.tsx
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

    // 1. Validate if provided
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

    // 2. Check duplicates (if not allowed)
    if (!field.allowDuplicates) {
      const duplicate = localOptions.find(
        (opt) => opt.label.toLowerCase() === search.toLowerCase()
      );

      if (duplicate) {
        toast.error("This option already exists");
        return;
      }
    }

    // 3. Create option (with transform if provided)
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

    // 7. Callback
    field.onCreateOption?.(newOption);

    toast.success(`Created: ${newOption.label}`);
  };

  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    formField.onChange(newValues);
  };

  const removeOption = (optionValue: string) => {
    formField.onChange(selectedValues.filter((v) => v !== optionValue));
  };

  const selectedOptions = selectedValues
    .map((value) => localOptions.find((opt) => opt.value === value))
    .filter(Boolean) as SelectOption[];

  return (
    <div className="space-y-2">
      {/* Selected items */}
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

      {/* Dropdown */}
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

      {/* Clear all */}
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

## 🎨 UX Design: Inline vs Modal

### ✅ Current Design: Inline Creation (Recommended)

**How it works:**

1. User types in search box inside dropdown
2. If text doesn't match any option → Show "Create" button **inside dropdown**
3. Click button → Create immediately
4. No modal, no extra clicks

**Visual Flow:**

```
┌──────────────────────────────────┐
│ [Search or create tags... ]  ⌄  │ ← Click to open dropdown
└──────────────────────────────────┘

User types "Machine Learning"
         ↓
┌──────────────────────────────────┐
│ Machine Learning            [×]  │ ← Search input (inside dropdown)
├──────────────────────────────────┤
│ ➕ Create "Machine Learning"     │ ← CREATE BUTTON (inside dropdown)
├──────────────────────────────────┤
│ ✓ React                          │ ← Existing options
│   TypeScript                     │
│   Next.js                        │
└──────────────────────────────────┘

Click "Create" button
         ↓
✅ Created! Option added & selected
```

**Why this design?**

- ✅ **Faster UX** (2 clicks: type → create)
- ✅ **No context switching** (stays in dropdown)
- ✅ **Mobile-friendly** (no modal stacking)
- ✅ **Visual feedback** (see existing options while typing)
- ✅ **Less intimidating** (no popup)

---

### ⚙️ Alternative Design: Modal Creation (Not Implemented)

**How it would work:**

1. User clicks "+ Add New" button
2. Modal opens with form
3. Fill in fields (name, description, etc.)
4. Submit → Create → Close modal

**Visual Flow:**

```
┌──────────────────────────────────┐
│ [Select tags...          ]  ⌄   │
├──────────────────────────────────┤
│ React                            │
│ TypeScript                       │
│ + Add New Tag                    │ ← Click this
└──────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Create New Tag                    [×] │ ← Modal opens
├────────────────────────────────────────┤
│  Name: [________________]              │
│  Description: [___________________]    │
│  Color: [  ]                           │
│                                        │
│  [Cancel]  [Create]                    │
└────────────────────────────────────────┘
```

**When to use Modal approach?**

- ✅ Creating option requires **multiple fields** (name, description, icon, color)
- ✅ Need **complex validation** with preview
- ✅ Creating is **not frequent** (main action is selecting)
- ✅ Want to **guide users** through creation process

**Implementation Example (Modal):**

```typescript
// If you want modal approach, here's how:

function CreatableSelectWithModal({ field, formField }) {
  const [showModal, setShowModal] = React.useState(false);
  const [newOption, setNewOption] = React.useState({
    name: "",
    description: "",
  });

  const handleCreateOption = () => {
    // Validate
    if (!newOption.name) {
      toast.error("Name is required");
      return;
    }

    const option: SelectOption = {
      label: newOption.name,
      value: generateId(),
      description: newOption.description,
      isNew: true,
    };

    // Add to options
    setLocalOptions([...localOptions, option]);
    formField.onChange(option.value);

    // Close modal
    setShowModal(false);
    setNewOption({ name: "", description: "" });
  };

  return (
    <>
      {/* Select dropdown with "+ Add New" option */}
      <Select>
        {/* ... existing options ... */}
        <CommandItem onSelect={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tag
        </CommandItem>
      </Select>

      {/* Creation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newOption.name}
                onChange={(e) =>
                  setNewOption({ ...newOption, name: e.target.value })
                }
                placeholder="Enter tag name..."
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={newOption.description}
                onChange={(e) =>
                  setNewOption({ ...newOption, description: e.target.value })
                }
                placeholder="Enter description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOption}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

### 🏗️ Best Practice: Separate Modal Component

**❌ Bad: Modal Inside Select Component**

```typescript
// ❌ DON'T: Everything in one component
function CreatableSelectWithModal() {
  const [showModal, setShowModal] = useState(false);
  const [newOption, setNewOption] = useState({});

  return (
    <>
      <Select>{/* ... */}</Select>
      <Dialog open={showModal}>{/* Modal JSX here */}</Dialog>
    </>
  );
}
```

**Problems:**

- ❌ Select component too complex (200+ lines)
- ❌ Modal logic mixed with select logic
- ❌ Hard to reuse modal elsewhere
- ❌ Difficult to test separately
- ❌ Props drilling nightmare

---

**✅ Good: Separate Modal Component**

```typescript
// ✅ DO: Separate concerns

// 1. Modal Component (Reusable)
// components/modals/CreateOptionModal.tsx
interface CreateOptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (option: SelectOption) => void;
  fieldLabel: string;
  schema?: z.ZodSchema;
}

export function CreateOptionModal({
  open,
  onOpenChange,
  onSubmit,
  fieldLabel,
  schema,
}: CreateOptionModalProps) {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const handleSubmit = (data: any) => {
    const option: SelectOption = {
      label: data.name,
      value: generateId(),
      description: data.description,
      icon: data.icon,
      isNew: true,
    };

    onSubmit(option);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New {fieldLabel}</DialogTitle>
          <DialogDescription>
            Add a new option to the list. All fields are optional except name.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (optional)</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
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

// 2. Select Component (Clean & Simple)
// components/forms/fields/CreatableSelect.tsx
export function CreatableSelectWithModal({ field, formField }) {
  const [showModal, setShowModal] = useState(false);
  const [localOptions, setLocalOptions] = useState(field.options || []);

  const handleCreateOption = (newOption: SelectOption) => {
    // Add to options
    setLocalOptions([...localOptions, newOption]);

    // Select the new option
    formField.onChange(newOption.value);

    // Callback
    field.onCreateOption?.(newOption);

    toast.success(`Created: ${newOption.label}`);
  };

  return (
    <>
      {/* Select Dropdown */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {localOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}

          {/* Trigger modal */}
          <div className="border-t mt-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New {field.label}
            </Button>
          </div>
        </SelectContent>
      </Select>

      {/* Separate Modal Component */}
      <CreateOptionModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleCreateOption}
        fieldLabel={field.label}
        schema={field.createSchema}
      />
    </>
  );
}
```

---

### 🎯 Benefits of Separation

| Benefit                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| **🔧 Maintainability** | Each component has single responsibility           |
| **♻️ Reusability**     | Use `CreateOptionModal` for categories, tags, etc. |
| **🧪 Testability**     | Test modal and select independently                |
| **📦 Composability**   | Mix and match with different selects               |
| **👥 Team Work**       | Different devs can work on each component          |
| **📖 Readability**     | Clean, focused code                                |

---

### 🔄 Reusing Modal Across Different Selects

```typescript
// Use same modal for different fields

// Product Form
<CreatableSelectWithModal
  field={{
    name: 'category',
    label: 'Category',
    options: categories,
    createSchema: categorySchema,
  }}
  formField={categoryField}
/>

// User Form
<CreatableSelectWithModal
  field={{
    name: 'role',
    label: 'Role',
    options: roles,
    createSchema: roleSchema,
  }}
  formField={roleField}
/>

// Same modal component, different schemas! ✅
```

---

### 🎨 Advanced: Context-Based Modal

For even better separation, use React Context:

```typescript
// 1. Create Context
// contexts/CreateModalContext.tsx
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

      {/* Global modal */}
      <CreateOptionModal
        open={!!config}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleSubmit}
        fieldLabel={config?.fieldLabel || ""}
        schema={config?.schema}
      />
    </CreateModalContext.Provider>
  );
}

export const useCreateModal = () => {
  const context = useContext(CreateModalContext);
  if (!context) throw new Error("useCreateModal must be within provider");
  return context;
};

// 2. Use in Select Component
function CreatableSelect({ field, formField }) {
  const { openModal } = useCreateModal();
  const [localOptions, setLocalOptions] = useState(field.options || []);

  const handleCreateClick = () => {
    openModal({
      fieldLabel: field.label,
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

// 3. Wrap your app
function App() {
  return (
    <CreateModalProvider>
      <YourApp />
    </CreateModalProvider>
  );
}
```

**Benefits of Context Approach:**

- ✅ **Single modal instance** for entire app (better performance)
- ✅ **No modal JSX** in select components (cleaner)
- ✅ **Centralized modal logic** (easier to theme/customize)
- ✅ **Keyboard shortcuts** (Ctrl+N to create) in one place

---

### 📁 Recommended File Structure

```
components/
├── forms/
│   ├── fields/
│   │   ├── SelectField.tsx                    # Basic select
│   │   ├── CreatableSelect.tsx                # Inline creation
│   │   ├── CreatableSelectWithModal.tsx       # With modal
│   │   └── ...
│   │
│   └── modals/
│       ├── CreateOptionModal.tsx              # ✅ Reusable modal
│       ├── CreateCategoryModal.tsx            # Specialized version
│       └── CreateTagModal.tsx                 # Specialized version
│
contexts/
└── CreateModalContext.tsx                     # ✅ Global modal provider

hooks/
└── useCreateModal.ts                          # ✅ Hook for modal
```

---

### 🧪 Testing Benefits

**Separate components = Easy testing**

```typescript
// Test modal independently
describe("CreateOptionModal", () => {
  it("validates required fields", () => {
    render(<CreateOptionModal open={true} onSubmit={vi.fn()} />);
    fireEvent.submit(screen.getByRole("button", { name: /create/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it("calls onSubmit with correct data", () => {
    const onSubmit = vi.fn();
    render(<CreateOptionModal open={true} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Option" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /create/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      label: "New Option",
      value: expect.any(String),
      isNew: true,
    });
  });
});

// Test select independently
describe("CreatableSelectWithModal", () => {
  it("opens modal when create button clicked", () => {
    render(<CreatableSelectWithModal field={field} formField={formField} />);
    fireEvent.click(screen.getByText(/create new/i));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
```

---

### 📊 Comparison: Inline vs Modal

| Aspect                | Inline (Current)        | Modal (Alternative)         |
| --------------------- | ----------------------- | --------------------------- |
| **Clicks to Create**  | 2 (type → click)        | 3+ (button → fill → submit) |
| **Context Switching** | None                    | Yes (dropdown → modal)      |
| **Mobile Experience** | Excellent               | OK (modal stacking)         |
| **Complex Forms**     | ❌ Not suitable         | ✅ Perfect                  |
| **Quick Entry**       | ✅ Fast                 | ❌ Slower                   |
| **Visual Feedback**   | ✅ See existing options | ❌ Hidden                   |
| **Use Case**          | Tags, labels, emails    | Categories with details     |

---

### 🎯 When to Use Each Approach

**Use Inline Creation when:**

- ✅ Creating option is just **1 field** (name/label)
- ✅ Users create options **frequently**
- ✅ Speed is important
- ✅ Simple validation (length, format)

**Use Modal Creation when:**

- ✅ Need **multiple fields** (name, description, color, icon, category, etc.)
- ✅ Complex relationships (parent category, permissions)
- ✅ Creating is **occasional** (not main workflow)
- ✅ Want to provide **guidance** or help text
- ✅ Need **preview** before creating

---

### 💡 Hybrid Approach (Best of Both Worlds)

You can offer both options:

```typescript
{
  name: 'category',
  type: 'select',
  label: 'Category',
  creatable: true,              // ← Inline creation (quick)
  createLabel: 'Quick add "{value}"',

  // Also show "Advanced Create" button that opens modal
  renderFooter: () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openCategoryModal()}
      className="w-full"
    >
      <Settings className="mr-2 h-4 w-4" />
      Advanced Category Creation
    </Button>
  ),
}
```

**Result:**

- Quick users → Type and create inline
- Power users → Click "Advanced" for full form

---

## 📚 Usage Examples

### Example 1: Blog Tags

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
      validateCreate: (value: string) => {
        if (value.length < 2) return "Tag too short";
        if (value.length > 20) return "Tag too long";
        return true;
      },
    },
  ],
};
```

### Example 2: Email Recipients

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
}
```

### Example 3: Product Categories with Persistence

```typescript
function ProductForm() {
  const { data: categories } = useCategories();
  const [localCategories, setLocalCategories] = React.useState<SelectOption[]>(
    []
  );

  const formConfig: FormConfig = {
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        creatable: true,
        searchable: true,
        options: [
          ...(categories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
          })) || []),
          ...localCategories,
        ],
        createLabel: 'Create category "{value}"',
        onCreateOption: (option: SelectOption) => {
          setLocalCategories((prev) => [...prev, option]);
          toast.info(
            `Category "${option.label}" created locally. Save form to persist.`
          );
        },
      },
    ],
  };

  const handleSubmit = async (data: any) => {
    // Include locally created categories
    console.log("Form data:", data);
    console.log("New categories:", localCategories);

    // Send to backend
    await api.post("/categories/bulk", { categories: localCategories });
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

### Example 4: Custom Labels with LocalStorage

```typescript
function TaskForm() {
  const [localLabels, setLocalLabels] = React.useState<SelectOption[]>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem("task-labels");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage when labels change
  React.useEffect(() => {
    localStorage.setItem("task-labels", JSON.stringify(localLabels));
  }, [localLabels]);

  const formConfig: FormConfig = {
    fields: [
      {
        name: "labels",
        type: "multiselect",
        label: "Labels",
        creatable: true,
        options: [
          { label: "Bug", value: "bug" },
          { label: "Feature", value: "feature" },
          ...localLabels,
        ],
        onCreateOption: (option: SelectOption) => {
          setLocalLabels((prev) => [...prev, option]);
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

### Example 5: Async Validation

```typescript
{
  name: 'username',
  type: 'select',
  label: 'Assign to User',
  creatable: true,
  searchable: true,
  options: existingUsers,

  // Check if username exists on backend
  validateCreate: async (value: string) => {
    try {
      const response = await fetch(`/api/users/check?username=${value}`);
      const { exists } = await response.json();

      if (exists) {
        return 'Username already exists';
      }
      return true;
    } catch (error) {
      return 'Failed to validate username';
    }
  },
}
```

---

## ✅ Best Practices

### DO ✅

- Validate input before creating (length, format, regex)
- Show "new" badge for locally created options
- Prevent duplicates unless explicitly allowed
- Save to localStorage for persistence
- Show toast notification when creating
- Transform input to consistent format
- Include created options in form submission
- Use callbacks to track created options

### DON'T ❌

- Don't allow empty or whitespace-only values
- Don't create without validation
- Don't forget to handle duplicates
- Don't lose created options on page refresh
- Don't create silently without user feedback
- Don't mix local and API options without tracking

---

## 🎯 Validation Examples

### Length Validation

```typescript
validateCreate: (value: string) => {
  if (value.length < 2) return "Too short (min 2 characters)";
  if (value.length > 30) return "Too long (max 30 characters)";
  return true;
};
```

### Format Validation

```typescript
validateCreate: (value: string) => {
  if (!/^[a-zA-Z0-9-]+$/.test(value)) {
    return "Only letters, numbers, and hyphens allowed";
  }
  return true;
};
```

### Email Validation

```typescript
validateCreate: (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || "Invalid email address";
};
```

### Combined Validation

```typescript
validateCreate: (value: string) => {
  // Check length
  if (value.length < 2 || value.length > 50) {
    return "Length must be between 2 and 50 characters";
  }

  // Check format
  if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
    return "Only letters, numbers, spaces, and hyphens allowed";
  }

  // Check for profanity (example)
  const badWords = ["spam", "test123"];
  if (badWords.some((word) => value.toLowerCase().includes(word))) {
    return "Invalid value";
  }

  return true;
};
```

---

## 🔗 Related

- **[Select Fields](./07-select-fields.md)** - Basic select/multi-select
- **[Async Select](./08-async-select.md)** - Load options from API
- **[Searchable Select](./09-searchable-select.md)** - For large lists

---

**Next:** [Date & DateTime Pickers →](./11-date-fields.md)
