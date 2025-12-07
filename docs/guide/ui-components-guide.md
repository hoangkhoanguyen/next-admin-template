# UI Components Guide

Tài liệu này giúp dev dễ dàng tìm, sử dụng và tái sử dụng các UI components đã build sẵn trong thư mục `src/components/ui/` của dự án.

---

## Mục lục

1. [Danh sách các UI components](#danh-sach-ui-components)
2. [Cách sử dụng](#cach-su-dung)
3. [Lưu ý khi sử dụng](#luu-y)
4. [Tham khảo thêm](#tham-khao)

---

## 1. Danh sách các UI components <a name="danh-sach-ui-components"></a>

Thư mục: `src/components/ui/`

Các component phổ biến:

**Tiêu chí đặt component vào thư mục này:**

- Là các UI component cơ bản, dùng lại được ở nhiều nơi trong dự án (button, card, modal, ...).
- Không phụ thuộc vào nghiệp vụ cụ thể, không chứa logic đặc thù cho từng domain.
- Được thiết kế để dễ tái sử dụng, dễ mở rộng, có props rõ ràng.
- Thường là các thành phần giao diện phổ biến: Button, Card, Badge, Avatar, Accordion, Dialog, Drawer, DropdownMenu, Checkbox, Calendar, AlertDialog, Breadcrumb, ...

Không đặt vào đây các component đặc thù cho từng nghiệp vụ (ví dụ: bảng sản phẩm, bộ lọc đơn hàng, ...), các component layout, hoặc các component chỉ dùng cho một màn hình cụ thể.
Xem thêm các file trong thư mục để biết đầy đủ các component.

---

## 2. Cách sử dụng <a name="cach-su-dung"></a>

Import component từ đường dẫn (do đã re-export ở `index.tsx`):

```tsx
import { Button } from "@/components/ui";
<Button variant="primary">Lưu</Button>;
```

Tùy từng component sẽ có props khác nhau, xem chi tiết trong file hoặc qua Storybook nếu có.

---

## 3. Lưu ý khi sử dụng <a name="luu-y"></a>

- Luôn import đúng đường dẫn, ưu tiên import từ `@/components/ui`.
- Xem kỹ props, type của component trước khi dùng (có thể xem trong file hoặc qua Storybook).
- Nếu cần custom, nên tạo component wrapper thay vì sửa trực tiếp vào component gốc.
- Khi thêm component mới, hãy đặt đúng thư mục `ui` để dễ quản lý.

---

## 4. Tham khảo thêm <a name="tham-khao"></a>

- Xem các ví dụ thực tế tại thư mục `src/app/ui-storybook/` nếu có.
- Đọc code trực tiếp trong các file component để hiểu rõ props, logic và cách mở rộng.

---

## 5. Mở rộng: Tạo UI component mới

Nếu bạn muốn tạo thêm UI component mới trong thư mục `src/components/ui/`, hãy làm theo các bước sau:

1. Đặt tên file và component rõ ràng, ngắn gọn, đúng chức năng (ví dụ: `Tooltip.tsx`, `Stepper.tsx`).
2. Đặt file vào đúng thư mục `ui`.
3. Định nghĩa component theo chuẩn React, ưu tiên dùng function component và TypeScript.
4. Định nghĩa rõ props, type, và export component:

   ```tsx
   // src/components/ui/tooltip.tsx
   import React from "react";

   export interface TooltipProps {
     content: string;
     children: React.ReactNode;
   }

   export function Tooltip({ content, children }: TooltipProps) {
     // ...UI logic
     return <div>{children}</div>;
   }
   ```

5. Viết chú thích cho props nếu cần, giữ code dễ đọc, dễ mở rộng.
6. Nếu component có nhiều biến thể, có thể tách thành nhiều file nhỏ hoặc dùng props để kiểm soát.
7. Thêm ví dụ sử dụng vào Storybook hoặc file demo nếu có.
8. Re-export component mới trong file `src/components/ui/index.tsx` (nếu có) để các nơi khác có thể import dễ dàng:

```ts
export * from "./tooltip";
```

9. Khi hoàn thành, thông báo cho team để mọi người biết và sử dụng lại.
