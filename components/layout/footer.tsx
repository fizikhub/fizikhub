"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// FOOTER v7 — Lightweight Cosmic CSS (No WebGL)
// Replaced 160-step ray-traced black hole with pure CSS gradient
// ~6,700x lighter on GPU while maintaining cosmic aesthetic
// ═══════════════════════════════════════════════════════════════

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const isWriterPanel = pathname?.startsWith('/yazar-paneli') || pathname?.startsWith('/yazar/');

    return (
        <footer role="contentinfo" aria-label="Site bilgileri"
            className={cn(
                "relative bg-black overflow-hidden flex flex-col justify-end",
                isChatPage ? "hidden" : "flex",
                isWriterPanel ? "min-h-[200px] md:min-h-[200px]" : "min-h-[520px] md:min-h-[650px]"
            )}
        >
            {/* COSMIC CSS BACKGROUND — Ultra-lightweight replacement */}
            {!isWriterPanel && (
                <div className="absolute inset-0 z-0">
                    {/* Deep space radial gradient */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `
                                radial-gradient(ellipse 60% 50% at 50% 60%, rgba(20, 10, 40, 0.9) 0%, transparent 70%),
                                radial-gradient(ellipse 40% 35% at 50% 65%, rgba(40, 15, 10, 0.6) 0%, transparent 60%),
                                radial-gradient(ellipse 25% 20% at 50% 70%, rgba(60, 25, 5, 0.4) 0%, transparent 50%),
                                radial-gradient(ellipse 8% 6% at 50% 72%, rgba(255, 200, 100, 0.08) 0%, transparent 100%),
                                linear-gradient(180deg, transparent 0%, rgba(5, 2, 15, 0.95) 40%, #000 100%)
                            `,
                        }}
                    />

                    {/* Subtle CSS stars via box-shadow (0 GPU compute, pure raster) */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `
                                radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8), transparent),
                                radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.6), transparent),
                                radial-gradient(1px 1px at 40% 15%, rgba(255,255,255,0.7), transparent),
                                radial-gradient(1.5px 1.5px at 55% 45%, rgba(255,220,180,0.9), transparent),
                                radial-gradient(1px 1px at 70% 25%, rgba(255,255,255,0.5), transparent),
                                radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.6), transparent),
                                radial-gradient(1px 1px at 15% 65%, rgba(255,255,255,0.4), transparent),
                                radial-gradient(1.5px 1.5px at 30% 80%, rgba(180,200,255,0.7), transparent),
                                radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.5), transparent),
                                radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.4), transparent),
                                radial-gradient(1px 1px at 5% 45%, rgba(255,255,255,0.3), transparent),
                                radial-gradient(1px 1px at 92% 15%, rgba(255,255,255,0.6), transparent),
                                radial-gradient(2px 2px at 48% 68%, rgba(255,180,100,0.5), transparent),
                                radial-gradient(1px 1px at 75% 85%, rgba(255,255,255,0.4), transparent),
                                radial-gradient(1px 1px at 35% 50%, rgba(200,220,255,0.5), transparent)
                            `,
                            backgroundSize: '100% 100%',
                        }}
                    />

                    {/* Faint accretion disk hint — pure CSS, no animation */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 opacity-[0.07]"
                        style={{
                            bottom: '35%',
                            width: '80%',
                            maxWidth: '600px',
                            height: '3px',
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,150,50,0.8) 20%, rgba(255,220,150,1) 50%, rgba(255,150,50,0.8) 80%, transparent 100%)',
                            borderRadius: '50%',
                            filter: 'blur(6px)',
                        }}
                    />

                    {/* Event horizon hint — dark circle */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 rounded-full"
                        style={{
                            bottom: '30%',
                            width: '60px',
                            height: '60px',
                            background: 'radial-gradient(circle, #000 40%, rgba(0,0,0,0.8) 60%, transparent 100%)',
                            boxShadow: '0 0 40px 15px rgba(255,150,50,0.04), 0 0 80px 30px rgba(100,50,150,0.03)',
                        }}
                    />
                </div>
            )}

            {/* SMOOTH GRADIENT TRANSITION — shrunken on mobile to avoid covering the hole */}
            <div className="absolute inset-x-0 top-0 z-10 pointer-events-none h-[150px] md:h-[400px] bg-gradient-to-b from-background via-background/80 to-background/0" />

            {/* CLEAN INLINE LINKS */}
            <div className="relative z-30 mt-auto pb-3 pt-6">
                <nav aria-label="Footer bağlantıları" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4">
                    <Link prefetch={false} href="/hakkimizda" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">Hakkımızda</Link>
                    <span className="text-zinc-500 text-[8px]">•</span>
                    <Link prefetch={false} href="/iletisim" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">İletişim</Link>
                    <span className="text-zinc-500 text-[8px]">•</span>
                    <Link prefetch={false} href="/makale" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">Blog</Link>
                    <span className="text-zinc-500 text-[8px]">•</span>
                    <Link prefetch={false} href="/gizlilik-politikasi" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">Gizlilik</Link>
                    <span className="text-zinc-500 text-[8px]">•</span>
                    <Link prefetch={false} href="/kullanim-sartlari" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">Şartlar</Link>
                    <span className="text-zinc-500 text-[8px]">•</span>
                    <Link prefetch={false} href="/kvkk" className="text-xs font-bold text-zinc-200 hover:text-white transition-colors duration-300 uppercase tracking-widest drop-shadow-md">KVKK</Link>
                </nav>
            </div>

            {/* COPYRIGHT BAR — Desktop only, mobile handled by BottomNav */}
            <div className="hidden md:block relative z-40 w-full border-t border-white/[0.06] bg-black/60 backdrop-blur-sm pb-4 pt-3 mt-auto">
                <div className="container flex flex-col items-center justify-center gap-1.5 text-center">
                    <div className="scale-[0.55] origin-center -my-2">
                        <DankLogo />
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500">&copy; 2025 FİZİKHUB.</p>
                    <span
                        className="font-black text-[11px] tracking-[0.25em] uppercase"
                        style={{
                            background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: 'none',
                            filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.4))',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    >
                        İzinsiz kopyalayanı kara deliğe atarız.
                    </span>
                    <style>{`
                        @keyframes shimmer {
                            0%, 100% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                        }
                    `}</style>
                </div>
            </div>
        </footer>
    );
}
