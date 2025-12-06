"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/",
            label: "ANA ÜS",
            icon: Home
        },
        {
            href: "/blog",
            label: "MAKALE",
            icon: BookOpen
        },
        {
            href: "/kesfet",
            label: "KEŞFET",
            icon: Compass
        },
        {
            href: "/profil",
            label: "PROFİL",
            icon: User
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
            <nav className="flex items-center justify-around h-16 px-2">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center flex-1 h-full py-1",
                                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <div className="relative">
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-glow"
                                        className="absolute -inset-3 bg-cyan-500/20 blur-lg rounded-full"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                <motion.div
                                    whileTap={{ scale: 0.8 }}
                                    animate={isActive ? {
                                        y: [0, -4, 0],
                                        scale: [1, 1.1, 1],
                                        filter: "drop-shadow(0 0 5px rgba(6,182,212,0.8))"
                                    } : {
                                        y: 0,
                                        scale: 1,
                                        filter: "drop-shadow(0 0 0px rgba(0,0,0,0))"
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        times: [0, 0.5, 1],
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                                </motion.div>
                            </div>

                            <motion.span
                                className="text-[10px] font-bold mt-1 tracking-wider"
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                            >
                                {link.label}
                            </motion.span>

                            {/* Active Dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-dot"
                                    className="absolute bottom-2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
