"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MemeCorner } from "@/components/home/meme-corner"; // Import V28

// ==========================================
// COMPACT HERO -> NOW THE MEME MACHINE
// ==========================================

export function CompactHero() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Fallback or loading state
        return <div className="h-48 bg-black border-2 border-white/20 rounded-2xl animate-pulse" />;
    }

    // The user explicitly wanted the "Bilimi Ti'ye Alıyoruz" card to be the new animated one.
    // So we simply return the MemeCorner here, effectively replacing the old static banner.
    return (
        <div className="mb-1 sm:mb-8">
            <MemeCorner />
        </div>
    );
}
