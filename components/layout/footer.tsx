"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const RealisticBlackHole = dynamic(() => import("@/components/ui/realistic-black-hole").then(mod => mod.RealisticBlackHole), {
    ssr: false,
    loading: () => <div className="w-[500px] h-[500px]" />
});

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isSingularityActive, setIsSingularityActive] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    // Shooting stars state
    const [shootingStars, setShootingStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // Initial shooting stars setup
        setShootingStars(Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 50,
            delay: Math.random() * 20
        })));

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; opacity: number }>>([]);

    useEffect(() => {
        // High density star field
        const newStars = Array.from({ length: 300 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.1,
            duration: Math.random() * 5 + 3,
            opacity: Math.random() * 0.8 + 0.2
        }));
        setStars(newStars);
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-[#020202] pt-1 overflow-hidden min-h-[700px] flex flex-col justify-end">
            {/* Deep Space Background Layer */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,_#0a0a0a_0%,_#000000_100%)]" />

            {/* REALISTIC GALAXY SYSTEM */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

                {/* 1. Large Spiral Galaxy (Top Left) */}
                <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] opacity-60 animate-[spin_200s_linear_infinite]">
                    {/* Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/30 blur-[60px] rounded-full" />
                    {/* Arms */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(120,50,255,0.2)_90deg,transparent_180deg,rgba(120,50,255,0.2)_270deg,transparent_360deg)] blur-[50px]" />
                </div>

                {/* 1.5. Second Spiral Galaxy (Bottom Right - Subtle) */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] opacity-40 animate-[spin_150s_linear_infinite_reverse]">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(50,100,255,0.15)_120deg,transparent_240deg)] blur-[40px]" />
                </div>

                {/* 2. Distant Nebula (Bottom Right) */}
                <div className="absolute bottom-0 right-0 w-[1000px] h-[600px] bg-gradient-to-t from-blue-900/10 via-transparent to-transparent blur-[100px] opacity-40 mix-blend-screen" />

                {/* 3. Colorful Star Clusters */}
                <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-indigo-600/10 blur-[80px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />

                {/* 4. Shooting Stars */}
                {shootingStars.map((star) => (
                    <motion.div
                        key={star.id}
                        initial={{ x: -100, y: -100, opacity: 0, scale: 0.5 }}
                        animate={{
                            x: ['10vw', '120vw'],
                            y: ['-10vh', '120vh'],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{
                            duration: Math.random() * 1.5 + 0.5, // Faster, random speed
                            repeat: Infinity,
                            repeatDelay: Math.random() * 15 + 5, // More random delays
                            ease: "easeIn" // Accelerate like gravity
                        }}
                        className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent via-blue-100 to-transparent rotate-45 blur-[0.5px]"
                        style={{ top: `${star.y - 20}%`, left: `${star.x - 20}%` }}
                    />
                ))}

                {/* Static Star Field */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full transition-opacity duration-1000"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Event Horizon Warning Line */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-8 flex items-center justify-center overflow-hidden z-50 transition-all duration-1000 border-b border-orange-900/30",
                isSingularityActive ? "bg-orange-950/20" : "bg-transparent"
            )}>
                <motion.div
                    animate={isSingularityActive ? { x: ["0%", "-50%"] } : {}}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap text-[9px] font-black uppercase tracking-[0.5em] text-orange-500/60"
                >
                    {Array(20).fill("⚠ DİKKAT OLAY UFKU TESPİT EDİLDİ • ").map((text, i) => (
                        <span key={i} className="shrink-0 mx-4">{text}</span>
                    ))}
                </motion.div>
            </div>

            <div className="relative z-20 mb-auto pt-16">
                <DidYouKnow />
            </div>

            {/* Center Singularity Brand & Toggle */}
            <div className="absolute bottom-[200px] md:bottom-[240px] left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-30 pointer-events-none scale-75 md:scale-100">
                <RealisticBlackHole />
            </div>

            <div className="container relative z-30 flex flex-col items-center justify-between gap-10 py-16 md:py-20">

                {/* Technical Links Grid - Enhanced Visibility */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-center md:text-left w-full max-w-4xl mx-auto pt-8 relative">

                    {/* 1. Keşif Modülü */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            <h4 className="text-xs font-bold text-blue-100 uppercase tracking-widest">Keşif Modülü</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/kesfet" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Keşfet</Link>
                            <Link href="/testler" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Testler</Link>
                            <Link href="/sozluk" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Sözlük</Link>
                        </nav>
                    </div>

                    {/* 2. Topluluk */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            <h4 className="text-xs font-bold text-purple-100 uppercase tracking-widest">Topluluk</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/forum" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Forum</Link>
                            <Link href="/siralamalar" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Sıralamalar</Link>
                            <Link href="/yazar" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Yazarlar</Link>
                        </nav>
                    </div>

                    {/* 3. Kurumsal */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                            <h4 className="text-xs font-bold text-green-100 uppercase tracking-widest">Kurumsal</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/hakkimizda" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Hakkımızda</Link>
                            <Link href="/iletisim" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">İletişim</Link>
                            <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Blog</Link>
                        </nav>
                    </div>

                    {/* 4. Protokoller */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            <h4 className="text-xs font-bold text-red-100 uppercase tracking-widest">Protokoller</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Gizlilik</Link>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">Şartlar</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 duration-300">KVKK</Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Flush to bottom */}
            <div className="relative z-40 w-full border-t border-white/5 bg-black/90 backdrop-blur-md">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-6 py-6">
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 text-center md:text-left">
                        <SiteLogo className="h-8 w-8 text-white" />
                        <p>
                            &copy; 2025 FİZİKHUB // <span className="text-zinc-300">TÜM HAKLARI SAKLIDIR.</span>
                            <br />
                            <span className="text-orange-500/80">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://instagram.com/fizikhub" target="_blank" rel="noopener noreferrer" className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 hover:scale-110">
                            <Instagram className="h-4 w-4" />
                        </a>
                        <a href="https://twitter.com/fizikhub" target="_blank" rel="noopener noreferrer" className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 hover:scale-110">
                            <Twitter className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer >
    )
}
