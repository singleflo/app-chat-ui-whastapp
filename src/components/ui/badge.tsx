import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-[var(--accent)] text-[var(--accent-fg)]",
                secondary: "border-transparent bg-[var(--bg-panel-2)] text-[var(--fg-secondary)]",
                outline: "border-[var(--border-strong)] text-[var(--fg-secondary)]",
                success: "border-transparent bg-[var(--fg-success)] text-white",
                warning: "border-transparent bg-[var(--fg-warning)] text-[var(--fg-primary)]",
                error: "border-transparent bg-[var(--fg-error)] text-white",
                unread:
                    "border-transparent bg-[var(--accent)] text-[var(--accent-fg)] font-semibold",
            },
        },
        defaultVariants: { variant: "default" },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
