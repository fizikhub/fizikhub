"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/magicui/tilt-card";
import { BorderBeam } from "@/components/magicui/border-beam";

interface NeoShareCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;      // Expected to be a tailwind class like "bg-yellow-400"
    accentColor: string; // Hex color for borders/shadows if needed, or used for inline styles
    actionText?: string;
    delay?: number;
    className?: string;
    showBorderBeam?: boolean;
}

export function NeoShareCard({
    title,
    description,
    href,
    icon: Icon,
    color,
    accentColor,
    actionText = "OLUŞTUR",
    delay = 0,
    className,
    showBorderBeam = false,
}: NeoShareCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: "backOut" }}
            className={cn("h-full", className)}
        >
            <Link href={href} className="block h-full group perspective-1000">
                <TiltCard className="h-full" rotationFactor={8}>
                    <div className="
                        relative h-full flex flex-col justify-between
                        bg-white dark:bg-zinc-900
                        border-[3px] border-black dark:border-white
                        rounded-xl overflow-hidden
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                        dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                        dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
                        hover:-translate-y-1 hover:-translate-x-1
                        transition-all duration-300 ease-out
                    ">

                        {showBorderBeam && (
                            <BorderBeam
                                size={300}
                                duration={8}
                                delay={9}
                                borderWidth={3}
                                colorFrom={accentColor}
                                colorTo="#FFF"
                            />
                        )}

                        {/* Top Section: Icon & Decorative Elements */}
                        <div className="p-5 flex items-start justify-between relative z-10">
                            {/* Icon Container */}
                            <div className={cn(
                                "w-14 h-14 flex items-center justify-center rounded-lg border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-transform group-hover:scale-110 duration-300",
                                color
                            )}>
                                <Icon className="w-7 h-7 text-black stroke-[2.5px]" />
                            </div>

                            {/* Arrow Indicator */}
                            <div className="
                                w-8 h-8 rounded-full border-[2px] border-black dark:border-white 
                                flex items-center justify-center
                                bg-transparent group-hover:bg-black group-hover:text-white
                                dark:group-hover:bg-white dark:group-hover:text-black
                                transition-colors duration-300
                            ">
                                <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                            </div>
                        </div>

                        {/* Middle Section: Text Content */}
                        <div className="px-5 pb-5 pt-2 flex-grow relative z-10">
                            <h3 className="text-2xl font-black text-black dark:text-white uppercase leading-none mb-2 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 leading-snug">
                                {description}
                            </p>
                        </div>

                        {/* Bottom Section: Action Bar */}
                        <div className={cn(
                            "mt-auto border-t-[3px] border-black dark:border-white py-3 px-5 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 transition-colors",

                        )}>
                            <span className="font-mono text-xs font-black uppercase text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                                _action
                            </span>
                            <span className={cn(
                                "text-xs font-black uppercase tracking-wider px-2 py-1 rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white",
                                "group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300"
                            )}>
                                {actionText}
                            </span>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                            style={{
                                backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
                                backgroundSize: '10px 10px'
                            }}
                        ></div>
                    </div>
                </TiltCard>
            </Link>
        </motion.div>
    );
}
