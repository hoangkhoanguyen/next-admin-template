# Image Picker Field - Summary

> **Quick reference for Image Picker field implementation**

---

## 🎯 What It Does

**Image Picker** allows users to select images in 2 ways:

1. **Browse Gallery** - Select from uploaded/existing images
2. **Paste URL** - Enter direct image URL from internet

---

## 📝 Basic Usage

```typescript
{
  name: 'thumbnail',
  type: 'imagepicker',
  label: 'Product Image',
  required: true,

  galleryEndpoint: '/api/media/images',

  allowGallery: true,
  allowUrl: true,

  showPreview: true,
  showImageInfo: true,
}
```

---

## 🔑 Key Features

| Feature          | Description                      |
| ---------------- | -------------------------------- |
| **Dual Input**   | Gallery browser + URL paste      |
| **Preview**      | Show selected image(s)           |
| **Multiple**     | Select multiple images           |
| **Validation**   | URL validation, dimensions, size |
| **Info Display** | Show width, height, file size    |
| **React Query**  | Cached gallery data              |

---

## 🎨 UX Flow

```
User clicks "Select Image"
        ↓
Modal opens with 2 tabs
├─ Gallery Tab
│  └─ Grid of images → Click to select
└─ URL Tab
   └─ Paste URL → Preview → Add

Selection confirmed
        ↓
Image preview shown
(with remove button)
```

---

## 📊 Use Cases

### E-commerce Product Images

```typescript
{
  name: 'images',
  type: 'imagepicker',
  multiple: true,
  maxImages: 5,
  galleryEndpoint: '/api/media/images',
  galleryFilters: { category: 'products' },
}
```

### Banner with Dimensions

```typescript
{
  name: 'banner',
  type: 'imagepicker',
  minWidth: 1920,
  minHeight: 1080,
  aspectRatio: 16/9,
  galleryFilters: { category: 'banners' },
}
```

### Avatar (URL Only)

```typescript
{
  name: 'avatar',
  type: 'imagepicker',
  allowGallery: false,
  allowUrl: true,
}
```

---

## 🔧 Configuration Options

### Selection

- `multiple` - Allow multiple images
- `maxImages` - Maximum images
- `minImages` - Minimum images

### Input Methods

- `allowGallery` - Enable gallery browser
- `allowUrl` - Enable URL input
- `allowUpload` - Enable direct upload

### Gallery

- `galleryEndpoint` - API endpoint
- `galleryQueryKey` - React Query key
- `galleryFilters` - Filter by category, tags, dimensions

### Validation

- `acceptedFormats` - MIME types
- `maxFileSize` - File size limit
- `minWidth` / `minHeight` - Dimension requirements
- `aspectRatio` - Required aspect ratio

### Display

- `showPreview` - Show image preview
- `previewSize` - sm | md | lg
- `showImageInfo` - Show dimensions, size
- `showDimensions` - Show width x height

---

## 🏗️ Architecture

### Components

```
ImagePicker.tsx              # Main field component
└─ Dialog (Shadcn)
   ├─ Tabs
   │  ├─ Gallery Tab
   │  │  └─ Image Grid (with React Query)
   │  └─ URL Tab
   │     └─ Input + Preview
   └─ Selected Images Preview
```

### Data Flow

```
User selects image
      ↓
ImageData object created
      ↓
formField.onChange(imageData)
      ↓
React Hook Form updates
      ↓
Preview shown
```

---

## 📦 Dependencies

```bash
# Required
npm install @tanstack/react-query

# Shadcn UI Components
npx shadcn@latest add dialog tabs input button
```

---

## 🎯 Best Practices

### ✅ DO

- Show image preview after selection
- Display dimensions for informed choice
- Validate image URL format
- Lazy load gallery images
- Cache gallery data with React Query
- Show loading state while fetching

### ❌ DON'T

- Don't load all images at once (use pagination)
- Don't forget to validate external URLs
- Don't allow upload without implementation
- Don't show gallery if endpoint not configured

---

## 🔗 Related

- **FileUpload** - For file uploads
- **AsyncSelect** - For loading options from API
- **[Full Documentation](./11-imagepicker-field.md)** - Complete guide

---

## 📊 Comparison: Gallery vs URL

| Aspect              | Gallery               | URL                |
| ------------------- | --------------------- | ------------------ |
| **Speed**           | Medium (need to load) | Fast (instant)     |
| **Quality Control** | ✅ Controlled         | ❌ Unknown         |
| **Validation**      | ✅ Pre-validated      | ⚠️ Need validation |
| **Organization**    | ✅ Categories/tags    | ❌ None            |
| **Use Case**        | Professional content  | Quick prototyping  |

---

## 🚀 Quick Implementation

### 1. Define Field

```typescript
const formConfig: FormConfig = {
  fields: [
    {
      name: "thumbnail",
      type: "imagepicker",
      label: "Product Thumbnail",
      required: true,
      galleryEndpoint: "/api/media/images",
    },
  ],
};
```

### 2. Create API Endpoint

```typescript
// app/api/media/images/route.ts
export async function GET(request: Request) {
  const images = await db.image.findMany({
    select: {
      id: true,
      url: true,
      thumbnail: true,
      width: true,
      height: true,
      format: true,
    },
  });

  return Response.json(images);
}
```

### 3. Use in Form

```typescript
<DynamicForm config={formConfig} onSubmit={handleSubmit} />
```

Done! 🎉

---

## 📈 Performance Tips

1. **Pagination** - Load gallery images in batches
2. **Lazy Loading** - Use intersection observer
3. **Image Optimization** - Serve thumbnails for gallery
4. **Caching** - Use React Query staleTime
5. **Debounce** - Debounce URL input validation

```typescript
// Example: Paginated gallery
{
  galleryEndpoint: '/api/media/images?page=1&limit=20',
  galleryQueryKey: ['images', { page: 1 }],
}
```

---

## 🎨 Customization Examples

### Custom Preview Size

```typescript
{
  showPreview: true,
  previewSize: 'lg', // sm | md | lg
  className: 'aspect-square', // Custom aspect ratio
}
```

### Category Filtering

```typescript
{
  galleryFilters: {
    category: 'products',
    tags: ['featured', 'new'],
    minWidth: 800,
  },
}
```

### With Callbacks

```typescript
{
  onImageSelect: (image) => {
    analytics.track('image_selected', { source: image.source });
  },
  onImageRemove: (image) => {
    console.log('Removed:', image.url);
  },
}
```

---

**Full Documentation:** [Image Picker Field Guide →](./11-imagepicker-field.md)
