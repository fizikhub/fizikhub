"use client"

import NextImage from "next/image"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, alt = "", src, ...props }, ref) => {
    // Only use Next.js Image for remote/absolute URLs. Use raw img for blobs/data-uris (like during local profile edit).
    const isExternal = typeof src === 'string' && (src.startsWith('http') || src.startsWith('/'));
    
    if (isExternal) {
        return (
            <AvatarPrimitive.Image
                ref={ref}
                asChild
                src={src}
                className={cn("aspect-square h-full w-full", className)}
                {...props}
            >
                <NextImage 
                    src={src} 
                    alt={alt}
                    fill
                    sizes="48px"
                    className={cn("object-cover", className)}
                />
            </AvatarPrimitive.Image>
        );
    }

    return (
        <AvatarPrimitive.Image
            ref={ref}
            className={cn("aspect-square h-full w-full object-cover", className)}
            alt={alt}
            src={src}
            {...props}
        />
    );
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
