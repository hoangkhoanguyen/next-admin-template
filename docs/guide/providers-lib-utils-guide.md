# Hướng dẫn sử dụng và mở rộng các thư mục core

## 1. Thư mục `providers`

### Mục đích

Chứa các React context providers, các thành phần cung cấp context hoặc state toàn cục cho toàn bộ ứng dụng hoặc một phần lớn của ứng dụng.

### Khi nào nên thêm mới?

- Khi bạn cần chia sẻ state, config, hoặc logic giữa nhiều component mà không muốn truyền props qua nhiều cấp.
- Khi cần tích hợp các thư viện như React Query, Theme, Auth, v.v.

### Cách sử dụng

- Import provider vào `src/app/layout.tsx` hoặc file layout tương ứng để bọc toàn bộ ứng dụng hoặc một phần.
- Ví dụ:

  ```tsx
  import { QueryClientProvider } from "@/providers/query-client-provider";
  import { ThemeProviders } from "@/providers/theme-providers";

  export default function RootLayout({ children }) {
    return (
      <QueryClientProvider>
        <ThemeProviders>{children}</ThemeProviders>
      </QueryClientProvider>
    );
  }
  ```

### Mở rộng

- Tạo file mới cho mỗi provider, đặt tên rõ ràng: `auth-provider.tsx`, `settings-provider.tsx`, ...
- Đảm bảo provider export cả component và custom hook (nếu có):
  ```tsx
  export const AuthProvider = ...
  export function useAuth() { ... }
  ```

---

## 2. Thư mục `lib/utils`

### Mục đích

Chứa các hàm tiện ích (utility functions), helpers, các đoạn code xử lý logic thuần tuý, không phụ thuộc vào UI.

### Khi nào nên thêm mới?

- Khi có logic xử lý dữ liệu, format, validate, ... dùng lại ở nhiều nơi.
- Khi cần tách biệt code "business logic" khỏi component.

### Cách sử dụng

- **Tất cả các hàm util nên được re-export tại `index.ts`** trong thư mục `lib/utils`.
- Khi import, chỉ cần import từ `@/lib/utils` mà không cần chỉ rõ file con:
  ```ts
  import { formatCurrency, debounce } from "@/lib/utils";
  ```

### Mở rộng

- Mỗi nhóm hàm nên tách file riêng: `format.ts`, `debounce.ts`, `date.ts`, `tailwind.ts`, ...
- Sau khi thêm hàm mới, **luôn re-export tại `index.ts`**:
  ```ts
  export * from "./format";
  export * from "./debounce";
  // ...
  ```
- Đặt tên hàm rõ ràng, export từng hàm hoặc export default object nếu hợp lý.
- Nếu hàm chỉ dùng cho 1 feature, cân nhắc đặt trong thư mục feature đó thay vì `lib/utils`.
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Clean Code Utilities](https://github.com/ryanmcdermott/clean-code-javascript#utility-functions)
