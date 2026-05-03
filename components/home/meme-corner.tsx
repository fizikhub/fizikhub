"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the heavy 3D canvas (loads cleanly in the background)
const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
});

export function MemeCorner() {
    const [load3D, setLoad3D] = useState(false);

    useEffect(() => {
        const connection = (navigator as Navigator & {
            connection?: { saveData?: boolean; effectiveType?: string };
        }).connection;

        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const saveData = connection?.saveData;
        const slowConnection = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
        const lowEndDevice = cores <= 4 || memory <= 4;

        if (isMobile || reduceMotion || saveData || slowConnection || lowEndDevice) return;

        const enable3D = () => setLoad3D(true);
        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable3D, { timeout: 4500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeout = setTimeout(enable3D, 3000);
        return () => clearTimeout(timeout);
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
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent),radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.35),transparent_24%),linear-gradient(135deg,#05070d_0%,#111827_55%,#1e1b4b_100%)]"
                )}
            >
                {/* 3D Canvas - Loaded automatically via dynamic import (ssr: false) */}
                <div className="absolute inset-0 z-0">
                    {load3D && <MemeCornerCanvas />}
                </div>

                {!load3D && (
                    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.95)_0_1px,transparent_1.5px),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.7)_0_1px,transparent_1.5px),radial-gradient(circle_at_45%_70%,rgba(147,197,253,0.75)_0_1px,transparent_1.5px),radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.65)_0_1px,transparent_1.5px)]" />
                        <div className="absolute left-1/2 top-1/2 h-36 w-[85%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.28),rgba(96,165,250,0.2)_28%,rgba(168,85,247,0.12)_52%,transparent_72%)] blur-sm" />
                    </div>
                )}

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-8 sm:pb-12 text-center">

                    <p className="font-head text-sm sm:text-lg font-bold tracking-[0.6em] text-blue-200/80 uppercase mb-0.5 sm:mb-1 drop-shadow-md">
                        BİLİMİ
                    </p>

                    <p
                        className="font-head text-4xl sm:text-7xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
                        style={{
                            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))'
                        }}
                    >
                        Tİ'YE ALIYORUZ
                    </p>

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
