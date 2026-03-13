"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
//  NEO-BRUTALIST: PHYSICS SLIDER
// ─────────────────────────────────────────────────────────────
interface PhysicsSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (val: number) => void;
    color?: string;
}

export function PhysicsSlider({
    label,
    value,
    min,
    max,
    step = 1,
    unit = "",
    onChange,
    color = "#FACC15"
}: PhysicsSliderProps) {

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-2 w-full group">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-zinc-400 tracking-wider uppercase group-hover:text-white transition-colors">
                    {label}
                </span>
                <div
                    className="font-mono text-xs font-black px-2.5 py-1 border-[2px] border-black bg-white text-black min-w-[4.5rem] text-center shadow-[2px_2px_0px_0px_#000] rounded-md"
                >
                    {value.toFixed(step % 1 !== 0 ? 2 : 0)} <span className="text-zinc-500 font-bold">{unit}</span>
                </div>
            </div>

            <div className="relative h-3 rounded-md bg-zinc-900 border-[2px] border-black overflow-visible flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                <div
                    className="absolute left-0 top-0 bottom-0 rounded-sm"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
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
                    className="absolute w-5 h-5 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] pointer-events-none rounded-md"
                    style={{ left: `calc(${percentage}% - 10px)` }}
                    layout
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  NEO-BRUTALIST: PHYSICS TOGGLE
// ─────────────────────────────────────────────────────────────
interface PhysicsToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    color?: string;
}

export function PhysicsToggle({ label, checked, onChange, color = "#FACC15" }: PhysicsToggleProps) {
    return (
        <div
            className="flex items-center justify-between w-full p-3 rounded-lg bg-zinc-900 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] transition-all cursor-pointer group"
            onClick={() => onChange(!checked)}
        >
            <span className="text-[11px] font-black text-zinc-400 tracking-wider uppercase group-hover:text-white transition-colors">
                {label}
            </span>

            <div
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-md border-[2px] border-black transition-colors shadow-[2px_2px_0px_0px_#000]",
                    checked ? "" : "bg-zinc-800"
                )}
                style={{ backgroundColor: checked ? color : undefined }}
            >
                <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                        "pointer-events-none block h-4 w-4 bg-white border-[1.5px] border-black rounded-sm shadow-sm",
                        checked ? "translate-x-[22px]" : "translate-x-[2px]"
                    )}
                />
            </div>
        </div>
    );
}
