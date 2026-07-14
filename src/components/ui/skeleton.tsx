import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton — shadcn 2026 standard.
 * Use to reserve space for async content (loading > 300ms) per UX guideline.
 * Reads --bg-muted token so it adapts to theme automatically.
 *
 * @example
 * <Skeleton className="h-4 w-32" />            // text line
 * <Skeleton className="h-12 w-12 rounded-full" /> // avatar
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-[var(--bg-muted)]", className)}
            {...props}
        />
    );
}

export { Skeleton };
