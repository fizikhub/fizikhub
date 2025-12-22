"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MarsEffect() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || theme !== "mars") {
        return null;
    }

    // Generate subtle dust particles
    const dustParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 10}s`,
        opacity: 0.1 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {dustParticles.map((particle) => (
                <div
                    key={particle.id}
                    className="dust-particle absolute"
                    style={{
                        left: particle.left,
                        animationDuration: particle.animationDuration,
                        animationDelay: particle.animationDelay,
                        opacity: particle.opacity,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: `hsl(25, 50%, ${45 + Math.random() * 20}%)`,
                    }}
                />
            ))}
            <style jsx>{`
                .dust-particle {
                    border-radius: 50%;
                    top: -10px;
                    animation: dust-drift linear infinite;
                    box-shadow: 0 0 3px rgba(255, 150, 80, 0.3);
                }

                @keyframes dust-drift {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(50vh) translateX(-30px) rotate(180deg);
                    }
                    100% {
                        transform: translateY(100vh) translateX(20px) rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
