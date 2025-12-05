"use client";

import { Rocket, Github, Twitter, Instagram, Atom, Orbit, Disc, Power } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isSingularityActive, setIsSingularityActive] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMessagesPage) return null;

    // AGGRESSIVE OPTIMIZATION: Very few particles on mobile
    const debrisCount = isMobile ? 5 : 15;
    const debris = Array.from({ length: debrisCount }).map((_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: 300 + Math.random() * 500,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2
    }));

    // Permanent breathing animation for the pull intensity
    const pullIntensity = {
        scale: isSingularityActive ? [0.9, 0.85, 0.9] : 1,
        rotate: isSingularityActive ? [5, 7, 5] : 0,
        x: isSingularityActive ? [20, 25, 20] : 0,
        y: isSingularityActive ? [20, 25, 20] : 0,
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <footer className="relative bg-black pt-1 overflow-hidden min-h-[600px] flex flex-col justify-end">
            {/* Event Horizon Warning Line */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-8 flex items-center justify-center overflow-hidden z-50 transition-all duration-1000",
                isSingularityActive ? "bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-20" : "bg-black opacity-0"
            )}>
                <div className="animate-marquee whitespace-nowrap text-[10px] font-black text-primary uppercase tracking-[0.5em]">
                    DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ // DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ
                </div>
            </div>

            {/* Massive Black Hole Background Effect - OPTIMIZED */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none transition-opacity duration-1000 will-change-transform" style={{ opacity: isSingularityActive ? 1 : 0.2 }}>
                {/* Accretion Disk - Outer - Simplified for Mobile */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "absolute inset-0 rounded-full bg-gradient-radial from-transparent via-primary/10 to-transparent",
                        isMobile ? "opacity-30" : "opacity-50 blur-2xl"
                    )}
                />

                {/* Accretion Disk - Inner (Faster) */}
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.05, 1] }}
                    transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                    className={cn(
                        "absolute inset-20 rounded-full bg-gradient-radial from-transparent via-orange-600/30 to-transparent",
                        isMobile ? "" : "blur-xl"
                    )}
                />

                {/* Photon Ring - The Bright Edge */}
                <div className={cn(
                    "absolute inset-[290px] rounded-full border-[3px] border-white/80 z-20",
                    isMobile ? "" : "shadow-[0_0_20px_rgba(255,255,255,0.8)] blur-[1px]"
                )} />
                <div className={cn(
                    "absolute inset-[290px] rounded-full border-[6px] border-primary/50 z-10",
                    isMobile ? "" : "shadow-[0_0_40px_rgba(234,88,12,0.8)] blur-sm"
                )} />

                {/* Event Horizon (The Void) */}
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-[300px] rounded-full bg-black z-30"
                />

                {/* Suction Particles - OPTIMIZED */}
                {debris.map((d) => (
                    <motion.div
                        key={d.id}
                        className="absolute bg-white rounded-full z-10"
                        style={{
                            width: d.size,
                            height: d.size,
                            left: '50%',
                            top: '50%',
                        }}
                        animate={isSingularityActive ? {
                            x: [Math.cos(d.angle * Math.PI / 180) * d.distance, 0],
                            y: [Math.sin(d.angle * Math.PI / 180) * d.distance, 0],
                            opacity: [0, 1, 0],
                            scale: [1, 0],
                        } : {
                            opacity: 0
                        }}
                        transition={{
                            duration: d.duration,
                            repeat: Infinity,
                            delay: d.delay,
                            ease: "easeIn"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-20 mb-auto pt-10">
                <DidYouKnow />
            </div>

            <div className="container relative z-30 flex flex-col items-center justify-between gap-20 py-16 md:py-20">

                {/* Center Singularity Brand & Toggle - FIXED LAYOUT */}
                <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 flex items-center justify-center z-50">
                    <div className="relative flex items-center">
                        {/* The Singularity Core */}
                        <div className="relative pointer-events-none z-10">
                            <motion.div
                                animate={{ scale: isSingularityActive ? [1, 1.2, 1] : 1, opacity: isSingularityActive ? [0.5, 0.8, 0.5] : 0.2 }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={cn(
                                    "absolute inset-0 bg-primary/50 rounded-full",
                                    isMobile ? "" : "blur-xl"
                                )}
                            />
                            <div className={cn(
                                "relative p-6 bg-black border-2 rounded-full transition-all duration-500",
                                isSingularityActive ? "border-primary" : "border-white/10",
                                !isMobile && isSingularityActive && "shadow-[0_0_30px_rgba(234,88,12,0.5)]"
                            )}>
                                <Atom className={cn(
                                    "h-10 w-10 transition-all duration-1000",
                                    isSingularityActive ? "text-primary animate-spin" : "text-white/20"
                                )} />
                            </div>
                        </div>

                        {/* Control Panel - Flex Positioned */}
                        <div
                            className="absolute left-[80%] ml-4 flex flex-col items-start gap-1 cursor-pointer group w-max z-20"
                            onClick={() => setIsSingularityActive(!isSingularityActive)}
                        >
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors",
                                isMobile ? "bg-black border-white/20" : "bg-black/80 backdrop-blur-md border-white/10 shadow-2xl group-hover:border-primary/50"
                            )}>
                                <Power className={cn(
                                    "h-3 w-3",
                                    isSingularityActive ? "text-primary" : "text-white/40"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-black tracking-tighter uppercase transition-colors",
                                    isSingularityActive ? "text-white" : "text-white/40"
                                )}>
                                    FİZİKHUB
                                </span>
                            </div>
                            <p className={cn(
                                "text-[7px] font-mono uppercase tracking-widest pl-1 transition-colors",
                                isSingularityActive ? "text-primary animate-pulse" : "text-white/20"
                            )}>
                                {isSingularityActive ? "AKTİF" : "PASİF"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left w-full max-w-6xl pt-8 relative min-h-[300px]">
                    {/* Left Side Links */}
                    <motion.div
                        className="flex flex-col gap-2 origin-bottom-right"
                        animate={{
                            rotate: pullIntensity.rotate,
                            x: pullIntensity.x,
                            y: pullIntensity.y,
                            scale: pullIntensity.scale
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Keşif Modülü</h4>
                        <Link href="/kesfet" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Keşfet</Link>
                        <Link href="/testler" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Testler</Link>
                        <Link href="/sozluk" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sözlük</Link>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 origin-bottom-right"
                        animate={isSingularityActive ? {
                            rotate: [10, 12, 10],
                            x: [40, 45, 40],
                            y: [40, 45, 40],
                            scale: [0.8, 0.75, 0.8]
                        } : { rotate: 0, x: 0, y: 0, scale: 1 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Topluluk</h4>
                        <Link href="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Forum</Link>
                        <Link href="/siralamalar" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sıralamalar</Link>
                        <Link href="/yazar" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Yazarlar</Link>
                    </motion.div>

                    {/* Right Side Links */}
                    <motion.div
                        className="flex flex-col gap-2 md:text-right origin-bottom-left"
                        animate={isSingularityActive ? {
                            rotate: [-10, -12, -10],
                            x: [-40, -45, -40],
                            y: [40, 45, 40],
                            scale: [0.8, 0.75, 0.8]
                        } : { rotate: 0, x: 0, y: 0, scale: 1 }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Kurumsal</h4>
                        <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">İletişim</Link>
                        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Blog</Link>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 md:text-right origin-bottom-left"
                        animate={isSingularityActive ? {
                            rotate: [-5, -7, -5],
                            x: [-20, -25, -20],
                            y: [20, 25, 20],
                            scale: [0.9, 0.85, 0.9]
                        } : { rotate: 0, x: 0, y: 0, scale: 1 }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Protokoller</h4>
                        <Link href="/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Gizlilik</Link>
                        <Link href="/kullanim-sartlari" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Şartlar</Link>
                        <Link href="/kvkk" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">KVKK</Link>
                    </motion.div>
                </div>

                {/* Bottom Bar - Safe Distance */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/10 pt-8 gap-6 bg-black/80 backdrop-blur-md rounded-t-2xl p-4 mt-20 relative z-40">
                    <p className="text-xs font-mono text-muted-foreground text-center md:text-left">
                        &copy; 2025 FİZİKHUB // TÜM HAKLARI SAKLIDIR.
                        <br />
                        <span className="text-primary/60">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                    </p>

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
