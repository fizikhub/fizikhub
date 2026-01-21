"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import Image from "next/image";
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

    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // Star field setup
        const newStars = Array.from({ length: 200 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.3,
            opacity: Math.random() * 0.5 + 0.2
        }));
        setStars(newStars);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-black pt-1 overflow-hidden min-h-[700px] flex flex-col justify-end">
            {/* Pure Black Background */}
            <div className="absolute inset-0 z-0 bg-black" />

            {/* REALISTIC SPACE IMAGERY */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-80">
                {/* 1. Spiral Galaxy (Andromeda-like) - Top Right */}
                <div className="absolute -top-[10%] -right-[15%] w-[800px] h-[800px] opacity-60 mix-blend-screen rotate-12">
                    <Image
                        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"
                        alt="Spiral Galaxy"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* 2. Nebula Cloud - Bottom Left */}
                <div className="absolute bottom-[10%] -left-[10%] w-[900px] h-[700px] opacity-50 mix-blend-screen -rotate-12">
                    <Image
                        src="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=2000&auto=format&fit=crop"
                        alt="Nebula"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* 3. Milky Way Dust - Center Diagonal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30 mix-blend-screen -rotate-45 pointer-events-none">
                    <Image
                        src="https://images.unsplash.com/photo-1534849144194-b791dc089d61?q=80&w=2000&auto=format&fit=crop"
                        alt="Milky Way"
                        fill
                        className="object-cover blur-sm"
                    />
                </div>

                {/* CSS Shooting Stars */}
                <style jsx>{`
                    @keyframes shootingStar {
                        0% {
                            transform: translate(-100px, -100px) rotate(45deg);
                            opacity: 0;
                        }
                        10% { opacity: 1; }
                        80% { opacity: 0; }
                        100% {
                            transform: translate(calc(80vw + 100px), calc(80vh + 100px)) rotate(45deg);
                            opacity: 0;
                        }
                    }
                    .shooting-star {
                        position: absolute;
                        width: 150px;
                        height: 2px;
                        background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 50%, rgba(255,255,255,0));
                        filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
                        animation: shootingStar linear infinite;
                        opacity: 0;
                    }
                `}</style>

                <div className="shooting-star" style={{ top: '0%', left: '10%', animationDuration: '6s', animationDelay: '2s' }} />
                <div className="shooting-star" style={{ top: '10%', left: '40%', animationDuration: '5s', animationDelay: '7s' }} />
                <div className="shooting-star" style={{ top: '-10%', left: '70%', animationDuration: '7s', animationDelay: '12s' }} />
                <div className="shooting-star" style={{ top: '40%', left: '-10%', animationDuration: '5.5s', animationDelay: '18s' }} />

                {/* Static Star Field */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity * 0.9,
                            boxShadow: `0 0 ${star.size}px rgba(255,255,255,${star.opacity})`
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
                {/* Technical Links Grid */}
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

            {/* Bottom Bar */}
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
        </footer>
    );
}
