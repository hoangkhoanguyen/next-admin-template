"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import Image from "next/image";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  Button,
  Card,
  Badge,
} from "@/components/ui";

import { Image as ImageIcon, X } from "lucide-react";
import { useImagePickerDialog } from "@/components/shared/ImagePickerDialogContext";

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

export function ImagePickerField({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const { openModal } = useImagePickerDialog();

  const isMultiple = field.multiple || false;

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => {
          const value = controllerField.value;
          const selectedImages: ImageData[] = isMultiple
            ? Array.isArray(value)
              ? value
              : []
            : value
            ? [value]
            : [];

          const handleSelectImage = () => {
            openModal({
              fieldId: field.name,
              onSelect: (images: ImageData | ImageData[]) => {
                // Nếu field có custom onSelect handler
                if (field.onImageSelect) {
                  const result = field.onImageSelect(images, selectedImages);
                  controllerField.onChange(result);
                } else {
                  // Default behavior
                  if (isMultiple && Array.isArray(images)) {
                    // Multi mode: merge with existing images (avoid duplicates)
                    const existingImages = selectedImages;
                    const newImages = images.filter(
                      (newImg) =>
                        !existingImages.some(
                          (existing) => existing.url === newImg.url
                        )
                    );
                    controllerField.onChange([...existingImages, ...newImages]);
                  } else {
                    // Single mode: replace
                    controllerField.onChange(images);
                  }
                }
              },
              multiple: isMultiple,
              maxImages: field.maxImages,
              currentImagesCount: selectedImages.length,
            });
          };

          const handleRemoveImage = (imageToRemove: ImageData) => {
            if (isMultiple) {
              const newImages = selectedImages.filter(
                (img) => img.url !== imageToRemove.url
              );
              controllerField.onChange(newImages.length > 0 ? newImages : null);
            } else {
              controllerField.onChange(null);
            }
          };

          return (
            <>
              <div className="space-y-2">
                {/* Selected Images Preview */}
                {selectedImages.length > 0 && field.showPreview !== false && (
                  <div
                    className={`grid gap-2 ${
                      isMultiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                    }`}
                  >
                    {selectedImages.map((image, index) => (
                      <Card
                        key={image.url + index}
                        className="relative group p-0 overflow-hidden"
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={image.thumbnail || image.url}
                            alt={image.alt || `Selected image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes={
                              isMultiple
                                ? "(max-width: 768px) 50vw, 33vw"
                                : "(max-width: 768px) 100vw, 448px"
                            }
                            unoptimized
                          />

                          {/* Remove button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemoveImage(image)}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          {/* Image info */}
                          {field.showImageInfo && (
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent">
                              <div className="flex gap-1 flex-wrap">
                                {image.width && image.height && (
                                  <Badge
                                    variant="secondary"
                                    className="text-white bg-black/50 text-xs"
                                  >
                                    {image.width} × {image.height}
                                  </Badge>
                                )}
                                {image.size && (
                                  <Badge
                                    variant="secondary"
                                    className="text-white bg-black/50 text-xs"
                                  >
                                    {(image.size / 1024).toFixed(1)} KB
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Select Image Button */}
                {(!isMultiple ||
                  !field.maxImages ||
                  selectedImages.length < field.maxImages) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-md"
                    onClick={handleSelectImage}
                    disabled={field.disabled}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {selectedImages.length > 0
                      ? isMultiple
                        ? `Thêm ảnh (${selectedImages.length}${
                            field.maxImages ? `/${field.maxImages}` : ""
                          })`
                        : "Đổi ảnh"
                      : field.placeholder || "Chọn ảnh"}
                  </Button>
                )}
              </div>

              <FieldError
                errors={
                  fieldState.error?.message
                    ? [{ message: String(fieldState.error.message) }]
                    : undefined
                }
              />
              {field.description && (
                <FieldDescription>{field.description}</FieldDescription>
              )}
            </>
          );
        }}
      />
    </Field>
  );
}
