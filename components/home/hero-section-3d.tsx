"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { BookOpen, MessageCircle, Sparkles, Rocket, Atom, Stars, ArrowRight, Brain, Zap, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection3D() {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const y = useTransform(scrollY, [0, 300], [0, 100]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-background"
        >
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-background to-background" />

            {/* Dynamic Aurora Background - Optimized */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow mix-blend-screen will-change-transform" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000 mix-blend-screen will-change-transform" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse-slow delay-2000 mix-blend-screen will-change-transform" />

                {/* Star Field Effect */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Floating Parallax Icons - Desktop Only */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <ParallaxIcon icon={Atom} className="top-[15%] left-[10%] text-blue-500/40" mouseX={mouseX} mouseY={mouseY} speed={2} />
                    <ParallaxIcon icon={Rocket} className="top-[20%] right-[10%] text-purple-500/40" mouseX={mouseX} mouseY={mouseY} speed={-2} />
                    <ParallaxIcon icon={Stars} className="bottom-[20%] left-[15%] text-pink-500/40" mouseX={mouseX} mouseY={mouseY} speed={1.5} />
                    <ParallaxIcon icon={Brain} className="bottom-[25%] right-[15%] text-cyan-500/40" mouseX={mouseX} mouseY={mouseY} speed={-1.5} />
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-screen">
                <div className="text-center space-y-8 max-w-4xl mx-auto">

                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500" />
                            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Türkiye'nin En Kapsamlı Bilim Platformu
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]"
                        >
                            <span className="block text-foreground drop-shadow-2xl">
                                EVRENİ
                            </span>
                            <span className="block relative">
                                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                    KEŞFET
                                </span>
                                <motion.span
                                    className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl -z-10"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </span>
                        </motion.h1>
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light px-4"
                    >
                        Fizik, uzay ve bilim dünyasına dair her şey burada.
                        <br className="hidden sm:block" />
                        <span className="text-foreground font-medium">Sorgula, öğren ve tartış.</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 w-full sm:w-auto"
                    >
                        <Button
                            size="lg"
                            className="w-full sm:w-auto relative group rounded-full text-lg h-14 px-8 overflow-hidden shadow-lg shadow-primary/25"
                            asChild
                        >
                            <Link href="/blog">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] animate-gradient-x" />
                                <div className="relative flex items-center justify-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Okumaya Başla</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto rounded-full text-lg h-14 px-8 border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 group"
                            asChild
                        >
                            <Link href="/forum">
                                <MessageCircle className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                                <span>Topluluğa Katıl</span>
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Feature Pills - Bottom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="pt-12 sm:pt-20 flex flex-wrap justify-center gap-4 sm:gap-8 opacity-70"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Güncel Makaleler
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Aktif Forum
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Bilim Sözlüğü
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity, y }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Aşağı Kaydır</span>
                <ChevronDown className="w-6 h-6 text-muted-foreground/50 animate-bounce" />
            </motion.div>
        </section>
    );
}

function ParallaxIcon({
    icon: Icon,
    className,
    mouseX,
    mouseY,
    speed
}: {
    icon: any;
    className: string;
    mouseX: any;
    mouseY: any;
    speed: number;
}) {
    const x = useTransform(mouseX, (val: any) => val * speed * 0.02);
    const y = useTransform(mouseY, (val: any) => val * speed * 0.02);

    return (
        <motion.div
            style={{ x, y }}
            className={`absolute ${className}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: Math.random() }}
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-current blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <Icon className="w-12 h-12 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
            </div>
        </motion.div>
    );
}

