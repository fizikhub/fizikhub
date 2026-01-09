"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ==========================================
// 1. CLASSIC HERO (Jan 1st Version)
// ==========================================

const ClassicUFO = () => (
    <svg width="100%" height="100%" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ufoBody" x1="32" y1="20" x2="32" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="ufoDome" x1="32" y1="10" x2="32" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22D3EE" stopOpacity="0.7" />
                <stop offset="1" stopColor="#0891B2" stopOpacity="0.4" />
            </linearGradient>
        </defs>
        <ellipse cx="32" cy="42" rx="20" ry="4" fill="#22D3EE" fillOpacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <path d="M20 26 C20 12, 44 12, 44 26" fill="url(#ufoDome)" stroke="#22D3EE" strokeWidth="0.5" />
        <ellipse cx="32" cy="28" rx="28" ry="8" fill="url(#ufoBody)" stroke="#475569" strokeWidth="0.5" />
        <circle cx="14" cy="28" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#EF4444;#FBBF24;#EF4444" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="28" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="18" r="4" fill="#4ADE80" />
        <ellipse cx="30" cy="17" rx="1.2" ry="1.8" fill="#1e293b" />
        <ellipse cx="34" cy="17" rx="1.2" ry="1.8" fill="#1e293b" />
    </svg>
);

function ClassicHero() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 border-primary rounded-2xl mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                    { top: '15%', left: '10%', size: 2 },
                    { top: '70%', left: '25%', size: 1 },
                    { top: '30%', left: '85%', size: 2 },
                    { top: '80%', left: '90%', size: 1 },
                ].map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/80 rounded-full"
                        style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                    />
                ))}
            </div>
            <div className="relative z-10 px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm sm:text-lg md:text-xl font-black text-white leading-tight tracking-tight uppercase">
                            BİLİMİ Tİ'YE ALIYORUZ
                        </h1>
                        <p className="text-xs sm:text-base md:text-lg font-black mt-0.5 text-cyan-400 uppercase tracking-tight">
                            AMA CİDDİLİ ŞEKİLDE.
                        </p>
                    </div>
                    <motion.div
                        className="flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16"
                        animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ClassicUFO />
                    </motion.div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
    );
}

// ==========================================
// 2. MODERN HERO (For Cybernetic Theme)
// ==========================================

const StarryBackground = () => {
    const stars = [
        { top: '10%', left: '20%', size: 2, delay: 0 },
        { top: '25%', left: '80%', size: 3, delay: 1 },
        { top: '60%', left: '15%', size: 2, delay: 2 },
        { top: '80%', left: '70%', size: 3, delay: 0.5 },
        { top: '40%', left: '50%', size: 2, delay: 1.5 },
        { top: '15%', left: '90%', size: 2, delay: 0.8 },
    ];
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                    style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
};

const PremiumUFO = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="domeGrad" x1="50" y1="20" x2="50" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A5F3FC" stopOpacity="0.8" />
                <stop offset="1" stopColor="#0891B2" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="50" y1="40" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <ellipse cx="50" cy="65" rx="35" ry="8" fill="#06B6D4" fillOpacity="0.4" filter="url(#glow)">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="rx" values="35;38;35" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <path d="M30 45 C30 20, 70 20, 70 45" fill="url(#domeGrad)" stroke="#22D3EE" strokeWidth="0.5" />
        <g>
            <circle cx="50" cy="35" r="7" fill="#4ADE80" />
            <ellipse cx="47" cy="34" rx="2" ry="3" fill="#1e293b" />
            <ellipse cx="53" cy="34" rx="2" ry="3" fill="#1e293b" />
            <path d="M49 40 Q50 41 51 40" stroke="#1e293b" strokeWidth="0.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 1; 0 0" dur="2s" repeatCount="indefinite" />
        </g>
        <ellipse cx="50" cy="50" rx="48" ry="14" fill="url(#bodyGrad)" stroke="#64748B" strokeWidth="1" />
        <path d="M10 50 Q50 62 90 50" fill="none" stroke="#64748B" strokeWidth="0.5" strokeOpacity="0.5" />
        {[15, 32, 50, 68, 85].map((cx, i) => (
            <circle key={i} cx={cx} cy={50 + (i === 2 ? 6 : i === 1 || i === 3 ? 4 : 0)} r="2.5" fill="#FBBF24" filter="url(#glow)">
                <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
        ))}
    </svg>
);

function ModernHero() {
    return (
        <div className="relative py-6 px-4 sm:py-10 sm:px-6 overflow-hidden border-2 border-white/20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
            <StarryBackground />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1 max-w-xl text-center sm:text-left">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-lg uppercase">
                        BİLİMİ HIZLANDIR<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 drop-shadow-md inline-block mt-1">
                            EVRENİN SIRLARINI ÇÖZ.
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-400 mt-2 sm:mt-3 max-w-md leading-relaxed mx-auto sm:mx-0">
                        Evrenin sırlarını çözmeye çalışan meraklı zihinlerin buluşma noktası.
                    </p>
                </div>
                <motion.div
                    className="flex-shrink-0 relative w-20 h-16 sm:w-36 sm:h-28"
                    animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                >
                    <PremiumUFO />
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
        </div>
    );
}

// ==========================================
// 3. MAIN COMPONENT (Switcher)
// ==========================================

// ==========================================
// 4. CUTE HERO (For Pink Theme)
// ==========================================

const CuteCat = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L20 20 L40 30" fill="#FF1493" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M70 40 L80 20 L60 30" fill="#FF1493" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="50" cy="50" rx="30" ry="25" fill="#FFF0F5" stroke="#FF1493" strokeWidth="3"/>
        <circle cx="40" cy="45" r="3" fill="#000"/>
        <circle cx="60" cy="45" r="3" fill="#000"/>
        <path d="M45 55 Q50 60 55 55" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        <line x1="25" y1="50" x2="10" y2="45" stroke="#FF1493" strokeWidth="2"/>
        <line x1="25" y1="55" x2="10" y2="60" stroke="#FF1493" strokeWidth="2"/>
        <line x1="75" y1="50" x2="90" y2="45" stroke="#FF1493" strokeWidth="2"/>
        <line x1="75" y1="55" x2="90" y2="60" stroke="#FF1493" strokeWidth="2"/>
    </svg>
);

function CuteHero() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 border-4 border-pink-400 rounded-3xl mb-4 shadow-[0_8px_0_0_rgba(255,20,147,0.3)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                     <h1 className="text-xl sm:text-3xl font-black text-pink-600 leading-tight tracking-tight uppercase drop-shadow-sm">
                        BİLİM ÇOK TATLI!
                    </h1>
                    <p className="text-sm sm:text-lg font-bold mt-1 text-pink-400 uppercase tracking-wide">
                        VE BİRAZ DA MIAUV.
                    </p>
                </div>
                 <motion.div
                    className="flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24"
                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <CuteCat />
                </motion.div>
            </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-xl"></div>
             <div className="absolute -top-4 -left-4 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-xl"></div>
        </div>
    );
}


export function CompactHero() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder or ClassicHero initially
    if (!mounted) {
        return <ClassicHero />;
    }

    // Switch based on theme
    if (theme === 'cybernetic') {
        return <ModernHero />;
    }

    if (theme === 'pink') {
        return <CuteHero />;
    }

    return <ClassicHero />;
}
