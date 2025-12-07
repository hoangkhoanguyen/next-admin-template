# Hướng dẫn xây dựng hooks React Query cho dự án

Tài liệu này hướng dẫn cách tổ chức, tạo mới và mở rộng các custom hooks sử dụng React Query để truy vấn dữ liệu từ API trong dự án.

---

## 1. Mục đích

- Đóng gói logic truy vấn/mutation dữ liệu, giúp component sử dụng đơn giản, tái sử dụng và dễ kiểm soát cache.
- Chuẩn hóa cách đặt tên, tổ chức file/folder cho hooks liên quan đến React Query.

---

## 2. Cấu trúc thư mục

- `src/lib/queries/` : Thư mục gốc chứa các hooks React Query.
  - `products/` : Nhóm hooks cho sản phẩm.
    - `query.ts` : Hooks truy vấn (GET, detail, list...)
    - `mutation.ts` : Hooks mutation (POST, PUT, DELETE...)
    - `index.ts` : Export các hooks của nhóm.
  - `keys.ts` : Định nghĩa các query key chuẩn hóa cho từng nhóm dữ liệu.
    - **Mục đích:** Đảm bảo mỗi truy vấn/mutation có một cache key duy nhất, giúp React Query nhận diện, lưu trữ, làm mới và xóa cache chính xác. Việc chuẩn hóa key giúp tránh xung đột, tăng hiệu quả caching và invalidate dữ liệu đúng mục tiêu.

---

## 3. Định nghĩa query key

- Đặt trong `keys.ts` để chuẩn hóa, tránh trùng lặp key, dễ mở rộng.
- Ví dụ:

```ts
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id) => [...queryKeys.products.details(), id] as const,
  },
};
```

---

## 4. Tạo custom hook truy vấn (query)

- Đặt trong file `query.ts` của nhóm dữ liệu.
- Sử dụng `useQuery` từ `@tanstack/react-query`.
- Đặt tên hook theo dạng: `use[Entity]s`, `use[Entity]`.
- Ví dụ:

```ts
import { useQuery } from "@tanstack/react-query";
import { getProductListResponse, getProduct } from "@/lib/api/endpoints";
import { queryKeys } from "../keys";

export function useProducts(filters, options) {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: () => getProductListResponse(filters),
    ...options,
  });
}

export function useProduct(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: enabled && !!id,
  });
}
```

---

## 5. Tạo custom hook mutation

- Đặt trong file `mutation.ts` của nhóm dữ liệu.
- Sử dụng `useMutation` từ `@tanstack/react-query`.
- Đặt tên hook theo dạng: `useCreate[Entity]`, `useUpdate[Entity]`, ...
- Ví dụ:

```ts
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/lib/api/endpoints";

export function useCreateProduct(options) {
  return useMutation({
    mutationFn: createProduct,
    ...options,
  });
}
```

---

## 6. Export hooks

- Trong `index.ts` của nhóm, export các hook:

```ts
export * from "./query";
export * from "./mutation";
```

---

## 7. Lưu ý khi phát triển

- Luôn sử dụng query key chuẩn hóa từ `keys.ts`.
- Đặt tên hook rõ ràng, nhất quán.
- Tách riêng query và mutation cho dễ bảo trì.
- Có thể mở rộng thêm các options cho hook (refetch, staleTime, ...).
- Khi thêm nhóm dữ liệu mới, tạo folder và file tương tự.

---

## 8. Tham khảo thêm

- [React Query Docs](https://tanstack.com/query/latest)
- Xem các ví dụ trong thư mục `src/lib/queries/`
