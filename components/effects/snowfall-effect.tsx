"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SnowfallEffect() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [snowflakes, setSnowflakes] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        setSnowflakes(Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 8}s`,
            opacity: 0.3 + Math.random() * 0.7,
            size: 2 + Math.random() * 4,
        })));
    }, []);

    if (!mounted || theme !== "christmas") {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake absolute animate-snowfall"
                    style={{
                        left: flake.left,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        opacity: flake.opacity,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                    }}
                >
                    ❄
                </div>
            ))}
            <style jsx>{`
                .snowflake {
                    color: white;
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
                    top: -10px;
                }

                @keyframes snowfall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    100% {
                        transform: translateY(100vh) translateX(50px) rotate(360deg);
                    }
                }

                .animate-snowfall {
                    animation: snowfall linear infinite;
                }
            `}</style>
        </div>
    );
}
