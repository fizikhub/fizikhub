import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer items-start">
            {/* 
        NEW LOGO: FizikHub (Perfect Recreation)
        - Color: #FFD200 (Bright Yellow)
        - 3D Shadow: Thick Solid Black
        - Font: Heading Sans
      */}
            <div className="relative">
                <motion.h1
                    className="font-black text-3xl sm:text-[40px] tracking-tight leading-none text-[#FFD200] relative z-20"
                    style={{
                        fontFamily: "var(--font-heading)",
                        textShadow: `
                            1px 1px 0px #000,
                            2px 2px 0px #000,
                            3px 3px 0px #000,
                            4px 4px 0px #000,
                            5px 5px 0px #000,
                            6px 6px 0px #000,
                            7px 7px 0px #000
                        `,
                        transform: "rotate(-2deg)"
                    }}
                    whileHover={{
                        scale: 1.05,
                        rotate: "0deg",
                        transition: { type: "spring", stiffness: 400 }
                    }}
                >
                    FizikHub
                </motion.h1>
            </div>

            {/* Slogan Banner */}
            <motion.div
                className="mt-1 -ml-1 z-30"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 1, scale: 1.1 }}
                style={{ transformOrigin: "left center" }}
            >
                <div className="relative">
                    {/* Banner Shadow/Background */}
                    <div className="absolute inset-0 bg-black translate-x-[4px] translate-y-[4px]" />

                    {/* Banner Main */}
                    <span className="relative bg-white border-[2.5px] border-black text-black text-[10px] sm:text-[12px] font-black uppercase px-3 py-1 tracking-wider inline-block">
                        BİLİM PLATFORMU
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
