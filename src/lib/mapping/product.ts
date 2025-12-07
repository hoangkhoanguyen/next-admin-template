import { Product } from "@/lib/schemas/product.schema";
import { ProductUI } from "@/types/product";

export const mapProductToUI = (product: Product): ProductUI => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.imageUrl || "",
  stock: product.stock,
  category: product.category,
});
