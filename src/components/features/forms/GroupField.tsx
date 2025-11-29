"use client";

import React from "react";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";
import { DynamicField } from "./DynamicField";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";

export function GroupField({ field }: { field: FieldConfig }) {
  return (
    <Card className={field.customUI?.itemClassName ?? "mb-4"}>
      <CardHeader>
        {field.label && (
          <CardTitle className="font-semibold">{field.label}</CardTitle>
        )}
        {field.customUI?.actions ? (
          <CardAction>
            {typeof field.customUI.actions === "function"
              ? (field.customUI.actions() as React.ReactNode)
              : (field.customUI.actions as React.ReactNode)}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {field.fields?.map((subField) => (
          <DynamicField
            key={subField.name}
            parentName={field.name}
            field={subField}
          />
        ))}
      </CardContent>
    </Card>
  );
}
