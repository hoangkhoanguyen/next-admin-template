"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon, FileIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

export interface FileUploaderProps {
  value?: File | File[] | null;
  onChange?: (file: File | File[] | null) => void;
  label?: string;
  className?: string;
  isMulti?: boolean;
  accept?: string;
}

export function FileUploader({
  value,
  onChange,
  label = "Chọn file",
  className,
  isMulti = false,
  accept = "*",
}: FileUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = React.useState<
    { url: string; name: string; type: string }[]
  >([]);

  React.useEffect(() => {
    if (value) {
      const files = Array.isArray(value) ? value : value ? [value] : [];
      const previewData = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      }));
      setPreviews(previewData);
      return () => previewData.forEach((p) => URL.revokeObjectURL(p.url));
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

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <Card
      className={"flex flex-col items-center gap-2 p-4 " + (className || "")}
    >
      {previews.length > 0 ? (
        <div className="flex gap-2 flex-wrap justify-center">
          {previews.map((preview, idx) => (
            <div key={preview.url} className="relative w-32 h-32">
              {isImage(preview.type) ? (
                <Image
                  src={preview.url}
                  alt={preview.name}
                  fill
                  className="object-cover rounded-md border"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full border rounded-md bg-muted p-2">
                  <FileIcon className="w-8 h-8 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground text-center truncate w-full px-1">
                    {preview.name}
                  </span>
                </div>
              )}
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
          {accept.includes("image") ? (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Chưa có ảnh</span>
            </>
          ) : (
            <>
              <FileIcon className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">
                Chưa có file
              </span>
            </>
          )}
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
        accept={accept}
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

// Backward compatibility: Export as ImageUploader
export { FileUploader as ImageUploader };
export type { FileUploaderProps as ImageUploaderProps };
