"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v11 — AEROSPACE THERMAL TILE (UZAY TUĞLASI) EDITION
// Serious "space hardware" aesthetic but with cheeky details.
// No generic layouts. Authentic blocky sci-fi brutalism.
// ═══════════════════════════════════════════════════════════════

const TAPE_MESSAGES = [
    "DİKKAT: BİLİMİ Tİ'YE ALIYORUZ", "YÜKSEK ÇEKİM ALANI",
    "KARADELİĞE YAKLAŞMAYINIZ", "SİSTEM STABİL: UZAY-ZAMAN BÜKÜLÜYOR",
    "E = mc² ÇALIŞIYOR"
];

const MARQUEE_TEXT = Array(6).fill(TAPE_MESSAGES.join(" ⚠️ ")).join(" ⚠️ ");

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    if (isChatPage) return null;

    return (
        <footer role="contentinfo" aria-label="Site bilgileri"
            className={cn(
                "relative flex flex-col justify-end border-t-[3px] md:border-t-4 border-black",
                "bg-[#e5e5e5] dark:bg-[#151515]",
                isWriterPanel ? "min-h-[150px]" : "min-h-[auto]"
            )}
        >
            {/* AEROSPACE BLUEPRINT GRID */}
             <div 
                className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.25]" 
                style={{ 
                    backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }} 
            />

            {!isWriterPanel && (
                <>
                    {/* INDUSTRIAL WARNING MARQUEE */}
                    <div className="absolute top-0 left-0 w-full bg-[#FFC800] border-b-[3px] md:border-b-4 border-black text-black font-black text-[10px] md:text-sm py-1.5 md:py-2.5 overflow-hidden shadow-[0_4px_0_0_#000] z-20">
                        <div className="animate-marquee whitespace-nowrap flex tracking-widest uppercase">
                            <span>{MARQUEE_TEXT}</span>
                            <span>{MARQUEE_TEXT}</span>
                        </div>
                    </div>

                    <div className="container relative z-30 pt-16 md:pt-24 pb-12 md:pb-16 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 px-4 md:px-8">
                        
                        {/* CONTROL PANEL LOGO SECTOR */}
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="border-[3px] md:border-4 border-black bg-white dark:bg-black p-4 md:p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#FFC800] transform -rotate-1 w-fit">
                                <div className="scale-[0.8] md:scale-[0.9] origin-center lg:origin-left -my-4">
                                    <DankLogo />
                                </div>
                                <div className="border-t-[3px] border-black dark:border-zinc-800 mt-4 md:mt-6 pt-3 md:pt-4 flex flex-col gap-1 text-center lg:text-left">
                                    <p className="text-[10px] md:text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-widest">
                                        Durum: <span className="text-green-600 dark:text-green-400">Çevrimiçi</span>
                                    </p>
                                    <p className="text-[10px] md:text-xs font-bold uppercase text-zinc-600 dark:text-zinc-500 tracking-wide">
                                        Mod: Ciddi Seviye %0.01
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SPACE THERMAL TILES (UZAY TUĞLALARI) */}
                        <div className="w-full lg:w-auto flex-1 max-w-2xl">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-zinc-300 dark:bg-zinc-900 border-[3px] md:border-4 border-black rounded-sm shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
                                <ThermalTile href="/makale" label="Blog" serial="SYS-BLG" color="hover:border-b-[#23A9FA]" />
                                <ThermalTile href="/simulasyonlar" label="Simülasyonlar" serial="SYS-SIM" color="hover:border-b-[#10B981]" />
                                <ThermalTile href="/sözlük" label="Sözlük" serial="SYS-SZL" color="hover:border-b-[#FF90E8]" />
                                <ThermalTile href="/hakkimizda" label="Hakkımızda" serial="SYS-HKM" color="hover:border-b-[#FFC800]" />
                            </div>
                            
                            {/* Auxiliary Systems */}
                            <div className="mt-3 md:mt-4 flex flex-wrap justify-center lg:justify-end gap-2 md:gap-3">
                                <AuxLink href="/iletisim" label="İletişim" />
                                <AuxLink href="/kullanim-sartlari" label="Şartlar" />
                                <AuxLink href="/gizlilik-politikasi" label="Gizlilik" />
                                <AuxLink href="/kvkk" label="KVKK" />
                            </div>
                        </div>

                    </div>
                </>
            )}

            {/* BASE PLATE (AEROSPACE CHASSIS) */}
            <div className="relative z-40 w-full border-t-[3px] md:border-t-4 border-black bg-zinc-200 dark:bg-zinc-950 py-3 md:py-4 shadow-[0_-4px_0_0_#000] md:shadow-[0_-8px_0_0_#000]">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-2 px-4 md:px-8">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-400">
                        FİZİKHUB &copy; 2026 // UZAY-ZAMAN SÜREKLİLİĞİ DEVREDE
                    </p>
                    
                    {/* Fake Serial Barcode Block */}
                    <div className="flex gap-1 items-center opacity-80 mix-blend-multiply dark:mix-blend-screen">
                        <div className="w-1 h-4 bg-zinc-800 dark:bg-zinc-500"></div>
                        <div className="w-2 h-4 bg-zinc-800 dark:bg-zinc-500"></div>
                        <div className="w-0.5 h-4 bg-zinc-800 dark:bg-zinc-500"></div>
                        <div className="w-1.5 h-4 bg-zinc-800 dark:bg-zinc-500"></div>
                        <div className="w-2 h-4 bg-zinc-800 dark:bg-zinc-500"></div>
                        <span className="text-[8px] font-mono text-zinc-800 dark:text-zinc-500 ml-1">TR-100</span>
                    </div>
                </div>
            </div>

        </footer>
    );
}

// ---------------------------------------------------------------------------------
// SPACE THERMAL TILE COMPONENT (GERÇEKÇİ UZAY TUĞLASI)
// ---------------------------------------------------------------------------------
function ThermalTile({href, label, serial, color}: {href: string, label: string, serial: string, color: string}) {
    return (
        <Link 
            href={href} 
            prefetch={false}
            className={cn(
                "group relative flex flex-col justify-between p-3 md:p-4 min-h-[90px] md:min-h-[110px] overflow-hidden",
                "bg-[#E4E4E7] dark:bg-[#1A1A1A] border-2 border-black",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                "transition-all duration-150 ease-out",
                color
            )}
        >
            {/* Tile Surface Texture (Slight metallic noise) */}
            <div 
                className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
            />
            {/* Inner Plate Detail */}
            <div className="absolute inset-1 border border-zinc-400 dark:border-zinc-700 pointer-events-none opacity-50" />
            
            {/* Serial Number (Cheeky Aerospace Detail) */}
            <div className="flex justify-between items-start w-full relative z-10">
                <span className="font-mono text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-widest">{serial}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-[#FFC800] transition-colors" />
            </div>
            
            {/* Label */}
            <div className="relative z-10 flex items-center justify-between w-full mt-4">
                <span className="font-black uppercase text-[11px] md:text-sm text-zinc-900 dark:text-zinc-100 tracking-wide group-hover:underline decoration-2 underline-offset-4">
                    {label}
                </span>
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 stroke-[3px] text-zinc-900 dark:text-zinc-100 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
        </Link>
    );
}

function AuxLink({href, label}: {href: string, label: string}) {
    return (
        <Link 
            href={href} 
            className="px-3 md:px-4 py-1.5 md:py-2 bg-zinc-200 dark:bg-zinc-800 border-[2px] border-black text-[10px] md:text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 hover:bg-[#FFC800] hover:text-black hover:border-black transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
            {label}
        </Link>
    )
}
