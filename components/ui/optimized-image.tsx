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
    lowQualityPlaceholder = false,
    alt,
    ...props
}: OptimizedImageProps) {
    return (
        <NextImage
            {...props}
            alt={alt}
            className={cn(
                "object-cover",
                className
            )}
            placeholder={lowQualityPlaceholder ? "blur" : "empty"}
            blurDataURL={lowQualityPlaceholder ? generateBlurPlaceholder() : undefined}
            quality={props.priority ? 60 : 45}
            fetchPriority={props.priority ? "high" : "auto"}
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
    fillContainer = false,
}: {
    src?: string | null;
    alt: string;
    size?: number;
    className?: string;
    fillContainer?: boolean;
}) {
    const [hasError, setHasError] = useState(false);
    const avatarStyle = fillContainer ? undefined : { width: size, height: size };

    if (!src || hasError) {
        return (
            <div
                className={cn(
                    "rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold",
                    fillContainer && "h-full w-full",
                    className
                )}
                style={{ ...avatarStyle, fontSize: size * 0.4 }}
            >
                {alt?.charAt(0)?.toUpperCase() || "?"}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative rounded-full overflow-hidden bg-muted",
                fillContainer && "h-full w-full",
                className
            )}
            style={avatarStyle}
        >
            <NextImage
                src={src}
                alt={alt}
                fill
                sizes={`${size}px`}
                className={cn(
                    "object-cover text-transparent",
                )}
                quality={45}
                onError={() => setHasError(true)}
            />
        </div>
    );
}

// Generate a tiny blur placeholder (1x1 pixel)
function generateBlurPlaceholder(): string {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k=";
}
