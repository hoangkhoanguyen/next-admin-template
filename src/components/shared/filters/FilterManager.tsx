"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Badge,
} from "@/components/ui";
import { X, Filter } from "lucide-react";

export interface FilterItem {
  key: string;
  label: string;
  value: string | number | boolean;
  displayValue?: string; // Custom display text
}

interface FilterManagerProps {
  onApply?: () => void; // Callback when apply filters
  children: ReactNode | ((onClose: () => void) => ReactNode); // Filter form content
  triggerButton?: ReactNode; // Custom trigger button
}

export function FilterManager({
  onApply,
  children,
  triggerButton,
}: FilterManagerProps) {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerButton || (
            <Button size="icon" variant="outline" aria-label="Filter">
              <Filter className="w-5 h-5" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bộ lọc</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {typeof children === "function" ? children(handleApply) : children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Separate component for displaying active filters
export function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: {
  filters: FilterItem[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-sm text-muted-foreground">Bộ lọc:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.displayValue || String(filter.value)}</span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs"
      >
        Xóa tất cả
      </Button>
    </div>
  );
}
