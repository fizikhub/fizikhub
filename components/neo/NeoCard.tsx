import * as React from "react"
import { cn } from "@/lib/utils"

const NeoCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-lg border-2 border-black bg-white text-black shadow-neo",
            className
        )}
        {...props}
    />
))
NeoCard.displayName = "NeoCard"

const NeoCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
NeoCardHeader.displayName = "NeoCardHeader"

const NeoCardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "font-heading text-2xl font-bold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
NeoCardTitle.displayName = "NeoCardTitle"

const NeoCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground font-sans font-medium", className)}
        {...props}
    />
))
NeoCardDescription.displayName = "NeoCardDescription"

const NeoCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 font-sans", className)} {...props} />
))
NeoCardContent.displayName = "NeoCardContent"

const NeoCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
NeoCardFooter.displayName = "NeoCardFooter"

export { NeoCard, NeoCardHeader, NeoCardFooter, NeoCardTitle, NeoCardDescription, NeoCardContent }
