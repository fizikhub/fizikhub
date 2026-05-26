"use client";

import { cn } from "@/lib/utils";
import { FlaskConical, MessageCircleQuestion, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
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
                    "bg-[radial-gradient(circle_at_20%_10%,rgba(0,245,212,0.24),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(255,200,0,0.18),transparent_32%),radial-gradient(circle_at_50%_120%,rgba(35,169,250,0.34),transparent_48%)]"
                )}
            >
                {/* 3D Canvas is deferred on desktop and skipped on mobile for faster first load. */}
                <div className="absolute inset-0 z-0">
                    {load3D && <MemeCornerCanvas />}
                </div>

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-6 sm:pb-10 text-center">

                    <p className="font-head text-sm sm:text-lg font-bold tracking-normal text-blue-200/80 uppercase mb-0.5 sm:mb-1 drop-shadow-md">
                        BİLİMİ
                    </p>

                    <h1
                        id="home-hero-title"
                        className="font-head text-4xl sm:text-7xl font-black tracking-normal leading-none bg-gradient-to-r from-white via-blue-100 to-[#FFC800] bg-clip-text text-transparent"
                        style={{
                            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))'
                        }}
                    >
                        <span className="block text-2xl sm:text-4xl">Fizikhub</span>
                        <span className="sr-only">: </span>
                        <span className="block">Tİ'YE ALIYORUZ</span>
                    </h1>

                    <div className="mt-2 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                        <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                            AMA CİDDİ ŞEKİLDE
                        </span>
                    </div>

                    <nav className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-4" aria-label="Hızlı erişim">
                        {[
                            { href: "/ara", label: "Ara", icon: Search },
                            { href: "/forum", label: "Forum", icon: MessageCircleQuestion },
                            { href: "/simulasyonlar", label: "Simülasyon", icon: FlaskConical },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-[7px] border-2 border-black bg-white/95 px-3 text-[10px] font-black uppercase tracking-normal text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#00F5D4] hover:shadow-[1px_1px_0px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5D4] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-10 sm:px-3.5 sm:text-xs"
                                >
                                    <Icon className="h-3.5 w-3.5 stroke-[3px]" aria-hidden="true" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                </div>
            </div>
        </div>
    );
}
