"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            progressRef.current?.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, progress))));
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div
            ref={progressRef}
            className="fixed top-0 left-0 right-0 h-2 bg-[#FACC15] origin-left z-50 border-b-2 border-black scale-x-[var(--scroll-progress,0)] transform-gpu"
        >
            <div className="absolute top-0 right-0 w-2 h-full bg-white animate-pulse" />
        </div>
    );
}
