"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Moon, Sun, Heart, TreePine, Rocket } from "lucide-react";

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const themes = [
        {
            value: "dark",
            label: "Karanlık",
            icon: Moon,
            color: "bg-zinc-950 border-zinc-800"
        },
        {
            value: "pink",
            label: "Pembe",
            icon: Heart,
            color: "bg-pink-500 border-pink-600"
        },
        {
            value: "mars",
            label: "Mars",
            icon: Rocket,
            color: "bg-gradient-to-br from-orange-600 via-red-700 to-orange-800 border-orange-900",
        }
    ];

    return (
        <div className="space-y-3">
            <Label>Görünüm</Label>
            <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => {
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
                                    t.value === "pink" || t.special ? "text-white" : "text-foreground"
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
