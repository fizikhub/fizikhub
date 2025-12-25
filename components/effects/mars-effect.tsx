"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    const dustParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 10}s`,
        opacity: 0.15 + Math.random() * 0.35,
        size: 1.5 + Math.random() * 3,
    }));

    return (
        <>
            {/* Mars Background Image Layer - Fixed position with proper z-index */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 0 }}
            >
                <Image
                    src="/images/mars-bg.webp"
                    alt="Mars surface"
                    fill
                    priority
                    quality={85}
                    className="object-cover"
                    style={{ opacity: 0.5 }}
                />
            </div>

            {/* Mars Atmospheric Gradient Overlay */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background: `
                        linear-gradient(180deg, 
                            rgba(41, 20, 15, 0.4) 0%, 
                            transparent 30%,
                            transparent 70%,
                            rgba(41, 20, 15, 0.6) 100%
                        )
                    `,
                }}
            />

            {/* Mars Surface Glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background: `radial-gradient(ellipse 120% 50% at 50% 100%, rgba(234, 88, 12, 0.2) 0%, transparent 50%)`,
                }}
            />

            {/* Dust Particles */}
            <div
                className="fixed inset-0 pointer-events-none overflow-hidden"
                style={{ zIndex: 100 }}
            >
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
                            background: `hsl(25, 60%, ${40 + Math.random() * 25}%)`,
                        }}
                    />
                ))}
                <style jsx>{`
                    .dust-particle {
                        border-radius: 50%;
                        top: -10px;
                        animation: dust-drift linear infinite;
                        box-shadow: 0 0 6px rgba(255, 150, 80, 0.4);
                        filter: blur(0.5px);
                    }

                    @keyframes dust-drift {
                        0% {
                            transform: translateY(0) translateX(0) rotate(0deg);
                        }
                        50% {
                            transform: translateY(50vh) translateX(-40px) rotate(180deg);
                        }
                        100% {
                            transform: translateY(100vh) translateX(30px) rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        </>
    );
}
