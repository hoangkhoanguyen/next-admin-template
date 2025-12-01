"use client";
import * as React from "react";
import { ImageUploader } from "@/components/ui";

export default function ImageUploaderDemo() {
  const [singleFile, setSingleFile] = React.useState<File | File[] | null>(
    null
  );
  const [multiFiles, setMultiFiles] = React.useState<File | File[] | null>(
    null
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Single Image Upload</h3>
        <ImageUploader
          value={singleFile}
          onChange={setSingleFile}
          label="Chọn ảnh"
          isMulti={false}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Multiple Images Upload</h3>
        <ImageUploader
          value={multiFiles}
          onChange={setMultiFiles}
          label="Chọn nhiều ảnh"
          isMulti={true}
        />
      </div>
    </div>
  );
}
