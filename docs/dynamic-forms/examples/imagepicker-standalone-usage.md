# ImagePicker Standalone Usage

`ImagePickerDialog` có thể được sử dụng **độc lập** ngoài DynamicForm - trong bất kỳ component nào của bạn!

## Setup

### 1. Add Provider ở Root Layout

Để sử dụng ImagePicker trong toàn bộ app, thêm provider vào root layout:

```tsx
// app/layout.tsx hoặc app/(dashboard)/layout.tsx
import { ImagePickerDialogProvider } from "@/components/shared/ImagePickerDialogContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ImagePickerDialogProvider>{children}</ImagePickerDialogProvider>
      </body>
    </html>
  );
}
```

### 2. Hoặc Wrap Component cụ thể

Nếu chỉ cần dùng trong một số components, wrap chúng:

```tsx
// app/products/page.tsx
import { ImagePickerDialogProvider } from "@/components/shared/ImagePickerDialogContext";
import { ProductManager } from "@/components/features/products/ProductManager";

export default function ProductsPage() {
  return (
    <ImagePickerDialogProvider>
      <ProductManager />
    </ImagePickerDialogProvider>
  );
}
```

---

## Usage Examples

### Example 1: Simple Avatar Picker

```tsx
"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AvatarPicker() {
  const { openModal } = useImagePickerDialog();
  const [avatar, setAvatar] = useState<string | null>(null);

  const handlePickAvatar = () => {
    openModal({
      multiple: false, // Single image
      onSelect: (image) => {
        setAvatar(image.url);
        console.log("Selected avatar:", image);
      },
    });
  };

  return (
    <div className="space-y-4">
      {avatar ? (
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No avatar</span>
        </div>
      )}

      <Button onClick={handlePickAvatar}>
        {avatar ? "Change Avatar" : "Pick Avatar"}
      </Button>
    </div>
  );
}
```

---

### Example 2: Product Gallery Manager

```tsx
"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageData {
  url: string;
  alt?: string;
  source?: "gallery" | "url" | "upload";
}

export function ProductGallery() {
  const { openModal } = useImagePickerDialog();
  const [images, setImages] = useState<ImageData[]>([]);

  const handleAddImages = () => {
    openModal({
      multiple: true,
      maxImages: 10,
      currentImagesCount: images.length,
      onSelect: (newImages: ImageData[]) => {
        // Merge with existing images
        const merged = [...images, ...newImages];
        setImages(merged);
        console.log("Total images:", merged.length);
      },
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Product Gallery ({images.length}/10)
        </h3>
        <Button onClick={handleAddImages}>Add Images</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square group">
            <Image
              src={image.url}
              alt={image.alt || `Image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Example 3: Blog Post Cover Image

```tsx
"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { Button, Card } from "@/components/ui";
import Image from "next/image";

export function BlogPostCover() {
  const { openModal } = useImagePickerDialog();
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleSelectCover = () => {
    openModal({
      multiple: false,
      onSelect: (image) => {
        setCoverImage(image.url);
      },
    });
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cover Image</h3>

      {coverImage ? (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={coverImage}
              alt="Cover image"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSelectCover} variant="outline">
              Change Image
            </Button>
            <Button onClick={handleRemoveCover} variant="destructive">
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No cover image</p>
            <Button onClick={handleSelectCover}>Select Cover Image</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
```

---

### Example 4: With State Management (Context/Redux)

```tsx
"use client";

import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { useProductStore } from "@/store/productStore"; // Your state management
import { Button } from "@/components/ui/button";

export function ProductImageManager({ productId }: { productId: string }) {
  const { openModal } = useImagePickerDialog();
  const { addProductImages, product } = useProductStore();

  const handleAddImages = () => {
    openModal({
      multiple: true,
      maxImages: 10,
      currentImagesCount: product.images.length,
      onSelect: async (newImages) => {
        // Upload to server
        const uploadedImages = await uploadToServer(newImages);

        // Update store
        addProductImages(productId, uploadedImages);

        // Show success
        toast.success(`Added ${uploadedImages.length} images`);
      },
    });
  };

  return (
    <Button onClick={handleAddImages}>
      Add Images ({product.images.length}/10)
    </Button>
  );
}
```

---

### Example 5: With API Integration

