"use client";

import { MemeCorner } from "@/components/home/meme-corner";

// ==========================================
// COMPACT HERO -> NOW THE MEME MACHINE
// ==========================================

export function CompactHero() {

    // The user explicitly wanted the "Bilimi Tİ'ye Alıyoruz" card to be the new animated one.
    // So we simply return the MemeCorner here, effectively replacing the old static banner.
    return (
        <div className="mb-2 sm:mb-6" role="img" aria-label="Fizikhub galaksi animasyonu — Bilimi Tİ'ye Alıyoruz">
            <MemeCorner />
        </div>
    );
}
