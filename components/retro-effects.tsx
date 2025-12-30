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
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Corner GIFs */}
            <img
                src="/img/retro/construction.gif"
                alt="Under Construction"
                className="absolute bottom-4 right-4 w-24 h-auto"
            />
            <img
                src="/img/retro/earth.gif"
                alt="World Wide Web"
                className="absolute top-20 right-4 w-16 h-16 opacity-80"
            />

            {/* Random decorations could go here */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-200 text-black px-2 border-2 border-black font-mono text-xs animate-pulse">
                BEST VIEWED WITH NETSCAPE NAVIGATOR 4.0
            </div>
        </div>
    );
}
