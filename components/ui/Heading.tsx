import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
    level: HeadingLevel;
    children: ReactNode;
    className?: string;
}

/**
 * Typography component with consistent sizing for headings
 * Supports h1 through h6 with appropriate styling
 */
export function Heading({ level, children, className = "" }: HeadingProps) {
    const baseStyles = "font-bold tracking-tight";

    const sizeStyles = {
        h1: "text-4xl sm:text-5xl lg:text-6xl mb-6",
        h2: "text-3xl sm:text-4xl lg:text-5xl mb-5",
        h3: "text-2xl sm:text-3xl lg:text-4xl mb-4",
        h4: "text-xl sm:text-2xl lg:text-3xl mb-4",
        h5: "text-lg sm:text-xl lg:text-2xl mb-3",
        h6: "text-base sm:text-lg lg:text-xl mb-3",
    };

    const Component = level;
    const styles = `${baseStyles} ${sizeStyles[level]} ${className}`;

    return <Component className={styles}>{children}</Component>;
}

