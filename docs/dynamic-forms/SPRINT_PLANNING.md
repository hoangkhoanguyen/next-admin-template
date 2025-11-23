# Sprint Planning - Dynamic Forms Implementation

> **Kế hoạch chi tiết cho 3 sprints (15 ngày làm việc)**

---

## 📊 Overview

### Timeline

- **Sprint 1**: Core Foundation (5 days) - Week 1
- **Sprint 2**: Advanced Fields (5 days) - Week 2
- **Sprint 3**: Advanced Features + Polish (5 days) - Week 3

### Team Size: 1-2 developers

### Daily Work: 6-8 hours/day

---

## 🏃 Sprint 1: Core Foundation (5 days)

> **Goal**: Xây dựng hạ tầng core + basic fields để có thể tạo form đơn giản

### Day 1: Setup & Core Types

**Morning (4h)**

- [ ] Setup dependencies (React Hook Form, Zod, Shadcn)
- [ ] Create `lib/dynamic-forms/types.ts`
  - FieldType enum (5 types)
  - FieldConfig interface
  - FormConfig interface
  - SelectOption interface
- [ ] Create `lib/dynamic-forms/schema-generator.ts`
  - Basic schema generation
  - Required validation
  - Type-based validation (string, number, boolean)

**Afternoon (4h)**

- [ ] Create `components/dynamic-forms/DynamicForm.tsx`
  - Form wrapper with React Hook Form
  - Zod resolver integration
  - Submit handler
  - Reset functionality
- [ ] Add basic styling with Tailwind

**Deliverable**: Core infrastructure với type-safe form wrapper

**Testing**:

```typescript
// Test schema generator
const schema = generateSchema({
  fields: [{ name: "test", type: "text", required: true }],
});
console.log(schema.parse({ test: "value" })); // Should work
```

---

### Day 2: Field Router + Basic Fields (Part 1)

**Morning (4h)**

- [ ] Create `components/dynamic-forms/DynamicField.tsx`
  - Field router with switch case
  - FormField wrapper (Shadcn)
  - Label + Error message display
- [ ] Create `components/dynamic-forms/fields/TextField.tsx`
  - Basic input component
  - Placeholder, disabled support
- [ ] Create `components/dynamic-forms/fields/TextareaField.tsx`
  - Multi-line text input
  - Rows configuration

**Afternoon (4h)**

- [ ] Create `components/dynamic-forms/fields/NumberField.tsx`
  - Number input with min/max/step
  - Type conversion (string → number)
- [ ] Create basic test page
- [ ] Test TextField, TextareaField, NumberField

**Deliverable**: 3 field types working with validation

**Testing**:

```typescript
// Test form with 3 field types
<DynamicForm
  config={{
    fields: [
      { name: "name", type: "text", required: true },
      { name: "bio", type: "textarea" },
      { name: "age", type: "number", min: 0, max: 120 },
    ],
  }}
  onSubmit={console.log}
/>
```

---

### Day 3: Basic Fields (Part 2) + Test Page

**Morning (4h)**

- [ ] Create `components/dynamic-forms/fields/SelectField.tsx`
  - Dropdown with options
  - Placeholder support
  - Value change handling
- [ ] Create `components/dynamic-forms/fields/CheckboxField.tsx`
  - Boolean checkbox
  - Custom styling

**Afternoon (4h)**

- [ ] Create comprehensive test page
  - Product form example
  - User form example
  - Settings form example
- [ ] Test all 5 field types together
- [ ] Fix any bugs found
- [ ] Add loading states to submit button

**Deliverable**: All 5 basic field types working + test page

**Testing**:

```typescript
// Product form test
const productConfig = {
  fields: [
    { name: 'name', type: 'text', label: 'Product Name', required: true },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'category', type: 'select', label: 'Category', options: [...] },
    { name: 'price', type: 'number', label: 'Price', min: 0, step: 0.01 },
    { name: 'featured', type: 'checkbox', label: 'Featured' },
  ],
};
```

---

### Day 4: Validation Enhancement

**Morning (4h)**

- [ ] Enhance `schema-generator.ts`
  - Min/max length for text
  - Min/max value for number
  - Pattern validation (regex)
  - Custom error messages
- [ ] Add validation helpers
  - Email validation
  - Phone validation
  - URL validation

**Afternoon (4h)**

- [ ] Create `components/dynamic-forms/ErrorDisplay.tsx`
  - Field-level error messages
  - Form-level error summary
- [ ] Add error styling (red borders, icons)
- [ ] Test validation with various scenarios
- [ ] Add success toast on submit

**Deliverable**: Comprehensive validation system

**Testing**:

