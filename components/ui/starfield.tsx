"use client";

import React, { useEffect, useRef } from "react";

interface StarfieldProps {
    speed?: number;
    backgroundColor?: string;
    starColor?: string;
    count?: number;
}

export const Starfield: React.FC<StarfieldProps> = ({
    speed = 0.5,
    backgroundColor = "transparent",
    starColor = "#ffffff",
    count = 800,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Array<{ x: number; y: number; z: number; o: number }> = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * canvas.width,
                o: Math.random(),
            }));
        };

        const animate = () => {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                star.z -= speed;

                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width - canvas.width / 2;
                    star.y = Math.random() * canvas.height - canvas.height / 2;
                }

                const x = (star.x / star.z) * canvas.width + canvas.width / 2;
                const y = (star.y / star.z) * canvas.height + canvas.height / 2;
                const size = (1 - star.z / canvas.width) * 2;
                const opacity = (1 - star.z / canvas.width) * star.o;

                if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                    ctx.beginPath();
                    ctx.fillStyle = starColor;
                    ctx.globalAlpha = opacity;
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [speed, backgroundColor, starColor, count]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};
