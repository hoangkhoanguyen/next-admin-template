"use client";

import * as React from "react";
import Image from "next/image";
import { GripVertical, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface ImageItem {
  id?: string;
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any; // Allow additional properties
}

interface SortableImageItemProps {
  image: ImageItem;
  isSelected?: boolean;
  onSelect?: (image: ImageItem) => void;
  onRemove?: (image: ImageItem) => void;
  showRemove?: boolean;
  showSelection?: boolean;
  badge?: string | React.ReactNode;
  size?: "sm" | "md" | "lg";
}

function SortableImageItem({
  image,
  isSelected = false,
  onSelect,
  onRemove,
  showRemove = false,
  showSelection = false,
  badge,
  size = "md",
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.url });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-grab active:cursor-grabbing",
        isSelected && showSelection
          ? "border-primary ring-2 ring-primary"
          : "border-transparent hover:border-muted-foreground"
      )}
    >
      {/* Drag Handle (visual only) */}
      <div className="absolute top-1 left-1 z-10 bg-black/70 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className={sizeClasses[size]} />
      </div>

      {/* Image */}
      <button
        type="button"
        onClick={() => onSelect?.(image)}
        className="w-full h-full relative"
        disabled={!onSelect}
        aria-label={image.alt || "Image"}
      >
        <Image
          src={image.thumbnail || image.url}
          alt={image.alt || "Image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />
      </button>

      {/* Selected indicator */}
      {showSelection && isSelected && (
        <Badge
          variant="default"
          className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center z-10"
        >
          <Check className="h-3 w-3" />
        </Badge>
      )}

      {/* Remove button */}
      {showRemove && onRemove && (
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Badge */}
      {badge && (
        <Badge
          variant="secondary"
          className="absolute bottom-1 left-1 text-xs"
        >
          {badge}
        </Badge>
      )}
    </div>
  );
}

export interface SortableImageListProps {
  images: ImageItem[];
  onReorder?: (images: ImageItem[]) => void;
  onRemove?: (image: ImageItem) => void;
  onSelect?: (image: ImageItem) => void;
  selectedImages?: ImageItem[];
  showRemove?: boolean;
  showSelection?: boolean;
  showSaveButton?: boolean;
  saveButtonText?: string;
  onSave?: (images: ImageItem[]) => void;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  size?: "sm" | "md" | "lg";
  badge?: (image: ImageItem) => string | React.ReactNode;
  emptyText?: string;
  title?: string;
  description?: string;
}

export function SortableImageList({
  images: initialImages,
  onReorder,
  onRemove,
  onSelect,
  selectedImages = [],
  showRemove = false,
  showSelection = false,
  showSaveButton = false,
  saveButtonText = "Save Order",
  onSave,
  columns = {
    default: 3,
    md: 4,
    lg: 5,
  },
  size = "md",
  badge,
  emptyText = "No images",
  title,
  description,
}: SortableImageListProps) {
  const [images, setImages] = React.useState<ImageItem[]>(initialImages);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Sync with external changes
  React.useEffect(() => {
    setImages(initialImages);
    setHasChanges(false);
  }, [initialImages]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImages((items) => {
      const oldIndex = items.findIndex((item) => item.url === active.id);
      const newIndex = items.findIndex((item) => item.url === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      // Call onReorder callback immediately if no save button
      if (!showSaveButton && onReorder) {
        onReorder(newOrder);
      }

      return newOrder;
    });

    if (showSaveButton) {
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(images);
    }
    if (onReorder) {
      onReorder(images);
    }
    setHasChanges(false);
  };

  const handleCancel = () => {
    setImages(initialImages);
    setHasChanges(false);
  };

  const gridColsClasses = cn(
    `grid gap-2`,
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  );

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Image Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.url)}
          strategy={rectSortingStrategy}
        >
          <div className={gridColsClasses}>
            {images.map((image) => {
              const isSelected = selectedImages.some(
                (img) => img.url === image.url
              );
              return (
                <SortableImageItem
                  key={image.url}
                  image={image}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  showRemove={showRemove}
                  showSelection={showSelection}
                  badge={badge?.(image)}
                  size={size}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Save/Cancel Buttons */}
      {showSaveButton && hasChanges && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            {saveButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
