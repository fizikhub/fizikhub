"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

export function StreakHeader() {
    // Mock state for demo - ideally fetched from DB
    const [streak, setStreak] = useState(3);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full px-4 py-1.5"
        >
            <div className="flex items-center gap-1.5 text-orange-500 font-black font-mono">
                <Flame size={18} className="animate-pulse" />
                <span className="text-sm">{streak} Gün</span>
            </div>

            <div className="w-px h-4 bg-border" />

            <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs uppercase tracking-wider">
                <Trophy size={14} />
                <span>Çaylak Fizikçi</span>
            </div>
        </motion.div>
    );
}
