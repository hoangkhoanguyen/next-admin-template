# Select & Multi-Select Fields

> **Single and multiple selection dropdowns with static options**

---

## 📋 Overview

Select fields allow users to choose one or multiple options from a predefined list. This document covers **basic select fields with static options**.

For advanced features:

- **[Async Select](./08-async-select.md)** - Load options from API
- **[Searchable Select](./09-searchable-select.md)** - Search within large lists
- **[Creatable Select](./10-creatable-select.md)** - User-created options

---

## 🎯 Field Types

### Single Select (`select-single`)

Choose one option from a dropdown.

### Multi-Select (`select-multi`)

Choose multiple options with badges/chips display.

---

## 📝 Configuration

### Basic Single Select

```typescript
{
  name: 'role',
  type: 'select-single',
  label: 'Role',
  placeholder: 'Select a role...',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ],
}
```

### Basic Multi-Select

```typescript
{
  name: 'tags',
  type: 'select-multi',
  label: 'Tags',
  placeholder: 'Select tags...',
  options: [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Next.js', value: 'nextjs' },
  ],
}
```

---

## 🔧 Configuration Options

```typescript
interface SelectFieldConfig extends FieldConfig {
  type: "select-single" | "select-multi";

  /** Array of options */
  options: SelectOption[];

  /** Callback when user wants to add a new option (for creatable select) */
  onAddNewOption?: (label: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readOnly?: boolean;
}

interface SelectOption {
  /** Display label */
  label: string;

  /** Option value */
  value: string;
  description?: string;

  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
}
```

---

## 💻 Implementation

### SelectField Component

```typescript
// components/forms/fields/SelectField.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type SelectOption } from "@/lib/types/dynamic-form.types";

interface SelectFieldProps {
  field: any; // Field config
  formField: any; // React Hook Form field
}

export function SelectField({ field, formField }: SelectFieldProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = field.options?.find(
    (opt: SelectOption) => opt.value === formField.value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !formField.value && "text-muted-foreground"
          )}
          disabled={field.disabled}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {field.showIcons && selectedOption.icon && (
                <selectedOption.icon className="h-4 w-4" />
              )}
              {selectedOption.label}
            </span>
          ) : (
            field.placeholder || "Select..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {field.options?.map((option: SelectOption) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  formField.onChange(option.value);
                  setOpen(false);
                  field.onChange?.(option.value, {});
                }}
                disabled={option.disabled}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    formField.value === option.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {field.showIcons && option.icon && (
                  <option.icon className="mr-2 h-4 w-4" />
                )}
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

### MultiSelect Component

```typescript
// components/forms/fields/MultiSelect.tsx
"use client";

import * as React from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type SelectOption } from "@/lib/types/dynamic-form.types";

interface MultiSelectProps {
  field: any;
  formField: any;
}

export function MultiSelect({ field, formField }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedValues: string[] = formField.value || [];

  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    formField.onChange(newValues);
    field.onChange?.(newValues, {});
  };

  const removeOption = (optionValue: string) => {
    const newValues = selectedValues.filter((v) => v !== optionValue);
    formField.onChange(newValues);
    field.onChange?.(newValues, {});
  };

  const selectedOptions = selectedValues
    .map((value) =>
      field.options?.find((opt: SelectOption) => opt.value === value)
    )
    .filter(Boolean) as SelectOption[];

  return (
    <div className="space-y-2">
      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="secondary" className="gap-1">
              {field.showIcons && option.icon && (
                <option.icon className="h-3 w-3" />
              )}
              {option.label}
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
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {field.options?.map((option: SelectOption) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    disabled={option.disabled}
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
                    {field.showIcons && option.icon && (
                      <option.icon className="mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
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

## 📚 Usage Examples

### Example 1: User Role Selection

```typescript
const userFormConfig: FormConfig = {
  fields: [
    {
      name: "role",
      type: "select",
      label: "Role",
      required: true,
      placeholder: "Select a role...",
      options: [
        {
          label: "Administrator",
          value: "admin",
          description: "Full access to all features",
        },
        {
          label: "Editor",
          value: "editor",
          description: "Can edit content",
        },
        {
          label: "Viewer",
          value: "viewer",
          description: "Read-only access",
        },
      ],
    },
  ],
};
```

### Example 2: Status with Icons

```typescript
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

{
  name: 'status',
  type: 'select',
  label: 'Status',
  showIcons: true,
  options: [
    {
      label: 'Active',
      value: 'active',
      icon: CheckCircle2
    },
    {
      label: 'Pending',
      value: 'pending',
      icon: Clock
    },
    {
      label: 'Inactive',
      value: 'inactive',
      icon: XCircle
    },
  ],
}
```

### Example 3: Multi-Select Tags

```typescript
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  placeholder: 'Select tags...',
  clearable: true,
  options: [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Tailwind CSS', value: 'tailwind' },
    { label: 'Shadcn UI', value: 'shadcn' },
  ],
}
```

### Example 4: Priority Selection

```typescript
{
  name: 'priority',
  type: 'select',
  label: 'Priority',
  required: true,
  options: [
    {
      label: 'Low',
      value: 'low',
      description: 'Can be done later'
    },
    {
      label: 'Medium',
      value: 'medium',
      description: 'Should be done soon'
    },
    {
      label: 'High',
      value: 'high',
      description: 'Urgent - do ASAP'
    },
  ],
}
```

### Example 5: Permissions (Multi-Select)

```typescript
{
  name: 'permissions',
  type: 'multiselect',
  label: 'Permissions',
  placeholder: 'Select permissions...',
  clearable: true,
  options: [
    { label: 'View Users', value: 'users.view' },
    { label: 'Create Users', value: 'users.create' },
    { label: 'Edit Users', value: 'users.edit' },
    { label: 'Delete Users', value: 'users.delete' },
    { label: 'View Products', value: 'products.view' },
    { label: 'Manage Products', value: 'products.manage' },
  ],
}
```

---

## ✅ Best Practices

### DO ✅

- Use clear, descriptive labels
- Add descriptions for complex options
- Show icons for visual clarity
- Use `clearable` for optional selects
- Sort options alphabetically or by importance
- Disable options that aren't available
- Provide helpful placeholder text

### DON'T ❌

- Don't use select for more than 20 options (use **[Searchable Select](./09-searchable-select.md)** instead)
- Don't make required selects clearable
- Don't use vague labels like "Option 1", "Option 2"
- Don't forget to handle empty state

---

## 🔗 Related

- **[Async Select](./08-async-select.md)** - Load options from API
- **[Searchable Select](./09-searchable-select.md)** - For large option lists
- **[Creatable Select](./10-creatable-select.md)** - User-created options
- **[Dependent Fields](../advanced/20-dependent-fields.md)** - Cascading selects

---

**Next:** [Async Select (API-driven) →](./08-async-select.md)
