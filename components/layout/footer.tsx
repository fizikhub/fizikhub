"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isMobile, setIsMobile] = useState(false);

    // Star field state
    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
    const [galaxyObjects, setGalaxyObjects] = useState<Array<{ id: number; r: number; theta: number; size: number; opacity: number; color: string; type: 'star' | 'dust' }>>([]);

    useEffect(() => {
        const checkMobile = () => window.innerWidth < 768;
        const mobile = checkMobile();
        setIsMobile(mobile);

        // 1. Background static stars
        const newStars = Array.from({ length: 300 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3
        }));
        setStars(newStars);

        // 2. Galaxy Spiral Generator (Stars + Gas Haze)
        const galaxyParticleCount = 800;
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
        <footer className="relative bg-[#000000] pt-1 overflow-hidden min-h-[600px] md:min-h-[800px] flex flex-col justify-end [mask-image:linear-gradient(to_bottom,transparent,black_150px)]">

            {/* 1. BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-black" />

            {/* 2. PROGRAMMATIC GALAXY CONTAINER */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none perspective-[1000px]">

                {/* 
                   GALAXY DISK
                   Tilted 3D perspective (`rotateX(60deg)`) for a realistic view
                */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1400px] md:h-[1400px] animate-[spin_240s_linear_infinite]"
                    style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(45deg) rotateY(10deg)' }}
                >

                    {/* A. Intense Core Bulge - BRIGHTER & BIGGER */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] rounded-full bg-orange-100 blur-[40px] z-40 shadow-[0_0_100px_rgba(255,220,180,0.8)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[15%] rounded-full bg-white/40 blur-[60px] z-30" />

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


            {/* Links Grid */}
            <div className="container relative z-30 flex flex-col items-center justify-between gap-10 py-12 md:py-20 min-h-[500px] justify-center">
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
            <div className="relative z-40 w-full border-t border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] pb-12 pt-8">
                <div className="container flex flex-col items-center justify-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-3 text-xs font-mono text-zinc-500">
                        <SiteLogo className="h-10 w-10 text-white opacity-80 mb-2" />
                        <p className="text-zinc-400 leading-relaxed">
                            &copy; 2025 FİZİKHUB.
                            <br />
                            <span className="text-orange-500/90 font-bold text-[10px] tracking-[0.2em] mt-2 block shadow-orange-500/20 drop-shadow-lg">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