```typescript
// Test validation
{
  name: 'email',
  type: 'text',
  label: 'Email',
  required: true,
  pattern: '^[^@]+@[^@]+\\.[^@]+$',
  patternMessage: 'Invalid email format',
}
```

---

### Day 5: Documentation + Bug Fixes

**Morning (4h)**

- [ ] Write JSDoc comments for all components
- [ ] Create usage examples in code
- [ ] Document common patterns
- [ ] Update README with Phase 1 completion

**Afternoon (4h)**

- [ ] Bug fixes from testing
- [ ] Performance check (React DevTools)
- [ ] Code cleanup & refactoring
- [ ] Sprint 1 demo preparation

**Deliverable**: Production-ready Phase 1 với docs

**Sprint 1 Demo Checklist**:

- [ ] Show product form creation (5 field types)
- [ ] Demonstrate validation (required, min/max, pattern)
- [ ] Show error handling
- [ ] Demonstrate submit + reset
- [ ] Show type safety (TypeScript autocomplete)

---

## 🚀 Sprint 2: Advanced Fields (5 days)

> **Goal**: Thêm 6 field types phức tạp (API-driven, file, image, date)

### Day 6: Async Select + Multi Select

**Morning (4h)**

- [ ] Install TanStack React Query
- [ ] Create `components/dynamic-forms/fields/AsyncSelectField.tsx`
  - Load options from API
  - Loading state
  - Error handling
  - Cache with React Query
- [ ] Create API endpoint for testing (`/api/options/[type]`)

**Afternoon (4h)**

- [ ] Create `components/dynamic-forms/fields/MultiSelectField.tsx`
  - Multiple selection support
  - Badges for selected items
  - Max selections limit
  - Search/filter options
- [ ] Test with large option lists (100+ items)

**Deliverable**: AsyncSelect + MultiSelect working

**Testing**:

```typescript
// Async select
{
  name: 'category',
  type: 'asyncselect',
  label: 'Category',
  apiEndpoint: '/api/categories',
  queryKey: ['categories'],
}

// Multi select
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  options: [...],
  maxSelections: 5,
}
```

---

### Day 7: Creatable Select

**Morning (4h)**

- [ ] Create `components/dynamic-forms/fields/CreatableSelectField.tsx`
  - Inline creation UI
  - Validation for new options
  - onCreate callback
- [ ] Create `components/dynamic-forms/modals/CreateOptionModal.tsx`
  - Modal for complex option creation
  - Form inside modal
  - API integration

**Afternoon (4h)**

- [ ] Implement separated modal pattern
  - Extract modal to separate component
  - Pass callbacks
  - Reusable across forms
- [ ] Add local storage persistence (optional)
- [ ] Test creation flow

**Deliverable**: CreatableSelect with modal pattern

**Testing**:

```typescript
{
  name: 'tags',
  type: 'creatableselect',
  label: 'Tags',
  options: existingTags,
  onCreate: async (newTag) => {
    const created = await api.createTag(newTag);
    return created;
  },
}
```

---

### Day 8: Image Picker

**Morning (4h)**

- [ ] Create `components/dynamic-forms/fields/ImagePickerField.tsx`
  - Dialog with tabs (Gallery + URL)
  - Gallery grid view
  - React Query for gallery loading
- [ ] Create API endpoint `/api/media/images`
  - Return image list with thumbnails
  - Filter support (category, tags)

**Afternoon (4h)**

- [ ] Implement URL paste tab
  - URL input
  - Preview image
  - Validation (check if URL is image)
- [ ] Add image preview after selection
  - Show thumbnail
  - Display dimensions
  - Remove button
- [ ] Support multiple images

**Deliverable**: ImagePicker with dual input mode

**Testing**:

```typescript
// Single image
{
  name: 'thumbnail',
  type: 'imagepicker',
  label: 'Product Thumbnail',
  galleryEndpoint: '/api/media/images',
  allowGallery: true,
  allowUrl: true,
}

// Multiple images
{
  name: 'gallery',
  type: 'imagepicker',
  label: 'Product Gallery',
  multiple: true,
  maxImages: 5,
}
```

---

### Day 9: Date Picker + File Upload

**Morning (4h)**

- [ ] Install date-fns, react-day-picker
- [ ] Create `components/dynamic-forms/fields/DatePickerField.tsx`
  - Calendar popup
  - Min/max date validation
  - Date format display
- [ ] Create `components/dynamic-forms/fields/DateTimePickerField.tsx`
  - Date + time selection
  - Timezone support

**Afternoon (4h)**

- [ ] Install react-dropzone
- [ ] Create `components/dynamic-forms/fields/FileUploadField.tsx`
  - Drag & drop area
  - File type validation
  - File size validation
  - Multiple files support
  - File preview (name, size, type)

