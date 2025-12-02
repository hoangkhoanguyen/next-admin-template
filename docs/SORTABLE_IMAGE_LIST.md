# SortableImageList Component

Component tái sử dụng cho drag & drop danh sách ảnh với `@dnd-kit`.

## Features

- ✅ Drag & drop để sắp xếp lại thứ tự ảnh
- ✅ Xóa ảnh (tùy chọn)
- ✅ Select/deselect ảnh (tùy chọn)
- ✅ Hiển thị nút "Save Order" khi có thay đổi (tùy chọn)
- ✅ Responsive grid layout
- ✅ Customizable columns, size, badge
- ✅ Empty state

## Usage

### 1. Basic Usage

```tsx
import {
  SortableImageList,
  ImageItem,
} from "@/components/shared/SortableImageList";

const images: ImageItem[] = [
  { url: "https://example.com/image1.jpg", alt: "Image 1" },
  { url: "https://example.com/image2.jpg", alt: "Image 2" },
];

function MyComponent() {
  const [images, setImages] = useState(initialImages);

  return <SortableImageList images={images} onReorder={setImages} />;
}
```

### 2. With Remove Button

```tsx
<SortableImageList
  images={images}
  onReorder={setImages}
  onRemove={(image) => {
    setImages(images.filter((img) => img.url !== image.url));
  }}
  showRemove={true}
/>
```

### 3. With Save Button (For Standalone Pages)

```tsx
<SortableImageList
  images={images}
  onReorder={setImages}
  showSaveButton={true}
  saveButtonText="Save Order"
  onSave={async (newOrder) => {
    await api.updateImageOrder(productId, newOrder);
    toast.success("Order saved!");
  }}
/>
```

### 4. With Selection

```tsx
<SortableImageList
  images={images}
  selectedImages={selectedImages}
  onSelect={(image) => {
    setSelectedImages([...selectedImages, image]);
  }}
  showSelection={true}
/>
```

### 5. Custom Grid Layout

```tsx
<SortableImageList
  images={images}
  onReorder={setImages}
  columns={{
    default: 2, // Mobile: 2 columns
    sm: 3, // Small screens: 3 columns
    md: 4, // Medium screens: 4 columns
    lg: 6, // Large screens: 6 columns
    xl: 8, // Extra large: 8 columns
  }}
  size="sm" // Size of drag handle and icons: "sm" | "md" | "lg"
/>
```

### 6. With Title, Description, and Custom Badge

```tsx
<SortableImageList
  images={images}
  onReorder={setImages}
  title="Product Gallery"
  description="Drag to reorder. First image will be the cover."
  badge={(image) => (image.isNew ? "New" : undefined)}
/>
```

## Props

```tsx
export interface SortableImageListProps {
  // Required
  images: ImageItem[];

  // Optional callbacks
  onReorder?: (images: ImageItem[]) => void;
  onRemove?: (image: ImageItem) => void;
  onSelect?: (image: ImageItem) => void;

  // Selection
  selectedImages?: ImageItem[];
  showSelection?: boolean;

  // Remove button
  showRemove?: boolean;

  // Save button (for standalone pages)
  showSaveButton?: boolean;
  saveButtonText?: string;
  onSave?: (images: ImageItem[]) => void;

  // Layout
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  size?: "sm" | "md" | "lg";

  // Customization
  badge?: (image: ImageItem) => string | React.ReactNode;
  emptyText?: string;
  title?: string;
  description?: string;
}
```

## ImageItem Interface

```tsx
export interface ImageItem {
  id?: string;
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any; // Allow additional properties
}
```

## Use Cases

### 1. Dynamic Form Field

Sử dụng trong dynamic form để người dùng chọn và sắp xếp ảnh:

```tsx
// In your form field component
<SortableImageList
  images={field.value || []}
  onReorder={(newOrder) => field.onChange(newOrder)}
  showSelection={false}
/>
```

### 2. Product Image Manager

Quản lý ảnh sản phẩm với nút save:

```tsx
<SortableImageList
  images={productImages}
  onReorder={setProductImages}
  onRemove={handleRemoveImage}
  showRemove={true}
  showSaveButton={true}
  onSave={handleSaveToAPI}
  title="Product Images"
  description="Drag to reorder. First image is the main product image."
/>
```

### 3. Image Picker Dialog

Hiển thị danh sách ảnh đã chọn trong dialog:

```tsx
<SortableImageList
  images={selectedImages}
  onReorder={setSelectedImages}
  onSelect={(img) => {
    // Remove from selection on click
    setSelectedImages(selected.filter((i) => i.url !== img.url));
  }}
  selectedImages={selectedImages}
  showSelection={true}
  columns={{ default: 6, md: 8, lg: 10 }}
  size="sm"
/>
```

## Examples

See full examples in:

- `/src/components/features/products/ProductImageManager.tsx` - Standalone product image manager
- `/src/components/shared/ImagePickerDialog.tsx` - Usage in image picker dialog

## Notes

- Component uses `@dnd-kit` for drag & drop functionality
- Inline styles are required by `@dnd-kit` for smooth animations
- All images must have unique `url` property (used as the drag ID)
- When `showSaveButton={true}`, changes are tracked internally and "Save" button only appears when there are unsaved changes
