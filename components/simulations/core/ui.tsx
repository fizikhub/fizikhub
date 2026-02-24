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
    color = "#FACC15"
}: PhysicsSliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-2 w-full group relative z-10">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black text-black uppercase tracking-tighter w-full">
                    {label}
                </span>
            </div>

            <div className="relative h-6 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center">
                {/* Fill Track */}
                <div
                    className="absolute left-0 top-0 bottom-0 border-r-[3px] border-black transition-all duration-75"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                />

                {/* Invisible input on top */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                {/* Value Display attached to thumb */}
                <div
                    className="absolute -top-10 pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${percentage}%)`, transform: 'translateX(-50%)' }}
                >
                    <div className="bg-black text-white font-mono font-black text-xs px-2 py-1 flex items-center gap-1 relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-4 after:border-x-4 after:border-x-transparent after:border-t-black">
                        {value.toFixed(step % 1 !== 0 ? 2 : 0)} <span className="text-zinc-400">{unit}</span>
                    </div>
                </div>

                {/* Custom Thumb - Brutalist Block */}
                <div
                    className="absolute w-6 h-8 bg-white border-[3px] border-black pointer-events-none transition-all duration-75 z-10 flex items-center justify-center shadow-[2px_2px_0px_#000]"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                >
                    <div className="w-1 h-3 bg-black"></div>
                </div>
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

export function PhysicsToggle({ label, checked, onChange, color = "#4ADE80" }: PhysicsToggleProps) {
    return (
        <div
            className="flex items-center justify-between w-full p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] cursor-pointer group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            onClick={() => onChange(!checked)}
        >
            <span className="text-sm font-black text-black uppercase tracking-tighter">
                {label}
            </span>

            <button
                role="switch"
                aria-checked={checked}
                className={cn(
                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center border-[3px] border-black transition-colors focus:outline-none",
                    checked ? "bg-white" : "bg-zinc-200"
                )}
                style={{ backgroundColor: checked ? color : undefined }}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-full w-6 bg-white border-x-[3px] border-black transition-transform duration-200 shadow-[2px_0_0_#000]",
                        checked ? "translate-x-6" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}
