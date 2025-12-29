"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Pizza, Droplets, Heart, ShoppingBag, X, Star } from "lucide-react";

interface AlienStats {
    hunger: number;
    hygiene: number;
    happiness: number;
    lastInteracted: number;
}

const STORAGE_KEY = "hub_alien_v2";
const DECAY_RATE_MS = 60000;

export function HubAlien() {
    const [stats, setStats] = useState<AlienStats>({
        hunger: 100,
        hygiene: 100,
        happiness: 100,
        lastInteracted: Date.now(),
    });

    const [mood, setMood] = useState<"idle" | "eating" | "cleaning" | "happy">("idle");
    const [showShop, setShowShop] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

    // Load from storage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                const elapsed = now - parsed.lastInteracted;
                const decayTicks = Math.floor(elapsed / DECAY_RATE_MS);

                if (decayTicks > 0) {
                    parsed.hunger = Math.max(0, parsed.hunger - (decayTicks * 2));
                    parsed.hygiene = Math.max(0, parsed.hygiene - (decayTicks * 1.5));
                    parsed.happiness = Math.max(0, parsed.happiness - (decayTicks * 1));
                }
                setStats(parsed);
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    // Save to storage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stats, lastInteracted: Date.now() }));
    }, [stats]);

    // Stat Decay
    useEffect(() => {
        const decay = setInterval(() => {
            setStats(prev => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 1),
                hygiene: Math.max(0, prev.hygiene - 0.5),
                happiness: Math.max(0, prev.happiness - 0.5)
            }));
        }, DECAY_RATE_MS);
        return () => clearInterval(decay);
    }, []);

    // Determine mood based on stats
    useEffect(() => {
        if (mood === "eating" || mood === "cleaning" || mood === "happy") return;

        if (stats.hunger < 30 || stats.hygiene < 30 || stats.happiness < 30) {
            setMood("idle");
        } else {
            setMood("idle");
        }
    }, [stats, mood]);

    const triggerAnimation = useCallback((emoji: string) => {
        setIsAnimating(true);
        setFloatingEmoji(emoji);
        setTimeout(() => {
            setIsAnimating(false);
            setFloatingEmoji(null);
        }, 1000);
    }, []);

    const handleFeed = () => {
        if (stats.hunger >= 100) return;
        setMood("eating");
        triggerAnimation("🍕");
        setStats(prev => ({
            ...prev,
            hunger: Math.min(100, prev.hunger + 25),
            happiness: Math.min(100, prev.happiness + 5)
        }));
        setTimeout(() => setMood("idle"), 1500);
    };

    const handleClean = () => {
        if (stats.hygiene >= 100) return;
        setMood("cleaning");
        triggerAnimation("🫧");
        setStats(prev => ({
            ...prev,
            hygiene: 100,
            happiness: Math.min(100, prev.happiness + 10)
        }));
        setTimeout(() => setMood("idle"), 1500);
    };

    const handlePet = () => {
        setMood("happy");
        triggerAnimation("💖");
        setStats(prev => ({
            ...prev,
            happiness: Math.min(100, prev.happiness + 15)
        }));
        setTimeout(() => setMood("idle"), 1000);
    };

    const getAlienExpression = () => {
        if (mood === "eating") return "😋";
        if (mood === "cleaning") return "🧼";
        if (mood === "happy") return "🥰";
        if (stats.hunger < 20) return "😵";
        if (stats.hygiene < 20) return "🤢";
        if (stats.happiness < 20) return "😢";
        if (stats.hunger < 40 || stats.hygiene < 40 || stats.happiness < 40) return "😐";
        return "😊";
    };

    const getOverallStatus = () => {
        const avg = (stats.hunger + stats.hygiene + stats.happiness) / 3;
        if (avg >= 80) return { text: "Mutlu!", color: "text-green-400" };
        if (avg >= 50) return { text: "İyi", color: "text-yellow-400" };
        if (avg >= 25) return { text: "Mutsuz", color: "text-orange-400" };
        return { text: "Kritik!", color: "text-red-400" };
    };

    const status = getOverallStatus();

    return (
        <div className="relative w-full">
            {/* Main Container */}
            <div className="bg-gradient-to-br from-gray-900 via-purple-950/50 to-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 px-4 py-3 border-b border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">👽</span>
                        <span className="font-bold text-white text-sm">Hub Alien</span>
                    </div>
                    <div className={`text-xs font-semibold ${status.color} flex items-center gap-1`}>
                        <Star className="w-3 h-3" />
                        {status.text}
                    </div>
                </div>

                {/* Alien Display Area */}
                <div
                    className="relative h-32 sm:h-40 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={handlePet}
                    style={{
                        background: `
                            radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%),
                            linear-gradient(180deg, rgba(15,15,35,1) 0%, rgba(25,15,45,1) 100%)
                        `
                    }}
                >
                    {/* Animated Stars */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${1 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating Emoji Animation */}
                    {floatingEmoji && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-3xl animate-bounce-up pointer-events-none z-20">
                            {floatingEmoji}
                        </div>
                    )}

                    {/* The Alien */}
                    <div
                        className={`relative text-6xl sm:text-7xl transition-transform duration-300 transform ${isAnimating ? 'scale-110' : 'hover:scale-105'
                            } ${mood === "happy" ? "animate-wiggle" : ""}`}
                    >
                        {/* Alien Body */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 blur-xl bg-purple-500/30 rounded-full scale-150" />

                            {/* Expression */}
                            <span className="relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                {getAlienExpression()}
                            </span>

                            {/* Status Indicators */}
                            {stats.hunger < 30 && (
                                <span className="absolute -top-2 -right-4 text-lg animate-bounce">🍔</span>
                            )}
                            {stats.hygiene < 30 && (
                                <span className="absolute -top-2 -left-4 text-lg animate-pulse">💩</span>
                            )}
                            {stats.happiness < 30 && (
                                <span className="absolute -bottom-2 right-0 text-lg animate-pulse">💔</span>
                            )}
                        </div>
                    </div>

                    {/* Tap hint */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-purple-300/50 font-medium">
                        Sevmek için tıkla
                    </div>
                </div>

                {/* Stats Bars */}
                <div className="px-4 py-3 space-y-2 bg-black/20">
                    <StatBar
                        icon={<Pizza className="w-3.5 h-3.5" />}
                        label="Açlık"
                        value={stats.hunger}
                        color="from-orange-500 to-yellow-500"
                        bgColor="bg-orange-950/50"
                    />
                    <StatBar
                        icon={<Droplets className="w-3.5 h-3.5" />}
                        label="Hijyen"
                        value={stats.hygiene}
                        color="from-cyan-500 to-blue-500"
                        bgColor="bg-cyan-950/50"
                    />
                    <StatBar
                        icon={<Heart className="w-3.5 h-3.5" />}
                        label="Mutluluk"
                        value={stats.happiness}
                        color="from-pink-500 to-rose-500"
                        bgColor="bg-pink-950/50"
                    />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-black/30">
                    <ActionButton
                        onClick={handleFeed}
                        disabled={stats.hunger >= 100 || showShop}
                        icon={<Pizza className="w-4 h-4" />}
                        label="Besle"
                        color="from-orange-600 to-amber-600"
                        hoverColor="hover:from-orange-500 hover:to-amber-500"
                    />
                    <ActionButton
                        onClick={handleClean}
                        disabled={stats.hygiene >= 100 || showShop}
                        icon={<Droplets className="w-4 h-4" />}
                        label="Yıka"
                        color="from-cyan-600 to-blue-600"
                        hoverColor="hover:from-cyan-500 hover:to-blue-500"
                    />
                    <ActionButton
                        onClick={() => setShowShop(!showShop)}
                        icon={<ShoppingBag className="w-4 h-4" />}
                        label="Dükkan"
                        color={showShop ? "from-purple-500 to-indigo-500" : "from-purple-600 to-indigo-600"}
                        hoverColor="hover:from-purple-500 hover:to-indigo-500"
                    />
                </div>

                {/* Shop Panel */}
                {showShop && (
                    <div className="border-t border-purple-500/20 bg-gradient-to-b from-purple-950/50 to-gray-900 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="font-bold text-white text-sm">Alien Dükkanı</span>
                            </div>
                            <button
                                onClick={() => setShowShop(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <span className="text-2xl mb-2 block">🚧</span>
                            Yakında geliyor...
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(3deg); }
                }
                @keyframes bounce-up {
                    0% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -60px); }
                }
                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out infinite;
                }
                .animate-bounce-up {
                    animation: bounce-up 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

// Stat Bar Component
function StatBar({
    icon,
    label,
    value,
    color,
    bgColor
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    bgColor: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 w-20 text-xs text-gray-300">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <div className={`flex-1 h-2.5 rounded-full ${bgColor} overflow-hidden`}>
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="text-[10px] text-gray-400 w-8 text-right font-mono">{Math.round(value)}%</span>
        </div>
    );
}

// Action Button Component
function ActionButton({
    onClick,
    disabled,
    icon,
    label,
    color,
    hoverColor
}: {
    onClick: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
    color: string;
    hoverColor: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex flex-col items-center justify-center gap-1 py-2.5 sm:py-3 rounded-xl
                bg-gradient-to-br ${color} ${hoverColor}
                text-white font-semibold text-xs
                transition-all duration-200
                active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg shadow-purple-900/30
            `}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
