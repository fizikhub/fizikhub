"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the heavy 3D canvas (loads cleanly in the background)
const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
});

export function MemeCorner() {
    const [loadCanvas, setLoadCanvas] = useState(false);

    useEffect(() => {
        const connection = (navigator as Navigator & {
            connection?: { saveData?: boolean; effectiveType?: string };
        }).connection;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || "")) return;

        const enable = () => setLoadCanvas(true);
        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 3500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable, 1800);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    return (
        <div className="w-full relative group min-h-[180px] sm:min-h-[240px]">

            <div
                className={cn(
                    "relative w-full h-[180px] sm:h-[240px] overflow-hidden cursor-pointer",
                    "rounded-[8px]",
                    "border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000]",
                    // VIBRANT FALLBACK - Ensure LCP is attractive even before 3D loads
                    "bg-zinc-950",
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent)]"
                )}
            >
                {/* 3D Canvas - Loaded automatically via dynamic import (ssr: false) */}
                <div className="absolute inset-0 z-0">
                    {loadCanvas ? <MemeCornerCanvas /> : null}
                </div>

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-8 sm:pb-12 text-center">

                    <h1 className="flex flex-col items-center font-head uppercase drop-shadow-md">
                        <span className="mb-0.5 text-sm font-bold tracking-[0.6em] text-blue-200/80 sm:mb-1 sm:text-lg">
                            BİLİMİ
                        </span>
                        <span
                            className="text-4xl font-black leading-none tracking-normal text-white sm:text-7xl"
                            style={{
                                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))',
                                textShadow: '0 0 18px rgba(190,200,255,0.45)'
                            }}
                        >
                            Tİ'YE ALIYORUZ
                        </span>
                        <span className="mt-2 text-[9px] font-bold tracking-[0.18em] text-blue-100/75 sm:text-xs">
                            Türkçe fizik, uzay ve bilim platformu
                        </span>
                    </h1>

                    <div className="mt-2 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                        <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                            AMA CİDDİLİ ŞEKİLDE
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}
