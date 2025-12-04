"use client";

import * as React from "react";
import { useState } from "react";
import {
  SortableImageList,
  ImageItem,
} from "@/components/shared/SortableImageList";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { toast } from "sonner";

/**
 * Example: Product Image Manager
 *
 * Component để quản lý danh sách ảnh của sản phẩm
 * - Drag & drop để sắp xếp lại thứ tự
 * - Xóa ảnh
 * - Nút "Save Order" xuất hiện khi có thay đổi
 *
 * Use case: Màn hình chi tiết sản phẩm, cho phép admin sắp xếp lại thứ tự ảnh hiển thị
 */

// Mock data - trong thực tế sẽ fetch từ API
const initialProductImages: ImageItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    alt: "Product image 1",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    alt: "Product image 2",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    alt: "Product image 3",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    alt: "Product image 4",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
    alt: "Product image 5",
  },
];

export function ProductImageManager() {
  const [images, setImages] = useState<ImageItem[]>(initialProductImages);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveOrder = async (newOrder: ImageItem[]) => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, call API to save new order
    // await updateProductImageOrder(productId, newOrder);

    console.log("New order:", newOrder);
    setImages(newOrder);
    setIsSaving(false);
    toast.success("Image order saved successfully!");
  };

  const handleRemoveImage = (image: ImageItem) => {
    // In real app, confirm with user before removing
    const confirmed = window.confirm(
      "Are you sure you want to remove this image?"
    );
    if (!confirmed) return;

    setImages(images.filter((img) => img.url !== image.url));
    toast.success("Image removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Drag and drop to reorder images. Click the X button to remove an
          image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SortableImageList
          images={images}
          onReorder={setImages}
          onRemove={handleRemoveImage}
          showRemove={true}
          showSaveButton={true}
          saveButtonText={isSaving ? "Saving..." : "Save Order"}
          onSave={handleSaveOrder}
          columns={{ default: 2, sm: 3, md: 4, lg: 5 }}
          emptyText="No images uploaded yet"
          title="Product Gallery"
          description="Drag images to reorder them. The first image will be the main product image."
        />
      </CardContent>
    </Card>
  );
}
