"use client";

import { useEffect, useState } from "react";
import { loadingMessages } from "@/lib/data";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingMessage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Hydration mismatch'i önlemek için client-side'da seçiyoruz
        const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setMessage(randomMessage);
    }, []);

    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium py-4"
        >
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span>{message}</span>
        </motion.div>
    );
}