```tsx
"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileAvatarUploader({ userId }: { userId: string }) {
  const { openModal } = useImagePickerDialog();
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = () => {
    openModal({
      multiple: false,
      onSelect: async (image) => {
        try {
          setUploading(true);

          // Upload to your API
          const response = await fetch(`/api/users/${userId}/avatar`, {
            method: "POST",
            body: JSON.stringify({ imageUrl: image.url }),
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Upload failed");

          const data = await response.json();
          toast.success("Avatar updated successfully!");

          // Refresh user data
          // mutate() or revalidatePath()
        } catch (error) {
          toast.error("Failed to upload avatar");
          console.error(error);
        } finally {
          setUploading(false);
        }
      },
    });
  };

  return (
    <Button onClick={handleUploadAvatar} disabled={uploading}>
      {uploading ? "Uploading..." : "Change Avatar"}
    </Button>
  );
}
```

---

### Example 6: Multiple Independent Pickers

```tsx
"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";
import { Button, Card } from "@/components/ui";
import Image from "next/image";

export function BannerManager() {
  const { openModal } = useImagePickerDialog();
  const [desktopBanner, setDesktopBanner] = useState<string | null>(null);
  const [mobileBanner, setMobileBanner] = useState<string | null>(null);

  const handlePickDesktop = () => {
    openModal({
      multiple: false,
      onSelect: (image) => setDesktopBanner(image.url),
    });
  };

  const handlePickMobile = () => {
    openModal({
      multiple: false,
      onSelect: (image) => setMobileBanner(image.url),
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Desktop Banner</h3>
        {desktopBanner && (
          <div className="relative aspect-[16/9] mb-4">
            <Image
              src={desktopBanner}
              alt="Desktop"
              fill
              className="object-cover"
            />
          </div>
        )}
        <Button onClick={handlePickDesktop} className="w-full">
          {desktopBanner ? "Change" : "Select"} Desktop Banner
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Mobile Banner</h3>
        {mobileBanner && (
          <div className="relative aspect-[9/16] mb-4">
            <Image
              src={mobileBanner}
              alt="Mobile"
              fill
              className="object-cover"
            />
          </div>
        )}
        <Button onClick={handlePickMobile} className="w-full">
          {mobileBanner ? "Change" : "Select"} Mobile Banner
        </Button>
      </Card>
    </div>
  );
}
```

---

## API Reference

### `useImagePickerDialog()`

Hook để mở ImagePicker dialog.

**Returns:**

```typescript
{
  openModal: (params: OpenModalParams) => void;
  closeModal: () => void;
  state: ImagePickerDialogState;
}
```

### `openModal(params)`

**Parameters:**

```typescript
{
  fieldId?: string;           // Optional - for form integration
  onSelect: (images: any) => void;  // Callback when images are selected
  multiple?: boolean;         // Allow multiple selection (default: false)
  maxImages?: number;         // Max images when multiple=true
  currentImagesCount?: number; // Current count for validation
}
```

**Example:**

```typescript
openModal({
  multiple: true,
  maxImages: 5,
  onSelect: (images) => {
    console.log("Selected images:", images);
    // Do something with images
  },
});
```

---

## TypeScript Types

```typescript
interface ImageData {
  id?: string;
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  source?: "gallery" | "url" | "upload";
}

// Single mode
onSelect: (image: ImageData) => void;

// Multiple mode
onSelect: (images: ImageData[]) => void;
```

---

## Best Practices

### ✅ DO:

- Wrap your app/page with `ImagePickerDialogProvider`
- Use `useImagePickerDialog()` hook in your components
- Handle `onSelect` callback appropriately
- Validate file types and sizes if needed
- Show loading states during upload

### ❌ DON'T:

- Use hook outside of provider (will throw error)
- Forget to handle errors in `onSelect`
- Store large image data in local state (use URLs)

---

## Common Use Cases

| Use Case            | Config                              |
| ------------------- | ----------------------------------- |
| **Avatar**          | `{ multiple: false }`               |
| **Cover Image**     | `{ multiple: false }`               |
| **Product Gallery** | `{ multiple: true, maxImages: 10 }` |
| **Banner Slider**   | `{ multiple: true, maxImages: 5 }`  |
| **Portfolio**       | `{ multiple: true, maxImages: 20 }` |
| **Thumbnails**      | `{ multiple: false }`               |

---

## Summary

✅ **Fully reusable** - Use anywhere in your app  
✅ **Simple API** - Just `openModal()` and `onSelect`  
✅ **Type-safe** - Full TypeScript support  
✅ **Flexible** - Single or multiple images  
✅ **No form dependency** - Works standalone

🎯 Perfect cho mọi image selection use case! 🚀
