"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
    priority?: boolean;
}

/**
 * Lazy Loading Image Component
 * Uses Next.js Image with blur placeholder and loading states
 */
export function LazyImage({
    src,
    alt,
    width,
    height,
    className,
    fill = false,
    priority = false,
}: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                loading={priority ? undefined : "lazy"}
                className={cn(
                    "transition-all duration-300",
                    isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
                )}
                onLoadingComplete={() => setIsLoading(false)}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
        </div>
    );
}
