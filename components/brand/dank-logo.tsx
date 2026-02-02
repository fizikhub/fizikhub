import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

// Dynamically import EarthIcon to disable SSR for 3D content if needed later, 
// but for this design we focus on the text sticker effect.
const EarthIcon = dynamic(() => import("./earth-icon").then((mod) => mod.EarthIcon), {
    ssr: false,
    loading: () => <div className="w-full h-full rounded-full bg-blue-500/20" />
});

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
                V30 LOGO: 3D STICKER EXTRUSION
                - Concept: Layered shadows to create a thick physical sticker look.
            */}
            <div className="relative z-10 flex items-center">
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {/* HARD SHADOW LAYER */}
                    <h1 className="font-black text-2xl sm:text-4xl italic tracking-tighter leading-none text-black absolute top-[3px] left-[3px] select-none z-0">
                        FIZIKHUB
                    </h1>

                    {/* MAIN TEXT LAYER */}
                    <h1
                        className="font-black text-2xl sm:text-4xl italic tracking-tighter leading-none text-[#FFC800] relative z-10 border-black"
                        style={{
                            WebkitTextStroke: "1.5px black", // Thick stroke
                            // No drop-shadow here to keep it crisp against the hard shadow layer
                        }}
                    >
                        FIZIKHUB
                    </h1>

                    {/* GLOSS HIGHLIGHT (Optional, subtle top sheen) */}
                    <div className="absolute top-[2px] left-[2px] right-[2px] h-[40%] bg-gradient-to-b from-white/40 to-transparent rounded-sm pointer-events-none z-20 mix-blend-overlay" />
                </motion.div>

                {/* 3D Earth Icon - Kept effectively but integrated better */}
                <motion.div
                    className="absolute -top-4 -right-5 w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] z-30 pointer-events-none"
                    initial={{ rotate: 12 }}
                    animate={{
                        y: [0, -4, 0],
                        rotate: [12, 16, 12]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-full h-full drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] filter">
                        <EarthIcon className="w-full h-full scale-110" />
                    </div>
                </motion.div>
            </div>

            {/* Slogan - Sticker Style */}
            <motion.div
                className="self-start sm:self-end -mt-1 sm:-mr-2 z-20 relative"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 2, scale: 1.1 }}
            >
                <div className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 shadow-[2px_2px_0px_0px_#FFC800] tracking-widest inline-block transform -skew-x-12 border border-white">
                    BİLİM PLATFORMU
                </div>
            </motion.div>
        </div>
    );
}
