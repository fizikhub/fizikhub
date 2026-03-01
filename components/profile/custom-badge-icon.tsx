"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface CustomBadgeIconProps {
    name: string;
    size?: number;
    className?: string;
}

const S = (s: number) => ({ width: s, height: s, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" });

const Badges: Record<string, React.FC<{ s: number }>> = {
    MerhabaDunya: ({ s }) => (
        <svg {...S(s)}>
            <motion.circle cx="12" cy="12" r="10" fill="#1a6bff" stroke="#4da6ff" strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M2 12h20" stroke="#4da6ff" strokeWidth="1" />
            <motion.path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#4da6ff" strokeWidth="1" fill="#2e8bff" fillOpacity="0.4" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} />
            <circle cx="8" cy="10" r="1.5" fill="#3ddc84" /><circle cx="15" cy="14" r="1" fill="#3ddc84" /><circle cx="6" cy="15" r="0.8" fill="#3ddc84" />
        </svg>
    ),
    IlkAdim: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#0d1b2a" stroke="#ffd700" strokeWidth="1.5" />
            <motion.path d="M9 18h6l-1-4h-4l-1 4zM10 14l-1-5c0-1 1-2 3-2s3 1 3 2l-1 5" fill="#ffd700" stroke="#ffec80" strokeWidth="0.5" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            <motion.circle cx="12" cy="5" r="1" fill="#fff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.circle cx="8" cy="8" r="0.5" fill="#fff" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
            <motion.circle cx="17" cy="6" r="0.5" fill="#fff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />
        </svg>
    ),
    Kasif: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1e3a5f" stroke="#e8b923" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="6" fill="none" stroke="#e8b923" strokeWidth="1" strokeDasharray="2 2" />
            <motion.g style={{ originX: "12px", originY: "12px" }} animate={{ rotate: [0, -15, 20, -10, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}>
                <polygon points="12,5 14,12 12,19" fill="#e8b923" fillOpacity="0.8" /><polygon points="12,5 10,12 12,19" fill="#c4392a" fillOpacity="0.8" />
            </motion.g>
            <circle cx="12" cy="12" r="1.5" fill="#e8b923" stroke="#fff" strokeWidth="0.5" />
        </svg>
    ),
    Yardimsever: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#2d1b3d" stroke="#ff3d8a" strokeWidth="1.5" />
            <motion.path d="M12 18l-1.2-1.1C6.5 13.3 4 11 4 8.2 4 5.9 5.8 4 8 4c1.4 0 2.7.7 3.5 1.7L12 6.2l.5-.5C13.3 4.7 14.6 4 16 4c2.2 0 4 1.9 4 4.2 0 2.8-2.5 5.1-6.8 9L12 18z" fill="#ff3d8a" stroke="#ff6baa" strokeWidth="0.5" animate={{ scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 3px #ff3d8a)", "drop-shadow(0 0 12px #ff3d8a)", "drop-shadow(0 0 3px #ff3d8a)"] }} transition={{ duration: 1.3, repeat: Infinity }} />
        </svg>
    ),
    YildizTozu: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#0f0c29" stroke="#a855f7" strokeWidth="1.5" />
            {[{ x: 12, y: 8, r: 2.5, c: "#ffd700", d: 0 }, { x: 7, y: 15, r: 1.8, c: "#ff6b6b", d: 0.3 }, { x: 17, y: 14, r: 1.5, c: "#4fc3f7", d: 0.6 }, { x: 15, y: 6, r: 1, c: "#69f0ae", d: 0.9 }].map((st, i) => (
                <motion.g key={i} animate={{ scale: [0, 1.5, 0], rotate: [0, 180] }} transition={{ duration: 2, repeat: Infinity, delay: st.d }}>
                    <path d={`M${st.x} ${st.y - st.r}l${st.r * 0.4} ${st.r * 0.7}l${st.r * 0.8} 0l-${st.r * 0.6} ${st.r * 0.5}l${st.r * 0.2} ${st.r * 0.8}l-${st.r * 0.8}-${st.r * 0.5}l-${st.r * 0.8} ${st.r * 0.5}l${st.r * 0.2}-${st.r * 0.8}l-${st.r * 0.6}-${st.r * 0.5}l${st.r * 0.8} 0z`} fill={st.c} />
                </motion.g>
            ))}
        </svg>
    ),
    KuyrukluYildiz: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#0a0e27" stroke="#00bcd4" strokeWidth="1.5" />
            <motion.g animate={{ x: [-4, 4, -4], y: [3, -3, 3] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <circle cx="17" cy="7" r="3" fill="#00e5ff" /><circle cx="17" cy="7" r="1.5" fill="#fff" />
                <motion.path d="M15 9L5 19M16 10L8 18M17 11L11 17" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
            </motion.g>
        </svg>
    ),
    Galaksi: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#0a0020" stroke="#7c4dff" strokeWidth="1.5" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }}>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#b388ff" strokeWidth="1" opacity="0.7" />
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#7c4dff" strokeWidth="1" opacity="0.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#ea80fc" strokeWidth="1" opacity="0.5" transform="rotate(120 12 12)" />
            </motion.g>
            <circle cx="12" cy="12" r="2.5" fill="#e040fb" /><circle cx="12" cy="12" r="1" fill="#fff" />
        </svg>
    ),
    SoruIsareti: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1b5e20" stroke="#66bb6a" strokeWidth="1.5" />
            <motion.g animate={{ y: [0, -3, 0], filter: ["drop-shadow(0 0 2px #69f0ae)", "drop-shadow(0 0 10px #69f0ae)", "drop-shadow(0 0 2px #69f0ae)"] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="900" fill="#69f0ae" stroke="none">?</text>
            </motion.g>
        </svg>
    ),
    Merakli: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1a237e" stroke="#42a5f5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="5" fill="none" stroke="#42a5f5" strokeWidth="1.5" />
            <line x1="14" y1="14" x2="19" y2="19" stroke="#42a5f5" strokeWidth="2" strokeLinecap="round" />
            <motion.circle cx="10" cy="10" r="2" fill="#64b5f6" fillOpacity="0.4" animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
    ),
    SoruUstasi: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#4a148c" stroke="#ce93d8" strokeWidth="1.5" />
            <path d="M7 6h10l-2 4h-6l-2-4z" fill="#ffd700" stroke="#ffeb3b" strokeWidth="0.5" />
            <circle cx="9" cy="4" r="1" fill="#ff5252" /><circle cx="12" cy="3" r="1" fill="#69f0ae" /><circle cx="15" cy="4" r="1" fill="#448aff" />
            <motion.text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ce93d8" stroke="none" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>?</motion.text>
        </svg>
    ),
    EnIyiCevap: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#bf360c" stroke="#ff9800" strokeWidth="1.5" />
            <motion.g animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 3px #ffd700)", "drop-shadow(0 0 10px #ffd700)", "drop-shadow(0 0 3px #ffd700)"] }} transition={{ duration: 2, repeat: Infinity }}>
                <circle cx="12" cy="10" r="5" fill="#ff9800" stroke="#ffd700" strokeWidth="1" />
                <path d="M12 7l1.2 2.5 2.8.4-2 2 .5 2.8L12 13.5l-2.5 1.2.5-2.8-2-2 2.8-.4z" fill="#ffd700" />
            </motion.g>
            <path d="M8.5 15l-1.5 5 5-2.5 5 2.5-1.5-5" fill="#ff6d00" stroke="#ffd700" strokeWidth="0.5" />
        </svg>
    ),
    Tesla: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1a0a3e" stroke="#b026ff" strokeWidth="1.5" />
            <path d="M10 20h4M10 20v-4c0-1-.5-2-1-3V9h6v4c-.5 1-1 2-1 3v4" fill="#2a1a4e" stroke="#7c4dff" strokeWidth="1" />
            <ellipse cx="12" cy="9" rx="4" ry="1.5" fill="#7c4dff" fillOpacity="0.5" stroke="#b388ff" strokeWidth="0.5" />
            <motion.path d="M7 7L4 3M5 8L2 6" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror" }} />
            <motion.path d="M17 7l3-4M19 8l3-2" stroke="#e040fb" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: 0.2 }} />
            <motion.path d="M12 5V2M10 4L8 1M14 4l2-3" stroke="#d500f9" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: [0, 1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: 0.3 }} />
        </svg>
    ),
    Newton: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1b3a1b" stroke="#4caf50" strokeWidth="1.5" />
            <path d="M6 6c2 0 4-2 6-2s4 2 6 2" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 6c0 0 1-4 4-4s4 4 4 4" fill="#2e7d32" stroke="#4caf50" strokeWidth="0.5" />
            <motion.g animate={{ y: [0, 10, 9, 11, 11], scaleY: [1, 1, 0.8, 1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeIn", repeatDelay: 1.5 }}>
                <circle cx="12" cy="7" r="2" fill="#f44336" stroke="#ef5350" strokeWidth="0.5" />
                <path d="M12 5v-1" stroke="#795548" strokeWidth="0.5" /><path d="M12.5 4.5c.5-.8 1.5-.5 1.5-.5" fill="#4caf50" stroke="#66bb6a" strokeWidth="0.5" />
            </motion.g>
            <line x1="4" y1="20" x2="20" y2="20" stroke="#795548" strokeWidth="1.5" />
        </svg>
    ),
Einstein: ({ s }) => (
    <svg {...S(s)}>
        <circle cx="12" cy="12" r="10" fill="#0d0221" stroke="#00e5ff" strokeWidth="1.5" />
        <motion.text x="12" y="14" textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="900" fontFamily="serif" fill="none" stroke="none" animate={{ filter: ["drop-shadow(0 0 4px #00e5ff)", "drop-shadow(0 0 15px #00e5ff)", "drop-shadow(0 0 4px #00e5ff)"] }} transition={{ duration: 2, repeat: Infinity }}>
            <tspan fill="#00e5ff">E</tspan><tspan fill="#fff">=</tspan><tspan fill="#e040fb">mc²</tspan>
        </motion.text>
        <motion.circle cx="12" cy="12" r="9" fill="none" stroke="#00e5ff" strokeWidth="0.5" strokeDasharray="3 5" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
    </svg>
),
    SeriOkuyucu: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#3e2723" stroke="#a1887f" strokeWidth="1.5" />
            <rect x="6" y="5" width="12" height="14" rx="1" fill="#5d4037" stroke="#8d6e63" strokeWidth="0.5" />
            <line x1="12" y1="5" x2="12" y2="19" stroke="#8d6e63" strokeWidth="0.5" />
            {[0, 1, 2].map(i => (
                <motion.rect key={i} x="7" y="6" width="5" height="12" fill="#d7ccc8" fillOpacity="0.3" style={{ originX: "12px" }} animate={{ scaleX: [1, -1, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }} />
            ))}
            <motion.text x="10" y="13" fontSize="3" fill="#ffcc80" stroke="none" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>ABC</motion.text>
        </svg>
    ),
        KeskinGoz: ({ s }) => (
            <svg {...S(s)}>
                <circle cx="12" cy="12" r="10" fill="#0d2137" stroke="#29b6f6" strokeWidth="1.5" />
                <motion.circle cx="12" cy="12" r="7" fill="none" stroke="#29b6f6" strokeWidth="0.5" strokeDasharray="4 4" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                <line x1="12" y1="3" x2="12" y2="6" stroke="#29b6f6" strokeWidth="1" /><line x1="12" y1="18" x2="12" y2="21" stroke="#29b6f6" strokeWidth="1" />
                <line x1="3" y1="12" x2="6" y2="12" stroke="#29b6f6" strokeWidth="1" /><line x1="18" y1="12" x2="21" y2="12" stroke="#29b6f6" strokeWidth="1" />
                <motion.circle cx="12" cy="12" r="2" fill="#00e5ff" animate={{ scale: [1, 2.5, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <circle cx="12" cy="12" r="0.8" fill="#fff" />
            </svg>
        ),
            Bilge: ({ s }) => (
                <svg {...S(s)}>
                    <circle cx="12" cy="12" r="10" fill="#1a237e" stroke="#7986cb" strokeWidth="1.5" />
                    <polygon points="12,3 21,19 3,19" fill="none" stroke="#7986cb" strokeWidth="1" />
                    <motion.circle cx="12" cy="13" r="3" fill="#536dfe" animate={{ filter: ["drop-shadow(0 0 3px #536dfe)", "drop-shadow(0 0 12px #536dfe)", "drop-shadow(0 0 3px #536dfe)"] }} transition={{ duration: 2, repeat: Infinity }} />
                    <circle cx="12" cy="13" r="1" fill="#fff" />
                </svg>
            ),
                Uzman: ({ s }) => (
                    <svg {...S(s)}>
                        <circle cx="12" cy="12" r="10" fill="#004d40" stroke="#26a69a" strokeWidth="1.5" />
                        <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity }}>
                            <polygon points="12,3 4,8 12,20 20,8" fill="none" stroke="#26a69a" strokeWidth="1" />
                            <polygon points="12,3 8,8 12,20 16,8" fill="#009688" fillOpacity="0.4" />
                            <path d="M4 8h16M12 3v17M8 8l4 3 4-3" stroke="#4db6ac" strokeWidth="0.5" />
                        </motion.g>
                        <motion.line x1="6" y1="6" x2="18" y2="6" stroke="#fff" strokeWidth="0.5" animate={{ x1: [0, 24], x2: [4, 28], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                    </svg>
                ),
                    FizikDehasi: ({ s }) => (
                        <svg {...S(s)}>
                            <circle cx="12" cy="12" r="10" fill="#1a0033" stroke="#e040fb" strokeWidth="1.5" />
                            <path d="M12 5c-2.5 0-4 1.5-4 3.5 0 1.2.8 2 .8 3.5v1c0 1.5 1.5 2.5 3.2 2.5s3.2-1 3.2-2.5v-1c0-1.5.8-2.3.8-3.5 0-2-1.5-3.5-4-3.5z" fill="#7c4dff" stroke="#b388ff" strokeWidth="0.5" />
                            <rect x="10" y="16" width="4" height="1" fill="#b388ff" rx="0.5" /><rect x="10.5" y="17.5" width="3" height="0.5" fill="#b388ff" rx="0.25" />
                            <motion.ellipse cx="12" cy="10" rx="8" ry="2.5" fill="none" stroke="#e040fb" strokeWidth="0.5" strokeDasharray="2 2" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "10px" }} />
                            <motion.ellipse cx="12" cy="10" rx="2.5" ry="8" fill="none" stroke="#7c4dff" strokeWidth="0.5" strokeDasharray="2 2" animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "10px" }} />
                        </svg>
                    ),
                        SosyalKelebek: ({ s }) => (
                            <svg {...S(s)}>
                                <circle cx="12" cy="12" r="10" fill="#311b92" stroke="#b388ff" strokeWidth="1.5" />
                                <line x1="12" y1="9" x2="12" y2="17" stroke="#7c4dff" strokeWidth="1.5" />
                                <circle cx="12" cy="8" r="1" fill="#ffd740" />
                                <motion.path d="M12 11C8 7 3 9 3 13c0 3 5 4 9 4" fill="#e040fb" fillOpacity="0.5" stroke="#ea80fc" strokeWidth="0.5" style={{ originX: "12px" }} animate={{ scaleX: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                                <motion.path d="M12 11c4-4 9-2 9 2 0 3-5 4-9 4" fill="#7c4dff" fillOpacity="0.5" stroke="#b388ff" strokeWidth="0.5" style={{ originX: "12px" }} animate={{ scaleX: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                            </svg>
                        ),
                            Populer: ({ s }) => (
                                <svg {...S(s)}>
                                    <circle cx="12" cy="12" r="10" fill="#e65100" stroke="#ffab40" strokeWidth="1.5" />
                                    <motion.polygon points="12,3 14.5,9 21,9.5 16,14 17.5,21 12,17.5 6.5,21 8,14 3,9.5 9.5,9" fill="#ffd740" stroke="#ffee58" strokeWidth="0.5" animate={{ scale: [1, 1.08, 1], filter: ["drop-shadow(0 0 3px #ffd700)", "drop-shadow(0 0 10px #ffd700)", "drop-shadow(0 0 3px #ffd700)"] }} transition={{ duration: 2, repeat: Infinity }} />
                                </svg>
                            ),
                                FikirOnderi: ({ s }) => (
                                    <svg {...S(s)}>
                                        <circle cx="12" cy="12" r="10" fill="#1a1a2e" stroke="#ffd740" strokeWidth="1.5" />
                                        <motion.path d="M15 13c2-1.5 3-3.5 3-5.5C18 4 15 2 12 2S6 4 6 7.5c0 2 1 4 3 5.5v3h6v-3z" fill="#ffd740" fillOpacity="0.3" stroke="#ffd740" strokeWidth="1" animate={{ filter: ["drop-shadow(0 0 4px #ffd740)", "drop-shadow(0 0 16px #ffd740)", "drop-shadow(0 0 4px #ffd740)"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                        <rect x="9" y="17" width="6" height="1.5" fill="#ffd740" rx="0.5" />
                                        <rect x="10" y="19" width="4" height="1" fill="#ffab00" rx="0.5" />
                                    </svg>
                                ),
                                    Sevilen: ({ s }) => (
                                        <svg {...S(s)}>
                                            <circle cx="12" cy="12" r="10" fill="#880e4f" stroke="#f48fb1" strokeWidth="1.5" />
                                            <motion.path d="M12 19l-1.2-1.1C6.2 13.7 4 11.5 4 8.8 4 6.6 5.7 5 7.8 5c1.3 0 2.5.6 3.2 1.5L12 7.8l1-1.3C13.7 5.6 14.9 5 16.2 5 18.3 5 20 6.6 20 8.8c0 2.7-2.2 4.9-6.8 9.1L12 19z" fill="#e91e63" stroke="#f06292" strokeWidth="0.5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                                            <motion.text x="12" y="12" fontSize="5" fontWeight="bold" fill="#fff" stroke="none" textAnchor="middle" dominantBaseline="middle" animate={{ y: [-2, -8], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>+1</motion.text>
                                        </svg>
                                    ),
                                        Caylak: ({ s }) => (
                                            <svg {...S(s)}>
                                                <circle cx="12" cy="12" r="10" fill="#1b5e20" stroke="#66bb6a" strokeWidth="1.5" />
                                                <line x1="12" y1="20" x2="12" y2="10" stroke="#795548" strokeWidth="2" />
                                                <motion.path d="M12 10c-4 0-5-4-5-4s1 4 5 4" fill="#4caf50" stroke="#66bb6a" strokeWidth="0.5" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "12px", originY: "10px" }} />
                                                <motion.path d="M12 12c4 0 5-4 5-4s-1 4-5 4" fill="#388e3c" stroke="#4caf50" strokeWidth="0.5" animate={{ rotate: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "12px", originY: "12px" }} />
                                                <line x1="3" y1="20" x2="21" y2="20" stroke="#795548" strokeWidth="1" />
                                            </svg>
                                        ),
                                            Gozlemci: ({ s }) => (
                                                <svg {...S(s)}>
                                                    <circle cx="12" cy="12" r="10" fill="#0d47a1" stroke="#42a5f5" strokeWidth="1.5" />
                                                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" fill="#1565c0" stroke="#42a5f5" strokeWidth="1" />
                                                    <circle cx="12" cy="12" r="3" fill="#1e88e5" stroke="#64b5f6" strokeWidth="0.5" />
                                                    <motion.circle cx="12" cy="12" r="1.5" fill="#00e5ff" animate={{ scale: [1, 1.8, 1], filter: ["drop-shadow(0 0 2px #00e5ff)", "drop-shadow(0 0 8px #00e5ff)"] }} transition={{ duration: 3, repeat: Infinity }} />
                                                </svg>
                                            ),
                                                Arastirmaci: ({ s }) => (
                                                    <svg {...S(s)}>
                                                        <circle cx="12" cy="12" r="10" fill="#01579b" stroke="#29b6f6" strokeWidth="1.5" />
                                                        <circle cx="11" cy="10" r="6" fill="none" stroke="#4fc3f7" strokeWidth="1.5" />
                                                        <line x1="15.5" y1="14.5" x2="20" y2="19" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" />
                                                        <motion.g animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ originX: "11px", originY: "10px" }}>
                                                            <circle cx="11" cy="6" r="1.2" fill="#00e5ff" /><line x1="11" y1="7.2" x2="11" y2="13" stroke="#29b6f6" strokeWidth="0.5" />
                                                        </motion.g>
                                                    </svg>
                                                ),
Teorisyen: ({ s }) => (
    <svg {...S(s)}>
        <circle cx="12" cy="12" r="10" fill="#263238" stroke="#78909c" strokeWidth="1.5" />
        <rect x="4" y="5" width="16" height="11" rx="1" fill="#37474f" stroke="#78909c" strokeWidth="0.5" />
        <line x1="4" y1="16" x2="20" y2="16" stroke="#78909c" strokeWidth="1" />
        <rect x="8" y="17" width="8" height="1" rx="0.5" fill="#546e7a" />
        <motion.text x="12" y="10" textAnchor="middle" fontSize="4.5" fontFamily="monospace" fill="#69f0ae" stroke="none" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>F=ma</motion.text>
        <motion.text x="12" y="14" textAnchor="middle" fontSize="3.5" fontFamily="monospace" fill="#4fc3f7" stroke="none" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>∇×B=μJ</motion.text>
    </svg>
),
    Profesor: ({ s }) => (
        <svg {...S(s)}>
            <circle cx="12" cy="12" r="10" fill="#1a237e" stroke="#5c6bc0" strokeWidth="1.5" />
            <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity }}>
                <path d="M2 10l10-5 10 5-10 5z" fill="#3949ab" stroke="#7986cb" strokeWidth="0.5" />
                <path d="M6 12v4c3 3 9 3 12 0v-4" fill="#283593" stroke="#5c6bc0" strokeWidth="0.5" />
                <line x1="20" y1="10" x2="20" y2="16" stroke="#ffd740" strokeWidth="1" />
                <circle cx="20" cy="17" r="1.5" fill="#ffd740" />
            </motion.g>
        </svg>
    ),
        Kozmolog: ({ s }) => (
            <svg {...S(s)}>
                <circle cx="12" cy="12" r="10" fill="#0a0020" stroke="#7c4dff" strokeWidth="1.5" />
                <motion.ellipse cx="12" cy="12" rx="8" ry="2.5" fill="none" stroke="#ff6d00" strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }} />
                <circle cx="12" cy="12" r="3" fill="#000" stroke="#e040fb" strokeWidth="1.5" />
                <motion.path d="M12 9V3" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" animate={{ y: [0, -3], opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
                <motion.path d="M12 15v6" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" animate={{ y: [0, 3], opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
            </svg>
        ),
            Evrensel: ({ s }) => (
                <svg {...S(s)}>
                    <circle cx="12" cy="12" r="10" fill="#1a0033" stroke="#ea80fc" strokeWidth="1.5" />
                    <motion.path d="M6 16c-3.3 0-6-2.7-6-6s2.7-6 6-6c5 0 7 12 12 12s6-2.7 6-6-2.7-6-6-6c-5 0-7 12-12 12z" stroke="#ea80fc" strokeWidth="1.5" fill="none" strokeDasharray="25 5" animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                </svg>
            ),
                Kuantum: ({ s }) => (
                    <svg {...S(s)}>
                        <circle cx="12" cy="12" r="10" fill="#0d0221" stroke="#00e5ff" strokeWidth="1.5" />
                        <motion.path d="M2 12Q7 2 12 12T22 12" fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" animate={{ strokeDashoffset: [0, -30] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <motion.path d="M2 12Q7 22 12 12T22 12" fill="none" stroke="#e040fb" strokeWidth="1" strokeDasharray="3 3" animate={{ strokeDashoffset: [0, 30] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <circle cx="12" cy="12" r="2" fill="#00e5ff" /><circle cx="12" cy="12" r="0.8" fill="#fff" />
                    </svg>
                ),
                    Cirak: ({ s }) => (
                        <svg {...S(s)}>
                            <circle cx="12" cy="12" r="10" fill="#33210a" stroke="#ff8f00" strokeWidth="1.5" />
                            <motion.g animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ originX: "12px", originY: "14px" }}>
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="#ff8f00" stroke="#ffb300" strokeWidth="0.5" />
                            </motion.g>
                        </svg>
                    ),
                        Curie: ({ s }) => (
                            <svg {...S(s)}>
                                <circle cx="12" cy="12" r="10" fill="#004d40" stroke="#26a69a" strokeWidth="1.5" />
                                <path d="M10 3v6l-5 8a2.5 2.5 0 0 0 2.2 4h9.6a2.5 2.5 0 0 0 2.2-4l-5-8V3" fill="none" stroke="#80cbc4" strokeWidth="1" />
                                <line x1="8.5" y1="3" x2="15.5" y2="3" stroke="#80cbc4" strokeWidth="1" strokeLinecap="round" />
                                <motion.path d="M7 16h10M8 18h8" fill="none" stroke="#69f0ae" strokeWidth="1" animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                <motion.circle cx="11" cy="17" r="1" fill="#69f0ae" animate={{ y: [0, -4], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                <motion.circle cx="13" cy="16" r="0.7" fill="#a5d6a7" animate={{ y: [0, -5], opacity: [1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }} />
                            </svg>
                        ),
                            Hawking: ({ s }) => (
                                <svg {...S(s)}>
                                    <circle cx="12" cy="12" r="10" fill="#000" stroke="#616161" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="4.5" fill="#000" stroke="#9e9e9e" strokeWidth="1" />
                                    <motion.circle cx="12" cy="12" r="6" fill="none" stroke="#ff6d00" strokeWidth="0.5" strokeDasharray="2 3" animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
                                    {[{ x: 6, y: 7, d: 0 }, { x: 18, y: 8, d: 0.3 }, { x: 5, y: 17, d: 0.6 }, { x: 19, y: 16, d: 0.9 }].map((p, i) => (
                                        <motion.circle key={i} cx={p.x} cy={p.y} r="0.8" fill="#fff" animate={{ y: [-1, -8], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: p.d }} />
                                    ))}
                                </svg>
                            ),
                                Vinci: ({ s }) => (
                                    <svg {...S(s)}>
                                        <circle cx="12" cy="12" r="10" fill="#3e2723" stroke="#a1887f" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="7" fill="none" stroke="#d7ccc8" strokeWidth="0.5" strokeDasharray="2 2" />
                                        <rect x="7" y="7" width="10" height="10" fill="none" stroke="#d7ccc8" strokeWidth="0.5" strokeDasharray="2 2" />
                                        <circle cx="12" cy="9" r="1.5" fill="#ffcc80" stroke="#ffab40" strokeWidth="0.5" />
                                        <path d="M12 10.5v3M10 12h4M9 11.5h6M12 13.5l-1.5 4M12 13.5l1.5 4M12 13.5l-3 2.5M12 13.5l3 2.5" stroke="#ffcc80" strokeWidth="0.5" />
                                    </svg>
                                ),
                                    Galileo: ({ s }) => (
                                        <svg {...S(s)}>
                                            <circle cx="12" cy="12" r="10" fill="#1a237e" stroke="#5c6bc0" strokeWidth="1.5" />
                                            <motion.g animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ originX: "8px", originY: "18px" }}>
                                                <rect x="7" y="8" width="3" height="12" rx="1" fill="#5c6bc0" stroke="#7986cb" strokeWidth="0.5" />
                                                <circle cx="8.5" cy="7" r="2.5" fill="none" stroke="#7986cb" strokeWidth="1" />
                                                <circle cx="8.5" cy="7" r="1" fill="none" stroke="#9fa8da" strokeWidth="0.5" />
                                            </motion.g>
                                            <circle cx="17" cy="7" r="2.5" fill="#ffd740" /><circle cx="17" cy="7" r="1" fill="#ffee58" />
                                            <circle cx="19" cy="12" r="1" fill="#90caf9" /><circle cx="16" cy="14" r="0.7" fill="#a5d6a7" />
                                        </svg>
                                    ),
                                        GeceKusu: ({ s }) => (
                                            <svg {...S(s)}>
                                                <circle cx="12" cy="12" r="10" fill="#0d1b2a" stroke="#1b2838" strokeWidth="1.5" />
                                                <path d="M16 6a6 6 0 0 1-8 8 6 6 0 0 0 8-8z" fill="#ffd740" stroke="#ffee58" strokeWidth="0.5" />
                                                {[{ x: 5, y: 5 }, { x: 8, y: 3 }, { x: 18, y: 8 }, { x: 4, y: 14 }, { x: 19, y: 15 }, { x: 15, y: 18 }].map((st, i) => (
                                                    <motion.circle key={i} cx={st.x} cy={st.y} r="0.5" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                                                ))}
                                            </svg>
                                        ),
                                            BilgeBaykus: ({ s }) => (
                                                <svg {...S(s)}>
                                                    <circle cx="12" cy="12" r="10" fill="#1a237e" stroke="#5c6bc0" strokeWidth="1.5" />
                                                    <path d="M6 6c0 0 2 3 6 3s6-3 6-3-1 5-6 5-6-5-6-5z" fill="#3949ab" stroke="#5c6bc0" strokeWidth="0.5" />
                                                    <path d="M7 11c0 4 2.5 7 5 7s5-3 5-7" fill="#283593" stroke="#3949ab" strokeWidth="0.5" />
                                                    <circle cx="9.5" cy="10" r="2" fill="#1e88e5" stroke="#42a5f5" strokeWidth="0.5" /><circle cx="9.5" cy="10" r="0.8" fill="#fff" />
                                                    <circle cx="14.5" cy="10" r="2" fill="#1e88e5" stroke="#42a5f5" strokeWidth="0.5" /><circle cx="14.5" cy="10" r="0.8" fill="#fff" />
                                                    <path d="M12 12l-1 1.5h2l-1-1.5" fill="#ffd740" />
                                                    <motion.g animate={{ filter: ["drop-shadow(0 0 2px #42a5f5)", "drop-shadow(0 0 8px #42a5f5)", "drop-shadow(0 0 2px #42a5f5)"] }} transition={{ duration: 2, repeat: Infinity }}>
                                                        <circle cx="9.5" cy="10" r="2" fill="none" stroke="#42a5f5" strokeWidth="0.5" /><circle cx="14.5" cy="10" r="2" fill="none" stroke="#42a5f5" strokeWidth="0.5" />
                                                    </motion.g>
                                                </svg>
                                            ),
                                                SorunCozucu: ({ s }) => (
                                                    <svg {...S(s)}>
                                                        <circle cx="12" cy="12" r="10" fill="#1b5e20" stroke="#4caf50" strokeWidth="1.5" />
                                                        <rect x="6" y="6" width="12" height="12" rx="1" fill="none" stroke="#66bb6a" strokeWidth="1" />
                                                        <line x1="6" y1="10" x2="18" y2="10" stroke="#4caf50" strokeWidth="0.5" /><line x1="6" y1="14" x2="18" y2="14" stroke="#4caf50" strokeWidth="0.5" />
                                                        <line x1="10" y1="6" x2="10" y2="18" stroke="#4caf50" strokeWidth="0.5" /><line x1="14" y1="6" x2="14" y2="18" stroke="#4caf50" strokeWidth="0.5" />
                                                        <motion.g animate={{ rotate: [0, 90, 90, 180] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "12px", originY: "12px" }}>
                                                            <rect x="6" y="6" width="4" height="4" fill="#69f0ae" fillOpacity="0.5" /><rect x="14" y="14" width="4" height="4" fill="#69f0ae" fillOpacity="0.5" />
                                                        </motion.g>
                                                    </svg>
                                                ),
                                                    Karadelik: ({ s }) => (
                                                        <svg {...S(s)}>
                                                            <circle cx="12" cy="12" r="10" fill="#000" stroke="#333" strokeWidth="1.5" />
                                                            <motion.ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#ff6d00" strokeWidth="1.5" strokeDasharray="3 3" animate={{ rotate: 360, strokeDashoffset: [0, -15] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }} />
                                                            <circle cx="12" cy="12" r="4" fill="#000" /><circle cx="12" cy="12" r="5.5" fill="none" stroke="#ff3d00" strokeWidth="0.5" opacity="0.5" />
                                                            <motion.circle cx="12" cy="12" r="6.5" fill="none" stroke="#ff6d00" strokeWidth="0.3" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                                                        </svg>
                                                    ),
                                                        FallbackIcon: ({ s }) => (
                                                            <svg {...S(s)}>
                                                                <circle cx="12" cy="12" r="10" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" strokeDasharray="3 4" />
                                                                <text x="12" y="15" textAnchor="middle" fontSize="10" fill="#666" stroke="none">?</text>
                                                            </svg>
                                                        )
};

