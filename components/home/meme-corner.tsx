"use client";

import MemeCornerCanvas from "@/components/home/meme-corner-canvas";
import { cn } from "@/lib/utils";

export function MemeCorner() {
    return (
        <div className="w-full relative group min-h-[180px] sm:min-h-[240px]">

            <div
                className={cn(
                    "relative w-full h-[180px] sm:h-[240px] overflow-hidden cursor-pointer",
                    "rounded-[8px]",
                    "border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000]",
                    // The CSS layer gives the hero an instant branded backdrop while canvas hydrates.
                    "bg-zinc-950",
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent),radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.35),transparent_24%),linear-gradient(135deg,#05070d_0%,#111827_55%,#1e1b4b_100%)]"
                )}
            >
                {/* Lightweight galaxy canvas. Always visible because the hero is a brand moment. */}
                <div className="absolute inset-0 z-0">
                    <MemeCornerCanvas />
                </div>

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
