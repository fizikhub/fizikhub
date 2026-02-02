"use client";

import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="relative group cursor-pointer select-none">
            {/* 
                MULTI-LAYER SVG FOR PERFECT REFERENCE MATCH 
                Layer 1: Shadow (Solid Black Block)
                Layer 2: Stroke (Thick Black Outline)
                Layer 3: Fill (Yellow Text)
            */}
            <div className="relative z-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <svg
                    width="180"
                    height="60"
                    viewBox="0 0 180 60"
                    className="w-[140px] h-[46px] sm:w-[180px] sm:h-[60px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 1. SHADOW LAYER (Offset) */}
                    <text
                        x="50%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-black italic tracking-tighter"
                        dx="4"
                        dy="4"
                        style={{
                            fill: "black",
                            stroke: "black",
                            strokeWidth: "8px",
                            paintOrder: "stroke",
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontSize: "48px",
                            fontWeight: 900
                        }}
                    >
                        FizikHub
                    </text>

                    {/* 2. STROKE LAYER (Thick Black Outline) */}
                    <text
                        x="50%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-black italic tracking-tighter"
                        style={{
                            fill: "black",
                            stroke: "black",
                            strokeWidth: "8px", // Matches thick sticker outline
                            strokeLinejoin: "round",
                            paintOrder: "stroke",
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontSize: "48px",
                            fontWeight: 900
                        }}
                    >
                        FizikHub
                    </text>

                    {/* 3. FILL LAYER (Yellow) */}
                    <text
                        x="50%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-black italic tracking-tighter"
                        style={{
                            fill: "#FFC800",
                            stroke: "none",
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontSize: "48px",
                            fontWeight: 900
                        }}
                    >
                        FizikHub
                    </text>
                </svg>

                {/* Subtitle Badge - Precise Positioning */}
                <div className="absolute -bottom-1 right-2 sm:right-4 transform rotate-[-3deg]">
                    <div className="bg-white border-[2px] border-black px-1.5 py-[1px] shadow-[3px_3px_0px_0px_#000]">
                        <span className="block text-[8px] sm:text-[9px] font-black text-black leading-none uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "var(--font-outfit)" }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
