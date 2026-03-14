"use client";

import { useEffect, useState } from "react";

/**
 * Detection hooks and utilities for mobile performance optimization
 */

// Check if device prefers reduced motion
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return prefersReducedMotion;
}

// Check if device is mobile (based on viewport width)
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < 768;
        }
        return false;
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}

// Check if device has low-end hardware (rough heuristic)
export function useIsLowEndDevice(): boolean {
    const [isLowEnd] = useState(() => {
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            const cores = navigator.hardwareConcurrency || 4;
            const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
            return cores < 4 || memory < 4;
        }
        return false;
    });

    // State is already initialized correctly on mount
    return isLowEnd;
}

// Combined hook for performance-aware rendering
export function usePerformanceMode(): {
    shouldReduceAnimations: boolean;
    shouldLoadHeavyAssets: boolean;
    deviceTier: "low" | "mid" | "high";
} {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isMobile = useIsMobile();
    const isLowEnd = useIsLowEndDevice();

    const shouldReduceAnimations = prefersReducedMotion || (isMobile && isLowEnd);
    const shouldLoadHeavyAssets = !isMobile || !isLowEnd;

    let deviceTier: "low" | "mid" | "high" = "high";
    if (isLowEnd) deviceTier = "low";
    else if (isMobile) deviceTier = "mid";

    return { shouldReduceAnimations, shouldLoadHeavyAssets, deviceTier };
}

// Intersection Observer hook for lazy loading
export function useInView(
    ref: React.RefObject<HTMLElement | null>,
    options?: IntersectionObserverInit
): boolean {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { rootMargin: "100px", threshold: 0.1, ...options }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, options]);

    return isInView;
}

// Throttle function for scroll events
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Debounce function for resize events
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
