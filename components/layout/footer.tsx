"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { SiteLogo } from "@/components/icons/site-logo";
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

    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 10 + 10,
        }));
        setStars(newStars);
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-[#050505] pt-1 overflow-hidden min-h-[600px] flex flex-col justify-end">
            {/* Star Field Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>
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

            </div>

            {/* Bottom Bar - Flush to bottom */}
            <div className="relative z-40 w-full border-t border-white/10 bg-black/80 backdrop-blur-md">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-6 py-6">
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground text-center md:text-left">
                        <SiteLogo className="h-8 w-8 animate-bounce" />
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
