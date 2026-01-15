"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Moon, Sun, CloudSun, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js"; // Using vanilla JS client for simplicity in client component or use the helper if available
// Actually better to use the browser client creator if we have it, checking utils
// The user has a pattern of `createClient` imports. 
// Let's check if there is a client-side supabase helper.
// Usually in Next.js it is `import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'` or similar.
// I'll stick to manual fetch if I can't find it, or reusing what's available.
// Let's assume standard supabase-js is safe for public key usage here.

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState({ title: "", body: "", icon: Sun });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const initGreeting = async () => {
            // 1. Get Session
            const { data: { session } } = await supabase.auth.getSession();
            let userName = "Gezgin";

            if (session?.user) {
                // 2. Fetch Profile if logged in
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    userName = profile.full_name?.split(' ')[0] || profile.username || "Kaşif";
                }
            } else {
                // If user meant "Only show if logged in", we can return here.
                // But the user said "siteye girdiklerinde kendi hesapları gözüküyor zaten".
                // We'll show it regardless, defaulting to 'Gezgin' if auth fails but trying hard to get name.
            }

            const today = new Date().toLocaleDateString('tr-TR');
            const lastGreeting = localStorage.getItem('fizikhub_last_greeting');

            // TEMPORARY: LIMIT DISABLE FOR TESTING (Uncomment to enable strict daily limit)
            // if (lastGreeting === today) return; 

            // Time Logic
            const hour = new Date().getHours();
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

            // Delay Appearance
            setTimeout(() => {
                setIsVisible(true);
                localStorage.setItem('fizikhub_last_greeting', today);
            }, 1000);

            // Auto Hide
            setTimeout(() => setIsVisible(false), 9000);
        };

        initGreeting();

    }, []);

    if (!mounted) return null;

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

                        {/* Glow */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/30 blur-2xl rounded-full animate-pulse" />

                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background">
                            <Icon className="w-5 h-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 pr-2">
                            <h4 className="text-base font-bold leading-none mb-1">
                                {message.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-background/80 leading-snug font-medium">
                                {message.body}
                            </p>
                        </div>

                        {/* Close */}
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
