"use client";

import { CompactShareGrid } from "@/components/share/compact-share-grid";

export default function PaylasPage() {
    return (
        <div className="min-h-screen bg-background pt-16 md:pt-20 px-4 font-sans pb-24">
            <div className="max-w-[800px] mx-auto">

                {/* Simple Header - No Massive Marquees */}
                <div className="mb-6 flex items-center justify-between border-b-2 border-border pb-4">
                    <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
                        Paylaşım Merkezi
                    </h1>
                    <div className="inline-block px-3 py-1 rounded-md border-2 border-black dark:border-white bg-primary text-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                        v2.1
                    </div>
                </div>

                {/* The Grid */}
                <CompactShareGrid />
            </div>
        </div>
    );
}
