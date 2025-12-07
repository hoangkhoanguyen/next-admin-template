// src/lib/api/endpoints/products.ts
import apiClient from "../client";
import {
  productSchema,
  productListResponseSchema,
  type Product,
  type ProductListResponse,
} from "@/lib/schemas";
import { zodSafeParse } from "../zodSafeParse";
import { ProductFilters } from "@/lib/types";
import { CreateProductInput } from "@/lib/schemas";
import { products } from "@/mock/products";

// POST /products
export async function createProduct(
  data: CreateProductInput
): Promise<Product | null> {
  const response = await apiClient.post("/products", data);
  return zodSafeParse(productSchema, response.data, null);
}

// GET /products (with pagination)
export async function getProductListResponse(
  filters?: ProductFilters
): Promise<ProductListResponse> {
  // TODO: Uncomment when API is ready
  // const response = await apiClient.get("/products", {
  //   params: filters,
  // });
  // return zodSafeParse(productListResponseSchema, response.data);

  // Mock data for demo
  const mockData = await new Promise<ProductListResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        data: products,
        meta: {
          total: 300,
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 10,
          totalPages: 30,
        },
      });
    }, 500);
  });
  return zodSafeParse(productListResponseSchema, mockData, {
    data: [],
    meta: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    },
  });
}

// GET /products/:id
export async function getProduct(id: number): Promise<Product | null> {
  const response = await apiClient.get(`/products/${id}`);
  return zodSafeParse(productSchema, response.data, null);
}
