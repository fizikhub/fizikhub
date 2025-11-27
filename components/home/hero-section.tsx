"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Atom, Rocket, Star, Sparkles } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

export function HeroSection() {
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient-shift" />

            {/* Hero Pattern - Newton, Einstein, Elma */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: "url('/hero-pattern.png')",
                    backgroundSize: "400px",
                    backgroundRepeat: "repeat",
                    filter: "invert(1) brightness(0.5) blur(0.5px)"
                }}
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

            <div
                className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    style={{
                        rotateX: isHovered ? rotateX : 0,
                        rotateY: isHovered ? rotateY : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="mb-8 will-change-transform"
                >
                    {/* Badge removed */}

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-10"
                    >
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block animate-gradient-x">
                            Fizikhub
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="max-w-[700px] text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-10 px-4 md:px-0"
                    >
                        Sıkıcı formüllerden, anlaşılmaz terimlerden gına mı geldi?
                        Fizikhub'da bilimi makaraya sararak öğreniyoruz.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/blog">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto gap-2 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Dal İçeri Kaptan
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Button>
                        </Link>
                        <Link href="/forum">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto gap-2 group border-2 hover:border-primary hover:bg-primary/5"
                            >
                                Bi Sorum Var
                                <Rocket className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>


            </div>

            {/* Floating Background Elements */}
            <FloatingElements />

            <style jsx global>{`
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 15s ease infinite;
                }

                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 4s linear infinite;
                }

                .bg-grid-pattern {
                    background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
                    background-size: 50px 50px;
                }
            `}</style>
        </section>
    );
}

function FloatingElements() {
    const elements = [
        { icon: Atom, className: "top-20 left-10", delay: 0, size: "w-16 h-16" },
        { icon: Rocket, className: "bottom-32 right-16", delay: 1, size: "w-20 h-20" },
        { icon: Star, className: "top-40 right-20", delay: 0.5, size: "w-12 h-12" },
        { icon: Sparkles, className: "bottom-48 left-20", delay: 1.5, size: "w-14 h-14" },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {elements.map((element, index) => (
                <motion.div
                    key={index}
                    className={`absolute ${element.className} text-primary/30 will-change-transform`}
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6 + element.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: element.delay,
                    }}
                >
                    <element.icon className={element.size} />
                </motion.div>
            ))}
        </div>
    );
}
