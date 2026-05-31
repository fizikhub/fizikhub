"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the heavy 3D canvas (loads cleanly in the background)
const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
});

export function MemeCorner() {
    const [load3D, setLoad3D] = useState(false);

    useEffect(() => {
        // Skip only for users who prefer reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const enable3D = () => setLoad3D(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable3D, { timeout: 2500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable3D, 1400);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    return (
        <div className="w-full relative group min-h-[168px] sm:min-h-[220px]">

            <div
                className={cn(
                    "relative w-full h-[168px] sm:h-[220px] md:h-[240px] overflow-hidden cursor-pointer",
                    "rounded-[8px]",
                    "border-2 sm:border-[3px] border-black",
                    "shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000]",
                    // VIBRANT FALLBACK - Ensure LCP is attractive even before 3D loads
                    "bg-zinc-950",
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent)]"
                )}
            >
                {/* 3D Canvas is deferred on desktop and skipped on mobile for faster first load. */}
                <div className="absolute inset-0 z-0">
                    {load3D && <MemeCornerCanvas />}
                </div>

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-7 sm:pb-10 text-center">

                    <p className="font-head text-xs sm:text-base font-bold tracking-normal text-blue-200/85 uppercase mb-1 drop-shadow-md">
                        BİLİMİ
                    </p>

                    <h1
                        className="font-head text-4xl min-[390px]:text-5xl sm:text-7xl font-black tracking-normal leading-none bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
                        style={{
                            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))'
                        }}
                    >
                        <span className="sr-only">Fizikhub: Türkçe fizik, uzay ve bilim platformu - </span>
                        Tİ'YE ALIYORUZ
                    </h1>

                    <div className="mt-2.5 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                        <span className="inline-block bg-[#EAB308] border-[2px] border-black text-black px-3 py-1.5 sm:px-4 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                            AMA CİDDİ ŞEKİLDE
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}
