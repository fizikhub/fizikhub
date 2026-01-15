"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Moon, Sun, CloudSun, Coffee } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getGreetingByHour(hour: number, name: string) {
    if (hour >= 6 && hour < 12) {
        return {
            title: `Günaydın ${name}! ☀️`,
            body: "Fizik yasaları bugün senin yanında. Harika bir gün olsun!",
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
            title: `İyi Akşamlar ${name} 🌇`,
            body: "Günün yorgunluğunu atmak için biraz bilim en iyi ilaçtır.",
            icon: CloudSun
        };
    } else if (hour >= 22 && hour < 24) {
        return {
            title: `İyi Geceler ${name} 🌙`,
            body: "Yıldızlar bu gece harika görünüyor, değil mi?",
            icon: Moon
        };
    } else {
        return {
            title: `Hala Uyumadın mı ${name}? 🦉`,
            body: "Evrenin sırları beklemez ama senin uykuya ihtiyacın var!",
            icon: Sparkles
        };
    }
}

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [userName, setUserName] = useState("Kaşif");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check daily limit
        const today = new Date().toLocaleDateString('tr-TR');
        const lastGreeting = localStorage.getItem('fizikhub_last_greeting');

        // COMMENT OUT FOR TESTING - Uncomment for production
        // if (lastGreeting === today) return;

        // Immediately show greeting after delay
        const showTimer = setTimeout(() => {
            setIsVisible(true);
            localStorage.setItem('fizikhub_last_greeting', today);
        }, 800);

        // Try to get user name in background
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data: profile }) => {
                        if (profile) {
                            const name = profile.full_name?.split(' ')[0] || profile.username || "Kaşif";
                            setUserName(name);
                        }
                    });
            }
        });

        // Auto hide after 8 seconds
        const hideTimer = setTimeout(() => setIsVisible(false), 8800);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!mounted) return null;

    const hour = new Date().getHours();
    const greeting = getGreetingByHour(hour, userName);
    const Icon = greeting.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-md z-[9999] pointer-events-none"
                >
                    <div className="pointer-events-auto bg-foreground text-background px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden border border-white/10">

                        {/* Glow Effect */}
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/40 blur-3xl rounded-full animate-pulse" />

                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background/20 flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 pr-6">
                            <h4 className="text-lg font-bold leading-tight mb-1">
                                {greeting.title}
                            </h4>
                            <p className="text-sm text-background/80 leading-snug">
                                {greeting.body}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-3 right-3 p-1.5 text-background/60 hover:text-background hover:bg-background/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
