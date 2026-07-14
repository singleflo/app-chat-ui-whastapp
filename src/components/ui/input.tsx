import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input — shadcn 2026 aligned.
 * - cursor-text, transition on border + box-shadow
 * - focus-visible: accent border + ring (shadcn focus pattern)
 * - placeholder uses --fg-tertiary
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full cursor-text rounded-md border border-transparent bg-[var(--bg-panel-2)] px-3 py-1 text-sm text-[var(--fg-primary)] transition-[border-color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-[var(--fg-tertiary)] focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--ring-offset)] focus-visible:ring-offset-[var(--bg-panel-2)] disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
