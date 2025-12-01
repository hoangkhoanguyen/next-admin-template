# Checklist tạo field mới cho Dynamic Form

1. **Tạo UI component cho field mới**

   - Đọc và tham khảo format, layout của component `TextField` trong `src/components/features/forms/TextField.tsx` trước khi tạo Field mới.
   - Tạo component Field cho field mới trong `src/components/features/forms/` (ví dụ: `NumberField.tsx`).
   - Nếu cần UI cơ bản (input, select, ...), sử dụng các component sẵn có trong `src/components/ui/`.
   - Nếu UI chưa có, tạo mới component UI trong `src/components/ui/` rồi sử dụng lại trong Field.

2. **Cập nhật type FieldType**

   - Thêm tên field mới vào enum/type FieldType trong `src/lib/types/dynamic-form.types.ts`.

3. **Cập nhật FieldConfig**

   - Thêm các thuộc tính cần thiết cho field mới vào interface `FieldConfig` nếu có.

4. **Cập nhật DynamicField**

   - Thêm case cho field mới vào switch-case trong `DynamicField.tsx` để render đúng component.

5. **Cập nhật mock/demo config**

   - Thêm field mới vào file mock config (ví dụ: `src/mock/fullDemoFormConfig.ts`) để kiểm thử.

6. **Cập nhật validation**
   - Thêm schema validation cho field mới (dùng Zod hoặc tương tự).

---

**Ghi chú:**

- Luôn sử dụng các component UI chung để đảm bảo đồng nhất giao diện.
- Đảm bảo field mới hoạt động tốt với react-hook-form và validation.
- Kiểm tra kỹ các props đặc biệt (disabled, readOnly, buttonAfter, ...).
