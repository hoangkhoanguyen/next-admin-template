"use client";

import { useState } from "react";
import { useImagePickerDialog } from "@/components/shared/image/ImagePickerDialogContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

interface ImageData {
  url: string;
  alt?: string;
  source?: "gallery" | "url" | "upload";
}

/**
 * Example: Standalone Avatar Picker
 * Demonstrates using ImagePicker outside of DynamicForm
 */
export function StandaloneAvatarPicker() {
  const { openModal } = useImagePickerDialog();
  const [avatar, setAvatar] = useState<ImageData | null>(null);

  const handlePickAvatar = () => {
    openModal({
      multiple: false,
      onSelect: (image: ImageData) => {
        setAvatar(image);
        console.log("Selected avatar:", image);
      },
    });
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  return (
    <Card className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Profile Avatar</h3>

      <div className="flex items-center gap-4">
        {/* Avatar Preview */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0">
          {avatar ? (
            <>
              <Image
                src={avatar.url}
                alt={avatar.alt || "Avatar"}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={handleRemoveAvatar}
                className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label="Remove avatar"
                title="Remove avatar"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={handlePickAvatar} variant="outline">
            {avatar ? "Change Avatar" : "Select Avatar"}
          </Button>
          {avatar && (
            <p className="text-xs text-muted-foreground">
              Source: {avatar.source || "gallery"}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Example: Standalone Gallery Manager
 * Demonstrates multi-image selection outside of DynamicForm
 */
export function StandaloneGalleryManager() {
  const { openModal } = useImagePickerDialog();
  const [images, setImages] = useState<ImageData[]>([]);

  const handleAddImages = () => {
    openModal({
      multiple: true,
      maxImages: 8,
      currentImagesCount: images.length,
      onSelect: (newImages: ImageData[]) => {
        // Merge with existing, avoid duplicates
        const merged = [...images];
        newImages.forEach((newImg) => {
          if (!merged.some((img) => img.url === newImg.url)) {
            merged.push(newImg);
          }
        });
        setImages(merged);
        console.log("Total images:", merged.length);
      },
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setImages([]);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Product Gallery ({images.length}/8)
        </h3>
        <div className="flex gap-2">
          {images.length > 0 && (
            <Button onClick={handleClearAll} variant="outline" size="sm">
              Clear All
            </Button>
          )}
          <Button
            onClick={handleAddImages}
            disabled={images.length >= 8}
            size="sm"
          >
            Add Images
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No images yet</p>
          <Button onClick={handleAddImages}>Select Images</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square group rounded-lg overflow-hidden border"
            >
              <Image
                src={image.url}
                alt={image.alt || `Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove image ${index + 1}`}
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {image.source || "gallery"}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/**
 * Example: Combined Usage
 * Shows multiple independent pickers in one component
 */
export function StandaloneCombinedExample() {
  const { openModal } = useImagePickerDialog();
  const [logo, setLogo] = useState<ImageData | null>(null);
  const [coverImage, setCoverImage] = useState<ImageData | null>(null);

  return (
    <div className="space-y-6">
      {/* Logo Picker */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted border">
            {logo ? (
              <Image
                src={logo.url}
                alt="Logo"
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Button
              onClick={() =>
                openModal({
                  multiple: false,
                  onSelect: setLogo,
                })
              }
              variant="outline"
            >
              {logo ? "Change Logo" : "Select Logo"}
            </Button>
            {logo && (
              <Button onClick={() => setLogo(null)} variant="ghost" size="sm">
                Remove
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Cover Image Picker */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
        {coverImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image
                src={coverImage.url}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  openModal({
                    multiple: false,
                    onSelect: setCoverImage,
                  })
                }
                variant="outline"
              >
                Change Cover
              </Button>
              <Button onClick={() => setCoverImage(null)} variant="destructive">
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No cover image</p>
            <Button
              onClick={() =>
                openModal({
                  multiple: false,
                  onSelect: setCoverImage,
                })
              }
            >
              Select Cover Image
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
