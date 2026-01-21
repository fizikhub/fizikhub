"use client";

import { Instagram, Twitter } from "lucide-react"
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
    loading: () => <div className="w-[300px] h-[300px]" />
});

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isSingularityActive, setIsSingularityActive] = useState(true);

    // Star field state
    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
    const [galaxyStars, setGalaxyStars] = useState<Array<{ id: number; r: number; theta: number; size: number; opacity: number; color: string }>>([]);

    useEffect(() => {
        // 1. Background static stars
        const newStars = Array.from({ length: 300 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3
        }));
        setStars(newStars);

        // 2. Galaxy Spiral Stars (Logarithmic Spiral Distribution)
        // r = a * e^(b * theta)
        const galaxyStarCount = 400;
        const newGalaxyStars = [];
        const arms = 2;
        const b = 0.5; // Spiral tightness

        for (let i = 0; i < galaxyStarCount; i++) {
            const armOffset = (Math.floor(Math.random() * arms) * 2 * Math.PI) / arms;
            const randomTheta = Math.random() * 3 * Math.PI; // How far out
            const theta = randomTheta + armOffset;

            // Add some randomness to spread stars around the arm
            const spread = (Math.random() - 0.5) * 0.5 * randomTheta;
            const finalTheta = theta + spread;

            // Logarithmic spiral radius
            // Normalizing to percentage (0-50% from center)
            const r = (Math.exp(b * (randomTheta / 6)) - 1) * 15;

            // Color variations: Core is yellow/white, arms are blue/white
            const distRatio = r / 50;
            const color = distRatio < 0.2 ? 'rgb(255, 240, 200)' : // Core: Warm
                distRatio < 0.6 ? 'rgb(200, 220, 255)' : // Mid: White-Blue
                    'rgb(150, 200, 255)';                   // Edge: Blue

            if (r < 50) { // Keep within container
                newGalaxyStars.push({
                    id: i,
                    r: r, // % from center
                    theta: finalTheta,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    color: color
                });
            }
        }
        setGalaxyStars(newGalaxyStars);

    }, []);

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-[#000000] pt-1 overflow-hidden min-h-[800px] flex flex-col justify-end">

            {/* 1. LAYER: PURE BLACK BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-black" />

            {/* 2. LAYER: CUSTOM PROGRAMMATIC GALAXY */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

                {/* 
                   REALISTIC SPIRAL GALAXY ANIMATION 
                   Positioned Top-Right (Desktop) / Far Right (Mobile)
                */}
                <div className="absolute top-[-25%] right-[-50%] md:right-[-10%] md:top-[-20%] w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] opacity-70 md:opacity-100 mix-blend-screen animate-[spin_200s_linear_infinite]">

                    {/* A. Bright Galactic Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12%] h-[12%] rounded-full bg-yellow-100 blur-[20px] z-30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] rounded-full bg-orange-200/40 blur-[50px] z-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[20%] rounded-full bg-blue-900/40 blur-[80px] rotate-45 z-10" />

                    {/* B. Spiral Arms (Gradients) */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(100, 150, 255, 0.4) 70deg, transparent 140deg, transparent 180deg, rgba(100, 150, 255, 0.4) 250deg, transparent 320deg)',
                            filter: 'blur(50px)',
                            transform: 'scale(1.2)'
                        }}
                    />

                    {/* C. Dust Lanes (Subtractive Dark Swirls) */}
                    <div className="absolute inset-0 rounded-full mix-blend-multiply opacity-80"
                        style={{
                            background: 'conic-gradient(from 45deg, transparent 0deg, #000 60deg, transparent 100deg, transparent 180deg, #000 240deg, transparent 280deg)',
                            filter: 'blur(30px)',
                            transform: 'scale(1.0) rotate(10deg)'
                        }}
                    />

                    {/* D. Individual Galaxy Stars (The "it's made of stars" look) */}
                    {galaxyStars.map((star) => (
                        <div
                            key={star.id}
                            className="absolute rounded-full"
                            style={{
                                left: `${50 + star.r * Math.cos(star.theta)}%`,
                                top: `${50 + star.r * Math.sin(star.theta)}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                backgroundColor: star.color,
                                opacity: star.opacity,
                                boxShadow: `0 0 ${star.size * 2}px ${star.color}`
                            }}
                        />
                    ))}

                </div>

                {/* Secondary Nebula (Deep Space Depth) */}
                <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen" />


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


                {/* BACKGROUND STARS */}
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


            {/* Singularite Card */}
            <div className="relative z-20 mb-auto pt-24 md:pt-32">
                <DidYouKnow />
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
