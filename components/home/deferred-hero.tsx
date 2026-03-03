"use client";

import dynamic from "next/dynamic";

// Client wrapper that defers loading of Three.js hero until idle
// This MUST be a Client Component because next/dynamic with ssr:false requires it
const CompactHero = dynamic(
    () => import("@/components/home/compact-hero").then(mod => mod.CompactHero),
    {
        ssr: false,
        loading: () => (
            <div className="mb-2 sm:mb-6">
                <div className="w-full relative min-h-[180px] sm:min-h-[240px]">
                    <div className="relative w-full h-[180px] sm:h-[240px] overflow-hidden rounded-[8px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] bg-zinc-950 bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent)]">
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-8 sm:pb-12 text-center">
                            <h2 className="font-head text-sm sm:text-lg font-bold tracking-[0.6em] text-blue-200/80 uppercase mb-0.5 sm:mb-1 drop-shadow-md">BİLİMİ</h2>
                            <h2 className="font-head text-4xl sm:text-7xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.9))' }}>Tİ'YE ALIYORUZ</h2>
                            <div className="mt-2 sm:mt-3"><span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000]">AMA CİDDİLİ ŞEKİLDE</span></div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    }
);

export function DeferredHero() {
    return <CompactHero />;
}
