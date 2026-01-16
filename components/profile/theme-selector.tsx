"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Moon, Heart, Rocket, Cpu, Biohazard } from "lucide-react";

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
        restricted?: boolean;
    }

    const themes: ThemeOption[] = [
        {
            value: "dark",
            label: "Karanlık",
            icon: Moon,
            color: "bg-zinc-950 border-zinc-800"
        },
        {
            value: "blood",
            label: "Kan Kırmızısı",
            icon: Heart,
            color: "bg-red-900 border-red-800"
        },
        {
            value: "pink",
            label: "Pembe",
            icon: Heart,
            color: "bg-pink-500 border-pink-600"
        },
        {
            value: "dark-pink",
            label: "K. Pembe",
            icon: Heart,
            color: "bg-gradient-to-br from-zinc-900 via-pink-900 to-pink-700 border-pink-500"
        },
        {
            value: "mars",
            label: "Mars",
            icon: Rocket,
            color: "bg-gradient-to-br from-orange-600 via-red-700 to-orange-800 border-orange-900",
            special: true
        },
        {
            value: "cybernetic",
            label: "Sibernetik",
            icon: Cpu,
            color: "bg-cyan-950 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
            special: true
        },
        {
            value: "slime",
            label: "Sümük",
            icon: Biohazard,
            color: "bg-[#78FF32] border-[#0A3000] text-black shadow-[0_0_10px_#78FF32]",
            special: true,
            restricted: true
        }
    ];

    const allowedUsers = ["sulfiriikasit", "baranbozkurt"];
    // Allow if explicitly allowed OR if currently selected (to prevent locking out)
    const canSeeSlime = username && allowedUsers.includes(username);

    const visibleThemes = themes.filter(t => !t.restricted || canSeeSlime || theme === t.value);

    return (
        <div className="space-y-3">
            <Label>Görünüm</Label>
            <div className="grid grid-cols-3 gap-2">
                {visibleThemes.map((t) => {
                    const isActive = theme === t.value;
                    const Icon = t.icon;

                    return (
                        <button
                            key={t.value}
                            onClick={() => setTheme(t.value)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all",
                                isActive
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all",
                                isActive ? "scale-110" : "scale-100",
                                t.color
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5",
                                    (t.value === "pink" || t.value === "dark-pink" || t.special) && t.value !== "slime" ? "text-white" : "text-foreground",
                                    t.value === "slime" && "text-black animate-pulse"
                                )} />
                            </div>
                            <span className="text-xs font-medium">{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
