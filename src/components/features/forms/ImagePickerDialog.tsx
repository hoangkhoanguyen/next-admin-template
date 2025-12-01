"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Link as LinkIcon, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Use mock images instead of API
  const galleryImages = mockImages;
  const isLoading = false;

  const isMultiple = state.multiple || false;
  const maxImages = state.maxImages;

  // Handle image selection from gallery
  const handleGallerySelect = (image: ImageData) => {
    const imageWithSource = { ...image, source: "gallery" as const };

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
      // Single selection mode - close immediately
      if (state.onSelect) {
        state.onSelect(imageWithSource);
      }
      closeModal();
      setSelectedImages([]);
    }
  };

  // Confirm selection for multiple mode
  const handleConfirmSelection = () => {
    if (state.onSelect) {
      state.onSelect(selectedImages);
    }
    closeModal();
    setSelectedImages([]);
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

  // Reset state when modal closes
  React.useEffect(() => {
    if (!state.open) {
      setUrlInput("");
      setSelectedImages([]);
      setActiveTab("gallery");
    }
  }, [state.open]);

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
            <div className="flex-1 overflow-auto mt-4">
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

        {/* Footer for multiple selection mode */}
        {isMultiple && selectedImages.length > 0 && (
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Đã chọn:{" "}
              <span className="font-semibold">{selectedImages.length}</span>
              {maxImages && ` / ${maxImages}`} ảnh
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedImages([])}
              >
                Xóa hết
              </Button>
              <Button type="button" onClick={handleConfirmSelection}>
                Xác nhận ({selectedImages.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
