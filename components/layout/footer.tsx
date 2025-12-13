"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { CustomRocketIcon } from "@/components/ui/custom-rocket-icon";
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

            {/* Massive Black Hole Background Effect - CINEMATIC ULTRA-REALISTIC */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none transition-opacity duration-1000" style={{ opacity: isSingularityActive ? 1 : 0.2 }}>

                {/* Warped Spacetime Background - Gravitational Lensing Field */}
                <div className="absolute inset-[-100px]">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={`warp-${i}`}
                            className="absolute rounded-full border border-white/[0.03]"
                            style={{ inset: `${i * 35}px` }}
                            animate={{
                                rotate: i % 2 === 0 ? 360 : -360,
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                rotate: { duration: 80 + i * 10, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                            }}
                        />
                    ))}
                </div>

                {/* Outer Accretion Disk - Redshifted (Moving Away) - Doppler Effect */}
                <motion.div
                    className="absolute inset-[-20px] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,rgba(180,50,0,0.3)_60deg,rgba(255,100,0,0.2)_120deg,transparent_180deg,rgba(100,20,0,0.15)_240deg,rgba(180,50,0,0.25)_300deg,transparent_360deg)] blur-2xl" />
                </motion.div>

                {/* Main Accretion Disk - Hot Orange/Yellow Core */}
                <motion.div
                    className="absolute inset-[40px] rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,rgba(255,150,0,0.5)_30deg,rgba(255,200,50,0.7)_60deg,rgba(255,220,100,0.6)_90deg,transparent_120deg,rgba(255,100,0,0.3)_180deg,transparent_240deg,rgba(255,180,0,0.5)_300deg,rgba(255,200,50,0.6)_330deg,transparent_360deg)] blur-xl" />
                </motion.div>

                {/* Inner Accretion Disk - Superheated White/Blue (Relativistic) */}
                <motion.div
                    className="absolute inset-[100px] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,200,0.8)_20deg,rgba(200,220,255,0.6)_40deg,transparent_80deg,rgba(255,200,100,0.4)_160deg,transparent_200deg,rgba(255,255,220,0.7)_280deg,rgba(180,200,255,0.5)_320deg,transparent_360deg)] blur-lg" />
                    {/* Bright spot from relativistic beaming */}
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[30px] bg-white/40 rounded-full blur-md"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </motion.div>

                {/* Innermost Stable Circular Orbit (ISCO) Ring */}
                <motion.div
                    className="absolute inset-[180px] rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 rounded-full border-[8px] border-t-yellow-300/60 border-r-orange-400/40 border-b-orange-600/20 border-l-yellow-200/50 blur-sm" />
                </motion.div>

                {/* Einstein Ring / Gravitational Lensing Arcs */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.03, 1] }}
                    transition={{ rotate: { duration: 120, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[220px] rounded-full border-2 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10"
                />
                <motion.div
                    animate={{ rotate: -360, opacity: [0.4, 0.7, 0.4] }}
                    transition={{ rotate: { duration: 100, repeat: Infinity, ease: "linear" }, opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[250px] rounded-full border border-orange-300/40 shadow-[0_0_20px_rgba(251,146,60,0.4)] z-10"
                />

                {/* Photon Sphere - Critical Light Orbit */}
                <motion.div
                    animate={{ opacity: [0.85, 1, 0.85], scale: [0.995, 1.005, 0.995] }}
                    transition={{ duration: 0.15, repeat: Infinity }}
                    className="absolute inset-[278px] rounded-full border-[3px] border-white z-20 shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(255,200,100,0.6)]"
                />
                {/* Secondary photon ring - orange glow */}
                <motion.div
                    animate={{ opacity: [0.6, 1, 0.6], scale: [1.005, 0.995, 1.005] }}
                    transition={{ duration: 0.2, repeat: Infinity, delay: 0.05 }}
                    className="absolute inset-[275px] rounded-full border-[5px] border-orange-500/70 z-19 shadow-[0_0_40px_rgba(234,88,12,1),0_0_80px_rgba(234,88,12,0.5)]"
                />

                {/* Hawking Radiation - Quantum Glow at Event Horizon */}
                <motion.div
                    animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[245px] rounded-full bg-gradient-radial from-cyan-400/25 via-blue-500/15 to-transparent blur-lg z-15"
                />

                {/* Event Horizon - The Absolute Void - ENLARGED & ULTRA-REALISTIC */}
                {/* Outer gravitational shadow */}
                <div className="absolute inset-[248px] rounded-full bg-gradient-radial from-black via-black/95 to-transparent z-28" />
                {/* Main event horizon */}
                <motion.div
                    animate={{ scale: [1, 1.005, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[250px] rounded-full bg-[#000000] z-30 shadow-[inset_0_0_100px_rgba(0,0,0,1),inset_0_0_40px_rgba(20,20,30,0.5),0_0_60px_rgba(0,0,0,0.9)]"
                >
                    {/* Deep void center - pure nothingness */}
                    <div className="absolute inset-[20px] rounded-full bg-[#000000]" />
                    {/* Subtle edge definition */}
                    <div className="absolute inset-0 rounded-full border border-white/[0.02]" />
                </motion.div>

                {/* Relativistic Jets - Upper */}
                {!isMobile && (
                    <>
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 bottom-[50%] w-[80px] h-[350px] origin-bottom z-5"
                            animate={{ scaleY: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 0.08, repeat: Infinity }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-400/50 via-cyan-300/30 to-transparent blur-lg" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[6px] h-full bg-gradient-to-t from-white/80 via-cyan-200/60 to-transparent blur-[2px]" />
                            {/* Jet particles */}
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={`jet-up-${i}`}
                                    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                                    style={{ bottom: `${20 + i * 15}%` }}
                                    animate={{
                                        y: [-20, -100],
                                        opacity: [1, 0],
                                        scale: [1, 0.3]
                                    }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
                                />
                            ))}
                        </motion.div>
                        {/* Lower Jet */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-[50%] w-[80px] h-[350px] origin-top z-5"
                            animate={{ scaleY: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 0.08, repeat: Infinity, delay: 0.04 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/50 via-cyan-300/30 to-transparent blur-lg" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[6px] h-full bg-gradient-to-b from-white/80 via-cyan-200/60 to-transparent blur-[2px]" />
                        </motion.div>
                    </>
                )}

                {/* Infalling Matter - Spaghettification Effect */}
                {debris.map((d) => (
                    <motion.div
                        key={d.id}
                        className="absolute z-20"
                        style={{
                            width: d.size * 1.5,
                            height: d.size * 0.6,
                            left: '50%',
                            top: '50%',
                            background: d.id % 4 === 0 ? '#fff' : (d.id % 4 === 1 ? '#fbbf24' : (d.id % 4 === 2 ? '#f97316' : '#60a5fa')),
                            boxShadow: `0 0 ${d.size * 3}px ${d.id % 4 === 0 ? '#fff' : (d.id % 4 === 1 ? '#fbbf24' : (d.id % 4 === 2 ? '#f97316' : '#60a5fa'))}`,
                            borderRadius: '50%',
                        }}
                        animate={isSingularityActive ? {
                            x: [Math.cos(d.angle * Math.PI / 180) * 380, 0],
                            y: [Math.sin(d.angle * Math.PI / 180) * 380, 0],
                            rotate: [0, 720 + d.angle],
                            scaleX: [1, 3, 0.1],
                            scaleY: [1, 0.3, 0.1],
                            opacity: [0, 1, 1, 0],
                        } : { opacity: 0 }}
                        transition={{
                            duration: d.duration * 0.7,
                            repeat: Infinity,
                            delay: d.delay,
                            ease: [0.32, 0, 0.67, 0]
                        }}
                    />
                ))}
            </div>

            <div className="relative z-20 mb-auto pt-10">
                <DidYouKnow />
            </div>

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
                            "relative p-8 bg-black border-2 rounded-full transition-all duration-500 group-hover:border-primary group-hover:scale-105",
                            isSingularityActive ? "border-primary shadow-[0_0_40px_rgba(234,88,12,0.6)]" : "border-white/10 hover:border-white/30",
                            !isMobile && isSingularityActive && "shadow-[0_0_60px_rgba(234,88,12,0.7)]"
                        )}>
                            {/* Solid Singularity Core - ENLARGED */}
                            <div className={cn(
                                "w-16 h-16 rounded-full transition-all duration-1000",
                                isSingularityActive ? "bg-white shadow-[0_0_30px_#fff,0_0_60px_#ea580c] scale-100 animate-pulse" : "bg-zinc-800 scale-90"
                            )} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container relative z-30 flex flex-col items-center justify-between gap-20 py-16 md:py-20">

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
                        <CustomRocketIcon className="h-6 w-6 text-primary animate-bounce" />
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
        </footer >
    )
}
