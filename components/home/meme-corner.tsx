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
        <div className="w-full relative group min-h-[176px] sm:min-h-[240px]">

            <div
                className={cn(
                    "relative w-full h-[176px] sm:h-[240px] overflow-hidden cursor-pointer",
                    "rounded-[8px] border-2 border-black",
                    "shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[5px_5px_0px_0px_#000]",
                    // VIBRANT FALLBACK - Ensure LCP is attractive even before 3D loads
                    "bg-zinc-950",
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(76,29,149,0.52),transparent_60%)]"
                )}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 opacity-45 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0_1px,transparent_1.4px)] [background-size:18px_18px]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 z-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(234,179,8,0.11))]"
                />
                {/* 3D Canvas is deferred on desktop and skipped on mobile for faster first load. */}
                <div className="absolute inset-0 z-0">
                    {load3D && <MemeCornerCanvas />}
                </div>

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.82)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none px-4 pb-7 sm:pb-12 text-center">

                    <p className="font-sans text-sm sm:text-lg font-black text-blue-100/80 uppercase mb-1 drop-shadow-md">
                        BİLİMİ
                    </p>

                    <h1
                        className="font-sans text-[30px] min-[360px]:text-[34px] min-[430px]:text-[44px] sm:text-7xl font-black leading-none whitespace-nowrap bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                        style={{
                            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))'
                        }}
                    >
                        <span className="sr-only">Fizikhub: Türkçe fizik, uzay ve bilim platformu - </span>
                        Tİ'YE ALIYORUZ
                    </h1>

                    <div className="mt-2 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                        <span className="inline-block bg-[#EAB308] border-2 border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                            AMA CİDDİ ŞEKİLDE
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}
