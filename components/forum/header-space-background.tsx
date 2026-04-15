"use client";

import React, { useEffect, useRef, useState } from "react";

// CSS-only shooting star animation - lightweight alternative to motion.div
const ShootingStar = ({ delay }: { delay: number }) => (
    <div
        className="absolute h-[2px] w-[100px] rotate-45 opacity-0 pointer-events-none"
        style={{
            top: `${Math.random() * 30}%`,
            left: `${Math.random() * 50 + 20}%`,
            background: 'linear-gradient(90deg, transparent 0%, white 30%, transparent 100%)',
            animation: `headerShootingStar 1.2s ease-out ${delay}s infinite`,
            animationDelay: `${delay}s`,
        }}
    />
);

export function HeaderSpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container
        const resizeCanvas = () => {
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        resizeCanvas();

        // Star properties - REDUCED COUNT for performance
        const starCount = mobile ? 40 : 80; // Was 200
        const stars: { x: number; y: number; size: number; baseOpacity: number; opacityDirection: number; speed: number }[] = [];

        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                baseOpacity: Math.random() * 0.7 + 0.3,
                opacityDirection: 1,
                speed: Math.random() * 0.02 + 0.005
            });
        }

        let animationFrameId: number;
        const currentOpacity: number[] = stars.map(s => s.baseOpacity);

        const render = () => {
            if (!canvas || !ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and animate stars
            stars.forEach((star, i) => {
                // Twinkle effect
                currentOpacity[i] += star.speed * (star.opacityDirection);
                if (currentOpacity[i] > star.baseOpacity * 1.5) {
                    star.opacityDirection = -1;
                } else if (currentOpacity[i] < star.baseOpacity * 0.5) {
                    star.opacityDirection = 1;
                }

                // Draw star
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity[i]})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Optional glow for larger stars
                if (star.size > 1.5) {
                    ctx.shadowBlur = star.size * 2;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Handle resize
        const handleResize = () => {
            resizeCanvas();
            // Reposition stars on resize
            stars.forEach(star => {
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
            });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] opacity-40" />

            {/* Canvas-based stars - GPU accelerated */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'transparent' }}
            />

            {/* CSS-only shooting stars - desktop only */}
            {!isMobile && (
                <>
                    <ShootingStar delay={2} />
                    <ShootingStar delay={5} />
                    <ShootingStar delay={8} />
                </>
            )}

            {/* Header shooting star keyframes - inline to ensure it loads */}
            <style>{`
                @keyframes headerShootingStar {
                    0% { transform: rotate(45deg) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: rotate(45deg) translateX(300px); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
