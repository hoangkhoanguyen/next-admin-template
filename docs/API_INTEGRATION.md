# API Integration Guide - Deep Dive

> **Chi tiết về 4 options quan trọng cho API handling trong Admin Dashboard**

## 📚 Table of Contents

1. [Zod Schema Validation](#1-zod-schema-validation)
2. [Axios Interceptors Pattern](#2-axios-interceptors-pattern)
3. [React Query + Axios Best Practices](#3-react-query--axios-best-practices)
4. [TanStack Table + Shadcn Integration](#4-tanstack-table--shadcn-integration)

---

## 1. Zod Schema Validation

### 🎯 Mục đích

- **Runtime validation**: Validate data từ API response
- **Type safety**: Tự động infer TypeScript types từ schema
- **Single source of truth**: Schema = Types = Validation rules
- **Error handling**: Clear error messages khi data không đúng format

### 📖 Cách hoạt động

```typescript
// ========================================
// FILE: lib/schemas/user.schema.ts
// ========================================
import { z } from "zod";

// 1. Định nghĩa schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user", "guest"]),
  avatar: z.string().url().optional(),
  createdAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});

// 2. Infer TypeScript type từ schema
export type User = z.infer<typeof userSchema>;
// Equivalent to:
// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'user' | 'guest';
//   avatar?: string;
//   createdAt: string;
//   isActive: boolean;
// }

// 3. Schema cho array
export const usersSchema = z.array(userSchema);
export type Users = z.infer<typeof usersSchema>;

// 4. Schema cho API response với pagination
export const userListResponseSchema = z.object({
  data: z.array(userSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});

export type UserListResponse = z.infer<typeof userListResponseSchema>;

// 5. Schema cho form input (có thể khác với API response)
export const createUserSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 🔥 Use Cases trong Admin Dashboard

#### Use Case 1: Validate API Response

```typescript
// lib/api/endpoints/users.ts
import axios from "../client";
import { userSchema, usersSchema } from "@/lib/schemas/user.schema";

export async function getUsers() {
  const response = await axios.get("/users");

  // Validate response data với Zod
  const validatedData = usersSchema.parse(response.data);
  // Nếu data không đúng format → throw ZodError
  // Nếu đúng → return data với correct types

  return validatedData;
}

export async function getUser(id: number) {
  const response = await axios.get(`/users/${id}`);
  return userSchema.parse(response.data);
}
```

#### Use Case 2: Form Validation với React Hook Form

```typescript
// components/forms/CreateUserForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserInput,
} from "@/lib/schemas/user.schema";

export function CreateUserForm() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      isActive: true,
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    // data đã được validate và có correct types
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

#### Use Case 3: Safe Parsing (không throw error)

```typescript
// Khi không chắc chắn data có đúng format
const result = userSchema.safeParse(apiResponse);

if (result.success) {
  const user = result.data; // Type-safe user data
  console.log(user.name);
} else {
  console.error("Validation failed:", result.error.errors);
  // Show error to user hoặc fallback
}
```

### 🎁 Benefits

- ✅ **Type safety**: TypeScript types tự động từ schema
- ✅ **Runtime safety**: Catch invalid data từ API
- ✅ **DRY**: Một schema cho cả validation và types
- ✅ **Better errors**: Clear validation error messages
- ✅ **Refactoring**: Change schema → types update everywhere

---

## 2. Axios Interceptors Pattern

### 🎯 Mục đích

- **Centralized logic**: Auth token, error handling, loading states ở một nơi
- **Request transformation**: Modify requests trước khi gửi
- **Response transformation**: Modify responses trước khi về component
- **Error handling**: Xử lý errors globally (401 → logout, 500 → toast)

### 📖 Cách hoạt động

```typescript
// ========================================
// FILE: lib/api/client.ts
// ========================================
import axios from "axios";
import { getSession, signOut } from "next-auth/react"; // hoặc auth solution của bạn

// 1. Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// FILE: lib/api/interceptors.ts
// ========================================

// 2. REQUEST INTERCEPTOR - chạy trước mỗi request
apiClient.interceptors.request.use(
  async (config) => {
    // A. Inject auth token
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // B. Add request ID cho tracking
    config.headers["X-Request-ID"] = crypto.randomUUID();

    // C. Log request (dev only)
    if (process.env.NODE_ENV === "development") {
      console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR - chạy sau mỗi response
apiClient.interceptors.response.use(
  (response) => {
    // A. Transform response data nếu cần
    if (response.data?.data) {
      response.data = response.data.data; // Unwrap { data: { data: ... } }
    }

    // B. Log response (dev only)
    if (process.env.NODE_ENV === "development") {
      console.log("📥 Response:", response.config.url, response.status);
    }

    return response;
  },
  async (error) => {
    // ERROR HANDLING - chạy khi có lỗi
    const originalRequest = error.config;

    // Case 1: Network Error
    if (!error.response) {
      console.error("❌ Network Error:", error.message);
      // Show toast: "Network error. Please check your connection."
      return Promise.reject(error);
    }

    // Case 2: 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Retry request
      } catch (refreshError) {
        // Refresh failed → logout user
        await signOut({ callbackUrl: "/login" });
        return Promise.reject(refreshError);
      }
    }

    // Case 3: 403 Forbidden
    if (error.response.status === 403) {
      console.error("🚫 Forbidden:", error.response.data);
      // Show toast: "You don't have permission to access this resource."
      // Redirect to 403 page hoặc show modal
    }

    // Case 4: 404 Not Found
    if (error.response.status === 404) {
      console.error("🔍 Not Found:", error.config.url);
      // Show toast hoặc redirect to 404 page
    }

    // Case 5: 500 Server Error
    if (error.response.status >= 500) {
      console.error("💥 Server Error:", error.response.data);
      // Show toast: "Server error. Please try again later."
      // Log to error tracking service (Sentry, etc.)
    }

    // Case 6: Validation Errors (422)
    if (error.response.status === 422) {
      // API trả về validation errors
      const validationErrors = error.response.data.errors;
      // Return structured errors để form có thể hiển thị
      return Promise.reject({
        ...error,
        validationErrors,
      });
    }

    return Promise.reject(error);
  }
);

// Helper: Refresh token
async function refreshAccessToken() {
  try {
    const response = await axios.post("/api/auth/refresh");
    return response.data.accessToken;
  } catch (error) {
    throw error;
  }
}

export default apiClient;
```

### 🔥 Use Cases

#### Use Case 1: Auto-inject Auth Token

```typescript
// Component không cần quan tâm đến auth token
const fetchUsers = async () => {
  const response = await apiClient.get("/users");
  // Token đã được inject automatically bởi interceptor
  return response.data;
};
```

#### Use Case 2: Global Loading State

```typescript
// lib/api/interceptors.ts
import { useLoadingStore } from "@/store/loading";

apiClient.interceptors.request.use((config) => {
  // Start loading
  useLoadingStore.getState().startLoading();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // Stop loading
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error) => {
    // Stop loading on error
    useLoadingStore.getState().stopLoading();
    return Promise.reject(error);
  }
);
```

#### Use Case 3: Global Error Toast

```typescript
// lib/api/interceptors.ts
import { toast } from "sonner";

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    // Show toast for all errors (except specific cases)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
```

### 🎁 Benefits

- ✅ **DRY**: Auth logic, error handling ở một nơi
- ✅ **Consistent**: Tất cả requests đều follow same rules
- ✅ **Easy debugging**: Log tất cả requests/responses
- ✅ **Better UX**: Auto-handle common errors (401, 500, etc.)
- ✅ **Token refresh**: Auto-retry requests sau khi refresh token

---

## 3. React Query + Axios Best Practices

### 🎯 Mục đích

- **Separation of concerns**: API calls, cache management, UI rendering riêng biệt
- **Reusability**: Custom hooks có thể dùng ở nhiều nơi
- **Type safety**: Full TypeScript support
- **Cache management**: Auto cache, invalidate, refetch
- **Optimistic updates**: Update UI trước khi API response

### 📖 Architecture Pattern

```
┌─────────────────────────────────────────────────┐
│                 Component Layer                  │
│  (UI logic, render, user interactions)          │
└─────────────────┬───────────────────────────────┘
                  │ uses
┌─────────────────▼───────────────────────────────┐
│            React Query Hooks Layer               │
│  (useUsers, useCreateUser, etc.)                │
│  - Cache management                             │
│  - Loading/error states                         │
│  - Refetch logic                                │
│  - Optimistic updates                           │
└─────────────────┬───────────────────────────────┘
                  │ calls
┌─────────────────▼───────────────────────────────┐
│              API Service Layer                   │
│  (getUsers, createUser, etc.)                   │
│  - Axios requests                               │
│  - Zod validation                               │
│  - Transform data                               │
└─────────────────┬───────────────────────────────┘
                  │ uses
┌─────────────────▼───────────────────────────────┐
│            Axios Client Layer                    │
│  (apiClient with interceptors)                  │
│  - Auth token injection                         │
│  - Error handling                               │
│  - Request/Response transformation              │
└─────────────────────────────────────────────────┘
```

### 📁 File Organization

```typescript
// ========================================
// 1. Query Keys Factory
// FILE: lib/queries/keys.ts
// ========================================
// Centralized query keys để dễ manage và invalidate

export const queryKeys = {
  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: UserFilters) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: ProductFilters) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: OrderFilters) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,
  },
} as const;

// Usage:
// queryKeys.users.all => ['users']
// queryKeys.users.list({ role: 'admin' }) => ['users', 'list', { role: 'admin' }]
// queryKeys.users.detail(1) => ['users', 'detail', 1]
```

```typescript
// ========================================
// 2. API Service Layer
// FILE: lib/api/endpoints/users.ts
// ========================================
import apiClient from "../client";
import { userSchema, usersSchema, type User } from "@/lib/schemas/user.schema";

export interface UserFilters {
  page?: number;
  pageSize?: number;
  role?: string;
  search?: string;
}

// GET /users
export async function getUsers(filters?: UserFilters) {
  const response = await apiClient.get<User[]>("/users", {
    params: filters,
  });
  return usersSchema.parse(response.data);
}

// GET /users/:id
export async function getUser(id: number) {
  const response = await apiClient.get<User>(`/users/${id}`);
  return userSchema.parse(response.data);
}

// POST /users
export async function createUser(data: Omit<User, "id" | "createdAt">) {
  const response = await apiClient.post<User>("/users", data);
  return userSchema.parse(response.data);
}

// PUT /users/:id
export async function updateUser(id: number, data: Partial<User>) {
  const response = await apiClient.put<User>(`/users/${id}`, data);
  return userSchema.parse(response.data);
}

// DELETE /users/:id
export async function deleteUser(id: number) {
  await apiClient.delete(`/users/${id}`);
}
```

```typescript
// ========================================
// 3. React Query Hooks - Queries
// FILE: lib/queries/users/use-users.ts
// ========================================
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUsers, type UserFilters } from "@/lib/api/endpoints/users";
import { queryKeys } from "../keys";
import { type User } from "@/lib/schemas/user.schema";

export function useUsers(
  filters?: UserFilters,
  options?: Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => getUsers(filters),
    // Options
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time
    refetchOnWindowFocus: true,
    retry: 3,
    ...options,
  });
}

// Usage trong component:
// const { data: users, isLoading, error } = useUsers({ role: 'admin' });
```

```typescript
// ========================================
// FILE: lib/queries/users/use-user.ts
// ========================================
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api/endpoints/users";
import { queryKeys } from "../keys";

export function useUser(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: enabled && !!id, // Only fetch if enabled and id exists
  });
}

// Usage:
// const { data: user } = useUser(userId);
```

```typescript
// ========================================
// 4. React Query Hooks - Mutations
// FILE: lib/queries/users/mutations.ts
// ========================================
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "@/lib/api/endpoints/users";
import { queryKeys } from "../keys";
import { toast } from "sonner";
import { type User } from "@/lib/schemas/user.schema";

// CREATE USER
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    // onMutate: Chạy trước khi mutation execute (optimistic update)
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(queryKeys.users.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.users.lists(), (old: User[] = []) => {
        return [...old, { ...newUser, id: Date.now() }]; // Fake ID
      });

      return { previousUsers };
    },

    // onError: Rollback on error
    onError: (error, newUser, context) => {
      queryClient.setQueryData(queryKeys.users.lists(), context?.previousUsers);
      toast.error("Failed to create user");
    },

    // onSuccess: Invalidate and refetch
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User created successfully");
    },
  });
}

// UPDATE USER
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });

      const previousUser = queryClient.getQueryData(queryKeys.users.detail(id));

      // Optimistic update
      queryClient.setQueryData(queryKeys.users.detail(id), (old: User) => ({
        ...old,
        ...data,
      }));

      return { previousUser };
    },

    onError: (error, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.users.detail(id),
        context?.previousUser
      );
      toast.error("Failed to update user");
    },

    onSuccess: (data, { id }) => {
      // Invalidate both detail and list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success("User updated successfully");
    },
  });
}

// DELETE USER
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      const previousUsers = queryClient.getQueryData(queryKeys.users.lists());

      // Optimistic removal
      queryClient.setQueryData(queryKeys.users.lists(), (old: User[] = []) =>
        old.filter((user) => user.id !== id)
      );

      return { previousUsers };
    },

    onError: (error, id, context) => {
      queryClient.setQueryData(queryKeys.users.lists(), context?.previousUsers);
      toast.error("Failed to delete user");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted successfully");
    },
  });
}

// Usage trong component:
// const createUser = useCreateUser();
// const updateUser = useUpdateUser();
// const deleteUser = useDeleteUser();
//
// createUser.mutate({ name: 'John', email: 'john@example.com' });
// updateUser.mutate({ id: 1, data: { name: 'Jane' } });
// deleteUser.mutate(1);
```

### 🔥 Advanced Patterns

#### Pattern 1: Infinite Query (Pagination)

```typescript
// lib/queries/users/use-infinite-users.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/endpoints/users";
import { queryKeys } from "../keys";

export function useInfiniteUsers(filters?: Omit<UserFilters, "page">) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: ({ pageParam = 1 }) => getUsers({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      // Return next page number or undefined if no more pages
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

// Usage:
// const {
//   data,
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage,
// } = useInfiniteUsers({ role: 'admin' });
```

#### Pattern 2: Dependent Queries

```typescript
// Fetch user details, then fetch user's orders
function UserProfile({ userId }: { userId: number }) {
  const { data: user } = useUser(userId);

  // Only fetch orders after user data is loaded
  const { data: orders } = useOrders(
    { userId },
    { enabled: !!user } // enabled based on user data
  );

  return <div>...</div>;
}
```

#### Pattern 3: Parallel Queries

```typescript
function Dashboard() {
  const usersQuery = useUsers();
  const productsQuery = useProducts();
  const ordersQuery = useOrders();

  // All queries run in parallel
  if (
    usersQuery.isLoading ||
    productsQuery.isLoading ||
    ordersQuery.isLoading
  ) {
    return <Loading />;
  }

  return (
    <div>
      <UsersStats data={usersQuery.data} />
      <ProductsStats data={productsQuery.data} />
      <OrdersStats data={ordersQuery.data} />
    </div>
  );
}
```

### 🎁 Benefits

- ✅ **Automatic caching**: No manual cache management
- ✅ **Background updates**: Auto-refetch stale data
- ✅ **Optimistic updates**: Fast UI feedback
- ✅ **Deduplication**: Multiple components use same query → 1 request
- ✅ **DevTools**: Visual debugging với React Query DevTools
- ✅ **Type safety**: Full TypeScript inference

---

## 4. TanStack Table + Shadcn Integration

### 🎯 Mục đích

- **Headless UI**: Control 100% appearance với Shadcn styles
- **Feature-rich**: Sorting, filtering, pagination, selection built-in
- **Performance**: Virtual scrolling, optimized re-renders
- **Type-safe**: TypeScript first với proper type inference
- **Flexible**: Customize mọi aspect của table

### 📖 Architecture

```typescript
// ========================================
// 1. Define Column Structure
// FILE: components/tables/users/columns.tsx
// ========================================
import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@/lib/schemas/user.schema";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<User>[] = [
  // Selection column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ID column
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },

  // Name column with sorting
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },

  // Email column
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  // Role column with badge
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Status column
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id.toString())}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("View", user)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit", user)}>
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete", user)}
              className="text-red-600"
            >
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

```typescript
// ========================================
// 2. Data Table Component
// FILE: components/tables/data-table.tsx
// ========================================
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string; // Which column to search
  filterOptions?: {
    // Filter options for toolbar
    column: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filterOptions,
}: DataTableProps<TData, TValue>) {
  // States
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar with search and filters */}
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        filterOptions={filterOptions}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
```

```typescript
// ========================================
// 3. Toolbar Component
// FILE: components/tables/data-table-toolbar.tsx
// ========================================
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  filterOptions?: {
    column: string;
    title: string;
    options: { label: string; value: string; icon?: React.ComponentType }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search input */}
        {searchKey && (
          <Input
            placeholder={`Search ${searchKey}...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Faceted filters */}
        {filterOptions?.map((filter) => {
          const column = table.getColumn(filter.column);
          return column ? (
            <DataTableFacetedFilter
              key={filter.column}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          ) : null;
        })}

        {/* Clear filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Column visibility */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
```

```typescript
// ========================================
// 4. Pagination Component
// FILE: components/tables/data-table-pagination.tsx
// ========================================
import { type Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      {/* Selected rows info */}
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// ========================================
// 5. Usage in Page Component
// FILE: app/(admin)/users/page.tsx
// ========================================
"use client";

import { useUsers } from "@/lib/queries/users/use-users";
import { columns } from "@/components/tables/users/columns";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return <div>Loading...</div>; // Or skeleton
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users || []}
        searchKey="name"
        filterOptions={[
          {
            column: "role",
            title: "Role",
            options: [
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
              { label: "Guest", value: "guest" },
            ],
          },
        ]}
      />
    </div>
  );
}
```

### 🔥 Advanced Features

#### Feature 1: Server-side Pagination với React Query

```typescript
// lib/queries/users/use-paginated-users.ts
export function usePaginatedUsers(page: number, pageSize: number) {
  return useQuery({
    queryKey: queryKeys.users.list({ page, pageSize }),
    queryFn: () => getUsers({ page, pageSize }),
    // Keep previous data while fetching next page
    placeholderData: (previousData) => previousData,
  });
}

// Component
function UsersTable() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = usePaginatedUsers(
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta.totalPages ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true, // Server-side pagination
    // ... other config
  });
}
```

#### Feature 2: Column Resizing

```typescript
const table = useReactTable({
  // ... other config
  enableColumnResizing: true,
  columnResizeMode: "onChange",
  defaultColumn: {
    minSize: 50,
    maxSize: 500,
  },
});
```

#### Feature 3: Row Actions with Mutations

```typescript
// In columns.tsx
{
  id: 'actions',
  cell: ({ row }) => {
    const user = row.original;
    const deleteUser = useDeleteUser();

    return (
      <DropdownMenu>
        {/* ... menu items */}
        <DropdownMenuItem
          onClick={() => {
            if (confirm('Are you sure?')) {
              deleteUser.mutate(user.id);
            }
          }}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    );
  },
}
```

### 🎁 Benefits

- ✅ **Full control**: Customize everything với Shadcn styles
- ✅ **Type-safe**: TypeScript infers column types
- ✅ **Feature-rich**: Sorting, filtering, pagination out-of-the-box
- ✅ **Performance**: Optimized renders, virtual scrolling support
- ✅ **Reusable**: One DataTable component cho all entities
- ✅ **Accessible**: Built with accessibility in mind

---

## 🚀 Putting It All Together

### Complete Flow Example

```typescript
// 1. User clicks "Create User" button
// 2. Form opens with validation (Zod + React Hook Form)
// 3. User submits form
// 4. Mutation hook calls API with Axios
// 5. Axios interceptor injects auth token
// 6. Zod validates response data
// 7. React Query optimistically updates cache
// 8. Table re-renders with new data
// 9. Toast shows success message
// 10. Form closes

// All of this with type safety, error handling, and cache management!
```

### Benefits of This Architecture

✅ **Type Safety**: End-to-end TypeScript
✅ **Separation of Concerns**: Each layer has one responsibility
✅ **Reusability**: Hooks và components có thể reuse
✅ **Maintainability**: Easy to test, debug, và extend
✅ **Performance**: Automatic optimization với React Query
✅ **Developer Experience**: Clear patterns, good errors, DevTools
✅ **User Experience**: Fast updates, error handling, loading states

---

## 📚 Learning Resources

### Documentation

- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [Shadcn UI](https://ui.shadcn.com/)

### Video Tutorials

- [React Query Tutorial - Complete Guide](https://www.youtube.com/results?search_query=tanstack+query+tutorial)
- [TanStack Table v8 - Complete Tutorial](https://www.youtube.com/results?search_query=tanstack+table+v8+tutorial)

### Code Examples

- [Shadcn Table Example](https://ui.shadcn.com/docs/components/data-table)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/react/simple)

---

**Happy coding! 🎉**
