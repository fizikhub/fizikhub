"use client";

import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="relative group cursor-pointer select-none flex items-center justify-center">
            {/* 
                FIXED LOGO IMPLEMENTATION
                - viewBox increased to prevent clipping of 'F' and 'b' (220x80)
                - Mobile size reduced significantly (h-[32px])
                - Overflow visible allowed to let the badge hang out if needed
            */}
            <div className="relative z-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <svg
                    width="220"
                    height="80"
                    viewBox="0 0 220 80"
                    className="w-[120px] h-[44px] sm:w-[160px] sm:h-[58px] overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 1. SHADOW LAYER (Offset) */}
                    <text
                        x="50%"
                        y="55%"
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
                        y="55%"
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
                        y="55%"
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

                {/* Subtitle Badge - Tucked tighter and ensured visibility */}
                <div className="absolute bottom-1 right-2 sm:right-6 transform rotate-[-3deg] z-20">
                    <div className="bg-white border-[1.5px] sm:border-[2px] border-black px-1 py-[0.5px] shadow-[2px_2px_0px_0px_#000]">
                        <span className="block text-[7px] sm:text-[9px] font-black text-black leading-none uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "var(--font-outfit)" }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
