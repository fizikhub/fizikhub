"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v8.1 — PREMIUM COMPACT NEO-BRUTALIST
// Optimized for mobile (less vertical height).
// Premium "space brick" textures (noise + inner borders + gradients).
// ═══════════════════════════════════════════════════════════════

const TAPE_MESSAGES = [
    "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE", "E = mc²",
    "FİZİK KURALLARI İHLAL EDİLEMEZ", "F = ma",
    "KARADELİĞE DÜŞERSEN GERİ DÖNEMEZSİN", "ΔxΔp ≥ ℏ/2",
    "ENTROPİ SÜREKLİ ARTAR", "∇ × E = -∂B/∂t",
    "KEDİ HEM CANLI HEM ÖLÜ", "S = k log W"
];

const MARQUEE_TEXT = Array(4).fill(TAPE_MESSAGES.join(" • ")).join(" • ");

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    if (isChatPage) return null;

    return (
        <footer role="contentinfo" aria-label="Site bilgileri"
            className={cn(
                "relative bg-[#EDEDED] dark:bg-[#0A0A0A] overflow-hidden flex flex-col justify-end border-t-[3px] md:border-t-4 border-black dark:border-zinc-800",
                isWriterPanel ? "min-h-[150px]" : "min-h-[auto] sm:min-h-[500px]"
            )}
        >
            {/* RAW GRID BACKGROUND */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                }}
            />

            {!isWriterPanel && (
                <>
                    {/* CAUTION TAPE MARQUEE - PURE CSS */}
                    <div className="absolute top-0 left-0 w-full bg-[#FFC800] border-b-[3px] md:border-b-4 border-black overflow-hidden py-1.5 md:py-4 z-20 flex whitespace-nowrap shadow-[0_4px_0_0_rgba(0,0,0,1)] md:shadow-[0_8px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_#1a1a1a] md:dark:shadow-[0_8px_0_0_#1a1a1a]">
                        <div className="animate-marquee flex gap-4 md:gap-8 items-center text-black font-black text-xs md:text-2xl tracking-widest uppercase">
                            <span>{MARQUEE_TEXT}</span>
                            <span>{MARQUEE_TEXT}</span>
                        </div>
                    </div>

                    <div className="container relative z-30 pt-[4.5rem] md:pt-40 pb-8 md:pb-16 px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 lg:gap-16 items-start">
                            
                            {/* BRAND COLUMN */}
                            <div className="flex flex-col gap-4 md:gap-6">
                                <div className="p-4 md:p-6 bg-white dark:bg-zinc-900 border-[3px] md:border-4 border-black dark:border-zinc-700 rounded-lg md:rounded-xl shadow-[4px_4px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFC800] md:dark:shadow-[8px_8px_0px_0px_#FFC800] transform -rotate-1 md:-rotate-2 hover:rotate-0 transition-transform duration-300 w-fit">
                                    <div className="scale-[0.7] md:scale-[0.8] origin-left -my-4 md:-my-4">
                                        <DankLogo />
                                    </div>
                                    <p className="mt-4 md:mt-6 text-xs md:text-base font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide md:leading-relaxed">
                                        Türkiye'nin İlk ve Tek<br/>
                                        <span className="bg-[#FFC800] text-black px-1 md:px-1.5 py-0.5 ml-0.5">Ti'ye Alan</span> Bilim Platformu
                                    </p>
                                </div>
                            </div>

                            {/* CHUNKY PREMIUM LINKS GRID */}
                            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                                <FooterBlockLink 
                                    href="/makale" 
                                    label="Blog" 
                                    bgClass="bg-gradient-to-br from-[#40baff] to-[#0a8ae6]" 
                                    textClass="text-white"
                                />
                                <FooterBlockLink 
                                    href="/simulasyonlar" 
                                    label="Simülasyonlar" 
                                    bgClass="bg-gradient-to-br from-[#ffd53d] to-[#e5a900]" 
                                    textClass="text-black"
                                />
                                <FooterBlockLink 
                                    href="/sözlük" 
                                    label="Sözlük" 
                                    bgClass="bg-gradient-to-br from-[#2ea87a] to-[#057A55]" 
                                    textClass="text-white"
                                />
                                <FooterBlockLink 
                                    href="/hakkimizda" 
                                    label="Hakkımızda" 
                                    bgClass="bg-gradient-to-br from-white to-neutral-200 dark:from-zinc-700 dark:to-zinc-800" 
                                    textClass="text-black dark:text-white"
                                />
                                <FooterBlockLink 
                                    href="/iletisim" 
                                    label="İletişim" 
                                    bgClass="bg-gradient-to-br from-white to-neutral-200 dark:from-zinc-700 dark:to-zinc-800" 
                                    textClass="text-black dark:text-white"
                                />
                                <div className="col-span-2 sm:col-span-1 border-[3px] md:border-4 border-dashed border-black/20 dark:border-white/20 p-3 md:p-4 flex flex-col justify-center gap-1.5 md:gap-3 bg-white/50 dark:bg-black/50">
                                    <Link href="/gizlilik-politikasi" className="text-[10px] md:text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">Gizlilik</Link>
                                    <Link href="/kullanim-sartlari" className="text-[10px] md:text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">Şartlar</Link>
                                    <Link href="/kvkk" className="text-[10px] md:text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">KVKK</Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            {/* COPYRIGHT BAR */}
            <div className="relative z-40 w-full border-t-[3px] md:border-t-4 border-black dark:border-zinc-800 bg-[#FFC800] dark:bg-[#FFC800] py-2 md:py-4 mt-auto shadow-[0_-4px_0_0_#000] md:shadow-[0_-8px_0_0_#000] dark:shadow-[0_-4px_0_0_#1a1a1a] md:dark:shadow-[0_-8px_0_0_#1a1a1a]">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3 text-center sm:text-left px-4">
                    <div className="flex flex-col sm:flex-row items-center gap-1.5 md:gap-6">
                        <p className="text-[10px] md:text-base font-black text-black uppercase tracking-widest pointer-events-none select-none">
                            &copy; 2026 FİZİKHUB
                        </p>
                        <span className="hidden sm:inline text-black/30 font-black">•</span>
                        <p className="text-[9px] md:text-sm font-bold text-black border-2 border-black px-1.5 md:px-2 py-0.5 transform -rotate-1 bg-white cursor-default shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-transform hover:shadow-none">
                            İZİNSİZ KOPYALAYANI KARADELİĞE ATARIZ.
                        </p>
                    </div>
                    {/* Fake Barcode Stamp */}
                    <div className="hidden lg:flex items-center gap-1 opacity-60 mix-blend-multiply">
                        <div className="w-1 h-8 bg-black"></div>
                        <div className="w-2 h-8 bg-black"></div>
                        <div className="w-1 h-8 bg-black"></div>
                        <div className="w-0.5 h-8 bg-black"></div>
                        <div className="w-3 h-8 bg-black"></div>
                        <div className="w-1 h-8 bg-black"></div>
                        <div className="w-2 h-8 bg-black"></div>
                        <div className="w-0.5 h-8 bg-black"></div>
                        <div className="text-[10px] font-black text-black ml-2 tabular-nums">100%<br/>RAW</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterBlockLink({ href, label, bgClass, textClass }: { href: string, label: string, bgClass: string, textClass: string }) {
    return (
        <Link 
            href={href}
            prefetch={false}
            className={cn(
                "group relative border-[2.5px] md:border-4 border-black dark:border-zinc-800 p-2.5 md:p-6 flex flex-col items-start justify-between min-h-[70px] md:min-h-[100px] overflow-hidden rounded-sm md:rounded-md",
                "shadow-[3px_3px_0px_0px_#000] md:shadow-[6px_6px_0px_0px_#000]",
                "hover:translate-x-[1px] hover:translate-y-[1px] md:hover:translate-x-[2px] md:hover:translate-y-[2px]",
                "hover:shadow-[2px_2px_0px_0px_#000] md:hover:shadow-[4px_4px_0px_0px_#000]",
                "active:translate-x-[3px] active:translate-y-[3px] md:active:translate-x-[6px] md:active:translate-y-[6px]",
                "active:shadow-none md:active:shadow-none dark:active:shadow-none",
                "transition-all duration-150 ease-out",
                bgClass
            )}
        >
            {/* Premium Texture Overlay (Subtle Noise) */}
            <div 
                className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
            />
            {/* Inner Metallic Highlight */}
            <div className="absolute inset-0 box-border border-t-[1.5px] border-l-[1.5px] border-white/40 pointer-events-none rounded-sm md:rounded-md mix-blend-overlay" />

            <span className={cn(
                "relative z-10 text-[11px] md:text-lg font-black uppercase group-hover:underline underline-offset-[3px] md:underline-offset-4 decoration-2 md:decoration-[3px]",
                textClass
            )}>
                {label}
            </span>
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 -translate-x-2 md:-translate-x-4 group-hover:translate-x-0 transition-all z-10">
                <ArrowUpRight className="w-3 h-3 md:w-5 md:h-5 stroke-[2.5px] md:stroke-[3px]" />
            </div>
        </Link>
    );
}
