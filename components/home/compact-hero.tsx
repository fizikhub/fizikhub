"use client";

import { motion } from "framer-motion";

export function CompactHero() {
    return (
        <div className="relative overflow-hidden rounded-sm border-y-2 border-primary/50 bg-background/80 backdrop-blur-sm">
            {/* Kinetic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,100,255,0.05)_50%,transparent_100%)]" />

                {/* Velocity Lines */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-[1px] bg-primary/30"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: 0,
                            right: 0,
                        }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "circOut"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 px-6 py-8 flex items-center justify-between gap-8">
                {/* Text Content - Kinetic Topography */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                            className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.85] italic"
                        >
                            Bilimi
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary bg-300% animate-shimmer uppercase tracking-tighter leading-[0.85] italic"
                        >
                            Ti'ye Alıyoruz
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-4 flex items-center gap-3"
                    >
                        <div className="h-[2px] w-12 bg-destructive/80" />
                        <p className="text-sm md:text-base font-mono text-muted-foreground uppercase tracking-widest">
                            Ama Ciddili Şekilde
                        </p>
                    </motion.div>
                </div>

                {/* Kinetic Graphic - Rotating Atom/Orbit */}
                <div className="hidden sm:block relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <motion.div
                        className="absolute inset-0 border-2 border-primary/30 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{ borderTopColor: "rgba(0,100,255,1)" }}
                    />
                    <motion.div
                        className="absolute inset-4 border-2 border-destructive/30 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                        style={{ borderBottomColor: "rgba(255,0,85,1)" }}
                    />
                    <motion.div
                        className="absolute inset-[30%] bg-primary/20 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(0,100,255,0.4)]"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="absolute top-0 right-0 p-2 opacity-50">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-primary'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
