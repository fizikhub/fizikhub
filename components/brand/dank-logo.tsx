import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer items-start pt-2">
            {/* 
        PIXEL PERFECT RECREATION: FizikHub
        - Color: #FFD200 (Bright Yellow)
        - 3D Shadow: 10px Solid Black (Aggressive)
        - Rotation: -6deg
      */}
            <div className="relative">
                <motion.h1
                    className="font-black text-[32px] sm:text-[44px] tracking-tight leading-none text-[#FFD200] relative z-20"
                    style={{
                        fontFamily: "var(--font-heading)",
                        textShadow: `
                            1px 1px 0px #000,
                            2px 2px 0px #000,
                            3px 3px 0px #000,
                            4px 4px 0px #000,
                            5px 5px 0px #000,
                            6px 6px 0px #000,
                            7px 7px 0px #000,
                            8px 8px 0px #000,
                            9px 9px 0px #000,
                            10px 10px 0px #000
                        `,
                        transform: "rotate(-6deg)"
                    }}
                    whileHover={{
                        scale: 1.05,
                        rotate: "-3deg",
                        transition: { type: "spring", stiffness: 400 }
                    }}
                >
                    FizikHub
                </motion.h1>
            </div>

            {/* Slogan Banner - Tightly Overlapping */}
            <motion.div
                className="mt-[-8px] ml-[20px] sm:ml-[40px] z-30"
                initial={{ rotate: -4 }}
                whileHover={{ rotate: 0, scale: 1.1 }}
                style={{ transformOrigin: "left center" }}
            >
                <div className="relative">
                    {/* Banner Shadow */}
                    <div className="absolute inset-0 bg-black translate-x-[5px] translate-y-[5px]" />

                    {/* Banner Main */}
                    <span className="relative bg-white border-[3px] border-black text-black text-[10px] sm:text-[13px] font-black uppercase px-4 py-1.5 tracking-tighter inline-block">
                        BİLİM PLATFORMU
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
