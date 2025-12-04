"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { BookOpen, MessageCircle, Sparkles, Rocket, Atom, Stars, ArrowRight, Brain, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection3D() {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

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
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background"
        >
            {/* Dynamic Aurora Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow mix-blend-screen will-change-transform" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000 mix-blend-screen will-change-transform" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow delay-2000 mix-blend-screen will-change-transform" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Floating Parallax Icons - Desktop Only */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                    <ParallaxIcon icon={Atom} className="top-[15%] left-[10%] text-blue-400" mouseX={mouseX} mouseY={mouseY} speed={2} />
                    <ParallaxIcon icon={Rocket} className="top-[20%] right-[10%] text-purple-400" mouseX={mouseX} mouseY={mouseY} speed={-2} />
                    <ParallaxIcon icon={Stars} className="bottom-[20%] left-[15%] text-pink-400" mouseX={mouseX} mouseY={mouseY} speed={1.5} />
                    <ParallaxIcon icon={Brain} className="bottom-[25%] right-[15%] text-cyan-400" mouseX={mouseX} mouseY={mouseY} speed={-1.5} />
                    <ParallaxIcon icon={Globe} className="top-[50%] left-[5%] text-emerald-400 opacity-50" mouseX={mouseX} mouseY={mouseY} speed={1} />
                    <ParallaxIcon icon={Zap} className="top-[45%] right-[5%] text-yellow-400 opacity-50" mouseX={mouseX} mouseY={mouseY} speed={-1} />
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-10">

                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200" />
                            <div className="relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-background/80 border border-primary/20 backdrop-blur-md shadow-xl">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                    Fizik & Bilim Dünyası
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Heading with Shimmer */}
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter"
                        >
                            <span className="block mb-2 text-foreground drop-shadow-sm">Sorgula, Araştır,</span>
                            <span className="block relative">
                                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                    Keşfetmeye Başla
                                </span>
                                <motion.span
                                    className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10"
                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
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
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Makaleler, tartışma forumu ve bilim sözlüğü ile fiziği derinlemesine öğren.
                        <span className="text-foreground font-medium"> Aklındaki soruları sor, cevaplar bul.</span> 🚀
                    </motion.p>

                    {/* Feature Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <FeaturePill icon={BookOpen} text="Güncel Makaleler" delay={0} />
                        <FeaturePill icon={MessageCircle} text="Canlı Tartışmalar" delay={0.1} />
                        <FeaturePill icon={Brain} text="Bilim Sözlüğü" delay={0.2} />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                    >
                        <Button
                            size="lg"
                            className="relative group rounded-full text-lg h-14 px-10 overflow-hidden"
                            asChild
                        >
                            <Link href="/blog">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] animate-gradient-x" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                                <div className="relative flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Makaleleri Keşfet</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full text-lg h-14 px-10 border-2 hover:bg-muted/50 transition-all duration-300 group"
                            asChild
                        >
                            <Link href="/forum">
                                <MessageCircle className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                                <span>Foruma Katıl</span>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Keşfet</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
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
                <div className="absolute inset-0 bg-current blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <Icon className="w-12 h-12 sm:w-16 sm:h-16 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            </div>
        </motion.div>
    );
}

function FeaturePill({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + delay }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted/30 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-default shadow-sm hover:shadow-md"
        >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">{text}</span>
        </motion.div>
    );
}
