"use client";

import { MemeCorner } from "@/components/home/meme-corner";

// ==========================================
// COMPACT HERO -> NOW THE MEME MACHINE
// ==========================================

export function CompactHero() {

    // The user explicitly wanted the "Bilimi Ti'ye Alıyoruz" card to be the new animated one.
    // So we simply return the MemeCorner here, effectively replacing the old static banner.
    return (
        <section className="mb-2 sm:mb-6" aria-labelledby="home-hero-title">
            <MemeCorner />
        </section>
    );
}
