"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Atom, Star, Sparkles, PenLine, Plus, HelpCircle } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { SpaceBackground } from "./space-background";

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
        <section className="relative overflow-hidden min-h-[70vh] md:min-h-[90vh] flex items-center justify-center">
            <SpaceBackground />

            {/* Hero Pattern - Newton, Einstein, Elma */}
            <div
                className="absolute inset-0 opacity-[0.08] hidden sm:block"
                style={{
                    backgroundImage: "url('/hero-pattern.png')",
                    backgroundSize: "400px",
                    backgroundRepeat: "repeat",
                    filter: "invert(1) brightness(0.5) blur(0.5px)"
                }}
            />

            <div
                className="container px-4 sm:px-6 md:px-6 relative z-10 flex flex-col items-center text-center"
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
                    className="mb-6 sm:mb-8 will-change-transform"
                >
                    {/* Badge removed */}

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-4 sm:mb-6 md:mb-8 lg:mb-10"
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
                        className="max-w-[90%] sm:max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 md:px-0"
                    >
                        Sıkıcı formüllerden, anlaşılmaz terimlerden gına mı geldi?
                        Fizikhub'da bilimi makaraya sararak öğreniyoruz.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0"
                    >
                        <Link href="/blog" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto gap-2 group relative overflow-hidden h-11 sm:h-12"
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
                        <Link href="/forum" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto gap-2 group border-2 hover:border-primary hover:bg-primary/5 h-11 sm:h-12"
                            >
                                Bi Sorum Var
                                <Rocket className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Aklında Ne Var Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 sm:mt-16 md:mt-20 w-full max-w-4xl px-4 sm:px-6"
                    >
                        {/* Question Prompt */}
                        <div className="mb-6 sm:mb-8 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-background/40 via-background/60 to-background/40 backdrop-blur-xl border border-primary/10 shadow-2xl">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground/90 mb-0">
                                Bugün bilimseverlerle ne paylaşmak istersin?
                            </h2>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            {/* Yaz Button */}
                            <Link href="/blog/yeni" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-red-500/20 via-rose-600/20 to-pink-500/20 backdrop-blur-lg border border-red-500/30 hover:border-red-400/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-red-500/20"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                                        <div className="p-3 sm:p-4 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors duration-300">
                                            <PenLine className="w-8 h-8 sm:w-10 sm:h-10 text-red-400 group-hover:text-red-300 transition-colors duration-300" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-lg sm:text-xl font-bold text-red-300 group-hover:text-red-200 transition-colors duration-300">
                                            Yaz
                                        </span>
                                    </div>

                                    {/* Animated Border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)',
                                        }}
                                        animate={{
                                            x: ['-100%', '100%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                </motion.div>
                            </Link>

                            {/* Ekle Button */}
                            <Link href="/forum/soru-sor" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-sky-500/20 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-cyan-500/20"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                                        <div className="p-3 sm:p-4 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300">
                                            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-lg sm:text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
                                            Ekle
                                        </span>
                                    </div>

                                    {/* Animated Border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
                                        }}
                                        animate={{
                                            x: ['-100%', '100%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                            delay: 0.3,
                                        }}
                                    />
                                </motion.div>
                            </Link>

                            {/* Soru Sor Button */}
                            <Link href="/forum" className="group">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-yellow-500/20 via-amber-600/20 to-orange-500/20 backdrop-blur-lg border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-yellow-500/20"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                                        <div className="p-3 sm:p-4 rounded-xl bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors duration-300">
                                            <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-lg sm:text-xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">
                                            Soru Sor
                                        </span>
                                    </div>

                                    {/* Animated Border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.3), transparent)',
                                        }}
                                        animate={{
                                            x: ['-100%', '100%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                            delay: 0.6,
                                        }}
                                    />
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>


            </div>

            {/* Floating Background Elements */}
            <FloatingElements />

            <style jsx global>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 4s linear infinite;
                }
            `}</style>
        </section>
    );
}

function FloatingElements() {
    const elements = [
        { icon: Atom, className: "top-20 left-10", delay: 0, size: "w-12 h-12 sm:w-16 sm:h-16", hideOnMobile: false },
        { icon: Rocket, className: "bottom-32 right-16", delay: 1, size: "w-16 h-16 sm:w-20 sm:h-20", hideOnMobile: true },
        { icon: Star, className: "top-40 right-20", delay: 0.5, size: "w-10 h-10 sm:w-12 sm:h-12", hideOnMobile: false },
        { icon: Sparkles, className: "bottom-48 left-20", delay: 1.5, size: "w-12 h-12 sm:w-14 sm:h-14", hideOnMobile: true },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {elements.map((element, index) => (
                <motion.div
                    key={index}
                    className={`absolute ${element.className} ${element.hideOnMobile ? 'hidden sm:block' : ''} text-primary/30 will-change-transform`}
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
