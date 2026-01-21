"use client";

import { Instagram, Twitter } from "lucide-react"
import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const RealisticBlackHole = dynamic(() => import("@/components/ui/realistic-black-hole").then(mod => mod.RealisticBlackHole), {
    ssr: false,
    loading: () => <div className="w-[300px] h-[300px]" />
});

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isSingularityActive, setIsSingularityActive] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Star field state
    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
    const [galaxyObjects, setGalaxyObjects] = useState<Array<{ id: number; r: number; theta: number; size: number; opacity: number; color: string; type: 'star' | 'dust' }>>([]);

    useEffect(() => {
        const checkMobile = () => window.innerWidth < 768;
        const mobile = checkMobile();
        setIsMobile(mobile);

        // 1. Background static stars - Optimizing count for mobile
        const bgStarCount = mobile ? 50 : 300;
        const newStars = Array.from({ length: bgStarCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3
        }));
        setStars(newStars);

        // 2. Galaxy Spiral Generator (Stars + Gas Haze) - Heavily optimized for mobile
        const galaxyParticleCount = mobile ? 180 : 800;
        const newGalaxyObjects: Array<{ id: number; r: number; theta: number; size: number; opacity: number; color: string; type: 'star' | 'dust' }> = [];
        const arms = 2; // Two main arms for a grand design spiral
        const b = 0.4; // Tighter spiral

        for (let i = 0; i < galaxyParticleCount; i++) {
            const isStar = Math.random() > 0.3; // 70% stars, 30% dust haze
            const armOffset = (Math.floor(Math.random() * arms) * 2 * Math.PI) / arms;
            const randomTheta = Math.random() * 3.5 * Math.PI;
            const theta = randomTheta + armOffset;

            // Spread: More spread further out
            const spreadFactor = isStar ? 0.3 : 0.6; // Dust is more spread out
            const spread = (Math.random() - 0.5) * spreadFactor * (randomTheta * 0.5);
            const finalTheta = theta + spread;

            // Logarithmic spiral radius
            const r = (Math.exp(b * (randomTheta / 6)) - 1) * 18;

            // Color Logic
            const distRatio = r / 50;
            let color = 'white';

            if (isStar) {
                // Stars: Core=Yellow, Mid=White, Edge=Blue
                color = distRatio < 0.15 ? 'rgba(255, 220, 180, 0.9)' :
                    distRatio < 0.5 ? 'rgba(220, 240, 255, 0.8)' :
                        'rgba(160, 210, 255, 0.8)';
            } else {
                // Dust/Gas: Mix of classic dark dust and vibrant purple/pink/orange ionized gas
                const gasType = Math.random();
                if (gasType < 0.4) {
                    // Dark Dust
                    color = 'rgba(10, 5, 20, 0.8)'; // Almost black
                } else if (gasType < 0.7) {
                    // Purple/Pink Nebula (Ionized Hydrogen/Oxygen)
                    color = 'rgba(180, 50, 255, 0.15)';
                } else {
                    // Blueish gas
                    color = 'rgba(50, 100, 255, 0.1)';
                }
            }

            if (r < 60) {
                newGalaxyObjects.push({
                    id: i,
                    r: r,
                    theta: finalTheta,
                    size: isStar ? (Math.random() * 1.5 + 0.5) : (Math.random() * 25 + 10), // Larger soft gas clouds
                    opacity: isStar ? (Math.random() * 0.8 + 0.2) : (Math.random() * 0.3 + 0.1),
                    color: color,
                    type: isStar ? 'star' : 'dust'
                });
            }
        }
        setGalaxyObjects(newGalaxyObjects);

    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-[#000000] pt-1 overflow-hidden min-h-[800px] flex flex-col justify-end">

            {/* 1. BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-black" />

            {/* 2. PROGRAMMATIC GALAXY CONTAINER */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none perspective-[1000px]">

                {/* 
                   GALAXY DISK
                   Tilted 3D perspective (`rotateX(60deg)`) for a realistic view
                */}
                <div
                    className="absolute top-[-10%] right-[-40%] md:right-[-10%] md:top-[-10%] w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] opacity-80 md:opacity-100 animate-[spin_240s_linear_infinite]"
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateY(10deg)' }}
                >

                    {/* A. Intense Core Bulge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] rounded-full bg-orange-100 blur-[30px] z-40 shadow-[0_0_80px_rgba(255,200,150,0.4)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[10%] rounded-full bg-white/20 blur-[50px] z-30" />

                    {/* B. Base Glow & Spiral Arms */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(50,100,200,0.1) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                            transform: 'scale(1.0)'
                        }}
                    />

                    {/* C. Generated Particles (Stars & Dust) */}
                    {galaxyObjects.map((obj) => (
                        <div
                            key={obj.id}
                            className={cn("absolute rounded-full", obj.type === 'dust' ? "blur-[8px]" : "")}
                            style={{
                                left: `${50 + obj.r * Math.cos(obj.theta)}%`,
                                top: `${50 + obj.r * Math.sin(obj.theta)}%`,
                                width: `${obj.size}px`,
                                height: `${obj.size}px`,
                                backgroundColor: obj.color,
                                opacity: obj.opacity,
                                boxShadow: obj.type === 'star' ? `0 0 ${obj.size}px ${obj.color}` : 'none'
                            }}
                        />
                    ))}

                    {/* D. Dust Lanes (Dark Rifts) */}
                    <div className="absolute inset-0 rounded-full mix-blend-multiply opacity-70"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0deg, #000 40deg, transparent 90deg, transparent 180deg, #000 220deg, transparent 270deg)',
                            filter: 'blur(40px)',
                            transform: 'scale(0.8) rotate(20deg)'
                        }}
                    />

                </div>


                {/* SHOOTING STARS */}
                <style jsx>{`
                    @keyframes shootingStar {
                        0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 0; }
                        5% { opacity: 1; }
                        20% { opacity: 0; }
                        100% { transform: translateX(100vh) translateY(100vh) rotate(45deg); opacity: 0; }
                    }
                    .star-trail {
                        position: absolute;
                        height: 1px;
                        background: linear-gradient(to right, transparent, white, transparent);
                        animation: shootingStar linear infinite;
                        opacity: 0;
                    }
                `}</style>
                <div className="star-trail w-[150px]" style={{ top: '0%', left: '30%', animationDuration: '4s', animationDelay: '2s' }} />
                <div className="star-trail w-[200px]" style={{ top: '-10%', left: '60%', animationDuration: '6s', animationDelay: '8s' }} />
                <div className="star-trail w-[100px]" style={{ top: '20%', left: '-10%', animationDuration: '7s', animationDelay: '15s' }} />

                {/* STATIC BACKGROUND STARS */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full"
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


            {/* 3. LAYER: CONTENT */}

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


            {/* Black Hole */}
            <div className="absolute bottom-[200px] md:bottom-[240px] left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-30 pointer-events-none scale-75 md:scale-100">
                <RealisticBlackHole />
            </div>

            {/* Links Grid */}
            <div className="container relative z-30 flex flex-col items-center justify-between gap-10 py-16 md:py-20">
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
