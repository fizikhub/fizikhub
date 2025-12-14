"use client";

import { useEffect, useState } from "react";

export function ChristmasLights() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fewer lights on mobile for better performance and cleaner look
    const lightCount = isMobile ? 12 : 24;
    const colors = ["#ff4444", "#44ff44", "#ffff44", "#4444ff", "#ff44ff", "#44ffff", "#ff8844"];

    return (
        <>
            {/* Christmas Lights Container */}
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-8 md:h-10 select-none">
                {/* Decorative Wire/String with SVG Path */}
                <svg className="w-full h-6 md:h-8" preserveAspectRatio="none" viewBox="0 0 1200 50">
                    {/* Main wire */}
                    <path
                        d="M0,25 Q100,35 200,25 Q300,15 400,25 Q500,35 600,25 Q700,15 800,25 Q900,35 1000,25 Q1100,15 1200,25"
                        stroke="rgba(100,100,100,0.25)"
                        strokeWidth="2"
                        fill="none"
                        className="drop-shadow-sm"
                    />
                </svg>

                {/* Light Bulbs */}
                <div className="absolute top-2 md:top-3 left-0 right-0 px-2 md:px-4 flex justify-between items-start">
                    {Array.from({ length: lightCount }).map((_, i) => {
                        const color = colors[i % colors.length];
                        const delay = (i * 0.15).toFixed(2);
                        const duration = (1.5 + (i % 3) * 0.3).toFixed(2);

                        return (
                            <div
                                key={i}
                                className="relative flex flex-col items-center"
                                style={{
                                    animation: `swing ${duration}s ease-in-out infinite`,
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                {/* Wire connector */}
                                <div className="w-0.5 h-2 md:h-3 bg-gradient-to-b from-zinc-700 to-zinc-600 rounded-full" />

                                {/* Bulb Socket (top part) */}
                                <div className="w-2.5 h-1.5 md:w-3 md:h-2 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-t-sm" />

                                {/* Light Bulb */}
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div
                                        className="absolute inset-0 rounded-full blur-md animate-pulse"
                                        style={{
                                            backgroundColor: color,
                                            width: isMobile ? '12px' : '16px',
                                            height: isMobile ? '12px' : '16px',
                                            transform: 'translate(-50%, -50%)',
                                            left: '50%',
                                            top: '50%',
                                            animationDuration: `${duration}s`,
                                            animationDelay: `${delay}s`,
                                            opacity: 0.6
                                        }}
                                    />
                                    {/* Actual bulb */}
                                    <div
                                        className="relative w-3 h-4 md:w-4 md:h-5 rounded-full shadow-lg"
                                        style={{
                                            background: `linear-gradient(145deg, ${color}ee, ${color}88)`,
                                            boxShadow: `0 0 6px ${color}, inset -1px -1px 3px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.3)`,
                                        }}
                                    >
                                        {/* Highlight shine */}
                                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full blur-[0.5px]" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Festive Corner Decorations */}
                <div className="absolute top-0 left-2 md:left-4 text-base md:text-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0s' }}>
                    🎄
                </div>
                <div className="absolute top-0 left-10 md:left-14 text-sm md:text-base" style={{ animation: 'twinkle 2s ease-in-out infinite', animationDelay: '0.5s' }}>
                    ❄️
                </div>
                <div className="absolute top-0 right-10 md:right-14 text-sm md:text-base" style={{ animation: 'twinkle 2s ease-in-out infinite', animationDelay: '1s' }}>
                    ⭐
                </div>
                <div className="absolute top-0 right-2 md:right-4 text-base md:text-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>
                    🎅
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes swing {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    25% {
                        transform: translateY(2px) rotate(2deg);
                    }
                    75% {
                        transform: translateY(-2px) rotate(-2deg);
                    }
                }
                
                @keyframes twinkle {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                }
            `}</style>
        </>
    );
}
