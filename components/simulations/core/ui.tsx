"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Custom Physics Slider ---
interface PhysicsSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (val: number) => void;
    color?: string; // used for accent
}

export function PhysicsSlider({
    label,
    value,
    min,
    max,
    step = 1,
    unit = "",
    onChange,
    color = "#38BDF8"
}: PhysicsSliderProps) {

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-2 w-full group">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase group-hover:text-zinc-200 transition-colors">
                    {label}
                </span>
                <div className="font-mono text-xs font-black px-2 py-1 rounded bg-black/50 border border-white/10 text-white min-w-[4rem] text-center shadow-inner tracking-tighter">
                    {value.toFixed(step % 1 !== 0 ? 2 : 0)} <span className="text-zinc-500">{unit}</span>
                </div>
            </div>

            <div className="relative h-2 rounded-full bg-black border border-white/5 overflow-visible flex items-center shadow-inner">
                <div
                    className="absolute left-0 top-0 bottom-0 rounded-full"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}80`
                    }}
                />

                <input
                    type="range"
                    autoFocus={false}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb */}
                <motion.div
                    className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-zinc-900 pointer-events-none"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                    layout
                />
            </div>
        </div>
    );
}

// --- Custom Physics Toggle ---
interface PhysicsToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    color?: string;
}

export function PhysicsToggle({ label, checked, onChange, color = "#38BDF8" }: PhysicsToggleProps) {
    return (
        <div className="flex items-center justify-between w-full p-2 sm:p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group" onClick={() => onChange(!checked)}>
            <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase group-hover:text-zinc-200 transition-colors">
                {label}
            </span>

            <button
                role="switch"
                aria-checked={checked}
                className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                    checked ? "bg-white/20" : "bg-zinc-800"
                )}
                style={{ backgroundColor: checked ? color : undefined }}
            >
                <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                        checked ? "translate-x-4" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}
