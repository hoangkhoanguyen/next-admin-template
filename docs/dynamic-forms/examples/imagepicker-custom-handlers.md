# ImagePicker Custom Handlers

## Overview

`ImagePickerField` giờ hỗ trợ custom handler `onImageSelect` để bạn tự quyết định logic khi chọn ảnh (thay thế, thêm mới, merge theo điều kiện, etc.)

## Default Behavior (Không có `onImageSelect`)

### Single Mode

```tsx
{
  name: "avatar",
  type: "imagepicker",
  label: "Avatar",
  multiple: false,
  // Không có onImageSelect → mặc định: THAY THẾ ảnh cũ
}
```

**Behavior:** Click "Đổi ảnh" → Ảnh mới thay thế ảnh cũ

### Multiple Mode

```tsx
{
  name: "gallery",
  type: "imagepicker",
  label: "Gallery",
  multiple: true,
  maxImages: 10,
  // Không có onImageSelect → mặc định: THÊM vào danh sách (tránh duplicate)
}
```

**Behavior:** Click "Thêm ảnh" → Ảnh mới được thêm vào danh sách, tránh duplicate

---

## Custom Handlers

### 1. Replace Mode (Thay thế hoàn toàn)

Dùng cho trường hợp muốn **xóa ảnh cũ** và chỉ giữ ảnh mới chọn:

```tsx
{
  name: "productImages",
  type: "imagepicker",
  label: "Product Images",
  multiple: true,
  maxImages: 5,
  onImageSelect: (newImages, existingImages) => {
    // Replace: Bỏ hết ảnh cũ, chỉ lấy ảnh mới
    return newImages;
  }
}
```

### 2. Append Mode (Thêm mới)

Thêm ảnh mới vào cuối danh sách:

```tsx
{
  name: "gallery",
  type: "imagepicker",
  label: "Gallery",
  multiple: true,
  onImageSelect: (newImages, existingImages) => {
    // Append: Thêm ảnh mới vào cuối
    return [...existingImages, ...newImages];
  }
}
```

### 3. Prepend Mode (Thêm vào đầu)

Thêm ảnh mới vào đầu danh sách:

```tsx
{
  name: "featuredImages",
  type: "imagepicker",
  label: "Featured Images",
  multiple: true,
  onImageSelect: (newImages, existingImages) => {
    // Prepend: Thêm ảnh mới vào đầu
    return [...newImages, ...existingImages];
  }
}
```

### 4. Merge với Duplicate Check

Thêm ảnh mới nhưng tránh duplicate (default behavior):

```tsx
{
  name: "gallery",
  type: "imagepicker",
  label: "Gallery",
  multiple: true,
  onImageSelect: (newImages, existingImages) => {
    // Merge: Thêm ảnh mới, tránh duplicate theo URL
    const filtered = Array.isArray(newImages)
      ? newImages.filter(newImg =>
          !existingImages.some(existing => existing.url === newImg.url)
        )
      : [];
    return [...existingImages, ...filtered];
  }
}
```

### 5. Limit & Replace Oldest

Giữ số lượng ảnh cố định, thay thế ảnh cũ nhất:

```tsx
{
  name: "recentPhotos",
  type: "imagepicker",
  label: "Recent Photos (Max 3)",
  multiple: true,
  maxImages: 3,
  onImageSelect: (newImages, existingImages) => {
    const newArray = Array.isArray(newImages) ? newImages : [newImages];
    const combined = [...existingImages, ...newArray];

    // Giữ 3 ảnh mới nhất (remove oldest)
    return combined.slice(-3);
  }
}
```

### 6. Set Featured (First Image)

Ảnh đầu tiên là featured, còn lại là gallery:

```tsx
{
  name: "productImages",
  type: "imagepicker",
  label: "Product Images",
  multiple: true,
  onImageSelect: (newImages, existingImages) => {
    const newArray = Array.isArray(newImages) ? newImages : [newImages];

    // Ảnh đầu tiên trong newImages sẽ thành featured
    // Thêm flag isFeatured
    const withFeaturedFlag = newArray.map((img, idx) => ({
      ...img,
      isFeatured: idx === 0 && existingImages.length === 0,
    }));

    return [...existingImages, ...withFeaturedFlag];
  }
}
```

