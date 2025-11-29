"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "./button";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  toggleAriaLabel?: string;
  wrapperClassName?: string;
}

export function PasswordInput({
  className,
  wrapperClassName,
  toggleAriaLabel = "Toggle password visibility",
  ...props
}: PasswordInputProps) {
  const [show, setShow] = React.useState(false);
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <Button
        type="button"
        size={"icon-sm"}
        variant="ghost"
        tabIndex={-1}
        aria-label={toggleAriaLabel}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        onClick={() => setShow((v) => !v)}
      >
        {show ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  );
}
