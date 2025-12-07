// src/lib/queries/products.ts
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProductListResponse, getProduct } from "@/lib/api/endpoints";
import { queryKeys } from "../keys";
import { ProductFilters } from "@/lib/types/product";
import { ProductListResponse } from "@/lib/schemas";

// Hook: Lấy danh sách sản phẩm
export function useProducts(
  filters?: ProductFilters,
  options?: Omit<UseQueryOptions<ProductListResponse>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: () => getProductListResponse(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    retry: 3,
    ...options,
  });
}

// Hook: Lấy chi tiết sản phẩm
export function useProduct(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: enabled && !!id,
  });
}
