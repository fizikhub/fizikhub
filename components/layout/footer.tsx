"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FOOTER v9 — TYPOGRAPHIC NEO-BRUTALISM
// Extreme Compactness. Zero background blocks.
// Hidden emoji interactions. The ultimate "cool" factor.
// ═══════════════════════════════════════════════════════════════

const TAPE_MESSAGES = [
    "BİLİMİ Tİ YEYİP YUTUYORUZ", "ENTROPİYE KARŞI KOYAMAZSIN",
    "FİZİKHUB 2026", "E = mc²", "TEORİK AMA PRATİKTE KOMİK"
];

const MARQUEE_TEXT = Array(8).fill(TAPE_MESSAGES.join(" • ")).join(" • ");

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    if (isChatPage) return null;

    return (
        <footer role="contentinfo" aria-label="Site bilgileri"
            className={cn(
                "relative bg-[#F5F5F5] dark:bg-[#070707] flex flex-col justify-end border-t border-black/20 dark:border-white/10",
                isWriterPanel ? "min-h-[120px]" : "min-h-[auto]"
            )}
        >
            {/* INVISIBLE ACCENT GLOW (Only on dark mode for premium feel) */}
            <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-10" style={{ background: 'radial-gradient(ellipse at bottom, #FFC800 0%, transparent 50%)' }} />

            {!isWriterPanel && (
                <>
                    {/* ULTRA-THIN CAUTION TAPE MARQUEE */}
                    <div className="w-full bg-[#FFC800] border-b border-black py-1.5 z-20 flex whitespace-nowrap overflow-hidden">
                        <div className="animate-marquee flex gap-6 items-center text-black font-black text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
                            <span>{MARQUEE_TEXT}</span>
                            <span>{MARQUEE_TEXT}</span>
                        </div>
                    </div>

                    <div className="container relative z-30 pt-12 md:pt-24 pb-8 md:pb-16 px-4 md:px-8 flex flex-col md:flex-row gap-12 lg:gap-24">
                        
                        {/* BRAND / LOGO AREA - Hyper Minimal */}
                        <div className="flex flex-col gap-4 max-w-[280px]">
                            <div className="scale-[0.8] origin-left -ml-2">
                                <DankLogo />
                            </div>
                            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[200px]">
                                Türkiye'nin ilk ve tek bilimi ti'ye alan araştırma-geliştirme ağı.<br />
                            </p>
                        </div>

                        {/* LIST BASED TYPOGRAPHY NAVIGATION */}
                        <div className="flex-1 w-full">
                            <ul className="flex flex-col border-t-2 border-black/10 dark:border-white/10">
                                <TypographicLink href="/makale" label="Blog" emoji="⚛️" />
                                <TypographicLink href="/simulasyonlar" label="Simülasyonlar" emoji="🚀" />
                                <TypographicLink href="/sözlük" label="Sözlük" emoji="📚" />
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* RECEIPT STYLE BOTTOM BAR */}
            <div className="relative z-40 w-full border-t border-black/10 dark:border-zinc-800 bg-[#F5F5F5] dark:bg-[#070707] py-4">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left px-4 md:px-8">
                    
                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        <span>FİZİKHUB &copy; 2026</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800]"></span>
                        <span>ALL INTELLECTUAL PROPERTY SECURED</span>
                    </div>

                    <div className="flex gap-4 md:gap-6 text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                        <Link href="/hakkimizda" className="hover:text-black dark:hover:text-white transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="hover:text-black dark:hover:text-white transition-colors">İletişim</Link>
                        <Link href="/kullanim-sartlari" className="hover:text-black dark:hover:text-white transition-colors border-l border-zinc-300 dark:border-zinc-700 pl-4 md:pl-6">Terms</Link>
                        <Link href="/gizlilik-politikasi" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function TypographicLink({ href, label, emoji }: { href: string, label: string, emoji: string }) {
    return (
        <li className="border-b-2 border-black/10 dark:border-white/10">
            <Link 
                href={href}
                prefetch={false}
                className="group flex items-center justify-between py-4 md:py-6 overflow-hidden relative"
            >
                {/* Text Effect */}
                <div className="flex items-center gap-4 relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-3 md:group-hover:translate-x-6">
                    <span className="text-2xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black dark:text-zinc-100 group-hover:text-[#FFC800] transition-colors duration-300">
                        {label}
                    </span>
                    <span className="text-2xl md:text-4xl opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
                        {emoji}
                    </span>
                </div>
                
                {/* Arrow Icon Effect */}
                <span className="relative z-10 p-2 border-2 border-black/0 group-hover:border-black dark:group-hover:border-white rounded-full transition-colors duration-300">
                    <ArrowRight className="w-5 h-5 md:w-8 md:h-8 stroke-[3px] text-zinc-400 group-hover:text-black dark:group-hover:text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </span>

                {/* Glitch Line Hover Background */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900/50 -z-0 transition-colors duration-200" />
            </Link>
        </li>
    );
}
