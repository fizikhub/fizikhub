"use client";

import { motion, useAnimation } from "framer-motion";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const controls = useAnimation();
    const threshold = 120; // Distance to trigger refresh

    useEffect(() => {
        if (isRefreshing) {
            controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
        } else {
            controls.start({ y: 0 });
        }
    }, [isRefreshing, controls]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY === 0) return;
        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0 && window.scrollY === 0) {
            // Apply resistance
            setPullDistance(Math.min(distance * 0.5, 200));
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > threshold) {
            setIsRefreshing(true);

            // Animate rocket launch
            await controls.start({ y: -1000, transition: { duration: 1, ease: "easeIn" } });

            // Trigger refresh
            router.refresh();

            // Reset after delay
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
                setStartY(0);
                controls.set({ y: 0 });
            }, 1500);
        } else {
            setPullDistance(0);
            setStartY(0);
        }
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="min-h-screen relative"
        >
            {/* Rocket Container */}
            <div
                className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
                style={{
                    transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
                    opacity: Math.min(pullDistance / threshold, 1)
                }}
            >
                <div className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <motion.div
                        animate={isRefreshing ? { y: -500, opacity: 0 } : { rotate: pullDistance > threshold ? 0 : 45 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Rocket
                            className={`w-6 h-6 ${pullDistance > threshold ? "text-cyan-400 animate-pulse" : "text-zinc-400"}`}
                            style={{
                                filter: pullDistance > threshold ? "drop-shadow(0 0 8px cyan)" : "none"
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Content with elasticity */}
            <motion.div
                style={{ y: isRefreshing ? 0 : pullDistance }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