### 7. Conditional Logic

Logic phức tạp dựa trên điều kiện:

```tsx
{
  name: "images",
  type: "imagepicker",
  label: "Images",
  multiple: true,
  maxImages: 10,
  onImageSelect: (newImages, existingImages) => {
    const newArray = Array.isArray(newImages) ? newImages : [newImages];

    // Nếu chưa có ảnh nào → Replace
    if (existingImages.length === 0) {
      return newImages;
    }

    // Nếu chọn 1 ảnh → Thay ảnh cuối
    if (newArray.length === 1) {
      return [...existingImages.slice(0, -1), ...newArray];
    }

    // Nếu chọn nhiều ảnh → Append
    return [...existingImages, ...newArray];
  }
}
```

### 8. Transform Images

Xử lý/transform ảnh trước khi lưu:

```tsx
{
  name: "gallery",
  type: "imagepicker",
  label: "Gallery",
  multiple: true,
  onImageSelect: (newImages, existingImages) => {
    const newArray = Array.isArray(newImages) ? newImages : [newImages];

    // Thêm metadata, timestamp, etc.
    const transformed = newArray.map(img => ({
      ...img,
      uploadedAt: new Date().toISOString(),
      uploadedBy: getCurrentUserId(),
      category: "product",
    }));

    return [...existingImages, ...transformed];
  }
}
```

---

## Use Cases

### E-commerce Product

```tsx
const productFormFields = [
  {
    name: "name",
    type: "text",
    label: "Product Name",
  },
  {
    name: "featuredImage",
    type: "imagepicker",
    label: "Featured Image",
    multiple: false,
    // Single mode → Replace (default)
  },
  {
    name: "gallery",
    type: "imagepicker",
    label: "Product Gallery",
    multiple: true,
    maxImages: 8,
    onImageSelect: (newImages, existingImages) => {
      // Thêm mới, không duplicate
      const filtered = newImages.filter(
        (newImg) =>
          !existingImages.some((existing) => existing.url === newImg.url)
      );
      return [...existingImages, ...filtered];
    },
  },
];
```

### User Profile

```tsx
const profileFormFields = [
  {
    name: "avatar",
    type: "imagepicker",
    label: "Avatar",
    multiple: false,
    // Replace old avatar (default)
  },
  {
    name: "coverPhoto",
    type: "imagepicker",
    label: "Cover Photo",
    multiple: false,
    // Replace old cover (default)
  },
];
```

### Banner Management

```tsx
const bannerFormFields = [
  {
    name: "banners",
    type: "imagepicker",
    label: "Banners (Max 5)",
    multiple: true,
    maxImages: 5,
    onImageSelect: (newImages, existingImages) => {
      // Replace mode: Chọn lại toàn bộ banner
      return newImages;
    },
  },
];
```

---

## Type Signature

```typescript
onImageSelect?: (
  newImages: ImageData | ImageData[], // Ảnh mới được chọn từ modal
  existingImages: ImageData[]          // Ảnh hiện có trong field
) => ImageData | ImageData[] | null;   // Return: Giá trị mới cho field
```

**Params:**

- `newImages`: Ảnh được chọn từ ImagePickerDialog (single object hoặc array)
- `existingImages`: Danh sách ảnh hiện có trong form field

**Returns:**

- Single mode: `ImageData | null`
- Multiple mode: `ImageData[] | null`

---

## Summary

✅ **Default behavior là thông minh:**

- Single mode: Replace
- Multiple mode: Append (tránh duplicate)

✅ **Custom handler cho flexibility:**

- Replace, Append, Prepend, Merge
- Transform, Add metadata
- Conditional logic

✅ **Type-safe:** Full TypeScript support

🎯 **Phù hợp cho mọi use case từ đơn giản đến phức tạp!**
