// src/lib/queries/products/mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { toast } from "sonner";
import { createProduct } from "@/lib/api/endpoints/products";
import { type CreateProductInput, type Product } from "@/lib/schemas";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),

    // onMutate: Optimistic update (optional, can be omitted if not needed)
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });
      const previousProducts = queryClient.getQueryData(
        queryKeys.products.lists()
      );
      // Optionally, add the new product to the cache optimistically
      queryClient.setQueryData(
        queryKeys.products.lists(),
        (old: Product[] = []) => [
          ...old,
          { ...newProduct, id: Date.now() }, // Fake ID for demo
        ]
      );
      return { previousProducts };
    },

    // onError: Rollback on error
    onError: (error, newProduct, context) => {
      queryClient.setQueryData(
        queryKeys.products.lists(),
        context?.previousProducts
      );
      toast.error("Failed to create product");
    },

    // onSuccess: Invalidate and refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast.success("Product created successfully");
    },
  });
}
