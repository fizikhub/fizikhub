"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const neoButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-black shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-pressed",
    {
        variants: {
            variant: {
                default: "bg-neo-yellow text-black hover:bg-neo-yellow/90",
                primary: "bg-primary text-black hover:bg-primary/90",
                secondary: "bg-neo-purple text-white hover:bg-neo-purple/90",
                destructive: "bg-destructive text-white hover:bg-destructive/90",
                outline: "bg-white text-black hover:bg-black/5",
                ghost: "border-transparent shadow-none hover:bg-black/5 hover:shadow-none active:translate-x-0 active:translate-y-0",
                link: "text-black underline-offset-4 hover:underline border-transparent shadow-none active:translate-x-0 active:translate-y-0",
                "neo-cyan": "bg-neo-cyan text-black hover:bg-neo-cyan/90",
                "neo-pink": "bg-neo-pink text-white hover:bg-neo-pink/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface NeoButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
    asChild?: boolean
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(neoButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
NeoButton.displayName = "NeoButton"

export { NeoButton, neoButtonVariants }
