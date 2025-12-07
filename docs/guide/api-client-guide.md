# Quy chuẩn giao tiếp API & hướng dẫn phát triển endpoints

Tài liệu này cung cấp quy chuẩn, hướng dẫn chi tiết về cấu hình, mở rộng, kiểm soát dữ liệu và phát triển các hàm giao tiếp API (endpoint) trong dự án.

---

## 1. Cấu trúc thư mục API Client

- `src/lib/api/` : Thư mục gốc chứa toàn bộ logic giao tiếp API.
  - `client.ts` : Khởi tạo và cấu hình axios client (baseURL, interceptor, ...).
  - `error-handlers.ts` : Xử lý lỗi toàn cục (401, refresh token, logout, ...).
  - `utils.ts` : Các hàm tiện ích liên quan đến API (ví dụ: kiểm tra token hết hạn).
  - `zodSafeParse.ts` : Hàm kiểm tra, validate dữ liệu trả về với Zod.
  - `endpoints/` : Chứa các hàm endpoint cho từng nhóm nghiệp vụ (auth, products, ...).
    - `auth.ts`, `products.ts`, ... : Định nghĩa các hàm gọi API cho từng nhóm.
    - `index.ts` : Export các endpoint để dễ import ở nơi khác.
- `src/lib/schemas/` : Chứa các schema Zod để validate dữ liệu phục vụ mục đích khác nhau, không chi riêng validate dữ liệu trả về từ API.
  - `product.schema.ts`, ... : Định nghĩa schema cho từng nhóm dữ liệu.
  - `index.ts` : Export các schema để dễ import.

**Ví dụ:**

```
src/lib/api/
  client.ts
  error-handlers.ts
  utils.ts
  zodSafeParse.ts
  endpoints/
    products.ts
    auth.ts
    index.ts
src/lib/schemas/
  product.schema.ts
  index.ts
```

## 2. Cấu hình & mở rộng apiClient

File `src/lib/api/client.ts` khởi tạo một instance axios với các interceptor mặc định (xử lý lỗi 401, tự refresh token). Bạn có thể mở rộng hoặc tuỳ biến như sau:

### Thêm request/response interceptor

```ts
import apiClient from "@/lib/api/client";

// Thêm request interceptor
apiClient.interceptors.request.use((config) => {
  // Custom logic, ví dụ: thêm header
  config.headers["X-Custom-Header"] = "value";
  return config;
});

// Thêm response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Custom logic sau khi nhận response
    return response;
  },
  (error) => {
    // Custom error handler
    return Promise.reject(error);
  }
);
```

### Tuỳ biến error handler

Bạn có thể sửa hoặc mở rộng file `src/lib/api/error-handlers.ts` để xử lý các lỗi khác ngoài 401, ví dụ log lỗi, redirect, ...

---

## 3. Hướng dẫn tạo endpoint mới

### 3.1. Tạo schema validate response

**Tác dụng:**

- Đảm bảo dữ liệu trả về từ API đúng định dạng, giúp code an toàn, dễ bảo trì, phát hiện lỗi sớm khi backend thay đổi.

**Khi nào tạo file mới?**

- Nếu là nhóm dữ liệu mới (chưa có file schema), hãy tạo file mới trong `src/lib/schemas/` (ví dụ: `order.schema.ts`).
- Nếu là mở rộng nhóm dữ liệu đã có, hãy viết vào file schema sẵn có.

**Cách thực hiện:**

1. Định nghĩa schema với Zod:

   ```ts
   // src/lib/schemas/order.schema.ts
   import { z } from "zod";

   export const orderSchema = z.object({
     id: z.number(),
     name: z.string(),
     // ... các trường khác
   });

   export const orderListResponseSchema = z.object({
     data: z.array(orderSchema),
     meta: z.object({
       total: z.number(),
       page: z.number(),
       pageSize: z.number(),
       totalPages: z.number(),
     }),
   });
   ```

2. Export schema trong file đó và trong `schemas/index.ts`:
   ```ts
   export * from "./order.schema";
   ```

### 3.2. Giải thích utils: zodSafeParse

Hàm `zodSafeParse(schema, data, defaultData)` giúp parse và validate dữ liệu trả về từ API với Zod schema:

- Nếu dữ liệu hợp lệ: trả về dữ liệu đã parse.
- Nếu không hợp lệ: trả về giá trị mặc định (`defaultData`).

Điều này giúp code an toàn, tránh lỗi khi backend trả về dữ liệu sai định dạng.

Ví dụ:

```ts
const result = zodSafeParse(orderSchema, response.data, null);
```

**Ghi chú:** Hàm này có thể custom lại để throw ra lỗi khi dữ liệu không hợp lệ (thay vì trả về giá trị mặc định), tuỳ vào nhu cầu xử lý lỗi của dự án.

### 3.3. Viết hàm endpoint

**Tác dụng:**

- Đóng gói logic gọi API, kiểm tra dữ liệu trả về, giúp code dễ dùng lại, kiểm soát dữ liệu tốt hơn và dễ bảo trì.

**Khi nào tạo mới?**

- Nếu là nhóm chức năng mới (chưa có file endpoint), hãy tạo file mới trong `src/lib/api/endpoints/` (ví dụ: `orders.ts`).
- Nếu là mở rộng nhóm chức năng đã có, hãy viết vào file endpoint sẵn có.

**Cách thực hiện:**

1. Định nghĩa hàm gọi API và validate response:

   ```ts
   import apiClient from "../client";
   import { orderListResponseSchema } from "@/lib/schemas";
   import { zodSafeParse } from "../zodSafeParse";

   export async function getOrderList(params) {
     const response = await apiClient.get("/orders", { params });
     return zodSafeParse(orderListResponseSchema, response.data, {
       data: [],
       meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
     });
   }
   ```

2. Export hàm trong file endpoint và trong `endpoints/index.ts`:
   ```ts
   export * from "./orders";
   ```

---

## 4. Lưu ý khi phát triển

- Luôn validate dữ liệu trả về với Zod.
- Không sửa trực tiếp vào `client.ts` trừ khi cần thay đổi cấu hình chung.
- Khi thêm endpoint/schema mới, luôn export ở file `index.ts` tương ứng.

---
