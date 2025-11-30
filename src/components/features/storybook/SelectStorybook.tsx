"use client";

import { SelectOption } from "@/components/ui/select-advanced";
import { SelectSingle } from "@/components/ui/select-single";
import { SelectMulti } from "@/components/ui/select-multi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export function SelectStorybook() {
  const [mockOptions, setMockOptions] = useState<SelectOption[]>([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Date", value: "date" },
    { label: "Elderberry", value: "elderberry" },
    { label: "Fig", value: "fig" },
    { label: "Grape", value: "grape" },
  ]);

  const [singleValue, setSingleValue] = useState<SelectOption | null>(null);
  const [multiValue, setMultiValue] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SelectAdvanced Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-6">
          <div>
            <div className="mb-2 font-medium">Single Select</div>
            <SelectSingle
              options={mockOptions}
              isCreatable={true}
              isSearchable={true}
              placeholder="Chọn một trái cây..."
              value={singleValue}
              onChange={setSingleValue}
            />
            {singleValue && (
              <div className="mt-2 text-sm text-muted-foreground">
                Đã chọn:{" "}
                <span className="font-medium">{singleValue.label}</span>
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 font-medium">Multi Select</div>
            <SelectMulti
              options={mockOptions}
              value={multiValue}
              onChange={setMultiValue}
              onAddNewOption={(label) => {
                setMockOptions((prev) => [
                  ...prev,
                  { label, value: label.toLowerCase() },
                ]);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
