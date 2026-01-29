"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    // The 3D extrusion layers (going down-right at 45°)
    const shadowLayers = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
    ];

    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-start p-1">

            {/* 
               V4: LIME SCIENCE BLOCK
               - Color: Lime Green (#84CC16)
               - Extrusion: Black layers, 45° down-right
               - Style: Chomiy/Lucky Junior inspired
            */}

            <div className="relative">
                {/* 3D EXTRUSION LAYERS (Black) */}
                {shadowLayers.map((layer, i) => (
                    <span
                        key={i}
                        className="absolute font-black italic tracking-tighter text-black text-2xl sm:text-4xl md:text-5xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            left: `${layer.x}px`,
                            top: `${layer.y}px`,
                            zIndex: 0
                        }}
                        aria-hidden="true"
                    >
                        FIZIKHUB
                    </span>
                ))}

                {/* MAIN TEXT LAYER (Lime Green with Black Stroke) */}
                <motion.h1
                    className="relative z-10 font-black italic tracking-tighter text-2xl sm:text-4xl md:text-5xl"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#84CC16', // Lime Green
                        WebkitTextStroke: '2px black',
                    }}
                    whileHover={{
                        scale: 1.03,
                        x: -2,
                        y: -2,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    FIZIKHUB
                </motion.h1>
            </div>

            {/* 
               BİLİM PLATFORMU BADGE
               - Color: Purple (#8B5CF6) background
               - Style: Rotated tag
            */}
            <motion.div
                className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 sm:-bottom-3"
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 3, scale: 1.1 }}
            >
                <div
                    className="flex items-center justify-center border-2 border-black bg-[#8B5CF6] px-2 py-0.5 shadow-[3px_3px_0px_0px_#000]"
                >
                    <span
                        className="text-[8px] font-bold uppercase leading-none tracking-widest text-white sm:text-[10px]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        BİLİM PLATFORMU
                    </span>
                </div>
            </motion.div>

        </div>
    );
}
