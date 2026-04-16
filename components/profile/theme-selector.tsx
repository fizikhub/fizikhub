"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Moon, Leaf, FlaskConical, Pi, Star } from "lucide-react";

interface ThemeSelectorProps {
    username?: string;
}

export function ThemeSelector({ username }: ThemeSelectorProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    interface ThemeOption {
        value: string;
        label: string;
        icon: any;
        color: string;
        special?: boolean;
    }

    const themes: ThemeOption[] = [
        {
            value: "dark",
            label: "Fizik Klasik",
            icon: Moon,
            color: "bg-zinc-950 border-zinc-800 text-foreground"
        },
        {
            value: "biology",
            label: "Biyoloji",
            icon: Leaf,
            color: "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
            special: true
        },
        {
            value: "chemistry",
            label: "Kimya",
            icon: FlaskConical,
            color: "bg-amber-950 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            special: true
        },
        {
            value: "math",
            label: "Matematik",
            icon: Pi,
            color: "bg-slate-900 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]",
            special: true
        },
        {
            value: "astro",
            label: "Astrofizik",
            icon: Star,
            color: "bg-indigo-950 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
            special: true
        }
    ];

    return (
        <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">Bilimsel Temalar</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {themes.map((t) => {
                    const isActive = theme === t.value || (theme === "system" && t.value === "dark");
                    const Icon = t.icon;

                    return (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setTheme(t.value)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all group",
                                isActive
                                    ? "border-primary bg-primary/5 text-primary scale-100 shadow-[4px_4px_0px_0px_#FFC800]"
                                    : "border-black bg-zinc-900 hover:bg-zinc-800 text-muted-foreground hover:text-foreground hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                                isActive ? "scale-110" : "scale-100 group-hover:scale-105",
                                t.color,
                                !isActive && "border-black opacity-80"
                            )}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-center mt-1">{t.label}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-[10px] text-zinc-500 font-medium px-1 mt-2">
                Bilim dalınıza uygun renk paleti ve animasyonlar anında uygulanır. Performans dostudur.
            </p>
        </div>
    );
}
