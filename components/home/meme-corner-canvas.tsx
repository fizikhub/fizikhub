"use client";

import { useEffect, useRef } from "react";

type Star = {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    twinkle: number;
};

type Particle = {
    radius: number;
    angle: number;
    armOffset: number;
    size: number;
    alpha: number;
    color: string;
    drift: number;
};

type Cloud = {
    x: number;
    y: number;
    radius: number;
    color: string;
    alpha: number;
    speed: number;
};

const COLORS = {
    core: "rgba(255, 235, 166,",
    white: "rgba(245, 250, 255,",
    blue: "rgba(96, 165, 250,",
    cyan: "rgba(125, 211, 252,",
    purple: "rgba(168, 85, 247,",
    violet: "rgba(109, 40, 217,",
};

function getConnectionHints() {
    const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;

    return {
        saveData: Boolean(connection?.saveData),
        slowConnection: connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g",
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        coarsePointer: window.matchMedia("(pointer: coarse)").matches,
        lowMemory: ((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4) <= 3,
        lowCores: (navigator.hardwareConcurrency || 4) <= 4,
    };
}

function createStars(count: number): Star[] {
    return Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: 0.45 + Math.random() * 1.1,
        alpha: 0.25 + Math.random() * 0.65,
        twinkle: 0.5 + Math.random() * 1.4,
    }));
}

function createParticles(count: number): Particle[] {
    const palette = [COLORS.white, COLORS.blue, COLORS.cyan, COLORS.purple, COLORS.core];

    return Array.from({ length: count }, (_, index) => {
        const arm = index % 2;
        const radius = Math.pow(Math.random(), 1.55);
        const branchAngle = arm * Math.PI;
        const spin = radius * 5.8;
        const scatter = (Math.random() - 0.5) * (0.18 + radius * 0.42);

        return {
            radius,
            angle: branchAngle + spin + scatter,
            armOffset: (Math.random() - 0.5) * (0.05 + radius * 0.22),
            size: 0.55 + Math.random() * (Math.random() > 0.965 ? 2.8 : 1.35),
            alpha: 0.18 + Math.random() * 0.8,
            color: palette[Math.floor(Math.random() * palette.length)],
            drift: 0.08 + Math.random() * 0.25,
        };
    });
}

function createClouds(count: number): Cloud[] {
    const palette = [COLORS.blue, COLORS.purple, COLORS.violet];

    return Array.from({ length: count }, () => ({
        x: 0.18 + Math.random() * 0.64,
        y: 0.22 + Math.random() * 0.56,
        radius: 0.16 + Math.random() * 0.3,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.08 + Math.random() * 0.12,
        speed: (Math.random() - 0.5) * 0.18,
    }));
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#02030a");
    bg.addColorStop(0.45, "#07111f");
    bg.addColorStop(1, "#14092b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.5, height * 0.58, 0, width * 0.5, height * 0.58, Math.max(width, height) * 0.72);
    glow.addColorStop(0, "rgba(59, 130, 246, 0.18)");
    glow.addColorStop(0.35, "rgba(88, 28, 135, 0.12)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
}

export default function MemeCornerCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let frame = 0;
        let width = 0;
        let height = 0;
        let cssWidth = 0;
        let cssHeight = 0;
        let lastFrame = 0;
        let stars: Star[] = [];
        let particles: Particle[] = [];
        let clouds: Cloud[] = [];
        const hints = getConnectionHints();
        const batteryMode = hints.saveData || hints.slowConnection || hints.lowMemory || hints.lowCores;
        const mobile = hints.coarsePointer || window.innerWidth < 768;
        const targetFrameMs = batteryMode || mobile ? 42 : 34;
        const rotationSpeed = hints.reducedMotion ? 0.025 : mobile ? 0.085 : 0.12;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            cssWidth = Math.max(1, rect.width);
            cssHeight = Math.max(1, rect.height);
            const dprCap = mobile || batteryMode ? 1.25 : 1.6;
            const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

            width = Math.round(cssWidth * dpr);
            height = Math.round(cssHeight * dpr);
            canvas.width = width;
            canvas.height = height;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const area = cssWidth * cssHeight;
            const quality = batteryMode ? 0.56 : mobile ? 0.76 : 1;
            const particleCount = Math.round(Math.min(1150, Math.max(430, area / 380)) * quality);
            const starCount = Math.round(Math.min(220, Math.max(80, area / 1800)) * quality);
            const cloudCount = batteryMode ? 5 : mobile ? 7 : 10;

            stars = createStars(starCount);
            particles = createParticles(particleCount);
            clouds = createClouds(cloudCount);
        };

        const draw = (now: number) => {
            frame = requestAnimationFrame(draw);
            if (now - lastFrame < targetFrameMs) return;
            lastFrame = now;

            drawBackground(ctx, cssWidth, cssHeight);

            const time = now * 0.001;
            const centerX = cssWidth * 0.5;
            const centerY = cssHeight * 0.54;
            const galaxyRadius = Math.min(cssWidth * 0.54, cssHeight * 0.92);
            const squash = mobile ? 0.32 : 0.36;
            const rotation = time * rotationSpeed;

            ctx.save();
            ctx.globalCompositeOperation = "screen";

            for (const cloud of clouds) {
                const cloudX = cloud.x * cssWidth + Math.cos(time * cloud.speed) * 12;
                const cloudY = cloud.y * cssHeight + Math.sin(time * cloud.speed * 1.4) * 8;
                const radius = cloud.radius * Math.max(cssWidth, cssHeight);
                const gradient = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, radius);
                gradient.addColorStop(0, `${cloud.color}${cloud.alpha})`);
                gradient.addColorStop(0.54, `${cloud.color}${cloud.alpha * 0.36})`);
                gradient.addColorStop(1, `${cloud.color}0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cloudX, cloudY, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            for (const star of stars) {
                const twinkle = star.alpha + Math.sin(time * star.twinkle + star.x * 10) * 0.14;
                ctx.fillStyle = `rgba(236, 248, 255, ${Math.max(0.08, twinkle)})`;
                ctx.beginPath();
                ctx.arc(star.x * cssWidth, star.y * cssHeight, star.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, galaxyRadius * 0.34);
            core.addColorStop(0, "rgba(255, 244, 196, 0.78)");
            core.addColorStop(0.22, "rgba(125, 211, 252, 0.34)");
            core.addColorStop(0.58, "rgba(168, 85, 247, 0.2)");
            core.addColorStop(1, "rgba(168, 85, 247, 0)");
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, galaxyRadius * 0.36, galaxyRadius * 0.18, -0.08, 0, Math.PI * 2);
            ctx.fill();

            for (const particle of particles) {
                const radius = particle.radius * galaxyRadius;
                const angle = particle.angle + rotation * particle.drift;
                const wobble = Math.sin(time * 0.75 + particle.radius * 12) * particle.armOffset * galaxyRadius;
                const x = centerX + Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * wobble;
                const y = centerY + Math.sin(angle) * radius * squash + Math.sin(angle + Math.PI / 2) * wobble * 0.18;
                const edgeFade = Math.max(0.18, 1 - particle.radius * 0.65);
                const pulse = 0.84 + Math.sin(time * 1.6 + particle.angle * 2) * 0.16;
                const alpha = particle.alpha * edgeFade * pulse;

                ctx.fillStyle = `${particle.color}${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        };

        resize();
        frame = requestAnimationFrame(draw);
        window.addEventListener("resize", resize, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
