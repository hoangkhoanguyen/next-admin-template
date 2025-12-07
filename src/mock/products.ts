import { Product } from "@/lib/schemas";

export const products: Product[] = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max",
    price: 1399,
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=facearea&w=80&h=80&q=80",
    stock: 12,
    category: "Smartphone",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra",
    price: 1299,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=80&h=80&q=80",
    stock: 8,
    category: "Smartphone",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 399,
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80&q=80",
    stock: 20,
    category: "Headphone",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Apple MacBook Pro 16",
    price: 2499,
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80&q=80",
    stock: 5,
    category: "Laptop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Dell XPS 13",
    price: 1099,
    imageUrl:
      "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=facearea&w=80&h=80&q=80",
    stock: 10,
    category: "Laptop",
    createdAt: new Date().toISOString(),
  },
];
