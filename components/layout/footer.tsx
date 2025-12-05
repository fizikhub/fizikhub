"use client";

import { Rocket, Github, Twitter, Instagram, Atom, Orbit, Disc } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const [isHoveringBlackHole, setIsHoveringBlackHole] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMessagesPage) return null;

    // Generate random debris for the suction effect
    const debris = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: 300 + Math.random() * 500,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2
    }));

    return (
        <footer className="relative bg-black pt-1 overflow-hidden min-h-[600px] flex flex-col justify-end">
            {/* Event Horizon Warning Line */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-20 flex items-center justify-center overflow-hidden z-50">
                <div className="animate-marquee whitespace-nowrap text-[10px] font-black text-primary uppercase tracking-[0.5em]">
                    DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ // DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ
                </div>
            </div>

            {/* Massive Black Hole Background Effect */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none">
                {/* Accretion Disk - Outer */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-primary/10 to-transparent opacity-50 blur-3xl"
                />

                {/* Accretion Disk - Inner (Faster) */}
                <motion.div
                    animate={{ rotate: -360, scale: isHoveringBlackHole ? 1.1 : 1 }}
                    transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 0.5 } }}
                    className="absolute inset-20 rounded-full bg-gradient-radial from-transparent via-orange-600/20 to-transparent blur-2xl"
                />

                {/* Event Horizon (The Void) */}
                <motion.div
                    animate={{ scale: isHoveringBlackHole ? 1.2 : 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="absolute inset-[300px] rounded-full bg-black shadow-[0_0_100px_50px_rgba(0,0,0,1)] z-10"
                />

                {/* Photon Ring */}
                <div className="absolute inset-[295px] rounded-full border-2 border-primary/50 blur-sm z-20" />

                {/* Suction Particles */}
                {debris.map((d) => (
                    <motion.div
                        key={d.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: d.size,
                            height: d.size,
                            left: '50%',
                            top: '50%',
                        }}
                        animate={{
                            x: [Math.cos(d.angle * Math.PI / 180) * d.distance, 0],
                            y: [Math.sin(d.angle * Math.PI / 180) * d.distance, 0],
                            opacity: [0, 1, 0],
                            scale: [1, 0],
                        }}
                        transition={{
                            duration: isHoveringBlackHole ? d.duration * 0.5 : d.duration,
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

                {/* Center Singularity Brand - The Trigger */}
                <div
                    className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center cursor-pointer group z-50"
                    onMouseEnter={() => setIsHoveringBlackHole(true)}
                    onMouseLeave={() => setIsHoveringBlackHole(false)}
                >
                    <div className="relative">
                        <motion.div
                            animate={{ scale: isHoveringBlackHole ? [1, 1.5, 1] : 1, opacity: isHoveringBlackHole ? 0.8 : 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/50 blur-xl rounded-full"
                        />
                        <div className="relative p-6 bg-black border-2 border-primary/50 rounded-full group-hover:border-primary transition-colors duration-300 shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                            <Atom className={`h-10 w-10 text-primary ${isHoveringBlackHole ? 'animate-spin' : ''}`} />
                        </div>
                    </div>
                    <div className="space-y-1 bg-black/50 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                        <h2 className="text-2xl font-black tracking-tighter text-white">FİZİKHUB</h2>
                        <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                            {isHoveringBlackHole ? "TEKİLLİK AKTİF" : "OLAY UFKU STABİL"}
                        </p>
                    </div>
                </div>

                {/* Technical Links Grid - Being Sucked In */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left w-full max-w-6xl pt-8 relative min-h-[300px]">
                    {/* Left Side Links - Pulled Right */}
                    <motion.div
                        className="flex flex-col gap-2 origin-bottom-right"
                        animate={{
                            rotate: isHoveringBlackHole ? 5 : 0,
                            x: isHoveringBlackHole ? 20 : 0,
                            y: isHoveringBlackHole ? 20 : 0,
                            scale: isHoveringBlackHole ? 0.9 : 1
                        }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Keşif Modülü</h4>
                        <Link href="/kesfet" className="text-sm text-muted-foreground hover:text-primary transition-colors">Keşfet</Link>
                        <Link href="/testler" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testler</Link>
                        <Link href="/sozluk" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sözlük</Link>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 origin-bottom-right"
                        animate={{
                            rotate: isHoveringBlackHole ? 10 : 0,
                            x: isHoveringBlackHole ? 40 : 0,
                            y: isHoveringBlackHole ? 40 : 0,
                            scale: isHoveringBlackHole ? 0.8 : 1
                        }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Topluluk</h4>
                        <Link href="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forum</Link>
                        <Link href="/siralamalar" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sıralamalar</Link>
                        <Link href="/yazar" className="text-sm text-muted-foreground hover:text-primary transition-colors">Yazarlar</Link>
                    </motion.div>

                    {/* Right Side Links - Pulled Left */}
                    <motion.div
                        className="flex flex-col gap-2 md:text-right origin-bottom-left"
                        animate={{
                            rotate: isHoveringBlackHole ? -10 : 0,
                            x: isHoveringBlackHole ? -40 : 0,
                            y: isHoveringBlackHole ? 40 : 0,
                            scale: isHoveringBlackHole ? 0.8 : 1
                        }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Kurumsal</h4>
                        <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">İletişim</Link>
                        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-2 md:text-right origin-bottom-left"
                        animate={{
                            rotate: isHoveringBlackHole ? -5 : 0,
                            x: isHoveringBlackHole ? -20 : 0,
                            y: isHoveringBlackHole ? 20 : 0,
                            scale: isHoveringBlackHole ? 0.9 : 1
                        }}
                    >
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Protokoller</h4>
                        <Link href="/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gizlilik</Link>
                        <Link href="/kullanim-sartlari" className="text-sm text-muted-foreground hover:text-primary transition-colors">Şartlar</Link>
                        <Link href="/kvkk" className="text-sm text-muted-foreground hover:text-primary transition-colors">KVKK</Link>
                    </motion.div>
                </div>

                {/* Bottom Bar - Safe Distance */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/10 pt-8 gap-6 bg-black/80 backdrop-blur-md rounded-t-2xl p-4 mt-20">
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