**Deliverable**: DatePicker + FileUpload

**Testing**:

```typescript
// Date picker
{
  name: 'birthdate',
  type: 'date',
  label: 'Birth Date',
  minDate: new Date('1900-01-01'),
  maxDate: new Date(),
}

// File upload
{
  name: 'attachments',
  type: 'file',
  label: 'Attachments',
  multiple: true,
  acceptedFormats: { 'image/*': ['.png', '.jpg'], 'application/pdf': ['.pdf'] },
  maxFileSize: 5 * 1024 * 1024, // 5MB
}
```

---

### Day 10: Integration + Testing

**Morning (4h)**

- [ ] Update DynamicField router with all new types
- [ ] Update schema-generator for new field types
- [ ] Update types.ts with all new configurations
- [ ] Add all new types to type definitions

**Afternoon (4h)**

- [ ] Create comprehensive test page with all 11 field types
- [ ] Test edge cases (empty data, invalid data, large data)
- [ ] Performance testing with large forms (50+ fields)
- [ ] Bug fixes

**Deliverable**: All 11 field types integrated and tested

**Sprint 2 Demo Checklist**:

- [ ] Show all 11 field types in one form
- [ ] Demonstrate AsyncSelect loading from API
- [ ] Show CreatableSelect creating new option
- [ ] Show ImagePicker selecting from gallery + URL
- [ ] Demonstrate file upload with drag-drop
- [ ] Show DatePicker with min/max dates

---

## 🎯 Sprint 3: Advanced Features + Polish (5 days)

> **Goal**: Conditional logic, dependent fields, field arrays, optimization

### Day 11: Conditional Logic

**Morning (4h)**

- [ ] Create `lib/dynamic-forms/conditional-logic.ts`
  - Condition evaluation (is, isNot, gt, lt, contains)
  - Show/hide logic
  - Enable/disable logic
  - Required logic
- [ ] Update DynamicField to support conditional rendering
- [ ] Add `useWatch` for reactive conditions

**Afternoon (4h)**

- [ ] Test complex conditional scenarios
  - Show field when dropdown = "other"
  - Hide field when checkbox = true
  - Require field when number > 100
- [ ] Add visual indicators (fade in/out animations)
- [ ] Handle dependent validation

**Deliverable**: Conditional logic system working

**Testing**:

```typescript
[
  {
    name: "hasCustomSize",
    type: "checkbox",
    label: "Custom Size",
  },
  {
    name: "customWidth",
    type: "number",
    label: "Width (cm)",
    showWhen: { when: "hasCustomSize", is: true },
  },
];
```

---

### Day 12: Dependent Fields

**Morning (4h)**

- [ ] Create `components/dynamic-forms/fields/DependentSelectField.tsx`
  - Watch parent field changes
  - Load options based on parent value
  - Reset value when parent changes
- [ ] Handle cascading selects (3+ levels)

**Afternoon (4h)**

- [ ] Create examples:
  - Country → State → City
  - Category → Subcategory → Product
  - Brand → Model → Year
- [ ] Optimize API calls (debounce, cache)
- [ ] Add loading states for dependent fields

**Deliverable**: Cascading selects working

**Testing**:

```typescript
[
  {
    name: "category",
    type: "select",
    label: "Category",
    options: categories,
  },
  {
    name: "subcategory",
    type: "dependentselect",
    label: "Subcategory",
    dependsOn: "category",
    apiEndpoint: "/api/subcategories",
  },
];
```

---

### Day 13: Field Arrays

**Morning (4h)**

- [ ] Create `components/dynamic-forms/FieldArray.tsx`
  - Repeatable field groups
  - Add/remove items
  - Drag to reorder (optional)
  - Min/max items validation
- [ ] Update schema-generator for arrays

**Afternoon (4h)**

- [ ] Create complex examples:
  - Product variants (size, color, price, stock)
  - Contact list (name, email, phone)
  - Order items (product, quantity, price)
- [ ] Add array-level validation
- [ ] Test nested arrays (array of objects with arrays)

**Deliverable**: Field arrays working

**Testing**:

```typescript
{
  name: 'variants',
  type: 'array',
  label: 'Product Variants',
  fields: [
    { name: 'size', type: 'text', label: 'Size' },
    { name: 'color', type: 'text', label: 'Color' },
    { name: 'price', type: 'number', label: 'Price' },
    { name: 'stock', type: 'number', label: 'Stock' },
  ],
  minItems: 1,
  maxItems: 10,
}
```

---

### Day 14: Optimization + Accessibility

**Morning (4h)**

- [ ] Performance optimization
  - Memoize DynamicField renders
  - Debounce async validation
  - Virtual scrolling for large lists
  - Lazy load heavy components (RichText, etc.)
