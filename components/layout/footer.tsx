"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v8 — NEO-BRUTALIST HIGH PERFORMANCE
// No WebGL, No JS loops. 100% CSS.
// Zero layout shifts. High contrast. Maximum impact.
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
                "relative bg-[#EDEDED] dark:bg-[#0A0A0A] overflow-hidden flex flex-col justify-end border-t-4 border-black dark:border-zinc-800",
                isWriterPanel ? "min-h-[200px]" : "min-h-[400px] sm:min-h-[500px]"
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
                    backgroundSize: '40px 40px',
                }}
            />

            {!isWriterPanel && (
                <>
                    {/* CAUTION TAPE MARQUEE - PURE CSS */}
                    <div className="absolute top-0 left-0 w-full bg-[#FFC800] border-b-4 border-black overflow-hidden py-3 sm:py-4 z-20 flex whitespace-nowrap shadow-[0_8px_0_0_rgba(0,0,0,1)] dark:shadow-[0_8px_0_0_#1a1a1a]">
                        <div className="animate-marquee flex gap-8 items-center text-black font-black text-xl sm:text-2xl tracking-widest uppercase">
                            <span>{MARQUEE_TEXT}</span>
                            <span>{MARQUEE_TEXT}</span>
                        </div>
                    </div>

                    <div className="container relative z-30 pt-32 sm:pt-40 pb-16 px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-start">
                            
                            {/* BRAND COLUMN */}
                            <div className="flex flex-col gap-6">
                                <div className="p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFC800] transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-fit">
                                    <div className="scale-[0.8] origin-left -my-4">
                                        <DankLogo />
                                    </div>
                                    <p className="mt-6 text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide leading-relaxed">
                                        Türkiye'nin İlk ve Tek<br/>
                                        <span className="bg-[#FFC800] text-black px-1.5 py-0.5 ml-0.5">Ti'ye Alan</span> Bilim Platformu
                                    </p>
                                </div>
                            </div>

                            {/* CHUNKY LINKS GRID */}
                            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                <FooterBlockLink href="/makale" label="Blog" color="bg-[#23A9FA]" />
                                <FooterBlockLink href="/simulasyonlar" label="Simülasyonlar" color="bg-[#FFC800]" />
                                <FooterBlockLink href="/sözlük" label="Sözlük" color="bg-[#10B981]" />
                                <FooterBlockLink href="/hakkimizda" label="Hakkımızda" color="bg-white dark:bg-zinc-800" />
                                <FooterBlockLink href="/iletisim" label="İletişim" color="bg-white dark:bg-zinc-800" />
                                <div className="space-y-3 col-span-2 sm:col-span-1 border-4 border-dashed border-black/20 dark:border-white/20 p-4 flex flex-col justify-center bg-white/50 dark:bg-black/50">
                                    <Link href="/gizlilik-politikasi" className="text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">Gizlilik</Link>
                                    <Link href="/kullanim-sartlari" className="text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">Şartlar</Link>
                                    <Link href="/kvkk" className="text-sm font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] hover:underline underline-offset-4 decoration-2">KVKK</Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            {/* COPYRIGHT BAR */}
            <div className="relative z-40 w-full border-t-4 border-black dark:border-zinc-800 bg-[#FFC800] dark:bg-[#FFC800] py-4 mt-auto shadow-[0_-8px_0_0_#000] dark:shadow-[0_-8px_0_0_#1a1a1a]">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-4">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                        <p className="text-sm sm:text-base font-black text-black uppercase tracking-widest pointer-events-none select-none">
                            &copy; 2026 FİZİKHUB
                        </p>
                        <span className="hidden sm:inline text-black/30 font-black">•</span>
                        <p className="text-xs sm:text-sm font-bold text-black border-2 border-black px-2 py-0.5 transform -rotate-1 bg-white cursor-default shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-transform hover:shadow-none">
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

function FooterBlockLink({ href, label, color }: { href: string, label: string, color: string }) {
    return (
        <Link 
            href={href}
            prefetch={false}
            className={cn(
                "group relative border-4 border-black dark:border-zinc-700 p-4 sm:p-6 flex flex-col items-start justify-between min-h-[100px]",
                "shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#000]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#000]",
                "active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:active:shadow-none",
                "transition-all duration-150 ease-out",
                color
            )}
        >
            <span className="text-base sm:text-lg font-black uppercase text-black dark:text-foreground group-hover:underline underline-offset-4 decoration-[3px]">
                {label}
            </span>
            <div className="absolute bottom-4 right-4 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
            </div>
        </Link>
    );
}
