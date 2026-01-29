"use client";

export function ModernNeoLogo() {
    return (
        <div className="flex flex-col select-none group">
            {/* MAIN BRAND ROW */}
            <div className="flex items-center leading-none tracking-tighter">
                {/* FIZIK: Outlined/Stroke Effect */}
                <span className="text-3xl sm:text-4xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 [webkit-text-stroke:1.5px_black] dark:[webkit-text-stroke:1.5px_white] dark:from-white dark:to-neutral-300 relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
                    FIZIK
                </span>

                {/* HUB: Solid Box Effect */}
                <div className="relative ml-1">
                    {/* Shadow Layer */}
                    <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px] rounded-sm" />
                    {/* Main Box */}
                    <span className="relative block bg-[#FFC800] text-black text-3xl sm:text-4xl font-[900] px-2 rounded-sm border-2 border-black transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-0">
                        HUB
                    </span>
                </div>
            </div>

            {/* SUBTITLE: Precision Typography */}
            <div className="flex items-center justify-between w-full mt-1.5 pl-1">
                <span className="h-[2px] flex-1 bg-current opacity-20 mr-2 rounded-full"></span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">
                    BİLİM PLATFORMU
                </span>
                <span className="h-[2px] w-[12px] bg-[#FFC800] border border-black ml-2 rounded-full"></span>
            </div>
        </div>
    );
}
