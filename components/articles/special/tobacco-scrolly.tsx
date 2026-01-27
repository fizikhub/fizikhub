"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { Article } from "@/lib/api";
import { ArrowDown, Flame, Leaf, Skull, FlaskConical, Anchor, Map as MapIcon, Wind, Droplets } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

interface TobaccoScrollyProps {
    article: Article;
    readingTime: string;
}

export function TobaccoScrolly({ article, readingTime }: TobaccoScrollyProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Background Color Transition: Jungle -> Ocean -> Lab -> Dark
    const bgColor = useTransform(
        springScroll,
        [0, 0.25, 0.5, 0.75, 1],
        ["#051c0d", "#0c1821", "#1e293b", "#270808", "#000000"]
    );

    // --- LEAF PARTICLES ---
    const [leaves, setLeaves] = useState<{ id: number; left: string; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate random leaves
        const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 5
        }));
        setLeaves(newLeaves);
    }, []);

    // --- PARALLAX UTILS ---
    const jungleY = useTransform(springScroll, [0, 0.25], ["0%", "50%"]);
    const shipX = useTransform(springScroll, [0.20, 0.45], ["-100vw", "100vw"]);
    const waterY = useTransform(springScroll, [0.20, 0.40], ["100px", "-50px"]);

    return (
        <motion.div
            ref={containerRef}
            style={{ backgroundColor: bgColor }}
            className="min-h-[500vh] relative text-white overflow-hidden"
        >
            {/* GLOBAL PARTICLES - Falling Leaves */}
            <div className="fixed inset-0 pointer-events-none z-50">
                {leaves.map((leaf) => (
                    <motion.div
                        key={leaf.id}
                        initial={{ y: -100, opacity: 0, rotate: 0 }}
                        animate={{
                            y: "120vh",
                            opacity: [0, 1, 1, 0],
                            rotate: 360,
                            x: [0, 20, -20, 0] // Swaying effect
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            delay: leaf.delay,
                            ease: "linear"
                        }}
                        style={{ left: leaf.left }}
                        className="absolute text-amber-600/40 opacity-50"
                    >
                        <Leaf size={24} fill="currentColor" />
                    </motion.div>
                ))}
            </div>

            {/* PROGRESS BAR */}
            <motion.div
                style={{ scaleX: springScroll }}
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-red-600 z-[100] origin-left"
            />

            {/* SCENE 1: AZTEC ORIGINS (0% - 25%) */}
            <div className="h-[120vh] relative flex items-center justify-center overflow-hidden">
                {/* Parallax Background Layers */}
                <motion.div className="absolute inset-0 z-0 bg-black">
                    {/* Layer 1: Sky/Fog */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f2e18] to-transparent opacity-50" />
                    {/* Layer 2: Deep Jungle (Blurred) */}
                    <motion.div
                        style={{ y: jungleY, scale: 1.1 }}
                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center brightness-[0.4] blur-sm"
                    />
                </motion.div>

                <motion.div
                    style={{
                        opacity: useTransform(springScroll, [0, 0.15], [1, 0]),
                        y: useTransform(springScroll, [0, 0.15], [0, 100])
                    }}
                    className="relative z-10 text-center px-4"
                >
                    <span className="block mb-4 text-green-400 tracking-[0.5em] text-sm font-bold uppercase">Fizikhub Originals</span>
                    <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-tr from-green-200 via-white to-amber-200">
                        TÜTÜN
                    </h1>
                    <p className="text-xl md:text-2xl text-green-100/80 font-serif italic max-w-2xl mx-auto">
                        "Tanrıların dumanından, sanayi devriminin bacalarına..."
                    </p>
                </motion.div>

                {/* Foreground Foliage (Moves quicker) */}
                <motion.div
                    style={{ y: useTransform(springScroll, [0, 0.25], ["0%", "-20%"]) }}
                    className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#051c0d] via-black/50 to-transparent z-20 pointer-events-none"
                />
            </div>


            {/* SCENE 2: THE VOYAGE (25% - 50%) */}
            <div className="relative z-10 grid grid-cols-1 gap-32 pb-32">

                <section className="min-h-screen relative flex items-center">
                    {/* Ocean Background */}
                    <div className="absolute inset-0 z-0 bg-[#0c1821] overflow-hidden">
                        {/* Abstract Waves */}
                        <motion.div style={{ y: waterY }} className="absolute bottom-0 left-0 right-0 h-[60vh] opacity-30">
                            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full text-blue-900 fill-current">
                                <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1440,112L1440,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                            <svg viewBox="0 0 1440 320" className="absolute bottom-20 w-full h-full text-blue-800 fill-current opacity-50 animation-pulse">
                                <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1440,160L1440,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </motion.div>

                        {/* Moving Ship */}
                        <motion.div
                            style={{ x: shipX }}
                            className="absolute bottom-32 left-0 w-32 md:w-64 text-white/80"
                        >
                            <Anchor size={64} className="mx-auto mb-2 text-amber-500/80" />
                            <div className="w-full h-2 bg-black/50 blur-sm rounded-full" /> {/* Shadow */}
                            {/* Simple SVG Ship or Icon */}
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M2,18 L22,18 L22,20 L2,20 L2,18 Z M12,2 L12,16 L4,16 L12,2 Z M12,2 L20,16 L12,16 L12,2 Z" />
                            </svg>
                        </motion.div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <Wind className="animate-pulse" />
                                <h2 className="text-3xl font-bold">1492: Temas</h2>
                            </div>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                Kristof Kolomb, Bahamalar'a ayak bastığında, yerliler ona "kuru yapraklar" hediye etti.
                                Kolomb bunları değersiz görüp denize attı. Ancak mürettebatı, bu yaprakların "yorgunluğu aldığını" keşfetmekte gecikmedi.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* SCENE 3: THE CHEMISTRY (50% - 75%) */}
                <section className="min-h-screen relative flex items-center justify-center">
                    {/* Floating Molecules Background */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-dashed border-cyan-500 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-800/50 rounded-full"
                        />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-10 rounded-3xl max-w-4xl mx-auto shadow-[0_0_50px_rgba(6,182,212,0.15)]"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="p-6 bg-cyan-950/50 rounded-full">
                                    <FlaskConical size={64} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold mb-4 text-white">Nikotin: <span className="text-cyan-400">C₁₀H₁₄N₂</span></h2>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        Doğada bir böcek ilacı (insektisit) olarak evrimleşti.
                                        İnsan beyninde ise <span className="text-white font-bold">Asetilkolin</span> reseptörlerini taklit eder.
                                        Sadece 7 saniyede beyne ulaşır ve dopamin salgılatır. Bu hız, bağımlılığın anahtarıdır.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SCENE 4: THE TOLL (75% - 100%) */}
                <section className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        className="max-w-3xl"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <Skull className="w-24 h-24 text-red-600 mx-auto mb-8 animate-pulse" />
                        <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">BEDEL.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl">
                                <span className="block text-3xl font-bold text-red-500 mb-2">7000+</span>
                                <span className="text-sm text-red-200">Kimyasal Madde</span>
                            </div>
                            <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl">
                                <span className="block text-3xl font-bold text-red-500 mb-2">70</span>
                                <span className="text-sm text-red-200">Kanserojen</span>
                            </div>
                            <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl">
                                <span className="block text-3xl font-bold text-red-500 mb-2">8M/Yıl</span>
                                <span className="text-sm text-red-200">Can Kaybı</span>
                            </div>
                        </div>
                        <p className="text-xl text-zinc-400 mb-12">
                            Keyif verici bir bitki olarak başlayan yolculuk, küresel bir halk sağlığı krizine dönüştü.
                        </p>

                        <ViewTransitionLink
                            href="/blog"
                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                        >
                            Keşfetmeye Devam Et
                        </ViewTransitionLink>
                    </motion.div>
                </section>

            </div>
        </motion.div>
    );
}
