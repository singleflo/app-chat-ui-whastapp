import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    // 2026: cursor-pointer + active:scale-95 (haptic-like press) + ring-offset
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--ring-offset)] focus-visible:ring-offset-[var(--bg-panel)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-sm)] hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-md)]",
                destructive:
                    "bg-[var(--destructive)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--destructive)]/90 hover:shadow-[var(--shadow-md)]",
                outline:
                    "border border-[var(--border-strong)] bg-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)]",
                secondary:
                    "bg-[var(--bg-panel-2)] text-[var(--fg-primary)] hover:bg-[var(--bg-hover)]",
                ghost: "hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]",
                link: "text-[var(--fg-link)] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-6",
                icon: "h-9 w-9",
                "icon-sm": "h-7 w-7 rounded-md",
                "icon-lg": "h-11 w-11 rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
