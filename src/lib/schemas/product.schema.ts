// src/lib/schemas/product.schema.ts
import { z } from "zod";

// 1. Định nghĩa schema cho Product
export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().nonnegative("Price must be >= 0"),
  category: z.string(),
  imageUrl: z.url().optional(),
  stock: z.number().int().nonnegative("Stock must be >= 0"),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().optional(),
});

// 2. Infer TypeScript type từ schema
export type Product = z.infer<typeof productSchema>;

// 3. Schema cho array
export const productsSchema = z.array(productSchema);
export type Products = z.infer<typeof productsSchema>;

// 4. Schema cho API response với pagination
export const productListResponseSchema = z.object({
  data: z.array(productSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});
export type ProductListResponse = z.infer<typeof productListResponseSchema>;

// 5. Schema cho form input (có thể khác với API response)
export const createProductSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // Add any form-only fields here if needed
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
