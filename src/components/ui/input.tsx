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
                    "flex h-9 w-full cursor-text rounded-md border border-transparent bg-(--bg-panel-2) px-3 py-1 text-sm text-(--fg-primary) transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-(--fg-tertiary) focus-visible:border-(--accent) focus-visible:ring-(--ring) focus-visible:ring-offset-(--bg-panel-2) focus-visible:ring-offset-(--ring-offset) focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
