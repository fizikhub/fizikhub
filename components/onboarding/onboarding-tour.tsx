"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/onboarding";
import { MessageCircle, Feather, BookOpen, Menu, Star, ChevronRight, X, Sparkles, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
    {
        id: "welcome",
        title: "HOŞ GELDİN!",
        subtitle: "Evrenin en garip köşesine hoş geldin.",
        description: "Burada bilim ciddi, ama biz değiliz. Hazırsan hızlı bi tur atalım, kaybolmaman için.",
        icon: Sparkles,
        position: "center" as const,
    },
    {
        id: "forum",
        title: "FORUM",
        subtitle: "Tartışma Arenası",
        description: "Soru sor, cevap ver, puanları topla. Saçma sapan sorular da olur, kimse yargılamıyor (belki biraz).",
        icon: MessageCircle,
        position: "bottom" as const,
        bottomNavIndex: 3,
    },
    {
        id: "blog",
        title: "BLOG",
        subtitle: "Senin Köşen",
        description: "Sadece veri tüketme, sen de üret! Kendi blogunu oluştur, araştırmalarını paylaş, toplulukla buluş.",
        icon: Feather,
        position: "bottom" as const,
        bottomNavIndex: 2,
    },
    {
        id: "makale",
        title: "MAKALE",
        subtitle: "Ciddi İşler",
        description: "Burada işler biraz daha akademik. Ama sıkılma, hâlâ eğlenceli tutmaya çalıştık.",
        icon: BookOpen,
        position: "bottom" as const,
        bottomNavIndex: 1,
    },
    {
        id: "menu",
        title: "MENÜ",
        subtitle: "Lügat, Sıralama, Herşey",
        description: "Sağ üstteki hamburger menüsünde Lügat (terimleri öğren), Sıralama (en iyileri gör) ve daha fazlası var.",
        icon: Menu,
        position: "top" as const,
    },
    {
        id: "hubpoints",
        title: "HUB PUANI",
        subtitle: "Katkın = Puanın",
        description: "Yorum yaz (+2), soru sor (+5), cevap ver (+3), beğeni al (+1). Ne kadar katkı, o kadar puan. Sıralamada yüksel, rozet kazan!",
        icon: Star,
        position: "center" as const,
    },
    {
        id: "finish",
        title: "HAZIRSIN!",
        subtitle: "Artık içeriden birisin.",
        description: "Hadi bakalım, keşfetmeye başla. Sorularını merak ediyoruz.",
        icon: Sparkles,
        position: "center" as const,
    },
];

const bottomNavItems = [
    { label: "ANA SAYFA", icon: Home },
    { label: "MAKALE", icon: BookOpen },
    { label: "BLOG", icon: Feather },
    { label: "FORUM", icon: MessageCircle },
    { label: "PROFİL", icon: User },
];

// Premium Realistic Rocket SVG Component
function RocketSVG({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rocket Body - Main fuselage */}
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4d4d4" />
                    <stop offset="30%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#b0b0b0" />
                </linearGradient>
                <linearGradient id="noseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cc2b2b" />
                    <stop offset="50%" stopColor="#ff4444" />
                    <stop offset="100%" stopColor="#aa2222" />
                </linearGradient>
                <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cc2b2b" />
                    <stop offset="50%" stopColor="#ff3333" />
                    <stop offset="100%" stopColor="#991111" />
                </linearGradient>
                <linearGradient id="windowGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0088aa" />
                </linearGradient>
                <filter id="rocketShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Main Body */}
            <ellipse cx="50" cy="100" rx="22" ry="70" fill="url(#bodyGradient)" filter="url(#rocketShadow)" />

            {/* Nose Cone */}
            <path d="M50 10 C35 35 30 50 30 65 L70 65 C70 50 65 35 50 10Z" fill="url(#noseGradient)" />
            <ellipse cx="50" cy="65" rx="20" ry="5" fill="#cc2b2b" />

            {/* Body Details - Stripes */}
            <rect x="28" y="70" width="44" height="4" fill="#cc2b2b" />
            <rect x="28" y="130" width="44" height="4" fill="#1a1a2e" />
            <rect x="28" y="136" width="44" height="2" fill="#cc2b2b" />

            {/* Window */}
            <circle cx="50" cy="95" r="12" fill="#0a0a15" stroke="#888" strokeWidth="3" />
            <circle cx="50" cy="95" r="8" fill="url(#windowGlow)" opacity="0.8" />
            <ellipse cx="47" cy="92" rx="3" ry="2" fill="white" opacity="0.6" />

            {/* Left Fin */}
            <path d="M28 140 L8 175 L8 180 L28 165 Z" fill="url(#finGradient)" />
            <path d="M28 140 L18 160 L28 155 Z" fill="#ff6666" opacity="0.5" />

            {/* Right Fin */}
            <path d="M72 140 L92 175 L92 180 L72 165 Z" fill="url(#finGradient)" />
            <path d="M72 140 L82 160 L72 155 Z" fill="#ff6666" opacity="0.5" />

            {/* Center Fin */}
            <ellipse cx="50" cy="170" rx="15" ry="8" fill="#888" />

            {/* Engine Nozzle */}
            <path d="M35 165 L30 180 L70 180 L65 165 Z" fill="#444" />
            <ellipse cx="50" cy="180" rx="20" ry="5" fill="#333" />
            <ellipse cx="50" cy="178" rx="15" ry="4" fill="#222" />

            {/* Rivets/Details */}
            {[75, 85, 105, 115, 125].map((y, i) => (
                <g key={i}>
                    <circle cx="30" cy={y} r="1.5" fill="#999" />
                    <circle cx="70" cy={y} r="1.5" fill="#999" />
                </g>
            ))}
        </svg>
    );
}

