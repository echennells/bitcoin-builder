import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main page wrapper with consistent padding and max-width
 * Provides the standard layout container for all pages
 */
export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
