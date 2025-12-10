"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isSingularityActive, setIsSingularityActive] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [debris, setDebris] = useState<Array<{
        id: number;
        angle: number;
        distance: number;
        size: number;
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate debris on client-side only to avoid hydration mismatch
    useEffect(() => {
        const mobile = window.innerWidth < 768;
        const debrisCount = mobile ? 18 : 25;
        const newDebris = Array.from({ length: debrisCount }).map((_, i) => ({
            id: i,
            angle: Math.random() * 360,
            distance: 300 + Math.random() * 500,
            size: mobile ? 2 : (Math.random() * 3 + 1),
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 2
        }));
        setDebris(newDebris);
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-black pt-1 overflow-hidden min-h-[600px] flex flex-col justify-end">
            {/* Event Horizon Warning Line - ENHANCED */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-10 flex items-center justify-center overflow-hidden z-50 transition-all duration-1000 border-b-2",
                isSingularityActive
                    ? "bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] border-primary/50 shadow-[0_4px_20px_rgba(234,88,12,0.3)]"
                    : "bg-black opacity-0 border-transparent"
            )}>
                <motion.div
                    animate={isSingularityActive ? {
                        x: ["0%", "-50%"],
                        opacity: [0.7, 1, 0.7]
                    } : { opacity: 0 }}
                    transition={{
                        x: { duration: 30, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="flex whitespace-nowrap text-[11px] font-black uppercase tracking-[0.5em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                    <span className="shrink-0">
                        {Array(8).fill("⚠ DİKKAT OLAY UFKU TESPİT EDİLDİ ").join(" ")}
                    </span>
                    <span className="shrink-0">
                        {Array(8).fill("⚠ DİKKAT OLAY UFKU TESPİT EDİLDİ ").join(" ")}
                    </span>
                </motion.div>
            </div>

            {/* Massive Black Hole Background Effect - ENHANCED */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none transition-opacity duration-1000" style={{ opacity: isSingularityActive ? 1 : 0.2 }}>
                {/* Accretion Disk - Layer 1 (Outermost, Slowest) */}
                <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '80s' }}>
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-gradient-conic from-transparent via-primary/15 via-transparent to-transparent blur-2xl will-change-transform"
                    )} />
                </div>

                {/* Accretion Disk - Layer 2 */}
                <div className="absolute inset-[50px] rounded-full animate-spin" style={{ animationDuration: '50s', animationDirection: 'reverse' }}>
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-gradient-conic from-orange-600/20 via-transparent via-primary/25 to-transparent blur-xl will-change-transform"
                    )} />
                </div>

                {/* Accretion Disk - Layer 3 (Fast Inner) */}
                <div className="absolute inset-[100px] rounded-full animate-spin" style={{ animationDuration: '30s' }}>
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-gradient-conic from-primary/30 via-orange-500/20 to-transparent blur-lg will-change-transform"
                    )} />
                </div>

                {/* Gravitational Lensing Rings */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.02, 1] }}
                    transition={{ rotate: { duration: 100, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[200px] rounded-full border border-white/20 z-10"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1.02, 1, 1.02] }}
                    transition={{ rotate: { duration: 120, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[240px] rounded-full border border-primary/30 z-10"
                />

                {/* Photon Ring - Enhanced Pulsing */}
                <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.01, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute inset-[290px] rounded-full border-[3px] border-white/90 z-20 shadow-[0_0_20px_rgba(255,255,255,0.8)] will-change-transform"
                    )}
                />
                <motion.div
                    animate={{ opacity: [0.6, 0.9, 0.6], scale: [1.01, 1, 1.01] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className={cn(
                        "absolute inset-[288px] rounded-full border-[6px] border-primary/60 z-19 shadow-[0_0_40px_rgba(234,88,12,0.8)] will-change-transform"
                    )}
                />

                {/* Event Horizon (The Void) - Breathing */}
                <motion.div
                    animate={{ scale: [1, 1.015, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[300px] rounded-full bg-black z-30"
                />

                {/* Energy Jets (Polar) */}
                {!isMobile && (
                    <>
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 -translate-x-1/2 top-[280px] w-[4px] h-[100px] bg-gradient-to-t from-primary/80 to-transparent z-5"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            className="absolute left-1/2 -translate-x-1/2 bottom-[280px] w-[4px] h-[100px] bg-gradient-to-b from-primary/80 to-transparent z-5"
                        />
                    </>
                )}

                {/* Suction Particles - Enhanced Variety & Physics */}
                {debris.map((d) => (
                    <motion.div
                        key={d.id}
                        className="absolute rounded-full z-10 will-change-transform"
                        style={{
                            width: d.size,
                            height: d.size,
                            left: '50%',
                            top: '50%',
                            backgroundColor: d.id % 3 === 0 ? '#fff' : (d.id % 3 === 1 ? '#ea580c' : '#fb923c'),
                        }}
                        animate={isSingularityActive ? {
                            x: [Math.cos(d.angle * Math.PI / 180) * (isMobile ? 150 : 300), 0], // Reduced start distance on mobile for visibility
                            y: [Math.sin(d.angle * Math.PI / 180) * (isMobile ? 150 : 300), 0],
                            opacity: [0, 1, 0], // Fade in then out
                            scale: [0.5, 1, 0], // Grow then shrink into void
                        } : {
                            opacity: 0
                        }}
                        transition={{
                            duration: isMobile ? 1.5 : d.duration, // Faster suction on mobile for impact
                            repeat: Infinity,
                            delay: d.delay,
                            ease: "easeIn" // Gravity acceleration feel
                        }}
                    />
                ))}
            </div>

            <div className="relative z-20 mb-auto pt-10">
                <DidYouKnow />
            </div>

            <div className="container relative z-30 flex flex-col items-center justify-between gap-20 py-16 md:py-20">

                {/* Center Singularity Brand & Toggle - FIXED LAYOUT */}
                <div className="absolute bottom-[300px] left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-50">
                    <div className="relative flex items-center justify-center">
                        {/* The Singularity Core - NOW INTERACTIVE */}
                        <div
                            className="relative cursor-pointer z-50 group"
                            onClick={() => setIsSingularityActive(!isSingularityActive)}
                        >
                            <motion.div
                                animate={{ scale: isSingularityActive ? [1, 1.2, 1] : 1, opacity: isSingularityActive ? [0.5, 0.8, 0.5] : 0.2 }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={cn(
                                    "absolute inset-0 bg-primary/50 rounded-full group-hover:scale-110 transition-transform duration-500",
                                    isMobile ? "" : "blur-xl"
                                )}
                            />
                            <div className={cn(
                                "relative p-6 bg-black border-2 rounded-full transition-all duration-500 group-hover:border-primary group-hover:scale-105",
                                isSingularityActive ? "border-primary shadow-[0_0_30px_rgba(234,88,12,0.5)]" : "border-white/10 hover:border-white/30",
                                !isMobile && isSingularityActive && "shadow-[0_0_50px_rgba(234,88,12,0.6)]"
                            )}>
                                {/* Solid Singularity Core */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full transition-all duration-1000",
                                    isSingularityActive ? "bg-white shadow-[0_0_20px_#fff,0_0_40px_#ea580c] scale-100 animate-pulse" : "bg-zinc-900 scale-75"
                                )} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-8 text-center md:text-left w-full max-w-2xl mx-auto pt-8 relative min-h-[300px]">
                    {/* 1. Keşif Modülü */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Keşif Modülü</h4>
                        <Link href="/kesfet" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Keşfet</Link>
                        <Link href="/testler" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Testler</Link>
                        <Link href="/sozluk" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sözlük</Link>
                    </div>

                    {/* 2. Topluluk */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Topluluk</h4>
                        <Link href="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Forum</Link>
                        <Link href="/siralamalar" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sıralamalar</Link>
                        <Link href="/yazar" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Yazarlar</Link>
                    </div>

                    {/* 3. Kurumsal */}
                    <div className="flex flex-col gap-2 md:text-right">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Kurumsal</h4>
                        <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">İletişim</Link>
                        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Blog</Link>
                    </div>

                    {/* 4. Protokoller */}
                    <div className="flex flex-col gap-2 md:text-right">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Protokoller</h4>
                        <Link href="/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Gizlilik</Link>
                        <Link href="/kullanim-sartlari" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Şartlar</Link>
                        <Link href="/kvkk" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">KVKK</Link>
                    </div>
                </div>

                {/* Bottom Bar - Safe Distance */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/10 pt-8 gap-6 bg-black/80 backdrop-blur-md rounded-t-2xl p-4 mt-20 relative z-40">
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground text-center md:text-left">
                        <Rocket className="h-6 w-6 text-primary animate-bounce" />
                        <p>
                            &copy; 2025 FİZİKHUB // TÜM HAKLARI SAKLIDIR.
                            <br />
                            <span className="text-primary/60">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://instagram.com/fizikhub" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="https://twitter.com/fizikhub" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="https://github.com/fizikhub" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
