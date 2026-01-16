"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <SiteLogo className="h-9 w-9 sm:h-11 sm:w-11 text-primary drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>
            </div>

            <div className="relative flex flex-col leading-none animate-[float_4s_ease-in-out_infinite]">
                {/* Main Text with Gradient and Drop Shadow */}
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-primary/50 drop-shadow-sm group-hover:to-primary transition-all duration-300">
                    FİZİKHUB
                </span>

                {/* Subtle underline decoration */}
                <span className="h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
        </Link>
    );
}
