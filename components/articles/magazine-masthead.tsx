"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Search, Sparkles, TrendingUp, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";

interface MagazineMastheadProps {
    articleCount?: number;
    categories?: string[];
    activeCategory?: string;
}

export function MagazineMasthead({ articleCount = 0, categories = [], activeCategory }: MagazineMastheadProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Parallax scroll effects
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Mouse tracking for interactive background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseX.set((e.clientX - rect.left - rect.width / 2) / 50);
            mouseY.set((e.clientY - rect.top - rect.height / 2) / 50);
        }
    };

    // Live clock
    const [time, setTime] = useState("");
    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.header
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black"
        >
            {/* Animated Background Grid */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

                {/* Floating gradient orbs */}
                <motion.div
                    style={{ x: smoothMouseX, y: smoothMouseY }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]"
                />
                <motion.div
                    style={{ x: smoothMouseX, y: smoothMouseY }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"
                />
            </motion.div>

            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            CANLI
                        </span>
                        <span>{time}</span>
                        <span className="hidden sm:inline">VOL. 2026</span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                        <span>{articleCount} MAKALE</span>
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Masthead */}
            <motion.div
                style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
                className="relative z-10 text-center px-6"
            >
                {/* Overline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <div className="h-px w-12 bg-amber-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500">
                        BİLİMSEL DERGİ
                    </span>
                    <div className="h-px w-12 bg-amber-500" />
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    <span className="block text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] font-black tracking-[-0.06em] leading-[0.85] text-black dark:text-white">
                        FİZİKHUB
                    </span>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                        JOURNAL
                    </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-16 text-lg sm:text-xl text-neutral-500 max-w-xl mx-auto font-medium leading-relaxed"
                >
                    Evrenin sırlarını çözen, bilimin sınırlarını zorlayan makaleler.
                </motion.p>
            </motion.div>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center"
                    >
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="absolute top-8 right-8 text-neutral-400 hover:text-black dark:hover:text-white"
                        >
                            ✕
                        </button>
                        <div className="w-full max-w-2xl px-6">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Makale ara..."
                                autoFocus
                                className="w-full text-4xl sm:text-6xl font-black bg-transparent border-none outline-none text-black dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 text-center"
                            />
                            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-neutral-400">
                                <span>Önerilen:</span>
                                <button className="hover:text-amber-500 transition-colors">Kuantum</button>
                                <button className="hover:text-amber-500 transition-colors">Kara Delik</button>
                                <button className="hover:text-amber-500 transition-colors">Görelilik</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-12 left-0 right-0 z-10"
            >
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <CategoryPill href="/makale" active={!activeCategory}>
                            <Sparkles className="w-3 h-3" />
                            Tümü
                        </CategoryPill>
                        <CategoryPill href="/makale?sort=popular" active={false}>
                            <TrendingUp className="w-3 h-3" />
                            Popüler
                        </CategoryPill>
                        <CategoryPill href="/makale?sort=latest" active={false}>
                            <Clock className="w-3 h-3" />
                            Yeni
                        </CategoryPill>
                        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-2" />
                        {categories.slice(0, 5).map(cat => (
                            <CategoryPill key={cat} href={`/makale?category=${cat}`} active={activeCategory === cat}>
                                {cat}
                            </CategoryPill>
                        ))}
                    </div>
                </div>
            </motion.nav>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <ChevronDown className="w-5 h-5 text-neutral-300" />
                </motion.div>
            </motion.div>
        </motion.header>
    );
}

function CategoryPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${active
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`}
        >
            {children}
        </Link>
    );
}