- [ ] Use React DevTools Profiler to find bottlenecks

**Afternoon (4h)**

- [ ] Accessibility improvements
  - ARIA labels on all inputs
  - Keyboard navigation
  - Focus management (first error field)
  - Screen reader testing
  - Color contrast check
- [ ] Test with keyboard only (no mouse)

**Deliverable**: Optimized and accessible forms

**Performance Targets**:

- First render: < 100ms
- Field update: < 16ms (60fps)
- Form validation: < 50ms
- Bundle size: < 50KB (gzipped)

---

### Day 15: Documentation + Final Polish

**Morning (4h)**

- [ ] Complete all JSDoc comments
- [ ] Update all documentation
- [ ] Create video demos (optional)
- [ ] Write migration guide from old forms
- [ ] Create Storybook stories (optional)

**Afternoon (4h)**

- [ ] Final bug fixes
- [ ] Code cleanup & refactoring
- [ ] Add error boundaries
- [ ] Create production build
- [ ] Sprint 3 demo + final presentation

**Deliverable**: Production-ready Dynamic Forms system

**Sprint 3 Demo Checklist**:

- [ ] Show conditional logic (show/hide fields)
- [ ] Demonstrate dependent selects (cascading)
- [ ] Show field arrays (add/remove variants)
- [ ] Performance demo (50-field form)
- [ ] Accessibility demo (keyboard navigation)
- [ ] Show complete product form example

---

## 📊 Progress Tracking

### Daily Standup Template

```
Yesterday:
- [x] Completed: ...
- [x] Tested: ...

Today:
- [ ] Working on: ...
- [ ] Will test: ...

Blockers:
- None / [issue description]
```

### Sprint Review Template

```
Completed:
- ✅ Feature 1
- ✅ Feature 2

Demo:
- Show [feature] working
- Show test results

Retrospective:
- What went well: ...
- What to improve: ...
- Action items: ...
```

---

## 🎯 Success Metrics

### Sprint 1

- [ ] 5 basic field types working
- [ ] Validation system complete
- [ ] Test page functional
- [ ] TypeScript fully typed
- [ ] Zero console errors

### Sprint 2

- [ ] 11 total field types working
- [ ] AsyncSelect loading from API
- [ ] ImagePicker with gallery
- [ ] All fields tested
- [ ] API integration working

### Sprint 3

- [ ] Conditional logic working
- [ ] Dependent fields working
- [ ] Field arrays working
- [ ] Performance optimized (< 100ms)
- [ ] Accessibility score > 90
- [ ] Documentation complete

---

## 🚨 Risk Management

### Technical Risks

**Risk**: React Hook Form performance with many fields

- **Mitigation**: Use `shouldUnregister: false`, memoization
- **Fallback**: Split into multi-step form

**Risk**: Zod schema generation complexity

- **Mitigation**: Start simple, add complexity gradually
- **Fallback**: Manual schema definition for complex cases

**Risk**: API integration delays

- **Mitigation**: Mock API endpoints early
- **Fallback**: Use static data for development

### Schedule Risks

**Risk**: Scope creep (too many features)

- **Mitigation**: Stick to roadmap, defer nice-to-haves
- **Fallback**: Move Phase 5 features to Sprint 4

**Risk**: Bugs taking longer than expected

- **Mitigation**: Daily testing, catch early
- **Fallback**: Extend sprint by 1-2 days

---

## 📦 Deployment Checklist

### Before Sprint 1 End

- [ ] Core components in `components/dynamic-forms/`
- [ ] Types in `lib/dynamic-forms/types.ts`
- [ ] Test page accessible at `/test/dynamic-form`

### Before Sprint 2 End

- [ ] All field components complete
- [ ] API endpoints created
- [ ] Image gallery working

### Before Sprint 3 End

- [ ] Advanced features working
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Ready for production use

---

## 🎉 Definition of Done

A feature is "Done" when:

- [ ] Code written and reviewed
- [ ] TypeScript types added
- [ ] Unit tests passing (optional)
- [ ] Manual testing passed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessible (keyboard + screen reader)
- [ ] Performance acceptable (< 100ms)

---

## 📞 Support & Questions

During implementation, refer to:

- [Quick Start Guide](./QUICK_START.md) - Code examples
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md) - Detailed specs
- [Type Definitions](./02-types.md) - TypeScript reference
- [Field Documentation](./fields/) - Individual field guides

---

**Ready to sprint?** 🏃‍♂️ Start with Sprint 1 Day 1!

**Estimated Total Time**: 15 days (3 weeks)  
**Estimated Lines of Code**: ~3,000-4,000 LOC  
**Components Created**: ~30 components  
**Files Created**: ~40 files
