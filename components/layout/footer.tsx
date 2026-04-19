"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Ghost, Sparkles, Zap, BookOpen } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v10 — THE "HAFİF MEŞREP" (PLAYFUL) PREMIUM EDITION
// Compact, Fun, Highly Interactive. 
// Uses "Pill" brutalism, scattered angles, and vibrant hover states.
// ═══════════════════════════════════════════════════════════════

const TapeRepeater = () => Array(8).fill("BİLİMİ Tİ YEYİP YUTUYORUZ • 🪐 • E=MC² • 🧪 • ").join("");

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    if (isChatPage) return null;

    return (
        <footer role="contentinfo" aria-label="Site bilgileri"
            className={cn(
                "relative border-t-[3px] md:border-t-4 border-black dark:border-zinc-800 bg-[#fbfbfb] dark:bg-[#0c0c0c] overflow-hidden flex flex-col justify-end",
                isWriterPanel ? "min-h-[150px]" : "min-h-[auto]"
            )}
        >
            {/* Playful Dotted Background */}
             <div 
                className="absolute inset-0 opacity-[0.10] dark:opacity-[0.05] pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', 
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }} 
            />

            {!isWriterPanel && (
                <>
                    {/* Wavy/Diagonal Marquee Tape */}
                    <div className="absolute top-0 left-0 w-full bg-[#FFC800] border-b-[3px] md:border-b-4 border-black text-black font-black text-[10px] md:text-sm py-1.5 md:py-2.5 overflow-hidden shadow-[0_4px_0_0_#000] z-20">
                        <div className="animate-marquee whitespace-nowrap flex tracking-widest uppercase">
                            <span><TapeRepeater /></span>
                            <span><TapeRepeater /></span>
                        </div>
                    </div>

                    <div className="container relative z-30 pt-16 md:pt-24 pb-16 md:pb-20 flex flex-col items-center text-center gap-8 md:gap-12 px-4">
                        
                        {/* Logo & Quirky Text */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="transform -rotate-2 hover:rotate-2 hover:scale-105 transition-all duration-300">
                                <DankLogo />
                            </div>
                            <div className="bg-black text-white dark:bg-[#FFC800] dark:text-black font-black text-[10px] md:text-xs px-3 py-1 rounded-sm uppercase tracking-wide transform rotate-1 shadow-[2px_2px_0px_0px_#FFC800] dark:shadow-[2px_2px_0px_0px_#fff]">
                                CİDDİYET SEVİYESİ: %0.01
                            </div>
                        </div>

                        {/* Playful Pill Links */}
                        <div className="flex flex-wrap justify-center gap-3 md:gap-5 w-full max-w-3xl">
                            <PillLink href="/makale" label="Blog" color="bg-[#FF90E8]" icon={<BookOpen strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5"/>} rotate="-rotate-2" />
                            <PillLink href="/simulasyonlar" label="Simülasyonlar" color="bg-[#23A9FA]" icon={<Zap strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5"/>} rotate="rotate-2" />
                            <PillLink href="/sözlük" label="Fizik Sözlüğü" color="bg-[#10B981]" icon={<Sparkles strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5"/>} rotate="-rotate-1" />
                            <PillLink href="/hakkimizda" label="Biz Kimiz?" color="bg-[#FFC800]" icon={<Ghost strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5"/>} rotate="rotate-3" />
                        </div>

                    </div>
                </>
            )}

            {/* Sub Menu & Legal - Receipt Style but colorful */}
            <div className="relative z-40 w-full border-t-[3px] md:border-t-4 border-black dark:border-zinc-800 bg-[#FFC800] py-3 md:py-4 shadow-[0_-4px_0_0_#000] md:shadow-[0_-8px_0_0_#000]">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                        &copy; 2026 FİZİKHUB • Uzay-Zaman Sürekliliği Sağlandı
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] md:text-xs font-black text-black uppercase">
                        <Link href="/iletisim" className="hover:underline decoration-2 underline-offset-4">İletişim</Link>
                        <span className="opacity-20">•</span>
                        <Link href="/kullanim-sartlari" className="hover:underline decoration-2 underline-offset-4">Şartlar</Link>
                        <span className="opacity-20">•</span>
                        <Link href="/gizlilik-politikasi" className="hover:underline decoration-2 underline-offset-4">Gizlilik</Link>
                        <span className="opacity-20">•</span>
                        <Link href="/kvkk" className="hover:underline decoration-2 underline-offset-4">KVKK</Link>
                    </div>
                </div>
            </div>
            
            {/* The "Schrodinger's Box" Eastern Egg */}
            {!isWriterPanel && (
                <div 
                    className="group absolute bottom-12 md:bottom-14 left-4 md:left-8 w-12 h-10 md:w-16 md:h-12 border-[3px] border-black bg-[#E5E7EB] dark:bg-zinc-800 rounded-t-lg flex items-end justify-center overflow-hidden hover:h-16 md:hover:h-24 transition-all duration-300 cursor-pointer z-30"
                    title="Schrödinger'in Kutusu"
                >
                    <span className="text-2xl md:text-4xl translate-y-6 md:translate-y-8 group-hover:-translate-y-1 md:group-hover:translate-y-1 transition-transform duration-300 ease-out delay-75">🐈</span>
                    <span className="absolute bottom-1 md:bottom-2 text-[6px] md:text-[8px] font-black text-black dark:text-white pointer-events-none tracking-widest">KUTU</span>
                </div>
            )}

        </footer>
    );
}

function PillLink({href, label, color, icon, rotate}: {href: string, label: string, color: string, icon: React.ReactNode, rotate: string}) {
    return (
        <Link 
            href={href} 
            prefetch={false}
            className={cn(
                "group relative flex items-center justify-between gap-3 px-5 py-2.5 md:py-4 md:px-8 rounded-full border-[3px] md:border-4 border-black dark:border-zinc-700 text-black dark:text-zinc-100 font-black uppercase text-xs md:text-sm",
                "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
                "hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                "active:shadow-none active:translate-x-[3px] active:translate-y-[3px] md:active:translate-x-[4px] md:active:translate-y-[4px]",
                "transition-all duration-150 ease-out bg-white dark:bg-zinc-900 overflow-hidden",
                rotate
            )}
        >
            {/* Colorful inner background triggered on hover */}
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0", color)}></div>
            
            {/* Label */}
            <span className="relative z-10 dark:group-hover:text-black transition-colors duration-200 tracking-wider">
                {label}
            </span>
            
            {/* Icon Box */}
            <span className="relative z-10 dark:text-white dark:group-hover:text-black transition-colors duration-200 transform group-hover:scale-110 group-hover:rotate-12">
                {icon}
            </span>
        </Link>
    );
}
