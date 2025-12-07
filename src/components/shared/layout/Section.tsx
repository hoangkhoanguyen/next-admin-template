import React from "react";

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Section({
  children,
  title,
  description,
  className,
}: SectionProps) {
  return (
    <section className={`space-y-4 ${className ?? ""}`}>
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {children}
    </section>
  );
}
