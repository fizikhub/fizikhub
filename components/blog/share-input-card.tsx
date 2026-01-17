"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShareInputCardProps {
    user?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export function ShareInputCard({ user }: ShareInputCardProps) {
    const avatarUrl = user?.avatar_url || "https://github.com/shadcn.png";
    const displayName = user?.full_name || user?.username || "Misafir";
    const firstName = displayName.split(" ")[0];
    const [isInputHovered, setIsInputHovered] = useState(false);

    // Motion values for magnetic effect on avatar
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-50, 50], [5, -5]);
    const rotateY = useTransform(x, [-50, 50], [-5, 5]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
                y: -6,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
            }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-colors duration-300",
                "bg-card border-2 border-border hover:border-emerald-500/50",
                "w-full max-w-2xl mx-auto mb-10"
            )}
        >
            {/* Animated Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-20 blur-sm animate-gradient-x" />
            </div>

            {/* Top Decorative Bar */}
            <div className="relative flex items-center justify-between px-5 py-3 border-b-2 border-border/30 bg-gradient-to-r from-muted/30 via-transparent to-muted/30">
                {/* Animated Sparkle */}
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                    <span className="text-xs font-black tracking-widest text-foreground/70 uppercase">
                        Paylaş
                    </span>
                </motion.div>

                {/* Animated Dots */}
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-emerald-500/50"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex items-center gap-4">
                {/* Avatar with 3D Tilt Effect */}
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        x.set(e.clientX - rect.left - rect.width / 2);
                        y.set(e.clientY - rect.top - rect.height / 2);
                    }}
                    onMouseLeave={() => {
                        x.set(0);
                        y.set(0);
                    }}
                    className="shrink-0 cursor-pointer"
                >
                    <Avatar className="w-12 h-12 border-2 border-border ring-2 ring-offset-2 ring-offset-background ring-emerald-500/30 transition-all duration-300 group-hover:ring-emerald-500/60">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="text-sm bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-black">
                            {displayName.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                {/* Input Trigger */}
                <Link
                    href="/makale/yeni"
                    className="flex-1 block"
                    onMouseEnter={() => setIsInputHovered(true)}
                    onMouseLeave={() => setIsInputHovered(false)}
                >
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "relative w-full rounded-xl px-4 py-3.5 cursor-text flex items-center justify-between overflow-hidden transition-all duration-300",
                            "bg-muted/30 border-2 border-transparent",
                            "hover:bg-muted/50 hover:border-emerald-500/30"
                        )}
                    >
                        {/* Animated Background Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={isInputHovered ? { x: "100%" } : { x: "-100%" }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />

                        <span className="text-muted-foreground/60 text-sm font-semibold truncate relative z-10">
                            Bugün ne paylaşmak istersin, {firstName}?
                        </span>

                        <motion.div
                            animate={isInputHovered ? { x: 0, opacity: 1, rotate: 0 } : { x: -10, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            <Send className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                    </motion.div>
                </Link>
            </div>

            {/* Action Bar with Staggered Animation */}
            <div className="px-5 py-3 border-t-2 border-border/30 flex items-center justify-around bg-muted/5">
                {[
                    { href: "/makale/yeni", icon: PenTool, label: "Makale", color: "rose" },
                    { href: "/makale/yeni", icon: Plus, label: "Ekle", color: "blue" },
                    { href: "/forum", icon: HelpCircle, label: "Soru", color: "emerald" }
                ].map((item, idx) => (
                    <Link key={item.label} href={item.href} className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-200",
                                `text-muted-foreground hover:text-${item.color}-500 hover:bg-${item.color}-500/10`
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs font-bold hidden sm:inline uppercase tracking-wide">{item.label}</span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
