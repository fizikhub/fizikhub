"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SiteLogoProps {
    className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isChristmas = mounted && theme === "christmas";

    return (
        <div className="relative inline-block">
            <div
                className={cn("w-[53px] h-[53px] bg-primary", className)}
                style={{
                    maskImage: 'url("/logo-no-bg.svg")',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url("/logo-no-bg.svg")',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                }}
                aria-label="FizikHub Logo"
            />
            {isChristmas && (
                <div
                    className="absolute -top-2 -right-1 text-2xl animate-bounce"
                    style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        animationDuration: '3s'
                    }}
                    title="Ho ho ho! 🎅"
                >
                    🎅
                </div>
            )}
        </div>
    );
}
