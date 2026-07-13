import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-transparent bg-[var(--bg-panel-2)] px-3 py-1 text-sm text-[var(--fg-primary)] transition-colors placeholder:text-[var(--fg-tertiary)] focus-visible:border-[var(--accent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
