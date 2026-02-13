"use client";

import React, { useRef, useEffect } from "react";

export const BlackHole = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resize);
        resize();

        // Black Hole Parameters
        const blackHole = {
            x: width / 2,
            y: height / 2,
            radius: Math.min(width, height) * 0.15, // Dynamic radius
            accretionDiskRadius: Math.min(width, height) * 0.4,
        };

        const stars: { x: number; y: number; size: number; speed: number; angle: number }[] = [];
        const numStars = 400;

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.5 + 0.1,
                angle: Math.random() * Math.PI * 2,
            });
        }

        const draw = () => {
            // Update center on resize
            blackHole.x = width / 2;
            blackHole.y = height / 2;
            blackHole.radius = Math.min(width, height) * 0.15;

            // Clear canvas with trail effect
            ctx.fillStyle = "rgba(5, 5, 5, 0.4)";
            ctx.fillRect(0, 0, width, height);

            // Draw Accretion Disk (Simple Glow)
            const gradient = ctx.createRadialGradient(
                blackHole.x, blackHole.y, blackHole.radius * 0.8,
                blackHole.x, blackHole.y, blackHole.radius * 3
            );
            gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
            gradient.addColorStop(0.1, "rgba(255, 100, 50, 0.8)"); // Inner rim (orange/red)
            gradient.addColorStop(0.2, "rgba(200, 50, 255, 0.4)"); // Middle (violet)
            gradient.addColorStop(0.5, "rgba(100, 0, 255, 0.1)"); // Outer (blue/violet)
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blackHole.x, blackHole.y, blackHole.radius * 4, 0, Math.PI * 2);
            ctx.fill();

            // Draw Stars being sucked in
            stars.forEach((star) => {
                // Calculate distance to black hole center
                const dx = star.x - blackHole.x;
                const dy = star.y - blackHole.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Gravitational pull logic
                if (distance < blackHole.radius) {
                    // Reset star if sucked in
                    star.x = Math.random() * width;
                    star.y = Math.random() * height;
                    // Ensure it doesn't spawn inside
                    if (Math.sqrt((star.x - width / 2) ** 2 + (star.y - height / 2) ** 2) < blackHole.radius * 1.5) {
                        star.x = 0; star.y = 0;
                    }
                } else {
                    // Move towards center
                    const angleToCenter = Math.atan2(dy, dx);
                    const pullFactor = 5000 / (distance * distance + 100); // Inverse square law approximation

                    star.x -= Math.cos(angleToCenter) * (star.speed + pullFactor);
                    star.y -= Math.sin(angleToCenter) * (star.speed + pullFactor);

                    // Spiral effect
                    star.x += Math.cos(angleToCenter + Math.PI / 2) * (pullFactor * 2);
                    star.y += Math.sin(angleToCenter + Math.PI / 2) * (pullFactor * 2);
                }

                // Draw Star
                // Lensing effect: stars get stretched near the event horizon
                const stretch = Math.max(1, 500 / distance);

                ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, distance / 200)})`;
                ctx.beginPath();
                ctx.ellipse(star.x, star.y, star.size * stretch, star.size, Math.atan2(dy, dx), 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Event Horizon (The Black Hole itself)
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
            ctx.fill();

            // Photon Ring (Bright white thin circle around event horizon)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#050505]" />;
};
