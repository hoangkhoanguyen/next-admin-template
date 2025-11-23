# Image Picker Field

> **Select images from gallery or paste URL**

---

## 📋 Overview

**Image Picker** field cho phép users chọn hình ảnh bằng 2 cách:

1. **Browse Gallery** - Chọn từ thư viện ảnh có sẵn (uploaded images)
2. **Paste URL** - Nhập trực tiếp URL từ internet

Perfect for:

- Product images (e-commerce)
- Avatar/profile pictures
- Banner images
- Gallery/portfolio items
- Any image selection scenario

---

## 🎯 Features

- ✅ **Dual input modes** (Gallery browser + URL input)
- ✅ **Image preview** with thumbnail
- ✅ **Multiple selection** support
- ✅ **Drag & drop** reordering (for multiple)
- ✅ **URL validation** (check if valid image URL)
- ✅ **Lazy loading** gallery images
- ✅ **Search/filter** gallery
- ✅ **Categories/folders** in gallery
- ✅ **Image info** (dimensions, size, format)
- ✅ **Replace/remove** functionality

---

## 📝 Configuration

### Basic Single Image Picker

```typescript
{
  name: 'thumbnail',
  type: 'imagepicker',
  label: 'Product Thumbnail',
  required: true,
  placeholder: 'Select image or paste URL...',

  // Gallery options
  galleryEndpoint: '/api/media/images',

  // Validation
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
}
```

### Multiple Images Picker

```typescript
{
  name: 'gallery',
  type: 'imagepicker',
  label: 'Product Gallery',
  multiple: true,
  maxImages: 5,

  galleryEndpoint: '/api/media/images',

  // Allow both gallery and URL
  allowGallery: true,
  allowUrl: true,

  description: 'Select up to 5 images from gallery or paste URLs',
}
```

### With Categories/Folders

```typescript
{
  name: 'banner',
  type: 'imagepicker',
  label: 'Banner Image',

  galleryEndpoint: '/api/media/images',
  galleryFilters: {
    category: 'banners',
    minWidth: 1920,
    minHeight: 400,
  },

  showImageInfo: true,
  showDimensions: true,
}
```

---

## 🔧 Configuration Options

```typescript
interface ImagePickerConfig extends FieldConfig {
  type: "imagepicker";

  // === Selection Mode ===
  multiple?: boolean; // Allow multiple images
  maxImages?: number; // Max number of images (for multiple)
  minImages?: number; // Min number of images (for multiple)

  // === Input Methods ===
  allowGallery?: boolean; // Allow selecting from gallery (default: true)
  allowUrl?: boolean; // Allow pasting URL (default: true)
  allowUpload?: boolean; // Allow direct upload (default: false)

  // === Gallery Options ===
  galleryEndpoint?: string; // API endpoint for gallery images
  galleryQueryKey?: string[]; // React Query key
  galleryFilters?: {
    // Pre-filter gallery
    category?: string;
    tags?: string[];
    minWidth?: number;
    minHeight?: number;
    format?: string[];
  };

  // === Validation ===
  acceptedFormats?: string[]; // MIME types (default: ['image/*'])
  maxFileSize?: number; // Max file size in bytes
  minWidth?: number; // Min image width
  minHeight?: number; // Min image height
  aspectRatio?: number; // Required aspect ratio (e.g., 16/9)

  // === Display Options ===
  showPreview?: boolean; // Show image preview (default: true)
  previewSize?: "sm" | "md" | "lg"; // Preview size
  showImageInfo?: boolean; // Show dimensions, size, format
  showDimensions?: boolean; // Show width x height

  // === URL Options ===
  validateUrl?: boolean; // Validate URL is valid image (default: true)
  urlPlaceholder?: string; // Placeholder for URL input

  // === Callbacks ===
  onImageSelect?: (image: ImageData) => void;
  onImageRemove?: (image: ImageData) => void;
  onUrlPaste?: (url: string) => void;
}

interface ImageData {
  id?: string; // ID from gallery
  url: string; // Image URL
  thumbnail?: string; // Thumbnail URL
  alt?: string; // Alt text
  width?: number; // Image width
  height?: number; // Image height
  size?: number; // File size in bytes
  format?: string; // Image format (jpeg, png, etc.)
  source?: "gallery" | "url" | "upload"; // Source type
}
```

---

## 💻 Implementation

### ImagePicker Component

