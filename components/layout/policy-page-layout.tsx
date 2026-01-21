"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HeaderSpaceBackground } from "@/components/forum/header-space-background";

interface PolicyPageLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    themeColor?: "emerald" | "purple" | "blue" | "orange";
}

export function PolicyPageLayout({
    children,
    title,
    subtitle,
    icon,
    themeColor = "blue"
}: PolicyPageLayoutProps) {

    // Theme color maps for gradients and accents
    const colorMap = {
        emerald: {
            gradient: "from-emerald-400 to-cyan-500",
            bgPulse: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            icon: "text-emerald-500"
        },
        purple: {
            gradient: "from-purple-400 to-indigo-500",
            bgPulse: "bg-purple-500/10",
            border: "border-purple-500/20",
            icon: "text-purple-500"
        },
        blue: {
            gradient: "from-blue-400 to-cyan-500",
            bgPulse: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: "text-blue-500"
        },
        orange: {
            gradient: "from-orange-400 to-red-500",
            bgPulse: "bg-orange-500/10",
            border: "border-orange-500/20",
            icon: "text-orange-500"
        }
    };

    const colors = colorMap[themeColor];

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden pb-20">
            {/* 1. Space Background (Fixed & Optimized) */}
            <div className="fixed inset-0 z-0 opacity-60">
                <HeaderSpaceBackground />
            </div>

            {/* 2. Ambient Glows */}
            <div className={cn("fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none z-0", colors.bgPulse.replace('/10', '/30'))} />
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[140px] opacity-20 pointer-events-none z-0" />

            {/* 3. Content Container */}
            <div className="relative z-10 container max-w-4xl px-4 md:px-6 py-12 md:py-20">

                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    {icon && (
                        <div className={cn("inline-flex items-center justify-center p-4 rounded-full backdrop-blur-md border ring-4 ring-black/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-2 animate-in zoom-in duration-700", colors.bgPulse, colors.border)}>
                            <div className={cn("w-12 h-12", colors.icon)}>
                                {icon}
                            </div>
                        </div>
                    )}

                    <h1 className={cn("text-4xl md:text-6xl font-black tracking-tight", "bg-clip-text text-transparent bg-gradient-to-r drop-shadow-sm", colors.gradient)}>
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Content Card Wrapper */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-12 shadow-[0_0_50px_-20px_rgba(0,0,0,0.7)]">
                    {/* Inner content with specific styling passed nicely */}
                    <div className="space-y-12">
                        {children}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 text-sm text-zinc-500">
                    <p>© {new Date().getFullYear()} FizikHub. Evrenin kurallarına tabidir.</p>
                </div>
            </div>
        </div>
    );
}

// Helper components for policy sections to keep them clean
export function PolicySection({
    children,
    number,
    title,
    icon
}: {
    children: React.ReactNode;
    number: string;
    title: string;
    icon?: React.ReactNode
}) {
    return (
        <section className="relative group">
            <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white font-mono font-bold text-lg group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {number}
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        {icon && <span className="text-zinc-400">{icon}</span>}
                        <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">{title}</h2>
                    </div>
                </div>
            </div>
            <div className="pl-4 md:pl-16 text-zinc-300 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    );
}
