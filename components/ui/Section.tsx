import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Content section wrapper with consistent spacing
 * Provides standard padding and layout for content sections
 */
export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-12 last:mb-0 ${className}`}>{children}</section>
  );
}
