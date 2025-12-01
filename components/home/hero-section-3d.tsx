"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Sparkles, Rocket, Atom, Stars, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection3D() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                {/* Floating Icons - Desktop Only */}
                {!isMobile && (
                    <>
                        <FloatingIcon icon={Atom} className="top-1/4 left-[15%] text-blue-400" delay={0} />
                        <FloatingIcon icon={Rocket} className="top-1/3 right-[20%] text-purple-400" delay={0.5} />
                        <FloatingIcon icon={Stars} className="bottom-1/4 left-[20%] text-pink-400" delay={1} />
                        <FloatingIcon icon={Brain} className="bottom-1/3 right-[15%] text-cyan-400" delay={1.5} />
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                Bilim Artık Daha Eğlenceli
                            </span>
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="block mb-2">Evrenin Sırlarını</span>
                            <span className="block bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Birlikte Keşfedelim
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        Fizik, uzay ve bilim meraklılarının buluşma noktası.
                        <span className="text-foreground font-medium"> Öğren, paylaş, tartış</span> – bilimi birlikte keşfetmenin tadını çıkar! 🚀
                    </motion.p>

                    {/* Feature Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
                    >
                        <FeaturePill icon={BookOpen} text="Güncel Makaleler" />
                        <FeaturePill icon={MessageCircle} text="Canlı Tartışmalar" />
                        <FeaturePill icon={Brain} text="Bilim Sözlüğü" />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button
                            size="lg"
                            className="rounded-full text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                            asChild
                        >
                            <Link href="/blog">
                                <BookOpen className="w-5 h-5 mr-2" />
                                <span>Makaleleri Keşfet</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 backdrop-blur-sm bg-background/50 border-2 hover:bg-background/80 hover:border-primary/50 transition-all duration-300"
                            asChild
                        >
                            <Link href="/forum">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                <span>Foruma Katıl</span>
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trust Indicator */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-sm text-muted-foreground pt-6"
                    >
                        <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Bilim tutkunları için ücretsiz ve reklamsız
                        </span>
                    </motion.p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted-foreground"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-xs font-medium uppercase tracking-wider">Keşfet</span>
                <div className="w-0.5 h-10 rounded-full bg-gradient-to-b from-primary/50 to-transparent" />
            </motion.div>
        </section>
    );
}

function FloatingIcon({
    icon: Icon,
    className,
    delay
}: {
    icon: any;
    className: string;
    delay: number;
}) {
    return (
        <motion.div
            className={`absolute ${className}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 0.6, 0.3, 0.6, 0],
                scale: [0.8, 1.2, 0.9, 1.1, 0.8],
                y: [0, -30, 0, -20, 0],
                rotate: [0, 10, -10, 5, 0],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
        >
            <div className="relative">
                <Icon className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
                <div className="absolute inset-0 blur-xl bg-current opacity-40" />
            </div>
        </motion.div>
    );
}

function FeaturePill({ icon: Icon, text }: { icon: any; text: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors cursor-default"
        >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{text}</span>
        </motion.div>
    );
}
