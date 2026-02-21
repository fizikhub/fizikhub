"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");

    if (isMessagesPage) return null;

    return (
        <footer
            role="contentinfo"
            aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden"
        >
            {/* ═══════════════ SPACE BACKGROUND ═══════════════ */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Base black */}
                <div className="absolute inset-0 bg-black" />

                {/* Subtle nebula glows — lightweight */}
                <div className="absolute top-[10%] right-[5%] w-48 h-48 md:w-72 md:h-72 rounded-full bg-purple-900/10 blur-[80px]" />
                <div className="absolute bottom-[20%] left-[10%] w-56 h-56 md:w-80 md:h-80 rounded-full bg-blue-900/8 blur-[90px]" />
                <div className="absolute top-[40%] left-[50%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-indigo-900/6 blur-[60px]" />

                {/* Shooting stars — CSS animated, diagonal */}
                <div className="shooting-star" style={{ top: '5%', left: '-5%', animationDelay: '0s', animationDuration: '4s' }} />
                <div className="shooting-star" style={{ top: '20%', left: '-10%', animationDelay: '3s', animationDuration: '3.2s' }} />
                <div className="shooting-star" style={{ top: '35%', left: '-3%', animationDelay: '7s', animationDuration: '3.8s' }} />
                <div className="shooting-star" style={{ top: '55%', left: '-8%', animationDelay: '11s', animationDuration: '2.8s' }} />
                <div className="shooting-star" style={{ top: '12%', left: '-12%', animationDelay: '15s', animationDuration: '3.5s' }} />
                <div className="shooting-star" style={{ top: '70%', left: '-6%', animationDelay: '19s', animationDuration: '4.2s' }} />

                {/* Fade-in mask from top */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent h-[120px]" />
            </div>

            {/* ═══════════════ CONTENT ═══════════════ */}

            {/* Links Grid */}
            <div className="container relative z-30 py-16 md:py-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-center md:text-left w-full max-w-4xl mx-auto">

                    {/* 1. Keşif Modülü */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <h4 className="text-xs font-bold text-blue-100 uppercase tracking-widest">Keşif Modülü</h4>
                        </div>
                        <nav aria-label="Keşif bağlantıları" className="flex flex-col gap-2.5">
                            <Link href="/kesfet" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Keşfet</Link>
                            <Link href="/testler" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Testler</Link>
                            <Link href="/sozluk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sözlük</Link>
                        </nav>
                    </div>

                    {/* 2. Topluluk */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            <h4 className="text-xs font-bold text-purple-100 uppercase tracking-widest">Topluluk</h4>
                        </div>
                        <nav className="flex flex-col gap-2.5">
                            <Link href="/forum" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Forum</Link>
                            <Link href="/siralamalar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sıralamalar</Link>
                            <Link href="/yazar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Yazarlar</Link>
                        </nav>
                    </div>

                    {/* 3. Kurumsal */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <h4 className="text-xs font-bold text-green-100 uppercase tracking-widest">Kurumsal</h4>
                        </div>
                        <nav className="flex flex-col gap-2.5">
                            <Link href="/hakkimizda" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Hakkımızda</Link>
                            <Link href="/iletisim" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">İletişim</Link>
                            <Link href="/blog" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Blog</Link>
                        </nav>
                    </div>

                    {/* 4. Protokoller */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <h4 className="text-xs font-bold text-red-100 uppercase tracking-widest">Protokoller</h4>
                        </div>
                        <nav className="flex flex-col gap-2.5">
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Gizlilik</Link>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Şartlar</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">KVKK</Link>
                        </nav>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full max-w-4xl mx-auto mt-14 mb-2 border-t border-zinc-800/60" />
            </div>

            {/* Bottom Bar */}
            <div className="relative z-40 w-full border-t border-zinc-800/40 bg-zinc-950/80 backdrop-blur-sm pb-10 pt-6">
                <div className="container flex flex-col items-center justify-center gap-4 text-center">
                    <SiteLogo className="h-9 w-9 text-yellow-400 opacity-90" />
                    <div className="flex flex-col items-center gap-1.5">
                        <p className="text-xs font-mono text-zinc-500">
                            &copy; 2025 FİZİKHUB.
                        </p>
                        <span className="text-orange-500/80 font-bold text-[10px] tracking-[0.2em] font-mono">
                            İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
