export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-[family-name:var(--font-outfit)]" role="status" aria-label="Sayfa yükleniyor">
            {/* Background Details */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-lighten" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            
            <div className="relative z-10 flex flex-col items-center gap-10">
                {/* Neo Spinning Geometry */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Inner core */}
                    <div className="absolute w-6 h-6 bg-[#FFBD2E] rounded-full z-20 border-[3px] border-black shadow-[2px_2px_0_0_#000] animate-pulse" />
                    
                    {/* Orbital Rings - Black */}
                    <div className="absolute w-20 h-20 border-[4px] border-black dark:border-zinc-500 rounded-full animate-[spin_3s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
                    <div className="absolute w-24 h-24 border-[4px] border-black dark:border-zinc-400 rounded-full animate-[spin_2s_linear_infinite_reverse]" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
                    
                    {/* Pink/Blue Orbits */}
                    <div className="absolute w-[110%] h-[110%] border-[3px] border-dashed border-neo-pink rounded-full animate-[spin_8s_linear_infinite]" />
                    <div className="absolute w-[130%] h-[130%] border-[4px] border-dotted border-neo-blue rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                </div>

                <div className="flex flex-col items-center gap-3">
                    <p className="font-black text-3xl sm:text-4xl tracking-tighter text-black dark:text-white uppercase drop-shadow-[2px_2px_0px_#FFBD2E] dark:drop-shadow-[2px_2px_0px_#000]">
                        VERİ ÇEKİLİYOR
                    </p>
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-black dark:text-zinc-200 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 px-4 py-2 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] rounded-full">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        Işık Hızında Bağlanıyor...
                    </div>
                </div>
            </div>
        </div>
    );
}
