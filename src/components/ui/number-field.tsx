// Simple number field UI component for dynamic form
"use client";
import * as React from "react";
import { Input } from "./input";

export interface NumberFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export function NumberField({ label, error, ...props }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input type="number" {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
