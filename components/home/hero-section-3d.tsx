"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { Atom, Zap, Globe, Rocket, Star, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection3D() {
    const ref = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0]);

    // Mouse parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        // Disable on mobile
        if (typeof window !== 'undefined' && window.innerWidth < 768) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX / innerWidth - 0.5);
        mouseY.set(clientY / innerHeight - 0.5);
    };

    // Smooth spring animation for mouse movement
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 }; // Snappier but smooth
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig); // Reduced rotation range
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig); // Reduced rotation range

    return (
        <section
            ref={ref}
            className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background perspective-1000"
            onMouseMove={handleMouseMove}
        >
            {/* Background Gradient & Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0" />

            {/* Floating 3D Objects Container */}
            <motion.div
                style={{ rotateX, rotateY, y, opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center transform-style-3d will-change-transform"
            >
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-20 max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Bilimin Eğlenceli Hali</span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                        Evrenin Sırlarını
                        <br />
                        <span className="text-primary">Keşfetmeye Başla</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Fizik, uzay ve bilim dünyasına dair en güncel makaleler, tartışmalar ve keşifler burada seni bekliyor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="rounded-full text-lg h-12 px-8 group relative overflow-hidden" asChild>
                            <Link href="/blog">
                                <span className="relative z-10 flex items-center gap-2">
                                    Okumaya Başla
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-primary-foreground/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full text-lg h-12 px-8 backdrop-blur-sm bg-background/50" asChild>
                            <Link href="/forum">
                                Tartışmalara Katıl
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Floating Elements - Reduced count on mobile */}
                <FloatingElement icon={Atom} className="absolute -top-20 -left-10 text-blue-500" delay={0} size={64} xRange={[-20, 20]} yRange={[-20, 20]} />
                {!isMobile && (
                    <>
                        <FloatingElement icon={Globe} className="absolute top-40 -right-20 text-green-500" delay={1} size={48} xRange={[20, -20]} yRange={[-30, 30]} />
                        <FloatingElement icon={Zap} className="absolute bottom-20 left-10 text-yellow-500" delay={2} size={56} xRange={[-15, 15]} yRange={[15, -15]} />
                    </>
                )}
                <FloatingElement icon={Rocket} className="absolute -bottom-10 right-20 text-red-500" delay={1.5} size={72} xRange={[30, -30]} yRange={[20, -20]} />
                {!isMobile && (
                    <FloatingElement icon={Star} className="absolute top-10 right-1/4 text-purple-500" delay={0.5} size={32} xRange={[-10, 10]} yRange={[-10, 10]} />
                )}

            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-sm font-medium">Aşağı Kaydır</span>
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary/50 to-transparent" />
            </motion.div>
        </section>
    );
}

function FloatingElement({
    icon: Icon,
    className,
    delay,
    size,
    xRange,
    yRange
}: {
    icon: any,
    className?: string,
    delay: number,
    size: number,
    xRange: number[],
    yRange: number[]
}) {
    return (
        <motion.div
            className={`${className} will-change-transform`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 0.8,
                y: yRange,
                x: xRange,
                rotate: [0, 10, -10, 0],
            }}
            transition={{
                opacity: { duration: 1, delay },
                y: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay },
                x: { duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
        >
            <div className="relative">
                <Icon size={size} strokeWidth={1.5} />
                <div className="absolute inset-0 blur-xl bg-current opacity-30" />
            </div>
        </motion.div>
    );
}
