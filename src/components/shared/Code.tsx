import React from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={`rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold ${
        className ?? ""
      }`}
    >
      {children}
    </code>
  );
}
