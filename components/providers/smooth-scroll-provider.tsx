"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    }, []);

    useLayoutEffect(() => {
        // Skip Lenis on mobile — native scrolling is smoother and less memory-intensive
        if (isMobile) return;

        const lenis = new Lenis({
            duration: 0.6,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.2,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [isMobile]);

    return <>{children}</>;
}