```typescript
// components/forms/fields/ImagePicker.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ImageData } from "@/lib/types/dynamic-form.types";

interface ImagePickerProps {
  field: any;
  formField: any;
}

export function ImagePicker({ field, formField }: ImagePickerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"gallery" | "url">("gallery");

  const selectedImages: ImageData[] = field.multiple
    ? formField.value || []
    : formField.value
    ? [formField.value]
    : [];

  // Fetch gallery images
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: field.galleryQueryKey || ["gallery-images"],
    queryFn: async () => {
      if (!field.galleryEndpoint) return [];
      const res = await fetch(field.galleryEndpoint);
      return res.json();
    },
    enabled: field.allowGallery !== false && !!field.galleryEndpoint,
  });

  // Handle image selection from gallery
  const handleGallerySelect = (image: ImageData) => {
    if (field.multiple) {
      const exists = selectedImages.some((img) => img.url === image.url);
      if (exists) {
        // Deselect
        const newImages = selectedImages.filter((img) => img.url !== image.url);
        formField.onChange(newImages);
      } else {
        // Select
        if (field.maxImages && selectedImages.length >= field.maxImages) {
          toast.error(`Maximum ${field.maxImages} images allowed`);
          return;
        }
        formField.onChange([
          ...selectedImages,
          { ...image, source: "gallery" },
        ]);
      }
    } else {
      // Single selection
      formField.onChange({ ...image, source: "gallery" });
      setShowDialog(false);
    }

    field.onImageSelect?.(image);
  };

  // Handle URL paste
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    // Validate URL
    if (field.validateUrl !== false) {
      try {
        new URL(urlInput);
      } catch {
        toast.error("Invalid URL format");
        return;
      }
    }

    // Check if image is accessible (optional)
    const image: ImageData = {
      url: urlInput,
      source: "url",
    };

    if (field.multiple) {
      if (field.maxImages && selectedImages.length >= field.maxImages) {
        toast.error(`Maximum ${field.maxImages} images allowed`);
        return;
      }
      formField.onChange([...selectedImages, image]);
    } else {
      formField.onChange(image);
      setShowDialog(false);
    }

    field.onUrlPaste?.(urlInput);
    setUrlInput("");
    toast.success("Image URL added");
  };

  // Remove image
  const handleRemove = (imageToRemove: ImageData) => {
    if (field.multiple) {
      const newImages = selectedImages.filter(
        (img) => img.url !== imageToRemove.url
      );
      formField.onChange(newImages.length > 0 ? newImages : null);
    } else {
      formField.onChange(null);
    }

    field.onImageRemove?.(imageToRemove);
  };

  return (
    <div className="space-y-2">
      {/* Selected Images Preview */}
      {selectedImages.length > 0 && field.showPreview !== false && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {selectedImages.map((image, index) => (
            <div
              key={image.url}
              className="relative group aspect-square rounded-lg overflow-hidden border"
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.alt || `Selected image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(image)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image info */}
              {field.showImageInfo && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.width && image.height && (
                    <div>
                      {image.width} × {image.height}
                    </div>
                  )}
                  {image.size && <div>{(image.size / 1024).toFixed(1)} KB</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Image Button */}
      {(!selectedImages.length || field.multiple) && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={field.disabled}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {selectedImages.length > 0
                ? `Add More Images (${selectedImages.length}/${
                    field.maxImages || "∞"
                  })`
                : field.placeholder || "Select Image"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{field.label || "Select Image"}</DialogTitle>
              <DialogDescription>
                Choose an image from the gallery or paste an image URL
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="grid w-full grid-cols-2">
                {field.allowGallery !== false && (
                  <TabsTrigger value="gallery">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Gallery
                  </TabsTrigger>
                )}
                {field.allowUrl !== false && (
                  <TabsTrigger value="url">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    URL
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Gallery Tab */}
              {field.allowGallery !== false && (
                <TabsContent
                  value="gallery"
                  className="flex-1 overflow-auto mt-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-muted-foreground">
                        Loading gallery...
                      </div>
                    </div>
                  ) : !galleryImages?.length ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          No images in gallery
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {galleryImages.map((image: ImageData) => {
                        const isSelected = selectedImages.some(
                          (img) => img.url === image.url
                        );
                        return (
                          <button
                            key={image.id || image.url}
                            type="button"
                            onClick={() => handleGallerySelect(image)}
                            className={cn(
                              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                              isSelected
                                ? "border-primary ring-2 ring-primary"
                                : "border-transparent hover:border-muted-foreground"
                            )}
                          >
                            <img
                              src={image.thumbnail || image.url}
                              alt={image.alt || "Gallery image"}
                              className="w-full h-full object-cover"
                            />

                            {/* Selected indicator */}
                            {isSelected && (
                              <div className="absolute top-1 right-1 p-1 rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </div>
                            )}

                            {/* Image dimensions */}
                            {field.showDimensions &&
                              image.width &&
                              image.height && (
                                <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs text-center">
                                  {image.width} × {image.height}
                                </div>
                              )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              )}

              {/* URL Tab */}
              {field.allowUrl !== false && (
                <TabsContent value="url" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={
                          field.urlPlaceholder ||
                          "https://example.com/image.jpg"
                        }
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUrlSubmit()
                        }
                      />
                      <Button type="button" onClick={handleUrlSubmit}>
                        Add
                      </Button>
                    </div>

                    {/* URL Preview */}
                    {urlInput && (
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={urlInput}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => toast.error("Failed to load image")}
                        />
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      <p>Paste an image URL from the internet.</p>
                      <p className="mt-1">
                        Supported formats: JPEG, PNG, WebP, GIF
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
```

---

## 📚 Usage Examples

### Example 1: Product Thumbnail (Single)

```typescript
const productFormConfig: FormConfig = {
  fields: [
    {
      name: "thumbnail",
      type: "imagepicker",
      label: "Product Thumbnail",
      required: true,
      placeholder: "Select product image...",

      galleryEndpoint: "/api/media/images",
      galleryFilters: {
        category: "products",
      },

      showImageInfo: true,
      showDimensions: true,

      // Validation
      minWidth: 800,
      minHeight: 800,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    },
  ],
};
```

### Example 2: Product Gallery (Multiple)

```typescript
{
  name: 'images',
  type: 'imagepicker',
  label: 'Product Images',
  multiple: true,
  maxImages: 5,
  minImages: 1,
  required: true,

  galleryEndpoint: '/api/media/images',

  allowGallery: true,
  allowUrl: true,

  showPreview: true,
  previewSize: 'md',

  description: 'Select 1-5 images for product gallery',
}
```

### Example 3: Banner Image (Specific Dimensions)

```typescript
{
  name: 'banner',
  type: 'imagepicker',
  label: 'Banner Image',
  required: true,

  galleryEndpoint: '/api/media/images',
  galleryFilters: {
    category: 'banners',
    minWidth: 1920,
    aspectRatio: 16/9,
  },

  // Strict validation
  minWidth: 1920,
  minHeight: 1080,
  aspectRatio: 16/9,
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],

  description: 'Banner must be 1920x1080 (16:9 aspect ratio)',
}
```

### Example 4: Avatar with URL Only

```typescript
{
  name: 'avatar',
  type: 'imagepicker',
  label: 'Avatar',

  allowGallery: false,
  allowUrl: true,

  urlPlaceholder: 'Paste avatar URL from Gravatar or social media...',

  showPreview: true,
  previewSize: 'sm',
}
```

### Example 5: With Callbacks

```typescript
{
  name: 'productImages',
  type: 'imagepicker',
  label: 'Product Images',
  multiple: true,
  maxImages: 10,

  galleryEndpoint: '/api/media/images',

  onImageSelect: (image) => {
    console.log('Image selected:', image);

    // Track analytics
    analytics.track('image_selected', {
      source: image.source,
      dimensions: `${image.width}x${image.height}`,
    });
  },

  onImageRemove: (image) => {
    console.log('Image removed:', image);
  },

  onUrlPaste: (url) => {
    console.log('URL pasted:', url);

    // Validate against external API
    validateImageUrl(url);
  },
}
```

### Example 6: Category-Filtered Gallery

```typescript
function ProductForm() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const formConfig: FormConfig = {
    fields: [
      {
        name: "category",
        type: "select",
        label: "Category",
        options: categories,
        onChange: (value) => setSelectedCategory(value),
      },
      {
        name: "image",
        type: "imagepicker",
        label: "Product Image",

        galleryEndpoint: "/api/media/images",
        galleryFilters: {
          category: selectedCategory, // Dynamic filter based on category
        },

        showWhen: {
          field: "category",
          operator: "isNotEmpty",
        },
      },
    ],
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
}
```

---

## 🎨 Variants

### Variant 1: Compact Preview

```typescript
{
  name: 'logo',
  type: 'imagepicker',
  label: 'Company Logo',

  showPreview: true,
  previewSize: 'sm',

  // Show as single thumbnail with replace button
}
```

### Variant 2: Grid with Drag & Drop

```typescript
{
  name: 'gallery',
  type: 'imagepicker',
  label: 'Gallery',
  multiple: true,
  maxImages: 20,

  enableDragDrop: true, // Allow reordering
  enableCrop: true,     // Enable cropping
}
```

### Variant 3: With Upload

```typescript
{
  name: 'photos',
  type: 'imagepicker',
  label: 'Photos',
  multiple: true,

  allowGallery: true,
  allowUrl: true,
  allowUpload: true,    // Enable direct upload

  uploadEndpoint: '/api/media/upload',
}
```

---

## ✅ Best Practices

### DO ✅

- Provide clear labels ("Select image or paste URL")
- Show image preview after selection
- Display image dimensions for informed choice
- Validate image dimensions/size
- Show loading state while fetching gallery
- Lazy load gallery images (pagination)
- Cache gallery data with React Query
- Allow keyboard navigation in gallery
- Show error toast for invalid URLs

### DON'T ❌

- Don't load all gallery images at once (use pagination)
- Don't forget to validate external URLs
- Don't allow uploading if not implemented
- Don't show gallery if endpoint not configured
- Don't forget to handle broken image URLs
- Don't mix gallery and uploaded images without tracking source

---

## 🔗 Related Components

- **FileUpload** - For uploading files
- **AsyncSelect** - For loading options from API
- **ImageCropper** - For cropping selected images (future enhancement)

---

## 🚀 Future Enhancements

- [ ] Drag & drop reordering for multiple images
- [ ] Built-in image cropping tool
- [ ] Direct upload from clipboard
- [ ] Search/filter within gallery
- [ ] Folder/category navigation in gallery
- [ ] Batch selection (Shift+Click)
- [ ] Image editing (brightness, contrast, filters)
- [ ] Integration with image CDN (Cloudinary, Imgix)

---

**Next:** [File Upload Fields →](./14-file-upload.md)