export function CustomBadgeIcon({ name, size = 48, className }: CustomBadgeIconProps) {
    const n = name.toLocaleLowerCase("tr-TR").trim();
    let C = Badges.FallbackIcon;

    if (n.includes("merhaba")) C = Badges.MerhabaDunya;
    else if (n.includes("ilk adım") || n.includes("ilk adim")) C = Badges.IlkAdim;
    else if (n.includes("kaşif") || n.includes("kasif")) C = Badges.Kasif;
    else if (n.includes("yardımsever") || n.includes("yardimsever")) C = Badges.Yardimsever;
    else if (n.includes("yıldız tozu") || n.includes("yildiz tozu")) C = Badges.YildizTozu;
    else if (n.includes("kuyruklu")) C = Badges.KuyrukluYildiz;
    else if (n.includes("galaksi")) C = Badges.Galaksi;
    else if (n.includes("soru işareti") || n.includes("soru isareti")) C = Badges.SoruIsareti;
    else if (n.includes("meraklı") || n.includes("merakli")) C = Badges.Merakli;
    else if (n.includes("soru ustası") || n.includes("soru ustasi")) C = Badges.SoruUstasi;
    else if (n.includes("en iyi cevap")) C = Badges.EnIyiCevap;
    else if (n.includes("tesla")) C = Badges.Tesla;
    else if (n.includes("newton")) C = Badges.Newton;
    else if (n.includes("einstein")) C = Badges.Einstein;
    else if (n.includes("seri okuyucu")) C = Badges.SeriOkuyucu;
    else if (n.includes("keskin göz") || n.includes("keskin goz")) C = Badges.KeskinGoz;
    else if (n === "bilge") C = Badges.Bilge;
    else if (n.includes("uzman")) C = Badges.Uzman;
    else if (n.includes("fizik dehası") || n.includes("fizik dehasi")) C = Badges.FizikDehasi;
    else if (n.includes("sosyal kelebek")) C = Badges.SosyalKelebek;
    else if (n.includes("popüler") || n.includes("populer")) C = Badges.Populer;
    else if (n.includes("önder") || n.includes("onder")) C = Badges.FikirOnderi;
    else if (n.includes("sevilen")) C = Badges.Sevilen;
    else if (n.includes("çaylak") || n.includes("caylak")) C = Badges.Caylak;
    else if (n.includes("gözlemci") || n.includes("gozlemci")) C = Badges.Gozlemci;
    else if (n.includes("araştır") || n.includes("arastir")) C = Badges.Arastirmaci;
    else if (n.includes("teorisyen")) C = Badges.Teorisyen;
    else if (n.includes("profesör") || n.includes("profesor")) C = Badges.Profesor;
    else if (n.includes("kozmolog")) C = Badges.Kozmolog;
    else if (n.includes("evrensel")) C = Badges.Evrensel;
    else if (n.includes("kuantum")) C = Badges.Kuantum;
    else if (n.includes("çırak") || n.includes("cirak")) C = Badges.Cirak;
    else if (n.includes("curie")) C = Badges.Curie;
    else if (n.includes("hawking")) C = Badges.Hawking;
    else if (n.includes("vinci")) C = Badges.Vinci;
    else if (n.includes("galileo")) C = Badges.Galileo;
    else if (n.includes("gece kuşu") || n.includes("gece kusu")) C = Badges.GeceKusu;
    else if (n.includes("baykuş") || n.includes("baykus")) C = Badges.BilgeBaykus;
    else if (n.includes("çözücü") || n.includes("cozucu")) C = Badges.SorunCozucu;
    else if (n.includes("karadelik")) C = Badges.Karadelik;

    return (
        <div className={cn("inline-flex items-center justify-center rounded-full", className)} style={{ width: size + 8, height: size + 8 }}>
            <C s={size} />
        </div>
    );
}
