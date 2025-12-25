"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { useState, useRef } from "react";
import { FlyingRocket } from "@/components/ui/flying-rocket";

export function Logo() {
    const [isFlying, setIsFlying] = useState(false);
    const logoRef = useRef<HTMLDivElement>(null);
    const [startRect, setStartRect] = useState<DOMRect | null>(null);

    const handleRocketClick = (e: React.MouseEvent) => {
        if (isFlying) return;

        e.preventDefault(); // Prevent navigation on rocket click
        e.stopPropagation();

        if (logoRef.current) {
            setStartRect(logoRef.current.getBoundingClientRect());
            setIsFlying(true);
        }
    };

    return (
        <>
            <Link href="/" className="flex items-center gap-1.5 group select-none">
                <div
                    ref={logoRef}
                    onClick={handleRocketClick}
                    className={`relative transition-all duration-300 ${isFlying ? 'opacity-0' : 'group-hover:scale-110 cursor-pointer'}`}
                >
                    <SiteLogo className="h-12 w-12 text-primary" />
                </div>
                <div className="relative">
                    <span className="text-2xl font-black tracking-tighter text-foreground transition-all duration-300 drop-shadow-xl select-none"
                        style={{
                            textShadow: `
                                  1px 1px 0px #c0c0c0,
                                  2px 2px 0px #b0b0b0,
                                  3px 3px 0px #a0a0a0,
                                  4px 4px 0px #909090,
                                  5px 5px 10px rgba(0, 0, 0, 0.6)
                              `
                        }}>
                        FizikHub
                    </span>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            </Link>

            {isFlying && (
                <FlyingRocket
                    startRect={startRect}
                    onComplete={() => setIsFlying(false)}
                />
            )}
        </>
    );
}
