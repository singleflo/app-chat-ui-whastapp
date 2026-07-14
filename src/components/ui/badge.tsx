import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums transition-colors duration-200 ease-out",
    {
        variants: {
            variant: {
                default: "border-transparent bg-(--accent) text-(--accent-fg)",
                secondary: "border-transparent bg-(--bg-panel-2) text-(--fg-secondary)",
                outline: "border-(--border-strong) text-(--fg-secondary)",
                success: "border-transparent bg-(--fg-success) text-white",
                warning: "border-transparent bg-(--fg-warning) text-(--fg-primary)",
                error: "border-transparent bg-(--destructive) text-white",
                unread: "border-transparent bg-(--accent) font-semibold text-(--accent-fg) shadow-(--shadow-sm)",
            },
        },
        defaultVariants: { variant: "default" },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
