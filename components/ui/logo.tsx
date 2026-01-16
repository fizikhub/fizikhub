"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group select-none">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <SiteLogo className="h-10 w-10 sm:h-12 sm:w-12 text-primary transition-all duration-700 animate-[spin_10s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]" />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300 drop-shadow-sm">
                    FIZIKHUB
                </span>
            </div>
        </Link>
    );
}
