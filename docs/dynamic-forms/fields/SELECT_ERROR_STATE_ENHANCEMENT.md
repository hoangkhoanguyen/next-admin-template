# Select Fields Error State Enhancement

## 📝 Tổng quan

Đã cập nhật các select field components để hiển thị trạng thái lỗi validation một cách rõ ràng hơn, tận dụng API của shadcn/ui.

## ✨ Những thay đổi

### 1. SelectSingle Component (`src/components/ui/select-single.tsx`)

#### Props mới:

```typescript
export interface SelectSingleProps {
  // ... existing props
  isInvalid?: boolean; // Trạng thái lỗi validation
  disabled?: boolean; // Trạng thái disabled
}
```

#### Cải tiến:

- ✅ Thêm prop `isInvalid` để nhận trạng thái lỗi
- ✅ Thêm prop `disabled` để support disabled state
- ✅ Sử dụng `aria-invalid` attribute cho accessibility
- ✅ Tận dụng built-in styles của shadcn/ui: `aria-invalid:border-destructive` và `aria-invalid:ring-destructive/20`

### 2. SelectMulti Component (`src/components/ui/select-multi.tsx`)

#### Props mới:

```typescript
interface Props {
  // ... existing props
  isInvalid?: boolean; // Trạng thái lỗi validation
  disabled?: boolean; // Trạng thái disabled
  placeholder?: string; // Placeholder text tùy chỉnh
}
```

#### Cải tiến:

- ✅ Thêm prop `isInvalid` để nhận trạng thái lỗi
- ✅ Thêm prop `disabled` để support disabled state
- ✅ Thêm prop `placeholder` để tùy chỉnh placeholder
- ✅ Sử dụng `aria-invalid` attribute
- ✅ Tận dụng built-in styles của Button component từ shadcn/ui
- ✅ Hiển thị label thay vì value trong badges (cải thiện UX)
- ✅ Thêm helper function `getLabel()` để map value -> label

### 3. SelectSingleField Component

#### Cải tiến:

```typescript
<SelectSingle
  options={field.options || []}
  value={controllerField.value ?? null}
  onChange={(value) => controllerField.onChange(value)}
  placeholder={field.placeholder}
  onAddNewOption={field.onAddNewOption}
  isInvalid={!!fieldState.error} // 🆕 Truyền trạng thái lỗi
  disabled={field.disabled} // 🆕 Truyền disabled state
/>
```

- ✅ Tự động truyền `isInvalid={!!fieldState.error}` từ React Hook Form
- ✅ Tự động truyền `disabled` từ field config

### 4. SelectMultiField Component

#### Cải tiến:

```typescript
<SelectMulti
  options={field.options || []}
  value={controllerField.value ?? []}
  onChange={(value) => controllerField.onChange(value)}
  onAddNewOption={field.onAddNewOption}
  isInvalid={!!fieldState.error} // 🆕 Truyền trạng thái lỗi
  disabled={field.disabled} // 🆕 Truyền disabled state
  placeholder={field.placeholder} // 🆕 Truyền placeholder
/>
```

- ✅ Tự động truyền `isInvalid={!!fieldState.error}` từ React Hook Form
- ✅ Tự động truyền `disabled` và `placeholder` từ field config

## 🎨 Shadcn/UI API được sử dụng

### Built-in Error Styles

Cả `SelectTrigger` và `Button` component từ shadcn/ui đều có sẵn support cho `aria-invalid`:

```css
/* SelectTrigger & Button */
aria-invalid:ring-destructive/20
dark:aria-invalid:ring-destructive/40
aria-invalid:border-destructive
```

Khi `aria-invalid={true}`:

- Border chuyển sang màu destructive (đỏ)
- Focus ring chuyển sang màu destructive với opacity
- Tự động responsive với dark mode

## 🎯 Cách sử dụng

### Tự động với React Hook Form

Khi sử dụng trong dynamic forms, error state sẽ tự động được áp dụng:

```typescript
{
  name: "role",
  type: "select-single",
  label: "Vai trò",
  options: [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" }
  ],
  zodSchema: z.string().min(1, "Vui lòng chọn vai trò"),  // ← Error khi không chọn
}
```

### Manual Usage

```typescript
<SelectSingle
  options={options}
  value={value}
  onChange={setValue}
  isInvalid={hasError}           // ← Truyền error state
  disabled={isDisabled}
  placeholder="Chọn một tùy chọn..."
/>

<SelectMulti
  options={options}
  value={selectedValues}
  onChange={setSelectedValues}
  isInvalid={hasError}           // ← Truyền error state
  disabled={isDisabled}
  placeholder="Chọn nhiều tùy chọn..."
/>
```

## ✨ Visual Indicators

### Khi có lỗi (isInvalid={true}):

**SelectSingle:**

- 🔴 Border màu đỏ (destructive)
- 🔴 Focus ring màu đỏ với opacity
- ⚠️ Error message hiển thị bên dưới
- ♿ `aria-invalid="true"` cho screen readers

**SelectMulti:**

- 🔴 Border màu đỏ (destructive)
- 🔴 Focus ring màu đỏ với opacity
- ⚠️ Error message hiển thị bên dưới
- ♿ `aria-invalid="true"` cho screen readers

## 🧪 Testing

### Test Case 1: Required Field Validation

1. Không chọn giá trị cho field required
2. Submit form
3. ✅ Border chuyển sang màu đỏ
4. ✅ Error message hiển thị

### Test Case 2: Multi-Select Minimum Selection

1. Có validation `.min(2)` cho multi-select
2. Chỉ chọn 1 item
3. Submit form
4. ✅ Border chuyển sang màu đỏ
5. ✅ Error message hiển thị

### Test Case 3: Error Recovery

1. Field có lỗi (border đỏ)
2. Chọn giá trị hợp lệ
3. ✅ Border trở về bình thường
4. ✅ Error message biến mất

## 🎨 UX Improvements

1. **Label Display in Multi-Select:**

   - Trước: Hiển thị value (`"react"`, `"typescript"`)
   - Sau: Hiển thị label (`"React"`, `"TypeScript"`)
   - ✅ Dễ đọc và professional hơn

2. **Consistent Error States:**

   - Tất cả input fields có cùng error style
   - Sử dụng cùng color palette (destructive)
   - ✅ Consistent UX across toàn bộ form

3. **Accessibility:**
   - Sử dụng `aria-invalid` attribute
   - Screen readers có thể announce error state
   - ✅ WCAG compliant

## 📚 Related Files

- `src/components/ui/select-single.tsx` - Single select component
- `src/components/ui/select-multi.tsx` - Multi select component
- `src/components/features/forms/SelectSingleField.tsx` - Form field wrapper
- `src/components/features/forms/SelectMultiField.tsx` - Form field wrapper
- `src/components/ui/select.tsx` - Base select component (shadcn/ui)
- `src/components/ui/button.tsx` - Button component (shadcn/ui)

## 🚀 Next Steps

Có thể mở rộng thêm:

- [ ] Custom error icon trong select trigger
- [ ] Animated error state transition
- [ ] Tooltip để show error message on hover
- [ ] Different error severity levels (warning, error)
- [ ] Focus management khi có lỗi
