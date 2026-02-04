"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const simButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-black uppercase ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] dark:hover:shadow-[2px_2px_0px_#fff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    {
        variants: {
            variant: {
                default: "bg-[#FFC800] text-black hover:bg-[#FFD633]",
                secondary: "bg-white text-black hover:bg-neutral-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800",
                destructive: "bg-[#EF4444] text-white hover:bg-red-600",
                outline: "bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800",
                ghost: "border-transparent shadow-none hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:shadow-none hover:translate-x-0 hover:translate-y-0",
            },
            size: {
                default: "h-11 px-8 py-2",
                sm: "h-9 px-4",
                lg: "h-14 px-10 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface SimButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof simButtonVariants> {
    asChild?: boolean;
}

const SimButton = React.forwardRef<HTMLButtonElement, SimButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(simButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
SimButton.displayName = "SimButton";

export { SimButton, simButtonVariants };
