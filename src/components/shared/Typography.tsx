import React, { HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function H1({ className, children, ...props }: TypographyProps) {
  return (
    <h1
      className={`text-4xl font-extrabold tracking-tight ${className ?? ""}`}
      {...props}
    >
      {children}
    </h1>
  );
}
export function H2({ className, children, ...props }: TypographyProps) {
  return (
    <h2
      className={`text-3xl font-semibold tracking-tight ${className ?? ""}`}
      {...props}
    >
      {children}
    </h2>
  );
}
export function Text({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={`text-sm text-muted-foreground ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
export function Code({ className, children, ...props }: TypographyProps) {
  return (
    <code
      className={`rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </code>
  );
}
