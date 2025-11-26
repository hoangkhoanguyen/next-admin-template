"use client";
import * as React from "react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface SearchInputProps
  extends React.ComponentProps<typeof InputGroupInput> {
  iconPosition?: "start" | "end";
  wrapperClassName?: string;
}

export function SearchInput({
  className,
  wrapperClassName,
  iconPosition = "end",
  ...props
}: SearchInputProps) {
  const iconAddon = (
    <InputGroupAddon
      align={iconPosition === "start" ? "inline-start" : "inline-end"}
    >
      <Search className="size-4 text-muted-foreground" />
    </InputGroupAddon>
  );

  return (
    <InputGroup className={wrapperClassName}>
      {iconPosition === "start" && iconAddon}
      <InputGroupInput type="search" {...props} />
      {iconPosition === "end" && iconAddon}
    </InputGroup>
  );
}
