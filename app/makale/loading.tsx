"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loadingMessages } from "@/lib/data";
import { SiteLogo } from "@/components/icons/site-logo";

export default function Loading() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Rastgele bir mesaj seç
        const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setMessage(randomMessage);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <SiteLogo className="h-24 w-24" />
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-muted-foreground font-medium text-center px-4"
            >
                {message}
            </motion.p>
        </div>
    );
}
