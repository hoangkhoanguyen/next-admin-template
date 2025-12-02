"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useImagePickerDialog } from "./ImagePickerDialogContext";
import { mockImages } from "@/mock/images";

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

export function ImagePickerDialog() {
  const { state, closeModal } = useImagePickerDialog();
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"gallery" | "url">("gallery");
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]); // Danh sách ảnh đã upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Dropzone setup
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      // Validate file types
      const validFiles = acceptedFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} không phải là file ảnh`);
          return false;
        }
        return true;
      });
      if (validFiles.length === 0) return;
      const newImages: ImageData[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        source: "upload" as const,
        alt: file.name,
      }));
      setUploadedImages([...newImages, ...uploadedImages]);
      toast.success(`Đã upload ${validFiles.length} ảnh. Click để chọn.`);
    },
    [uploadedImages]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Use mock images instead of API
  const galleryImages = mockImages;
  const isLoading = false;

  const isMultiple = state.multiple || false;
  const maxImages = state.maxImages;

  // Handle image selection from gallery
  const handleGallerySelect = (image: ImageData) => {
    const imageWithSource = {
      ...image,
      source: image.source || ("gallery" as const),
    };

    if (isMultiple) {
      // Multiple selection mode
      const exists = selectedImages.some((img) => img.url === image.url);
      if (exists) {
        // Deselect
        setSelectedImages(
          selectedImages.filter((img) => img.url !== image.url)
        );
      } else {
        // Select - check max limit
        if (maxImages && selectedImages.length >= maxImages) {
          toast.error(`Tối đa ${maxImages} ảnh`);
          return;
        }
        setSelectedImages([...selectedImages, imageWithSource]);
      }
    } else {
      // Single selection mode - just select, don't close
      setSelectedImages([imageWithSource]);
    }
  };

  // Confirm selection for both single and multiple mode
  const handleConfirmSelection = () => {
    if (selectedImages.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }

    if (state.onSelect) {
      state.onSelect(isMultiple ? selectedImages : selectedImages[0]);
    }
    closeModal();
    // Don't clear immediately - let useEffect handle cleanup when modal closes
  };

  // Handle URL paste
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    // Validate URL
    try {
      new URL(urlInput);
    } catch {
      toast.error("Invalid URL format");
      return;
    }

    const image: ImageData = {
      url: urlInput,
      source: "url",
    };

    if (isMultiple) {
      // Multiple mode - add to selection
      if (maxImages && selectedImages.length >= maxImages) {
        toast.error(`Tối đa ${maxImages} ảnh`);
        return;
      }
      setSelectedImages([...selectedImages, image]);
      setUrlInput("");
      toast.success("Đã thêm ảnh từ URL");
    } else {
      // Single mode - return immediately
      if (state.onSelect) {
        state.onSelect(image);
      }
      setUrlInput("");
      closeModal();
      setSelectedImages([]);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Validate file types
    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert files to ImageData và thêm vào đầu danh sách uploaded
    const newImages: ImageData[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      source: "upload" as const,
      alt: file.name,
    }));

    // Thêm vào ĐẦU danh sách uploaded (KHÔNG tự động chọn)
    setUploadedImages([...newImages, ...uploadedImages]);
    toast.success(`Đã upload ${validFiles.length} ảnh. Click để chọn.`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle selection from uploaded images (giống như gallery)
  const handleUploadedImageSelect = (image: ImageData) => {
    const imageWithSource = { ...image, source: "upload" as const };

    // Cả single và multiple đều xử lý như nhau
    const exists = selectedImages.some((img) => img.url === image.url);
    if (exists) {
      // Deselect
      setSelectedImages(selectedImages.filter((img) => img.url !== image.url));
    } else {
      // Select - check max limit
      if (isMultiple) {
        if (maxImages && selectedImages.length >= maxImages) {
          toast.error(`Tối đa ${maxImages} ảnh`);
          return;
        }
        setSelectedImages([...selectedImages, imageWithSource]);
      } else {
        // Single mode - replace selection
        setSelectedImages([imageWithSource]);
      }
    }
  };

  // Remove uploaded image from the list
  const handleRemoveUpload = (url: string) => {
    // Xóa khỏi danh sách uploaded
    setUploadedImages(uploadedImages.filter((img) => img.url !== url));
    // Xóa khỏi selected nếu đã được chọn
    setSelectedImages(selectedImages.filter((img) => img.url !== url));
    // Cleanup URL
    URL.revokeObjectURL(url);
    toast.success("Đã xóa ảnh");
  };

  // Reset state when modal closes
  React.useEffect(() => {
    if (!state.open) {
      // Cleanup uploaded image URLs before resetting
      uploadedImages.forEach((img) => {
        if (img.source === "upload") {
          URL.revokeObjectURL(img.url);
        }
      });

      // Reset states
      setUrlInput("");
      setSelectedImages([]);
      setActiveTab("gallery");
      setUploadedImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.open]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      uploadedImages.forEach((img) => {
        if (img.source === "upload") {
          URL.revokeObjectURL(img.url);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={state.open} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
          <DialogDescription>
            Choose an image from the gallery or paste an image URL
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid w-full grid-cols-2 gap-2 mb-4">
            <Button
              type="button"
              variant={activeTab === "gallery" ? "default" : "outline"}
              onClick={() => setActiveTab("gallery")}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Gallery
            </Button>
            <Button
              type="button"
              variant={activeTab === "url" ? "default" : "outline"}
              onClick={() => setActiveTab("url")}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              URL
            </Button>
          </div>

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Upload Box - Drag & Drop */}
              <div className="mb-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer bg-muted/50",
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm font-medium">
                    {isDragActive
                      ? "Thả file ảnh vào đây..."
                      : "Kéo thả hoặc click để upload ảnh từ máy tính"}
                  </span>
                </div>
                {/* Fallback: vẫn giữ input hidden để click upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  aria-label="Upload images"
                />
              </div>

              {/* Image List */}
              <div className="flex-1 overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">
                      Loading gallery...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {/* Uploaded images first */}
                    {uploadedImages.map((image, idx) => {
                      const isSelected = selectedImages.some(
                        (img) => img.url === image.url
                      );
                      return (
                        <button
                          key={`uploaded-${idx}`}
                          type="button"
                          onClick={() => handleUploadedImageSelect(image)}
                          className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                            isSelected
                              ? "border-primary ring-2 ring-primary"
                              : "border-transparent hover:border-muted-foreground"
                          )}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt || "Uploaded image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            unoptimized
                          />

                          {/* Selected indicator */}
                          {isSelected && (
                            <Badge
                              variant="default"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                            >
                              <Check className="h-3 w-3" />
                            </Badge>
                          )}

                          {/* Remove button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 left-1 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUpload(image.url);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>

                          {/* Upload badge */}
                          <Badge
                            variant="secondary"
                            className="absolute bottom-1 left-1 text-xs bg-blue-500 text-white"
                          >
                            Uploaded
                          </Badge>
                        </button>
                      );
                    })}

                    {/* Gallery images */}
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
                          <Image
                            src={image.thumbnail || image.url}
                            alt={image.alt || "Gallery image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            unoptimized
                          />

                          {/* Selected indicator */}
                          {isSelected && (
                            <Badge
                              variant="default"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                            >
                              <Check className="h-3 w-3" />
                            </Badge>
                          )}

                          {/* Image dimensions */}
                          {image.width && image.height && (
                            <Badge
                              variant="secondary"
                              className="absolute bottom-1 left-1 right-1 text-xs text-center bg-black/70 text-white"
                            >
                              {image.width} × {image.height}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  />
                  <Button type="button" onClick={handleUrlSubmit}>
                    Add
                  </Button>
                </div>

                {/* URL Preview */}
                {urlInput && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={urlInput}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                      unoptimized
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
            </div>
          )}
        </div>

        {/* Footer - Show for both single and multiple when images are selected */}
        {selectedImages.length > 0 && (
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Đã chọn:{" "}
              <span className="font-semibold">{selectedImages.length}</span>
              {isMultiple && maxImages && ` / ${maxImages}`} ảnh
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedImages([])}
              >
                Bỏ chọn
              </Button>
              <Button type="button" onClick={handleConfirmSelection}>
                Xác nhận{isMultiple && ` (${selectedImages.length})`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
