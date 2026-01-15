"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Moon, Sun, CloudSun, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyGreetingProps {
    user: {
        username: string;
        full_name?: string;
    } | null;
}

export function DailyGreeting({ user }: DailyGreetingProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState({ title: "", body: "", icon: Sun });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log("DailyGreeting: Mounted, user prop:", user);

        // Removed early return for user check to allow debugging/guest view
        // if (!user) {
        //     console.log("DailyGreeting: No user, aborting.");
        //     return;
        // }

        const today = new Date().toLocaleDateString('tr-TR');
        const lastGreeting = localStorage.getItem('fizikhub_last_greeting');

        // Check if already greeted today
        // TEMPORARY FOR TESTING: Commenting out to allow user to see it
        // if (lastGreeting === today) {
        //     return;
        // }

        // Determine Time Logic
        const hour = new Date().getHours();
        const userName = user?.full_name?.split(' ')[0] || user?.username || "Gezgin"; // Fallback to Gezgin

        let greetingData = { title: "", body: "", icon: Sun };

        if (hour >= 6 && hour < 12) {
            greetingData = {
                title: `Günaydın ${userName}! ☀️`,
                body: "Fizik yasaları bugün senin yanında. Harika bir gün olsun!",
                icon: Coffee
            };
        } else if (hour >= 12 && hour < 20) {
            greetingData = {
                title: `Hoş Geldin ${userName}! 👋`,
                body: "Bugün evrenin hangi sırrını çözmeyi planlıyorsun?",
                icon: Sun
            };
        } else if (hour >= 20 && hour < 22) {
            greetingData = {
                title: `İyi Akşamlar ${userName} 🌇`,
                body: "Günün yorgunluğunu atmak için biraz bilim en iyi ilaçtır.",
                icon: CloudSun
            };
        } else if (hour >= 22 && hour < 24) {
            greetingData = {
                title: `İyi Geceler ${userName} 🌙`,
                body: "Yıldızlar bu gece harika görünüyor, değil mi?",
                icon: Moon
            };
        } else { // 00:00 - 06:00
            greetingData = {
                title: `Hala Uyumadın mı ${userName}? 🦉`,
                body: "Evrenin sırları beklemez ama senin uykuya ihtiyacın var!",
                icon: Sparkles
            };
        }

        setMessage(greetingData);

        // Show after a small delay
        const timer = setTimeout(() => {
            console.log("DailyGreeting: Setting visible to TRUE");
            setIsVisible(true);
            localStorage.setItem('fizikhub_last_greeting', today);
        }, 1500);

        // Auto hide after 8 seconds
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 9500);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [user]);

    if (!mounted || !message.title) return null;

    const Icon = message.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-md z-[100] pointer-events-none"
                >
                    <div className="pointer-events-auto bg-foreground/95 text-background backdrop-blur-md px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden border border-white/10 ring-1 ring-black/5">

                        {/* Interactive Glow Background */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/30 blur-2xl rounded-full animate-pulse" />

                        {/* Icon Box */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background">
                            <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-2">
                            <h4 className="text-base font-bold leading-none mb-1">
                                {message.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-background/80 leading-snug font-medium">
                                {message.body}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-background/50 hover:text-background hover:bg-background/10 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
