import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const neoBadgeVariants = cva(
    "inline-flex items-center rounded-sm border-2 border-black px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-black hover:bg-primary/80 border-black",
                secondary:
                    "border-transparent bg-secondary text-white hover:bg-secondary/80 border-black",
                destructive:
                    "border-transparent bg-destructive text-white hover:bg-destructive/80 border-black",
                outline: "text-foreground",
                "neo-yellow": "bg-neo-yellow text-black border-black",
                "neo-pink": "bg-neo-pink text-white border-black",
                "neo-cyan": "bg-neo-cyan text-black border-black",
                "neo-black": "bg-black text-white border-black",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface NeoBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neoBadgeVariants> { }

function NeoBadge({ className, variant, ...props }: NeoBadgeProps) {
    return (
        <div className={cn(neoBadgeVariants({ variant }), className)} {...props} />
    )
}

export { NeoBadge, neoBadgeVariants }
