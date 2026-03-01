"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface CustomBadgeIconProps {
    name: string;
    size?: number;
    className?: string;
}

const DefProps = (s: number, w: number) => ({
    width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: w, strokeLinecap: "round" as any, strokeLinejoin: "round" as any
});

const Badges = {
    MerhabaDunya: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.circle cx="12" cy="12" r="10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        </svg>
    ),
    IlkAdim: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.path d="M12 17a5 5 0 0 0 5-5V8H7v4a5 5 0 0 0 5 5z" fill="currentColor" fillOpacity="0.2" animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            <path d="M7 8h10M7 12h10" />
        </svg>
    ),
    Kasif: ({ s, w }: any) => ( // REDESIGN: Natural pendulum
        <svg {...DefProps(s, w)}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
            <motion.polygon points="12 4 15 12 12 20 9 12" fill="currentColor" fillOpacity="0.3"
                animate={{ rotate: [0, -10, 15, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                style={{ originX: "12px", originY: "12px" }}
            />
        </svg>
    ),
    Yardimsever: ({ s, w }: any) => ( // REDESIGN: Glowing heart in hands
        <svg {...DefProps(s, w)}>
            <motion.path d="M12 19.5l-1.45-1.3C5.4 13.36 2 10.28 2 6.5 2 3.42 4.42 1 7.5 1 9.24 1 10.91 1.81 12 3.09 13.09 1.81 14.76 1 16.5 1 19.58 1 22 3.42 22 6.5c0 3.78-3.4 6.86-8.55 11.54L12 19.5z"
                fill="#ff3366" stroke="#ff3366"
                animate={{ scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 5px #ff3366)", "drop-shadow(0 0 15px #ff3366)", "drop-shadow(0 0 5px #ff3366)"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M2 18h20M4 22c0-2 4-4 8-4s8 2 8 4" opacity="0.6" strokeDasharray="3 3" />
        </svg>
    ),
    YildizTozu: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            {[
                { cx: 12, cy: 12, r: 3, d: 0 }, { cx: 18, cy: 6, r: 1.5, d: 0.3 },
                { cx: 6, cy: 16, r: 2, d: 0.6 }, { cx: 16, cy: 18, r: 1, d: 0.9 }
            ].map((star, i) => (
                <motion.path key={i} d={`M${star.cx} ${star.cy - star.r * 2} L${star.cx + star.r} ${star.cy - star.r} L${star.cx + star.r * 2} ${star.cy} L${star.cx + star.r} ${star.cy + star.r} L${star.cx} ${star.cy + star.r * 2} L${star.cx - star.r} ${star.cy + star.r} L${star.cx - star.r * 2} ${star.cy} L${star.cx - star.r} ${star.cy - star.r} Z`} fill="currentColor"
                    animate={{ scale: [0, 1.5, 0], rotate: [0, 90, 180] }}
                    transition={{ duration: 2, repeat: Infinity, delay: star.d }}
                />
            ))}
        </svg>
    ),
    KuyrukluYildiz: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ x: [-5, 5, -5], y: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <circle cx="16" cy="8" r="4" fill="currentColor" />
                <path d="M13.5 10.5L3 21M16 12l-7 7M12 16l-7 7" strokeDasharray="4 4" opacity="0.6" />
            </motion.g>
        </svg>
    ),
    Galaksi: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }}>
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 9c-3 0-6-1.5-8-4 0 5 2 8 4 10M12 15c3 0 6 1.5 8 4 0-5-2-8-4-10M9 12c0 3-1.5 6-4 8 5 0 8-2 10-4M15 12c0-3 1.5-6 4-8-5 0-8 2-10 4" />
            </motion.g>
        </svg>
    ),
    SoruIsareti: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ y: [0, -5, 0], scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 2px currentColor)", "drop-shadow(0 0 8px currentColor)", "drop-shadow(0 0 2px currentColor)"] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 5" strokeWidth={w + 1} />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            </motion.g>
        </svg>
    ),
    Merakli: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M21 21l-6-6" strokeWidth={w + 1} />
            <circle cx="10" cy="10" r="7" />
            <motion.path d="M8 8a2 2 0 0 1 4 0c0 1.5-2 2-2 3.5" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ originX: "10px", originY: "10px" }} />
            <motion.circle cx="10" cy="14" r="1" fill="currentColor" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </svg>
    ),
    SoruUstasi: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M6 4h12M8 4v7a4 4 0 0 0 8 0V4M12 11v8M8 19h8" />
            {[0, 0.6, 1.2].map((delay, i) => (
                <motion.g key={i} animate={{ y: [0, -8, 0], opacity: [0, 1, 0], x: (i - 1) * 4 }} transition={{ duration: 2, repeat: Infinity, delay }}>
                    <path d="M12 3c-1 0-1-1 0-1s1 1 0 1" strokeWidth={1} />
                </motion.g>
            ))}
        </svg>
    ),
    EnIyiCevap: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.circle cx="12" cy="10" r="7" fill="currentColor" fillOpacity="0.2" animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 5px currentColor)", "drop-shadow(0 0 15px currentColor)"] }} transition={{ duration: 2, repeat: Infinity }} />
            <path d="M8 15.5l-2 6.5 6-3 6 3-2-6.5" fill="currentColor" fillOpacity="0.1" />
            <motion.path d="M12 7l1.5 3 3 .5-2.5 2 .5 3-2.5-1.5L9.5 15.5l.5-3-2.5-2 3-.5z" fill="currentColor" animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "10px" }} />
        </svg>
    ),
    Tesla: ({ s, w }: any) => ( // REDESIGN: Epik mor yıldırımlar
        <svg {...DefProps(s, w)}>
            <path d="M8 22h8M10 22v-6c0-1-1-2-1-3V8h6v5c0 1-1 2-1 3v6" fill="currentColor" fillOpacity="0.1" />
            <ellipse cx="12" cy="8" rx="5" ry="2" fill="currentColor" fillOpacity="0.3" />
            <ellipse cx="12" cy="6" rx="6" ry="2.5" fill="currentColor" fillOpacity="0.5" />
            <motion.path d="M6 6L2 2M6 6L3 9L1 7" stroke="#b026ff" strokeWidth={2} animate={{ opacity: [0, 1, 0, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }} />
            <motion.path d="M18 6l4-4M18 6l3 3l2-2" stroke="#b026ff" strokeWidth={2} animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: 0.2 }} />
            <motion.path d="M12 3V0M14 4l2-4M10 4L8 0" stroke="#b026ff" strokeWidth={1.5} animate={{ opacity: [0, 1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity, repeatType: "mirror", delay: 0.4 }} />
        </svg>
    ),
    Newton: ({ s, w }: any) => ( // REDESIGN: Falling Apple
        <svg {...DefProps(s, w)}>
            <path d="M2 5c4 0 6-3 10-3s6 3 10 3" />
            <path d="M15 5A3 3 0 0 1 9 5" fill="currentColor" fillOpacity="0.2" />
            <motion.g animate={{ y: [0, 14, 13, 15, 15], scaleY: [1, 1, 0.7, 1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeIn", repeatDelay: 1 }}>
                <circle cx="12" cy="7" r="2.5" fill="#ff3333" stroke="#ff3333" />
                <path d="M12 4.5v-1" stroke="#ff3333" />
                <path d="M12 4c.5-1 1.5-.5 1.5-.5" stroke="#4ade80" />
            </motion.g>
            <path d="M5 21h14" />
        </svg>
    ),
    Einstein: ({ s, w }: any) => ( // REDESIGN: E=mc2 neon glow
        <svg {...DefProps(s, w)}>
            <motion.text
                x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
                fontSize="8" fontWeight="900" fontFamily="system-ui, sans-serif"
                fill="none" stroke="none"
                animate={{ textShadow: ["0 0 5px #0ff, 0 0 10px #0ff", "0 0 15px #0ff, 0 0 30px #0ff", "0 0 5px #0ff, 0 0 10px #0ff"] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <tspan fill="#00f3ff">E</tspan><tspan fill="#fff">=</tspan><tspan fill="#ff00ff">mc²</tspan>
            </motion.text>
            <motion.circle cx="12" cy="12" r="10" stroke="#00f3ff" strokeDasharray="4 6" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
        </svg>
    ),
    SeriOkuyucu: ({ s, w }: any) => ( // REDESIGN: Flipping book pages
        <svg {...DefProps(s, w)}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            {[0, 1, 2].map((i) => (
                <motion.path key={i} d="M20 2v15H6.5c-1 0-1.5-.5-2-1V3c.5-.5 1-1 2-1H20" fill="currentColor" fillOpacity="0.1" style={{ originX: "6.5px" }} animate={{ scaleX: [1, -1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }} />
            ))}
        </svg>
    ),
    KeskinGoz: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.circle cx="12" cy="12" r="9" strokeDasharray="6 6" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <motion.circle cx="12" cy="12" r="1" fill="currentColor" animate={{ scale: [1, 3, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </svg>
    ),
    Bilge: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <polygon points="12 2 22 20 2 20" strokeWidth={w} fill="currentColor" fillOpacity="0.1" />
            <motion.path d="M7 14c2-2 4-3 5-3s3 1 5 3" strokeWidth={w} />
            <motion.path d="M8 15c1.5 1.5 2.5 2 4 2s2.5-.5 4-2" strokeWidth={w} />
            <motion.circle cx="12" cy="14" r="1.5" fill="currentColor" animate={{ filter: ["drop-shadow(0 0 2px currentColor)", "drop-shadow(0 0 10px currentColor)"] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
    ),
    Uzman: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <polygon points="12 2 2 7 12 22 22 7" fill="currentColor" fillOpacity="0.1" />
                <polygon points="12 2 6 7 12 22 18 7" />
                <path d="M2 7h20M12 2v20M6 7l6 4 6-4" />
            </motion.g>
            <motion.path d="M10 5l4 0" stroke="#fff" animate={{ x: [-10, 20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
        </svg>
    ),
    FizikDehasi: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M12 4c-3 0-5 2-5 4 0 1.5 1 2.5 1 4v1c0 2 2 3 4 3s4-1 4-3v-1c0-1.5 1-2.5 1-4 0-2-2-4-5-4zM9 12h6M10 16h4" />
            <motion.ellipse cx="12" cy="10" rx="9" ry="3" strokeDasharray="3 3" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "10px" }} />
            <motion.ellipse cx="12" cy="10" rx="3" ry="9" strokeDasharray="3 3" animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "10px" }} />
        </svg>
    ),
    SosyalKelebek: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M12 8v8" strokeWidth={w + 1} />
            <circle cx="12" cy="6" r="1" fill="currentColor" />
            <motion.path d="M12 10C8 6 3 8 3 12c0 3 5 4 9 4M12 10c4-4 9-2 9 2 0 3-5 4-9 4" fill="currentColor" fillOpacity="0.2" style={{ originX: "12px" }} animate={{ scaleX: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
            <motion.path d="M12 14c-3 0-6 2-6 5 0 2 3 2 6-1M12 14c3 0 6 2 6 5 0 2-3 2-6-1" fill="currentColor" fillOpacity="0.1" style={{ originX: "12px" }} animate={{ scaleX: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
        </svg>
    ),
    Populer: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" fill="currentColor" fillOpacity="0.2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }}>
                <polygon points="12 1 13 3 15 3 13 4 14 6 12 5 10 6 11 4 9 3 11 3" fill="currentColor" />
            </motion.g>
        </svg>
    ),
    FikirOnderi: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.path d="M9 18h6v2H9z" />
            <path d="M10 22h4" />
            <motion.path d="M15 14c2-2 3-4.5 3-7 0-3.3-2.7-6-6-6S6 3.7 6 7c0 2.5 1 5 3 7v4h6v-4z" fill="#ffdd00" fillOpacity="0.2" stroke="#ffdd00" animate={{ filter: ["drop-shadow(0 0 5px #ffdd00)", "drop-shadow(0 0 20px #ffdd00)", "drop-shadow(0 0 5px #ffdd00)"] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </svg>
    ),
    Sevilen: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff3366" fillOpacity="0.2" stroke="#ff3366" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.text x="12" y="12" fontSize="6" fontWeight="bold" fill="#ff3366" stroke="none" textAnchor="middle" dominantBaseline="middle" animate={{ y: [0, -5, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>+1</motion.text>
        </svg>
    ),
    Caylak: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M2 22h20M12 22V10" strokeWidth={w + 1} />
            <motion.path d="M12 10C8 10 6 6 6 6s2 4 6 4" fill="currentColor" fillOpacity="0.3" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "12px", originY: "10px" }} />
            <motion.path d="M12 12c4 0 6-4 6-4s-2 4-6 4" fill="currentColor" fillOpacity="0.3" animate={{ rotate: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "12px", originY: "12px" }} />
        </svg>
    ),
    Gozlemci: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <motion.circle cx="12" cy="12" r="3" fill="currentColor" animate={{ scale: [1, 1.5, 1], filter: ["drop-shadow(0 0 2px currentColor)", "drop-shadow(0 0 10px currentColor)"] }} transition={{ duration: 4, repeat: Infinity }} />
        </svg>
    ),
    Arastirmaci: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ originX: "11px", originY: "11px" }}>
                <circle cx="11" cy="7" r="1.5" fill="currentColor" />
                <path d="M11 8.5v5" />
            </motion.g>
        </svg>
    ),
    Teorisyen: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M2 16h20M6 20v4M18 20v4" />
            <motion.text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>F=ma</motion.text>
            <motion.text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>∇×B = μJ</motion.text>
        </svg>
    ),
    Profesor: ({ s, w }: any) => ( // REDESIGN: Floating glowing book & cap
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="currentColor" fillOpacity="0.2" />
                <path d="M6 12v5c3 3 9 3 12 0v-5M12 18v4M9 22h6" />
                <motion.path d="M20 10l-2 5" strokeDasharray="1 2" animate={{ y: [0, 2, 0] }} transition={{ duration: 1, repeat: Infinity }} />
            </motion.g>
        </svg>
    ),
    Kozmolog: ({ s, w }: any) => ( // REDESIGN: Quasar Jets
        <svg {...DefProps(s, w)}>
            <motion.ellipse cx="12" cy="12" rx="10" ry="3" fill="none" stroke="currentColor" animate={{ rotate: 360, scaleX: [1, 0.8, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
            <circle cx="12" cy="12" r="3" fill="#000" stroke="currentColor" strokeWidth={2} />
            <motion.path d="M12 9V2M10 4l2-2 2 2" stroke="#b026ff" strokeWidth={2} animate={{ y: [0, -5], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.path d="M12 15v7M10 20l2 2 2-2" stroke="#b026ff" strokeWidth={2} animate={{ y: [0, 5], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
        </svg>
    ),
    Evrensel: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.path d="M6 16c-3.3 0-6-2.7-6-6s2.7-6 6-6c5 0 7 12 12 12s6-2.7 6-6-2.7-6-6-6c-5 0-7 12-12 12z" strokeDasharray="30 6" animate={{ strokeDashoffset: [0, -72] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        </svg>
    ),
    Kuantum: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M12 2v20M5 7c0 7 14 7 14 0" strokeWidth={w + 1} />
            <motion.path d="M2 12 Q 7 2, 12 12 T 22 12" stroke="#00f3ff" fill="none" animate={{ strokeDashoffset: [0, -40] }} strokeDasharray="4 4" transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        </svg>
    ),
    Cirak: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.g animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ originX: "12px", originY: "12px" }}>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                <path d="M15 15l-3 3" opacity="0.5" />
            </motion.g>
        </svg>
    ),
    Curie: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M10 2v7.31L4.65 18A3 3 0 0 0 7.24 22h9.52a3 3 0 0 0 2.59-4L14 9.31V2M8.5 2h7" />
            <motion.path d="M6 16h12M7 19h10M5.5 13h13" fill="#4ade80" fillOpacity="0.4" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.circle cx="12" cy="18" r="1.5" fill="#4ade80" animate={{ y: [0, -5], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
    ),
    Hawking: ({ s, w }: any) => ( // REDESIGN: Evaporating Black hole
        <svg {...DefProps(s, w)}>
            <circle cx="12" cy="12" r="6" fill="#000" stroke="currentColor" />
            {[4, 8, 16, 20].map((cx, i) => (
                <motion.circle key={i} cx={cx} cy={cx % 3 === 0 ? 8 : 16} r="1" fill="#fff" stroke="none" animate={{ y: [-2, -10], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
            ))}
        </svg>
    ),
    Vinci: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <circle cx="12" cy="12" r="10" opacity="0.3" strokeDasharray="3 3" />
            <rect x="5" y="5" width="14" height="14" opacity="0.3" strokeDasharray="3 3" />
            <path d="M12 9.5v5M9 11h6M8 10h8M12 14.5l-2 5M12 14.5l2 5M12 14.5l-4 3M12 14.5l4 3" />
            <circle cx="12" cy="8" r="1.5" />
        </svg>
    ),
    Galileo: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.path d="M22 2l-7 7M22 2c-1 0-2 1-2 2s1 2 2 2c1 0 2-1 2-2s-1-2-2-2z" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ originX: "20px", originY: "4px" }} />
            <motion.path d="M15 9l-9 9c-1.5 1.5-2 3-2 4s3-1 4-2l9-9" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ originX: "4px", originY: "20px" }} />
        </svg>
    ),
    GeceKusu: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M21 10.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l2.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" opacity="0.3" />
            <path d="M10 8c-1 0-2 1-2 2s1 2 2 2c1 0 2-1 2-2s-1-2-2-2zM16 8c-1 0-2 1-2 2s1 2 2 2c1 0 2-1 2-2s-1-2-2-2z" />
            <motion.circle cx="10" cy="10" r="1" fill="currentColor" animate={{ scaleY: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
            <motion.circle cx="16" cy="10" r="1" fill="currentColor" animate={{ scaleY: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
        </svg>
    ),
    BilgeBaykus: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <path d="M5 4c0 0 2 3 7 3s7-3 7-3-1 6-7 6-7-6-7-6zM6 10c0 4 3 8 6 8s6-4 6-8M12 18v3M9 21h6" />
            <circle cx="9" cy="9" r="2" stroke="#00f3ff" />
            <circle cx="15" cy="9" r="2" stroke="#00f3ff" />
            <motion.path d="M12 11l-1 2-1-2M15 9h2M7 9H5" stroke="#00f3ff" animate={{ filter: ["drop-shadow(0 0 2px #00f3ff)", "drop-shadow(0 0 8px #00f3ff)"] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
    ),
    SorunCozucu: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <rect x="6" y="6" width="12" height="12" rx="1" />
            <path d="M6 10h12M6 14h12M10 6v12M14 6v12" />
            <motion.g animate={{ rotate: [0, 90, 90, 180, 180] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "12px", originY: "12px" }}>
                <rect x="6" y="6" width="4" height="4" fill="currentColor" /><rect x="14" y="14" width="4" height="4" fill="currentColor" />
            </motion.g>
        </svg>
    ),
    Karadelik: ({ s, w }: any) => (
        <svg {...DefProps(s, w)}>
            <motion.ellipse cx="12" cy="12" rx="10" ry="4" stroke="#ffaa00" strokeWidth={2} strokeDasharray="4 4" animate={{ rotate: 360, strokeDashoffset: [0, -20] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }} />
            <circle cx="12" cy="12" r="5" fill="#000" stroke="#000" />
            <circle cx="12" cy="12" r="7" stroke="none" fill="#ff0000" fillOpacity="0.2" />
        </svg>
    ),
    FallbackIcon: ({ s, w }: any) => (
        <svg {...DefProps(s, w)} opacity="0.3">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="2 4" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
    )
};

export function CustomBadgeIcon({ name, size = 48, className }: CustomBadgeIconProps) {
    const normalName = name.toLocaleLowerCase("tr-TR").trim().replace(/['"ıI]/g, "i");
    const strokeW = 1.5;

    let Cmp = Badges.FallbackIcon;

    // DB Map to Components (Handling all 40 exactly)
    if (normalName.includes("merhaba dünya")) Cmp = Badges.MerhabaDunya;
    else if (normalName.includes("ilk adim")) Cmp = Badges.IlkAdim;
    else if (normalName.includes("kasif") || normalName.includes("kaşif")) Cmp = Badges.Kasif;
    else if (normalName.includes("yardimsever") || normalName.includes("yardımsever")) Cmp = Badges.Yardimsever;
    else if (normalName.includes("yildiz tozu") || normalName.includes("yıldız tozu")) Cmp = Badges.YildizTozu;
    else if (normalName.includes("kuyruklu")) Cmp = Badges.KuyrukluYildiz;
    else if (normalName.includes("galaksi")) Cmp = Badges.Galaksi;

    else if (normalName.includes("soru isareti") || normalName.includes("soru işareti")) Cmp = Badges.SoruIsareti;
    else if (normalName.includes("merakli") || normalName.includes("meraklı")) Cmp = Badges.Merakli;
    else if (normalName.includes("soru ustasi") || normalName.includes("soru ustası")) Cmp = Badges.SoruUstasi;
    else if (normalName.includes("en iyi cevap")) Cmp = Badges.EnIyiCevap;
    else if (normalName.includes("tesla")) Cmp = Badges.Tesla;
    else if (normalName.includes("newton")) Cmp = Badges.Newton;
    else if (normalName.includes("einstein")) Cmp = Badges.Einstein;
    else if (normalName.includes("seri okuyucu")) Cmp = Badges.SeriOkuyucu;

    else if (normalName.includes("keskin gö") || normalName.includes("keskin go")) Cmp = Badges.KeskinGoz;
    // Make sure not to match Bilge Baykuş with just Bilge
    else if (normalName === "bilge" || normalName === "bılge") Cmp = Badges.Bilge;
    else if (normalName.includes("uzman")) Cmp = Badges.Uzman;
    else if (normalName.includes("fizik dehasi") || normalName.includes("fizik dehası")) Cmp = Badges.FizikDehasi;
    else if (normalName.includes("sosyal kelebek")) Cmp = Badges.SosyalKelebek;
    else if (normalName.includes("popüler") || normalName.includes("populer")) Cmp = Badges.Populer;
    else if (normalName.includes("önder") || normalName.includes("onder")) Cmp = Badges.FikirOnderi;
    else if (normalName.includes("sevilen")) Cmp = Badges.Sevilen;

    else if (normalName.includes("çaylak") || normalName.includes("caylak")) Cmp = Badges.Caylak;
    else if (normalName.includes("gözlemci") || normalName.includes("gozlemci")) Cmp = Badges.Gozlemci;
    else if (normalName.includes("araştır") || normalName.includes("arastir")) Cmp = Badges.Arastirmaci;
    else if (normalName.includes("teorisyen")) Cmp = Badges.Teorisyen;
    else if (normalName.includes("profesör") || normalName.includes("profesor")) Cmp = Badges.Profesor;
    else if (normalName.includes("kozmolog")) Cmp = Badges.Kozmolog;
    else if (normalName.includes("evrensel")) Cmp = Badges.Evrensel;
    else if (normalName.includes("kuantum")) Cmp = Badges.Kuantum;
    else if (normalName.includes("çırak") || normalName.includes("cirak")) Cmp = Badges.Cirak;

    else if (normalName.includes("curie")) Cmp = Badges.Curie;
    else if (normalName.includes("hawking")) Cmp = Badges.Hawking;
    else if (normalName.includes("vinci") || normalName.includes("da vinci")) Cmp = Badges.Vinci;
    else if (normalName.includes("galileo")) Cmp = Badges.Galileo;
    else if (normalName.includes("gece kusu") || normalName.includes("gece kuşu")) Cmp = Badges.GeceKusu;
    else if (normalName.includes("baykus") || normalName.includes("baykuş")) Cmp = Badges.BilgeBaykus;
    else if (normalName.includes("çözücü") || normalName.includes("cozucu")) Cmp = Badges.SorunCozucu;
    else if (normalName.includes("karadelik")) Cmp = Badges.Karadelik;

    return (
        <div className={cn("inline-flex items-center justify-center p-2 rounded-full border-[3px] border-black bg-zinc-900/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", className)} style={{ width: size + 16, height: size + 16 }}>
            <Cmp s={size} w={strokeW} />
        </div>
    );
}
