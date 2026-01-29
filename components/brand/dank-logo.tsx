"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">
            {/* 
               V5: "THE SCIENTIFIC BADGE" (SVG LOGO)
               - Concept: A physical sticker/badge made of pure SVG.
               - Shape: Jagged Star / Sawblade (Energy/Impact).
               - Color: Neo-Yellow Burst + Lime Green Accent + Purple Tag.
            */}
            <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative"
            >
                <svg
                    width="240"
                    height="80"
                    viewBox="0 0 240 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[140px] sm:w-[180px] md:w-[220px] h-auto drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                >
                    {/* LAYER 1: THE BURST (JAGGED SHAPE) */}
                    {/* A chaotic polygon simulating a collision/explosion */}
                    <path
                        d="M20 40 L5 25 L30 15 L35 0 L60 15 L80 5 L95 25 L120 10 L135 30 L160 20 L165 40 L190 35 L180 55 L205 65 L180 75 L160 65 L140 80 L115 65 L90 75 L70 60 L45 70 L35 50 L10 60 L20 40Z"
                        fill="#FFC800"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* LAYER 2: THE "LIME" ACCENT (OFFSET) */}
                    <path
                        d="M30 40 L25 30 L40 25 L45 15 L60 25 L160 30 L155 50 L30 40Z"
                        fill="#84CC16"
                        stroke="none"
                        className="opacity-100 mix-blend-multiply"
                    />

                    {/* LAYER 3: FIZIKHUB TEXT (Curved/Warped look via standard SVG text) */}
                    {/* Shadow Layer for Depth */}
                    <text
                        x="52%"
                        y="52%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontFamily="var(--font-heading)"
                        fontWeight="900"
                        fontStyle="italic"
                        fontSize="42"
                        fill="black"
                        className="translate-y-[2px] translate-x-[2px]"
                    >
                        FIZIKHUB
                    </text>

                    {/* Main White Text with Thick Stroke */}
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontFamily="var(--font-heading)"
                        fontWeight="900"
                        fontStyle="italic"
                        fontSize="42"
                        fill="white"
                        stroke="black"
                        strokeWidth="2.5"
                        paintOrder="stroke"
                    >
                        FIZIKHUB
                    </text>

                    {/* LAYER 4: BİLİM PLATFORMU TAG (Sticker on top) */}
                    <g transform="translate(130, 50) rotate(-6)">
                        {/* Tag Background */}
                        <rect
                            x="0"
                            y="0"
                            width="100"
                            height="20"
                            fill="#8B5CF6"
                            stroke="black"
                            strokeWidth="2"
                            rx="4"
                        />
                        {/* Tag Text */}
                        <text
                            x="50"
                            y="14"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontFamily="var(--font-heading)"
                            fontWeight="800"
                            fontSize="10"
                            fill="white"
                            letterSpacing="1"
                        >
                            BİLİM PLATFORMU
                        </text>
                    </g>

                    {/* DECORATION: SPARKS */}
                    <circle cx="210" cy="20" r="6" fill="#00FFFF" stroke="black" strokeWidth="2" />
                    <path d="M210 10 L210 30 M200 20 L220 20" stroke="black" strokeWidth="2" />
                </svg>
            </motion.div>
        </div>
    );
}
