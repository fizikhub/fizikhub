"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v12 — PURE NEO-BRUTALISM 
// Zero bullshit. No AI-style gimmicks, no noise, no fake sci-fi.
// Just strong, clean, flat blocks and sharp typography.
// ═══════════════════════════════════════════════════════════════

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    if (isChatPage) return null;

    return (
        <footer role="contentinfo" aria-label="Site bilgileri" className={cn(
            "bg-[#FAFAFA] dark:bg-[#09090b] border-t-4 border-black dark:border-zinc-800",
            isWriterPanel ? "min-h-[150px]" : "min-h-[auto]"
        )}>
            {/* STATIC MARQUEE SLOGAN (Clean, not scrolling) */}
            {!isWriterPanel && (
                <div className="w-full bg-[#FFC800] border-b-4 border-black py-2 md:py-3 px-4 flex justify-center text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">
                        BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE
                    </p>
                </div>
            )}

            {!isWriterPanel && (
                <div className="container pt-10 pb-12 px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                        
                        {/* BRANDS & COPY */}
                        <div className="w-full lg:w-[35%] flex flex-col gap-6">
                            <div className="scale-[0.8] origin-left -ml-2 -mt-4">
                                <DankLogo />
                            </div>
                            <p className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200 uppercase leading-snug">
                                Türkiye'nin ilk ve tek <br/>
                                <span className="bg-[#FFC800] text-black px-1 mr-1">Ti'ye alan</span> 
                                bilim ağı.
                            </p>
                        </div>

                        {/* NAV PURE BRICKS */}
                        <div className="w-full lg:w-[65%] grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <BrickLink href="/makale" label="Blog" color="bg-[#40baff]" />
                            <BrickLink href="/simulasyonlar" label="Simülasyon" color="bg-[#10B981]" />
                            <BrickLink href="/sözlük" label="Sözlük" color="bg-[#FF90E8]" />
                            <BrickLink href="/hakkimizda" label="Hakkımızda" color="bg-white dark:bg-zinc-800 text-black dark:text-white" />
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM BAR */}
            <div className="w-full border-t-4 border-black dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#0A0A0A] py-4 md:py-6 relative">
                {/* Vintage Brutalist Decoration */}
                <div className="absolute left-0 top-0 w-2 h-full bg-[#FFC800] border-r-4 border-black dark:border-zinc-800"></div>

                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-10">
                    <div className="text-[11px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest">
                        &copy; 2026 FİZİKHUB
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <Link href="/iletisim" className="hover:text-black dark:hover:text-white hover:underline underline-offset-4 decoration-2">İletişim</Link>
                        <span className="opacity-30">•</span>
                        <Link href="/kullanim-sartlari" className="hover:text-black dark:hover:text-white hover:underline underline-offset-4 decoration-2">Şartlar</Link>
                        <span className="opacity-30">•</span>
                        <Link href="/gizlilik-politikasi" className="hover:text-black dark:hover:text-white hover:underline underline-offset-4 decoration-2">Gizlilik</Link>
                        <span className="opacity-30">•</span>
                        <Link href="/kvkk" className="hover:text-black dark:hover:text-white hover:underline underline-offset-4 decoration-2">KVKK</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function BrickLink({href, label, color}: {href: string, label: string, color: string}) {
    return (
        <Link 
            href={href} 
            prefetch={false}
            className={cn(
                "group flex flex-col justify-between p-3 md:p-5 border-[3px] border-black dark:border-[#3f3f46]",
                "shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]",
                "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                "transition-all min-h-[70px] md:min-h-[110px] rounded-sm",
                color
            )}
        >
            <span className={cn(
                "text-xs md:text-sm font-black uppercase tracking-wide",
                color.includes('text') ? "" : "text-black"
            )}>
                {label}
            </span>
            <div className="flex w-full justify-end">
                <ArrowUpRight className={cn(
                    "w-4 h-4 md:w-5 md:h-5 stroke-[3px] transform group-hover:scale-110 transition-transform",
                    color.includes('text') ? "" : "text-black"
                )} />
            </div>
        </Link>
    );
}
