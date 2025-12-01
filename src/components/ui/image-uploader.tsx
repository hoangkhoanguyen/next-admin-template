"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

export interface ImageUploaderProps {
  value?: File | File[] | null;
  onChange?: (file: File | File[] | null) => void;
  label?: string;
  className?: string;
  isMulti?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Chọn ảnh",
  className,
  isMulti = false,
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (value) {
      const files = Array.isArray(value) ? value : value ? [value] : [];
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (isMulti) {
      const fileArr = files ? Array.from(files) : [];
      onChange?.(fileArr.length ? fileArr : null);
    } else {
      const file = files?.[0] || null;
      onChange?.(file);
    }
  };

  const handleRemove = (idx?: number) => {
    if (isMulti && Array.isArray(value)) {
      const newFiles = value.slice();
      if (typeof idx === "number") newFiles.splice(idx, 1);
      onChange?.(newFiles.length ? newFiles : null);
    } else {
      onChange?.(null);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card
      className={"flex flex-col items-center gap-2 p-4 " + (className || "")}
    >
      {previews.length > 0 ? (
        <div className="flex gap-2 flex-wrap justify-center">
          {previews.map((preview, idx) => (
            <div key={preview} className="relative w-32 h-32">
              <Image
                src={preview}
                alt={`Preview ${idx + 1}`}
                fill
                className="object-cover rounded-md border"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1"
                onClick={() => handleRemove(idx)}
                type="button"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-32 h-32 border rounded-md bg-muted">
          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground">Chưa có ảnh</span>
        </div>
      )}
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        title={label}
        aria-label={label}
        placeholder={label}
        multiple={isMulti}
      />
    </Card>
  );
}
