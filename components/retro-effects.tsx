"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function RetroEffects() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || theme !== "retro") {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden font-serif">
            {/* Top Center Welcome Banner (CSS Based for reliability) */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-50 text-center">
                <div className="bg-[#000080] text-white px-4 py-1 border-2 border-white shadow-[2px_2px_0px_#000] animate-pulse font-bold text-xl tracking-widest">
                    WELCOME TO FIZIKHUB
                </div>
            </div>

            {/* Rotating Earth (Top Right) */}
            <img
                src="/img/retro/earth.gif"
                alt="World Wide Web"
                className="absolute top-24 right-4 w-16 h-16 opacity-80"
            />

            {/* Email / Contact (Bottom Right) */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
                <div className="w-12 h-8 bg-[#FFFF00] border-2 border-black flex items-center justify-center relative shadow-[2px_2px_0px_#000]">
                    <div className="absolute inset-0 border-t-[14px] border-x-[24px] border-b-[14px] border-transparent border-t-black/10"></div>
                    <span className="z-10 text-[10px] font-bold">@</span>
                </div>
                <span className="bg-white text-black text-[10px] border border-black px-1 mt-1 font-bold">
                    EMAIL ME
                </span>
            </div>

            {/* New Icon (CSS Based) */}
            <div className="absolute bottom-20 left-4 animate-bounce">
                <div className="bg-red-600 text-yellow-300 px-2 py-1 transform -rotate-12 font-black border-2 border-white shadow-[2px_2px_0px_#000]">
                    NEW!
                </div>
            </div>

            {/* Netscape Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#FFFF00] text-black px-2 border-2 border-white shadow-[2px_2px_0px_#000] font-bold text-xs">
                BEST VIEWED WITH NETSCAPE 4.0
            </div>
        </div>
    );
}
