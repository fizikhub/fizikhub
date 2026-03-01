"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalName = name.trim().toLowerCase();

    // Sticker Container (SVG Fallback & Standard Background)
    const NeoSticker = ({ children, color, rotate = 0, hoverRotate = 5 }: { children: React.ReactNode, color: string, rotate?: number, hoverRotate?: number }) => (
        <div className={cn("relative w-full h-full flex items-center justify-center p-0.5 rounded-full overflow-hidden", className)}>
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: rotate + hoverRotate }}
                initial={{ rotate: rotate }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {/* Background Shape */}
                    <path
                        d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5 Z"
                        fill={color}
                        stroke="black"
                        strokeWidth="4"
                    />
                    {/* Inner Graphic Area */}
                    <g transform="translate(15, 15) scale(0.7)">
                        {children}
                    </g>
                </svg>
            </motion.div>
        </div>
    );

    // 1. Merhaba Dünya (El sallayan eldiven)
    if (normalName.includes("merhaba dünya")) {
        return (
            <NeoSticker color="#34d399" rotate={-5}>
                <motion.g animate={{ rotate: [0, 15, -10, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }} style={{ originX: 0.5, originY: 1 }}>
                    <path d="M40 90 V50 C40 45 45 45 45 50 V90 Z M50 90 V30 C50 25 55 25 55 30 V90 Z M60 90 V40 C60 35 65 35 65 40 V90 Z M30 90 V60 C30 55 35 55 35 60 V90 Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M25 70 C20 70 20 65 25 60 L35 70 Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 2. Soru İşareti (Zıplayan 3D Soru İşareti)
    if (normalName.includes("soru işareti")) {
        return (
            <NeoSticker color="#fbbf24" rotate={5}>
                <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}>
                    <path d="M35 35 C35 20 65 20 65 35 C65 45 50 50 50 60" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50" cy="80" r="5" fill="white" stroke="black" strokeWidth="2" />
                    <path d="M35 35 C35 20 65 20 65 35 C65 45 50 50 50 60" fill="none" stroke="black" strokeWidth="2" strokeDasharray="5, 15" strokeLinecap="round" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 3. Einstein'ın Mirası (E=mc^2)
    if (normalName.includes("einstein")) {
        return (
            <NeoSticker color="#60a5fa" rotate={-2}>
                <motion.text x="50" y="60" fontSize="30" fontWeight="900" fontFamily="monospace" fill="white" stroke="black" strokeWidth="2" textAnchor="middle"
                    animate={{ textShadow: ["0px 0px 0px white", "0px 0px 10px white", "0px 0px 0px white"] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    E=mc²
                </motion.text>
            </NeoSticker>
        );
    }

    // 4. Newton'un Elması
    if (normalName.includes("newton")) {
        return (
            <NeoSticker color="#ef4444" rotate={8}>
                <motion.g animate={{ y: [-20, 0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}>
                    <path d="M50 85 C20 85 20 35 50 35 C80 35 80 85 50 85 Z" fill="#b91c1c" stroke="black" strokeWidth="4" />
                    <path d="M50 35 C50 20 60 15 60 15" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M60 25 C55 25 50 30 50 35" fill="#22c55e" stroke="black" strokeWidth="2" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 5. Sorun Çözücü (Yapboz parçası)
    if (normalName.includes("sorun çözücü") || normalName.includes("çözücü")) {
        return (
            <NeoSticker color="#a78bfa" rotate={-4}>
                <motion.path
                    d="M30 30 h15 a10 10 0 1 0 20 0 h15 v40 h-40 v-40 z"
                    fill="white" stroke="black" strokeWidth="4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </NeoSticker>
        );
    }

    // 6. Gözlemci (Radar/Teleskop)
    if (normalName.includes("gözlemci")) {
        return (
            <NeoSticker color="#22d3ee" rotate={2}>
                <motion.g animate={{ rotate: [0, 45, -45, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <path d="M20 40 A15 15 0 1 1 50 40 A15 15 0 1 1 20 40 M50 40 A15 15 0 1 1 80 40 A15 15 0 1 1 50 40" fill="white" stroke="black" strokeWidth="4" />
                    <circle cx="35" cy="40" r="5" fill="black" />
                    <circle cx="65" cy="40" r="5" fill="black" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 7. Çırak (Dönen dişliler)
    if (normalName.includes("çırak") || normalName.includes("cirak")) {
        return (
            <NeoSticker color="#9ca3af" rotate={0}>
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="50" cy="50" r="20" fill="white" stroke="black" strokeWidth="6" strokeDasharray="10 5" />
                    <circle cx="50" cy="50" r="10" fill="#4b5563" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 8. Teorisyen (Karatahta)
    if (normalName.includes("teorisyen")) {
        return (
            <NeoSticker color="#15803d" rotate={-3}>
                <rect x="20" y="25" width="60" height="50" fill="#14532d" stroke="black" strokeWidth="4" />
                <rect x="15" y="75" width="70" height="5" fill="#854d0e" stroke="black" strokeWidth="2" />
                <motion.text x="50" y="55" fontSize="20" fontFamily="monospace" fill="white" textAnchor="middle" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity }}>
                    x(t)
                </motion.text>
            </NeoSticker>
        );
    }

    // 9. Profesör (Mezuniyet Kepi)
    if (normalName.includes("profesör") || normalName.includes("profesor")) {
        return (
            <NeoSticker color="#dc2626" rotate={5}>
                <motion.g animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}>
                    <path d="M50 30 L80 45 L50 60 L20 45 Z" fill="black" stroke="white" strokeWidth="2" />
                    <path d="M40 55 V75 A10 5 0 0 0 60 75 V55" fill="none" stroke="black" strokeWidth="20" />
                    <path d="M80 45 L80 65" fill="none" stroke="#fbbf24" strokeWidth="4" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 10. Kozmolog (Gezegen)
    if (normalName.includes("kozmolog")) {
        return (
            <NeoSticker color="#4f46e5" rotate={-6}>
                <circle cx="50" cy="50" r="25" fill="#818cf8" stroke="black" strokeWidth="3" />
                <motion.path d="M15 50 C25 25 75 25 85 50 C75 75 25 75 15 50 Z" fill="none" stroke="#c7d2fe" strokeWidth="4" animate={{ rotateX: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }} />
            </NeoSticker>
        );
    }

    // 11. Kuantum Mekaniği (Atom)
    if (normalName.includes("kuantum")) {
        return (
            <NeoSticker color="#0ea5e9" rotate={0}>
                <circle cx="50" cy="50" r="10" fill="white" stroke="black" strokeWidth="2" />
                <motion.ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="black" strokeWidth="3" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }} />
                <motion.ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="black" strokeWidth="3" animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }} transform="rotate(60 50 50)" />
            </NeoSticker>
        );
    }

    // 12. Popüler (Kalp/Ateş)
    if (normalName.includes("popüler") || normalName.includes("populer")) {
        return (
            <NeoSticker color="#f43f5e" rotate={4}>
                <motion.path d="M50 80 C50 80 20 50 20 30 A15 15 0 0 1 50 40 A15 15 0 0 1 80 30 C80 50 50 80 50 80 Z" fill="white" stroke="black" strokeWidth="4" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
            </NeoSticker>
        );
    }

    // 13. Bilge Baykuş
    if (normalName.includes("bilge")) {
        return (
            <NeoSticker color="#d97706" rotate={-2}>
                <path d="M25 40 Q50 20 75 40 L80 80 L20 80 Z" fill="#78350f" stroke="black" strokeWidth="4" />
                <circle cx="35" cy="50" r="12" fill="white" stroke="black" strokeWidth="3" />
                <circle cx="65" cy="50" r="12" fill="white" stroke="black" strokeWidth="3" />
                <motion.circle cx="35" cy="50" r="4" fill="black" animate={{ scaleY: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                <motion.circle cx="65" cy="50" r="4" fill="black" animate={{ scaleY: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                <path d="M45 60 L55 60 L50 70 Z" fill="#fbbf24" stroke="black" strokeWidth="2" />
            </NeoSticker>
        );
    }

    // 14. Gece Kuşu
    if (normalName.includes("gece")) {
        return (
            <NeoSticker color="#312e81" rotate={3}>
                <motion.path d="M60 20 A30 30 0 1 0 80 70 A35 35 0 1 1 60 20 Z" fill="#fef08a" stroke="black" strokeWidth="2" animate={{ rotate: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0.5, originY: 0.5 }} />
                <motion.text x="50" y="50" fontSize="18" fontWeight="bold" fill="white" animate={{ y: [-10, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>Z</motion.text>
                <motion.text x="65" y="30" fontSize="12" fontWeight="bold" fill="white" animate={{ y: [-10, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>z</motion.text>
            </NeoSticker>
        );
    }

    // 15. Seri Okuyucu
    if (normalName.includes("seri okuyucu") || normalName.includes("okuyucu")) {
        return (
            <NeoSticker color="#f59e0b" rotate={-5}>
                <motion.g animate={{ skewY: [0, -10, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 1 }}>
                    <path d="M50 80 Q25 70 20 40 L50 30 L80 40 Q75 70 50 80 Z" fill="white" stroke="black" strokeWidth="4" />
                    <line x1="50" y1="30" x2="50" y2="80" stroke="black" strokeWidth="3" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 16. Sosyal Kelebek
    if (normalName.includes("sosyal kelebek") || normalName.includes("kelebek")) {
        return (
            <NeoSticker color="#ec4899" rotate={6}>
                <motion.g animate={{ scaleX: [1, 0.4, 1] }} transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <path d="M50 50 Q20 20 30 50 Q20 80 50 50 Z" fill="white" stroke="black" strokeWidth="3" />
                    <path d="M50 50 Q80 20 70 50 Q80 80 50 50 Z" fill="white" stroke="black" strokeWidth="3" />
                </motion.g>
                <line x1="50" y1="30" x2="50" y2="70" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </NeoSticker>
        );
    }

    // 17. Fikir Önderi (Taç)
    if (normalName.includes("fikir") || normalName.includes("önder")) {
        return (
            <NeoSticker color="#eab308" rotate={0}>
                <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <path d="M20 70 L20 30 L40 50 L50 20 L60 50 L80 30 L80 70 Z" fill="#fef08a" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                    <circle cx="20" cy="25" r="5" fill="white" stroke="black" strokeWidth="2" />
                    <circle cx="50" cy="15" r="6" fill="white" stroke="black" strokeWidth="2" />
                    <circle cx="80" cy="25" r="5" fill="white" stroke="black" strokeWidth="2" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 18. Keskin Göz (Büyüteç)
    if (normalName.includes("keskin")) {
        return (
            <NeoSticker color="#14b8a6" rotate={-8}>
                <motion.g animate={{ x: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <circle cx="45" cy="45" r="20" fill="#ccfbf1" stroke="black" strokeWidth="4" />
                    <line x1="60" y1="60" x2="80" y2="80" stroke="black" strokeWidth="6" strokeLinecap="round" />
                    <path d="M40 35 L50 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
            </NeoSticker>
        );
    }

    // 19. Tesla'nın Kıvılcımı
    if (normalName.includes("tesla") || normalName.includes("kıvılcım")) {
        return (
            <NeoSticker color="#fcd34d" rotate={4}>
                <motion.path d="M60 20 L30 50 H60 L40 80 L70 50 H40 Z" fill="#fff" stroke="black" strokeWidth="4" strokeLinejoin="round"
                    animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }} />
            </NeoSticker>
        );
    }

    // 20. Karadelik
    if (normalName.includes("karadelik") || normalName.includes("kara")) {
        return (
            <NeoSticker color="#000000" rotate={0}>
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 0.5 }}>
                    <circle cx="50" cy="50" r="15" fill="black" stroke="#6366f1" strokeWidth="4" />
                    <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#a5b4fc" strokeWidth="2" />
                    <path d="M20 50 A30 30 0 0 0 80 50" fill="none" stroke="#e0e7ff" strokeWidth="3" />
                </motion.g>
            </NeoSticker>
        );
    }

    // Default Fallback
    return (
        <NeoSticker color="#cbd5e1">
            <circle cx="50" cy="50" r="30" fill="white" stroke="black" strokeWidth="4" />
            <path d="M35 45 L50 60 L65 35" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </NeoSticker>
    );
}
