"use client";

import { MessageSquareDashed, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { RealisticBlackHole } from "@/components/ui/realistic-black-hole";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center px-4 relative overflow-hidden bg-black/20">
            {/* Background Black Hole Effect - Subtle for focus */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none scale-110">
                <RealisticBlackHole variant="contained" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="relative mb-8">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-gradient-to-br from-[#FACC15]/20 to-zinc-900 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.15)] border border-[#FACC15]/30 backdrop-blur-md relative"
                    >
                        <MessageSquareDashed className="h-10 w-10 text-[#FACC15]" />

                        {/* Decorative orbits */}
                        <div className="absolute inset-[-8px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-[-16px] border border-white/[0.03] rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-4 -right-4 bg-zinc-900/80 p-2 rounded-xl border border-white/10 backdrop-blur-xl"
                    >
                        <Sparkles className="h-5 w-5 text-[#FACC15]" />
                    </motion.div>
                </div>

                <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase font-[family-name:var(--font-outfit)]">
                    MESAJINI SEÇ
                </h3>
                <p className="text-zinc-500 max-w-[280px] text-sm font-medium leading-relaxed mb-8">
                    Sol taraftaki listeden bir konuşma seç veya birinin profilinden yeni sohbet başlat.
                </p>

                {/* Ambient Glow */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FACC15]/5 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>
        </div>
    );
}
