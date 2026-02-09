"use client";

import NextImage, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
    lowQualityPlaceholder?: boolean;
}

/**
 * Optimized Image component with:
 * - Blur placeholder for better perceived performance
 * - Fade-in animation on load
 * - Lower quality for mobile (auto-handled by Next.js)
 */
export function OptimizedImage({
    className,
    lowQualityPlaceholder = true,
    alt,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <NextImage
            {...props}
            alt={alt}
            className={cn(
                "transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
                className
            )}
            placeholder={lowQualityPlaceholder ? "blur" : "empty"}
            blurDataURL={lowQualityPlaceholder ? generateBlurPlaceholder() : undefined}
            quality={props.priority ? 85 : 75}
            onLoad={() => setIsLoaded(true)}
        />
    );
}

/**
 * Avatar component optimized for small images
 */
export function OptimizedAvatar({
    src,
    alt,
    size = 40,
    className,
}: {
    src?: string | null;
    alt: string;
    size?: number;
    className?: string;
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div
                className={cn(
                    "rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold",
                    className
                )}
                style={{ width: size, height: size, fontSize: size * 0.4 }}
            >
                {alt?.charAt(0)?.toUpperCase() || "?"}
            </div>
        );
    }

    return (
        <div
            className={cn("relative rounded-full overflow-hidden bg-muted", className)}
            style={{ width: size, height: size }}
        >
            <NextImage
                src={src}
                alt={alt}
                fill
                sizes={`${size}px`}
                className={cn(
                    "object-cover transition-opacity duration-200",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                quality={60}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
            />
        </div>
    );
}

// Generate a tiny blur placeholder (1x1 pixel)
function generateBlurPlaceholder(): string {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k=";
}
