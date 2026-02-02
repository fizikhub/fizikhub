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
        <div className="group relative flex flex-col items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-300 origin-center cursor-pointer select-none">
            {/* 3D YELLOW TEXT LAYER */}
            <div className="relative z-20">
                <h1
                    className="font-black text-[28px] sm:text-4xl tracking-tighter leading-[0.85] text-[#FFD600]"
                    style={{
                        fontFamily: "var(--font-heading), sans-serif",
                        // The '3D' extrusion effect using text-shadow
                        textShadow: `
                            1px 1px 0px #000,
                            2px 2px 0px #000,
                            3px 3px 0px #000,
                            4px 4px 0px #000,
                            5px 5px 0px #000,
                            6px 6px 0px #000
                        `,
                        WebkitTextStroke: "1px black"
                    }}
                >
                    FizikHub
                </h1>
            </div>

            {/* WHITE BOX SUBTITLE LAYER */}
            <div className="relative z-30 -mt-2 sm:-mt-3 ml-4 sm:ml-8 rotate-[-2deg] group-hover:rotate-[0deg] transition-transform duration-300">
                <div
                    className="bg-white border-[2px] border-black px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-[3px_3px_0px_0px_#000]"
                >
                    <span className="block text-[8px] sm:text-[10px] font-black text-black leading-none uppercase tracking-widest">
                        BİLİM PLATFORMU
                    </span>
                </div>
            </div>
        </div>
    );
}
