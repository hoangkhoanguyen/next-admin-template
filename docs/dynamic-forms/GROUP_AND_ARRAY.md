# Dynamic Form: Group & Array Field Design

## 1. Grouping Fields (Object Group)

Để nhóm nhiều field thành một object (group), bạn có thể sử dụng cấu trúc section hoặc lồng các field trong một field kiểu đặc biệt (ví dụ: section, group). Tuy nhiên, giải pháp phổ biến là dùng field array với các field con.

## 2. Field Array (Repeatable Group)

Field array cho phép bạn lặp lại một nhóm field (mỗi item là một object gồm nhiều field). Đây là cách để mô hình hóa các danh sách như địa chỉ, sản phẩm, v.v.

### Định nghĩa type

```typescript
export type FieldType = "text" | "array";
// ... các loại khác

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  // ... các thuộc tính khác
  fields?: FieldConfig[]; // Nếu type là 'array', đây là các field cho mỗi item
}
```

### Ví dụ cấu hình group field (object)

```typescript
const userGroup: FieldConfig = {
  name: "userInfo",
  type: "group", // Nếu muốn hỗ trợ group riêng
  label: "User Info",
  fields: [
    { name: "firstName", type: "text", label: "First Name" },
    { name: "lastName", type: "text", label: "Last Name" },
    { name: "email", type: "text", label: "Email" },
  ],
};
```

### Ví dụ cấu hình field array (repeatable object)

```typescript
const addressArray: FieldConfig = {
  name: "addresses",
  type: "array",
  label: "Addresses",
  fields: [
    { name: "street", type: "text", label: "Street" },
    { name: "city", type: "text", label: "City" },
    { name: "zip", type: "text", label: "ZIP Code" },
  ],
};
```

### Ví dụ cấu hình form: 1 field text, 1 field array (mỗi item gồm 1 text, 1 select)

```typescript
const formConfig = {
  fields: [
    {
      name: "title",
      type: "text",
      label: "Tiêu đề",
    },
    {
      name: "items",
      type: "array",
      label: "Danh sách mục",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Tên mục",
        },
        {
          name: "type",
          type: "select",
          label: "Loại mục",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
            { label: "C", value: "c" },
          ],
        },
      ],
    },
  ],
};
```

Khi render, form sẽ có 1 trường nhập text "Tiêu đề" và 1 danh sách các mục, mỗi mục gồm trường nhập "Tên mục" và trường chọn "Loại mục".

### Ví dụ cấu hình form: 1 field text, 1 field group (object), 1 field array (mỗi item gồm 1 text, 1 select)

```typescript
const formConfig = {
  fields: [
    {
      name: "title",
      type: "text",
      label: "Tiêu đề",
    },
    {
      name: "info",
      type: "group",
      label: "Thông tin bổ sung",
      fields: [
        {
          name: "description",
          type: "text",
          label: "Mô tả",
        },
        {
          name: "category",
          type: "select",
          label: "Danh mục",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Danh sách mục",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Tên mục",
        },
        {
          name: "type",
          type: "select",
          label: "Loại mục",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
            { label: "C", value: "c" },
          ],
        },
      ],
    },
  ],
};
```

Kết quả:

- Trường "Tiêu đề" là text.
- Trường "Thông tin bổ sung" là group gồm 1 text và 1 select.
- Trường "Danh sách mục" là array, mỗi item gồm 1 text và 1 select.

### Sử dụng trong FormConfig

```typescript
const formConfig = {
  fields: [userGroup, addressArray],
};
```

## 3. Render Logic

- Nếu field có type là "array", render danh sách các item, mỗi item là một nhóm field theo cấu hình `fields`.
- Nếu field có type là "group" (hoặc section), render các field con như một object.

## 4. Lưu ý

- Có thể mở rộng thêm type "group" nếu muốn phân biệt rõ giữa group và array.
- Khi submit, dữ liệu sẽ có dạng:

```json
{
  "userInfo": {
    "firstName": "...",
    "lastName": "...",
    "email": "..."
  },
  "addresses": [
    { "street": "...", "city": "...", "zip": "..." },
    { "street": "...", "city": "...", "zip": "..." }
  ]
}
```

## 5. Best Practice

- Sử dụng field array cho các danh sách lặp lại.
- Sử dụng group/section cho các object đơn lẻ.
- Đảm bảo các field con đều là FieldConfig để dễ mở rộng và kiểm soát.

## Quy tắc: Item của field array luôn là group

Để đảm bảo mỗi item của field array là một group (object), bạn nên quy ước cấu hình như sau:

- Khi type là "array", thuộc tính `fields` sẽ mô tả một group các field cho mỗi item.
- Mỗi item của array sẽ là một object gồm các field con.

### Ví dụ cấu hình

```typescript
const formConfig = {
  fields: [
    {
      name: "items",
      type: "array",
      label: "Danh sách mục",
      fields: [
        // Đây là group các field cho mỗi item
        {
          name: "name",
          type: "text",
          label: "Tên mục",
        },
        {
          name: "type",
          type: "select",
          label: "Loại mục",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        },
      ],
    },
  ],
};
```

Khi render, mỗi item của array sẽ là một group gồm các field: "Tên mục", "Loại mục".

### Lưu ý

- Không cần thêm type "group" cho từng item trong array, chỉ cần quy ước `fields` là group các field cho mỗi item.
- Khi submit, dữ liệu sẽ là mảng các object, mỗi object gồm các field con.

## Thuộc tính bổ sung cho field array

Khi cấu hình field array, ngoài các field con, bạn có thể bổ sung các thuộc tính sau để kiểm soát hành vi và giao diện của từng item:

- **actions**: Hiển thị các nút thao tác cho mỗi item (thêm, xóa, di chuyển, v.v.)
- **defaultValue**: Giá trị mặc định cho mỗi item khi thêm mới vào array
- **disabled/readOnly**: Trạng thái không cho phép chỉnh sửa/xóa item
- **customUI**: Tùy chỉnh giao diện cho từng item (ví dụ: header, divider, icon, màu sắc)

### Ví dụ cấu hình field array với các thuộc tính bổ sung

```typescript
const formConfig = {
  fields: [
    {
      name: "items",
      type: "array",
      label: "Danh sách mục",
      fields: [
        { name: "name", type: "text", label: "Tên mục" },
        {
          name: "type",
          type: "select",
          label: "Loại mục",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        },
      ],
      actions: ["add", "remove", "moveUp", "moveDown"], // Các thao tác cho item
      defaultValue: { name: "", type: "a" }, // Giá trị mặc định cho item mới
      disabled: false, // Cho phép chỉnh sửa
      readOnly: false, // Cho phép xóa
      customUI: {
        itemHeader: (item, index) => `Mục #${index + 1}`,
        itemIcon: "list-icon",
        itemClassName: "bg-gray-50 rounded-md mb-2",
      },
    },
  ],
};
```

### Lưu ý

- Các thuộc tính này có thể được xử lý trong component render để kiểm soát UI và logic cho từng item của array.
- Tùy vào nhu cầu, bạn có thể mở rộng thêm các thuộc tính khác cho field array.

## Validate cho Dynamic Form

- Việc kiểm tra dữ liệu (validate) cho từng field sẽ sử dụng Zod schema.
- Không cần thuộc tính `requiredMessage` trong cấu hình field, vì thông báo lỗi sẽ được kiểm soát qua Zod hoặc UI.
- Với field đơn giá trị, dùng Zod như: `zod.string().min(1)` hoặc `zod.number().min(0)`.
- Với array hoặc group, validate từng field con bằng Zod schema lồng nhau.