// Professional Smoke Cloud Component
function SmokeCloud({ delay, x, size, direction }: { delay: number; x: number; size: number; direction: number }) {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: size,
                height: size,
                left: `calc(50% + ${x}px)`,
                bottom: 20,
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.7) 40%, rgba(150,150,150,0.4) 70%, transparent 100%)`,
                filter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: 0, scale: 0.3, x: 0 }}
            animate={{
                opacity: [0, 0.9, 0.7, 0.4, 0],
                y: [0, -50, -120, -200, -300],
                scale: [0.3, 1, 1.8, 2.5, 3],
                x: [0, direction * 20, direction * 50, direction * 80],
            }}
            transition={{
                duration: 4,
                delay: delay,
                ease: "easeOut",
            }}
        />
    );
}

// Animated Fire/Thrust Component
function AnimatedFlame() {
    return (
        <div className="relative w-24 h-40 flex items-start justify-center">
            {/* Outer flame glow */}
            <motion.div
                className="absolute w-20 h-32 rounded-b-full"
                style={{
                    background: 'radial-gradient(ellipse at center top, rgba(255,100,0,0.8) 0%, rgba(255,50,0,0.4) 50%, transparent 100%)',
                    filter: 'blur(10px)',
                }}
                animate={{
                    scaleY: [1, 1.2, 0.9, 1.1, 1],
                    scaleX: [1, 0.9, 1.1, 0.95, 1],
                }}
                transition={{ duration: 0.15, repeat: Infinity }}
            />

            {/* Main orange flame */}
            <motion.div
                className="absolute w-16 h-28 rounded-b-full"
                style={{
                    background: 'linear-gradient(to bottom, #ff6600 0%, #ff4400 30%, #ff2200 60%, #cc0000 100%)',
                }}
                animate={{
                    scaleY: [1, 1.3, 0.85, 1.15, 1],
                    scaleX: [1, 0.85, 1.15, 0.9, 1],
                }}
                transition={{ duration: 0.1, repeat: Infinity }}
            />

            {/* Inner yellow flame */}
            <motion.div
                className="absolute w-10 h-20 rounded-b-full"
                style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #ffff00 20%, #ffcc00 50%, #ff8800 100%)',
                }}
                animate={{
                    scaleY: [1, 1.4, 0.8, 1.2, 1],
                    scaleX: [1, 0.8, 1.2, 0.85, 1],
                    y: [0, 2, -1, 1, 0],
                }}
                transition={{ duration: 0.08, repeat: Infinity }}
            />

            {/* Core white-hot center */}
            <motion.div
                className="absolute w-5 h-12 rounded-b-full"
                style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #ffffcc 50%, #ffee88 100%)',
                }}
                animate={{
                    scaleY: [1, 1.5, 0.7, 1.3, 1],
                    scaleX: [1, 0.7, 1.3, 0.8, 1],
                }}
                transition={{ duration: 0.06, repeat: Infinity }}
            />

            {/* Sparks */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                        left: `${40 + (Math.random() - 0.5) * 30}%`,
                    }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                        y: [0, 60 + Math.random() * 40],
                        x: [(Math.random() - 0.5) * 40],
                        opacity: [1, 0],
                    }}
                    transition={{
                        duration: 0.5 + Math.random() * 0.3,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                />
            ))}
        </div>
    );
}

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [showLiftoff, setShowLiftoff] = useState(true); // TEST MODE: her yenilemede roket kalkar, sonra false yapılacak

    const step = tourSteps[currentStep];
    const isLastStep = currentStep === tourSteps.length - 1;
    const Icon = step.icon;

    const handleNext = () => {
        if (isLastStep) {
            // Trigger liftoff animation instead of immediate complete
            setShowLiftoff(true);
            // Complete after animation
            setTimeout(async () => {
                await completeOnboarding();
                setIsVisible(false);
            }, 6500); // Animasyon süresi + fade out
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        setIsVisible(false);
        await completeOnboarding();
    };

    if (!isVisible) return null;

    // Liftoff Animation Screen
    if (showLiftoff) {
        return (
            <motion.div
                className="fixed inset-0 z-[200] bg-gradient-to-b from-black via-[#0a0a1a] to-[#1a1a2e] flex items-end justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Screen Shake Effect */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        x: [0, -3, 3, -2, 2, -1, 1, 0],
                        y: [0, 2, -2, 1, -1, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 1.2,
                        repeat: 6,
                        ease: "easeInOut"
                    }}
                >
                    {/* Stars Background - More stars with better distribution */}
                    <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 80 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white"
                                style={{
                                    width: Math.random() * 2 + 1,
                                    height: Math.random() * 2 + 1,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 60}%`,
                                }}
                                animate={{
                                    opacity: [0.2, 0.8, 0.2],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Launch Pad Platform */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#2a2a3a] to-[#1a1a2a] border-t-2 border-[#3a3a4a]">
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                    </div>

                    {/* Professional Smoke Clouds */}
                    <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none overflow-visible">
                        {/* Large smoke clouds from both sides */}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <SmokeCloud
                                key={i}
                                delay={1.0 + i * 0.15}
                                x={(i % 2 === 0 ? -1 : 1) * (20 + Math.random() * 60)}
                                size={80 + Math.random() * 80}
                                direction={i % 2 === 0 ? -1 : 1}
                            />
                        ))}

                        {/* Central dense smoke */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-48"
                            style={{
                                background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.95) 0%, rgba(200,200,200,0.8) 30%, rgba(150,150,150,0.5) 60%, transparent 100%)',
                                filter: 'blur(20px)',
                                transformOrigin: "center bottom",
                            }}
                            initial={{ opacity: 0, scaleX: 0.3, scaleY: 0 }}
                            animate={{
                                opacity: [0, 1, 0.9, 0.7],
                                scaleX: [0.3, 1, 1.5, 2.5],
                                scaleY: [0, 0.8, 1, 1.2],
                            }}
                            transition={{ duration: 4, delay: 1.0, ease: "easeOut" }}
                        />
                    </div>

                    {/* Rocket with Slow Liftoff */}
                    <motion.div
                        className="absolute bottom-24 left-1/2 -translate-x-1/2"
                        initial={{ y: 0 }}
                        animate={{ y: -1200 }}
                        transition={{
                            duration: 5,
                            delay: 1.5,
                            ease: [0.2, 0.1, 0.3, 1], // Slow start, gradual acceleration
                        }}
                    >
                        {/* Animated Fire/Thrust */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-full -mt-4"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <AnimatedFlame />
                        </motion.div>

                        {/* Vibration effect on rocket - more intense */}
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: [-2, 2, -2, 1, -1, 2, -2] }}
                            transition={{
                                duration: 0.1,
                                repeat: Infinity,
                                delay: 1.0,
                            }}
                        >
                            {/* Rocket Glow Effect */}
                            <motion.div
                                className="absolute inset-0 -z-10"
                                style={{
                                    background: 'radial-gradient(ellipse at center bottom, rgba(255,150,50,0.4) 0%, transparent 60%)',
                                    filter: 'blur(20px)',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.8, 0.6, 0.8] }}
                                transition={{ delay: 1.0, duration: 0.5, repeat: Infinity }}
                            />
                            <RocketSVG className="w-32 h-64" />
                        </motion.div>
                    </motion.div>

                    {/* Countdown Text */}
                    <motion.div
                        className="absolute top-1/4 left-0 right-0 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Countdown numbers */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="countdown"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 1.2] }}
                                transition={{ duration: 1.5, times: [0, 0.1, 0.9, 1] }}
                            >
                                <span className="text-6xl md:text-8xl font-black text-orange-500 drop-shadow-[0_0_30px_rgba(255,150,0,0.5)]">
                                    3... 2... 1...
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Launch Text */}
                    <motion.div
                        className="absolute top-1/3 left-0 right-0 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0, 0, 1, 1, 0],
                            scale: [0.8, 0.8, 1, 1.1, 1.2],
                            y: [0, 0, 0, 0, -50],
                        }}
                        transition={{
                            duration: 4,
                            times: [0, 0.35, 0.4, 0.8, 1],
                            delay: 0.5,
                        }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-wider mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            KALKIŞ!
                        </h2>
                        <motion.p
                            className="text-xl md:text-2xl font-bold text-primary uppercase tracking-widest"
                            animate={{
                                textShadow: [
                                    "0 0 10px rgba(255,100,0,0.5)",
                                    "0 0 30px rgba(255,100,0,0.8)",
                                    "0 0 10px rgba(255,100,0,0.5)",
                                ]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            Keşfe hazırsın
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Fade out overlay at end */}
                <motion.div
                    className="absolute inset-0 bg-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5.5, duration: 0.8 }}
                />
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                className="fixed inset-0 z-[200]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/85" onClick={handleSkip} />

                {/* Top Spotlight for Menu */}
                {step.id === "menu" && (
                    <motion.div
                        className="absolute top-2 right-2 md:hidden"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-14 h-14 border-4 border-primary rounded-lg flex items-center justify-center bg-background/20 backdrop-blur-sm">
                            <Menu className="w-6 h-6 text-primary" />
                        </div>
                        <motion.div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45"
                            animate={{ y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    </motion.div>
                )}

                {/* Main Card */}
                <motion.div
                    className={cn(
                        "absolute left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md",
                        step.position === "bottom" && "bottom-28 md:bottom-32",
                        step.position === "top" && "top-24 md:top-28",
                        step.position === "center" && "top-1/2 -translate-y-1/2"
                    )}
                    initial={{ opacity: 0, y: step.position === "top" ? -30 : 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {/* Brutalist Card */}
                    <div className="bg-background border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                        <div className="bg-primary h-2" />

                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 pt-4">
                            <div className="flex gap-1.5 mb-4">
                                {tourSteps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-200",
                                            index === currentStep ? "bg-primary w-8" : index < currentStep ? "bg-primary/50 w-4" : "bg-muted w-4"
                                        )}
                                    />
                                ))}
                            </div>

                            <motion.div
                                className="w-16 h-16 bg-primary/10 border-2 border-primary flex items-center justify-center mb-4"
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon className="w-8 h-8 text-primary" />
                            </motion.div>

                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{step.title}</h2>
                                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-3">{step.subtitle}</p>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors border-2 border-transparent hover:border-muted"
                                >
                                    Geç
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 py-3 px-4 text-sm font-black uppercase tracking-wide bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center gap-2 hover:bg-primary hover:border-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                >
                                    {isLastStep ? "Kalkış!" : "İleri"}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {step.position === "bottom" && step.bottomNavIndex !== undefined && (
                        <motion.div
                            className="absolute -bottom-6 md:hidden"
                            style={{ left: `${(step.bottomNavIndex / 4) * 100 - 10}%` }}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>

                {step.position === "bottom" && step.bottomNavIndex !== undefined && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 md:hidden z-[201]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="bg-background/95 backdrop-blur-xl border-t-2 border-black dark:border-white">
                            <div className="flex h-14 items-center justify-around px-2">
                                {bottomNavItems.map((item, index) => {
                                    const NavIcon = item.icon;
                                    const isHighlighted = index === step.bottomNavIndex;

                                    return (
                                        <div
                                            key={item.label}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center gap-0.5 px-2 py-1 transition-all",
                                                isHighlighted ? "text-primary" : "text-muted-foreground/50"
                                            )}
                                        >
                                            {isHighlighted && (
                                                <motion.div
                                                    className="absolute inset-0 border-2 border-primary rounded-lg bg-primary/10"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}

                                            <NavIcon className={cn("h-5 w-5 relative z-10", isHighlighted && "stroke-[2.5px]")} />

                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-wider relative z-10",
                                                isHighlighted ? "text-primary" : "opacity-50"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
