"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Moon, Sun, CloudSun, Coffee } from "lucide-react";

function getGreetingByHour(hour: number, name: string) {
    if (hour >= 6 && hour < 12) {
        return {
            title: `Günaydın ${name}! ☀️`,
            body: "Fizik yasaları bugün senin yanında!",
            icon: Coffee
        };
    } else if (hour >= 12 && hour < 20) {
        return {
            title: `Hoş Geldin ${name}! 👋`,
            body: "Bugün evrenin hangi sırrını çözmeyi planlıyorsun?",
            icon: Sun
        };
    } else if (hour >= 20 && hour < 22) {
        return {
            title: `İyi Akşamlar ${name}! 🌇`,
            body: "Günün yorgunluğunu atmak için biraz bilim!",
            icon: CloudSun
        };
    } else if (hour >= 22 && hour < 24) {
        return {
            title: `İyi Geceler ${name}! 🌙`,
            body: "Yıldızlar harika görünüyor, değil mi?",
            icon: Moon
        };
    } else {
        return {
            title: `Hala Uyumadın mı ${name}? 🦉`,
            body: "Evrenin sırları bekler ama uykun da önemli!",
            icon: Sparkles
        };
    }
}

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Show greeting after 1 second unconditionally
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        // Auto hide after 8 seconds
        const hideTimer = setTimeout(() => setIsVisible(false), 9000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!mounted) return null;

    const hour = new Date().getHours();
    const greeting = getGreetingByHour(hour, "Kaşif");
    const Icon = greeting.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[350px] sm:max-w-md z-[9999]"
                >
                    <div className="bg-zinc-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden border border-zinc-700">

                        {/* Glow Effect */}
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-500/20 blur-3xl rounded-full" />

                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h4 className="text-lg font-bold leading-tight mb-0.5">
                                {greeting.title}
                            </h4>
                            <p className="text-sm text-zinc-400 leading-snug">
                                {greeting.body}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
