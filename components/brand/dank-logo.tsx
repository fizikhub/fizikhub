import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import EarthIcon to disable SSR for 3D content
const EarthIcon = dynamic(() => import("./earth-icon").then((mod) => mod.EarthIcon), {
    ssr: false,
    loading: () => <div className="w-full h-full rounded-full bg-blue-500/20" /> // Placeholder
});

export function DankLogo() {
    return (
        <div className="relative group cursor-pointer select-none">
            {/* 
                SVG IMPLEMENTATION FOR PIXEL-PERFECT MATCH 
                - Yellow Fill: #FFC800
                - Stroke: Black
                - 3D Extrusion: Hard shadow
            */}
            <div className="relative z-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <svg
                    width="180"
                    height="60"
                    viewBox="0 0 180 60"
                    className="w-[140px] h-[46px] sm:w-[180px] sm:h-[60px] drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <text
                        x="50%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-black italic tracking-tighter"
                        style={{
                            fill: "#FFC800", // The Reference Yellow
                            stroke: "black",
                            strokeWidth: "3px",
                            paintOrder: "stroke",
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontSize: "48px",
                            fontWeight: 900
                        }}
                    >
                        FizikHub
                    </text>
                </svg>

                {/* Subtitle Badge - Positioned strictly relative to the SVG container */}
                <div className="absolute -bottom-1 right-2 sm:right-4 transform rotate-[-2deg]">
                    <div className="bg-white border-[2px] border-black px-1.5 py-[1px] shadow-[2px_2px_0px_0px_#000]">
                        <span className="block text-[8px] sm:text-[9px] font-black text-black leading-none uppercase tracking-widest whitespace-nowrap">
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
