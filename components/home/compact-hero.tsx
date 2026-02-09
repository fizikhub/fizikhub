"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MemeCorner } from "@/components/home/meme-corner"; // Import V28

// ==========================================
// COMPACT HERO -> NOW THE MEME MACHINE
// ==========================================

export function CompactHero() {

    // The user explicitly wanted the "Bilimi Ti'ye Alıyoruz" card to be the new animated one.
    // So we simply return the MemeCorner here, effectively replacing the old static banner.
    return (
        <div className="mb-8 sm:mb-10">
            <MemeCorner />
        </div>
    );
}
