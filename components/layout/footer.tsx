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
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

            {/* Massive Black Hole Background Effect - MOBILE OPTIMIZED */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none transition-opacity duration-1000" style={{ opacity: isSingularityActive ? 1 : 0.2 }}>

                {/* Warped Spacetime Background */}
                <div className="absolute inset-[-50px] bg-gradient-radial from-violet-900/10 via-transparent to-transparent opacity-30" />

                {/* Outer Accretion Disk */}
                {isMobile ? (
                    <div className="absolute inset-[0px] rounded-full">
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,rgba(234,88,12,0.08)_60deg,rgba(234,88,12,0.15)_120deg,transparent_180deg,rgba(234,88,12,0.08)_240deg,rgba(234,88,12,0.12)_300deg,transparent_360deg)]" />
                    </div>
                ) : (
                    <motion.div
                        className="absolute inset-[0px] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,rgba(234,88,12,0.1)_60deg,rgba(234,88,12,0.2)_120deg,transparent_180deg,rgba(234,88,12,0.1)_240deg,rgba(234,88,12,0.15)_300deg,transparent_360deg)] blur-3xl" />
                    </motion.div>
                )}

                {/* Inner Accretion Disk */}
                {isMobile ? (
                    <div className="absolute inset-[100px] rounded-full">
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(234,88,12,0.25)_60deg,rgba(255,255,255,0.08)_120deg,transparent_180deg,rgba(234,88,12,0.25)_240deg,rgba(255,255,255,0.08)_300deg,transparent_360deg)]" />
                    </div>
                ) : (
                    <motion.div
                        className="absolute inset-[100px] rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(234,88,12,0.3)_60deg,rgba(255,255,255,0.1)_120deg,transparent_180deg,rgba(234,88,12,0.3)_240deg,rgba(255,255,255,0.1)_300deg,transparent_360deg)] blur-2xl" />
                    </motion.div>
                )}

                {/* Event Horizon - The Absolute Void */}
                {isMobile ? (
                    <div className="absolute inset-[250px] rounded-full bg-black z-30 shadow-[0_0_40px_rgba(234,88,12,0.25)]">
                        {/* Photon Ring */}
                        <div className="absolute inset-[-2px] rounded-full border border-orange-500/25" />
                    </div>
                ) : (
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-[250px] rounded-full bg-black z-30 shadow-[0_0_60px_rgba(234,88,12,0.3)]"
                    >
                        {/* Photon Ring */}
                        <div className="absolute inset-[-2px] rounded-full border border-orange-500/30 blur-[1px]" />
                    </motion.div>
                )}

            </div>

            <div className="relative z-20 mb-auto pt-10">
                <DidYouKnow />
            </div>

            {/* Center Singularity Brand & Toggle */}
            <div className="absolute bottom-[300px] left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-50">
                <div className="relative flex items-center justify-center">
                    {/* The Singularity Core - INTERACTIVE */}
                    <div
                        className="relative cursor-pointer z-50 group"
                        onClick={() => setIsSingularityActive(!isSingularityActive)}
                    >
                        <motion.div
                            animate={{ scale: isSingularityActive ? [1, 1.2, 1] : 1, opacity: isSingularityActive ? [0.5, 0.8, 0.5] : 0.2 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={cn(
                                "absolute inset-0 bg-primary/20 rounded-full group-hover:scale-110 transition-transform duration-500",
                                isMobile ? "" : "blur-xl"
                            )}
                        />
                        <div className={cn(
                            "relative p-8 bg-black border-2 rounded-full transition-all duration-500 group-hover:border-primary group-hover:scale-105",
                            isSingularityActive ? "border-primary shadow-[0_0_40px_rgba(234,88,12,0.4)]" : "border-white/10 hover:border-white/30",
                        )}>
                            {/* Solid Singularity Core */}
                            <div className={cn(
                                "w-16 h-16 rounded-full transition-all duration-1000",
                                isSingularityActive ? "bg-white shadow-[0_0_30px_#fff,0_0_60px_#ea580c] scale-100" : "bg-zinc-800 scale-90"
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
