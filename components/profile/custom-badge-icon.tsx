"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Helper for wrapping generated images
    const GeneratedBadge = ({ src, alt, rotate = 0 }: { src: string, alt: string, rotate?: number }) => (
        <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
            <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1, rotate: rotate + 5 }}
                initial={{ rotate: rotate }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain drop-shadow-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </motion.div>
        </div>
    );

    // Sticker Container (SVG Fallback)
    const Sticker = ({ children, color, rotate = 0 }: { children: React.ReactNode, color: string, rotate?: number }) => (
        <div className={cn("relative w-full h-full flex items-center justify-center p-1", className)}>
            <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1, rotate: rotate + 5 }}
                initial={{ rotate: rotate }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    {/* Background Shape - Imperfect Circle */}
                    <path
                        d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5 Z"
                        fill={color}
                        stroke="black"
                        strokeWidth="3"
                    />

                    {/* Inner Graphic Area */}
                    <g transform="translate(15, 15) scale(0.7)">
                        {children}
                    </g>
                </svg>
            </motion.div>
        </div>
    );

    // Einstein
    if (normalizedName.includes("einstein")) {
        return <GeneratedBadge src="/badges/einstein.png" alt="Einstein Badge" rotate={-5} />;
    }

    // Newton
    if (normalizedName.includes("newton")) {
        return <GeneratedBadge src="/badges/newton.png" alt="Newton Badge" rotate={5} />;
    }

    // Tesla
    if (normalizedName.includes("tesla")) {
        return <GeneratedBadge src="/badges/tesla.png" alt="Tesla Badge" rotate={-2} />;
    }

    // Bilge (Wise/Owl)
    if (normalizedName.includes("bilge") || normalizedName.includes("teorisyen")) {
        return <GeneratedBadge src="/badges/bilge.png" alt="Bilge Badge" rotate={3} />;
    }

    // Meraklı Kuyruklu Yıldız (Comet)
    if (normalizedName.includes("meraklı") || normalizedName.includes("kuyruklu")) {
        return <GeneratedBadge src="/badges/merakli-kuyruklu-yildiz.png" alt="Meraklı Kuyruklu Yıldız Badge" rotate={-4} />;
    }

    // İlk Adım (First Step)
    if (normalizedName.includes("ilk adım") || normalizedName.includes("çaylak")) {
        return <GeneratedBadge src="/badges/ilk-adim.png" alt="İlk Adım Badge" rotate={2} />;
    }

    // Late Night / Owl (Moon) (Fallback for older badges or if image logic skipped)
    if (normalizedName.includes("gece") || normalizedName.includes("uykusuz")) {
        return (
            <Sticker color="#818CF8" rotate={3}>
                <path d="M70 10 A40 40 0 1 1 40 90 A30 30 0 1 0 70 10 Z" fill="#FEF3C7" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                {/* Zzz */}
                <motion.text x="65" y="40" fontSize="24" fontFamily="sans-serif, Arial" fontWeight="900" fill="white" stroke="black" strokeWidth="1"
                    animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
                >Z</motion.text>
                <motion.text x="75" y="25" fontSize="16" fontFamily="sans-serif, Arial" fontWeight="900" fill="white" stroke="black" strokeWidth="1"
                    animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >Z</motion.text>
            </Sticker>
        );
    }

    // Writer / Pen (Fountain Pen)
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <Sticker color="#F472B6" rotate={-4}>
                <motion.g
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: 0.5, originY: 1 }}
                >
                    <path d="M50 90 L30 30 L50 10 L70 30 Z" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="2" />
                    <rect x="30" y="30" width="40" height="10" fill="#333" stroke="black" strokeWidth="3" />
                </motion.g>
            </Sticker>
        );
    }

    // Explorer / Kaşif (Binoculars/Eye)
    if (normalizedName.includes("kaşif") || normalizedName.includes("explorer") || normalizedName.includes("araştırmacı") || normalizedName.includes("gözlemci")) {
        return (
            <Sticker color="#22D3EE" rotate={4}>
                <path d="M20 40 A15 15 0 1 1 50 40 A15 15 0 1 1 20 40 M50 40 A15 15 0 1 1 80 40 A15 15 0 1 1 50 40" fill="white" stroke="black" strokeWidth="4" />
                <path d="M35 40 A5 5 0 1 1 40 40" fill="black" />
                <motion.circle cx="65" cy="40" r="5" fill="black"
                    animate={{ cx: [60, 70, 60] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx="35" cy="40" r="5" fill="black"
                    animate={{ cx: [30, 40, 30] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </Sticker>
        );
    }

    // Default Fallback
    return (
        <Sticker color="#cbd5e1">
            <circle cx="50" cy="50" r="30" fill="white" stroke="black" strokeWidth="4" />
            <path d="M35 45 L50 60 L65 35" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </Sticker>
    );
}
