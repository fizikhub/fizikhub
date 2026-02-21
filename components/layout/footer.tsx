"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// BLACK HOLE FOOTER — Canvas-based, 20K stars, accretion disk
// ═══════════════════════════════════════════════════════

interface Star {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    brightness: number;
    speed: number;
    color: [number, number, number]; // RGB
}

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const starsRef = useRef<Star[]>([]);
    const timeRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const initStars = useCallback((width: number, height: number) => {
        const count = 20000;
        const stars: Star[] = [];

        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            // Star color distribution: white, blue-white, yellow, orange-red
            const colorRoll = Math.random();
            let color: [number, number, number];
            if (colorRoll < 0.5) {
                // White/blue-white (most common)
                const b = 200 + Math.random() * 55;
                color = [b - 20 + Math.random() * 20, b - 10 + Math.random() * 10, b];
            } else if (colorRoll < 0.75) {
                // Warm yellow
                color = [220 + Math.random() * 35, 200 + Math.random() * 30, 150 + Math.random() * 40];
            } else if (colorRoll < 0.9) {
                // Cool blue
                color = [140 + Math.random() * 40, 170 + Math.random() * 50, 220 + Math.random() * 35];
            } else {
                // Orange-red (rare giant stars)
                color = [230 + Math.random() * 25, 140 + Math.random() * 60, 80 + Math.random() * 40];
            }

            stars.push({
                x, y,
                baseX: x,
                baseY: y,
                size: Math.random() < 0.98 ? Math.random() * 1.2 + 0.3 : Math.random() * 2 + 1.5, // 2% brighter stars
                brightness: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.3 + 0.05,
                color,
            });
        }

        starsRef.current = stars;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const dpr = window.devicePixelRatio || 1;

        // Black hole position (center-bottom area)
        const bhX = W / 2;
        const bhY = H * 0.52;
        const bhRadius = Math.min(W, H) * 0.08; // Event horizon
        const accretionInner = bhRadius * 1.8;
        const accretionOuter = bhRadius * 4.5;
        const influenceRadius = bhRadius * 8;

        timeRef.current += 0.004;
        const t = timeRef.current;

        // Clear
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);

        // ── DRAW STARS ──
        const stars = starsRef.current;
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // Distance from black hole
            const dx = s.baseX - bhX;
            const dy = s.baseY - bhY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let drawX = s.baseX;
            let drawY = s.baseY;
            let drawSize = s.size;
            let drawAlpha = s.brightness;

            if (dist < influenceRadius) {
                // Gravitational lensing: bend light around black hole
                const strength = 1 - dist / influenceRadius;
                const angle = Math.atan2(dy, dx);

                // Warp position (lensing effect)
                const warpAngle = angle + strength * strength * 1.2;
                const warpDist = dist + strength * bhRadius * 0.5;
                drawX = bhX + Math.cos(warpAngle) * warpDist;
                drawY = bhY + Math.sin(warpAngle) * warpDist;

                // Stars near event horizon get stretched and dimmed
                if (dist < bhRadius * 2) {
                    drawAlpha *= Math.max(0, (dist - bhRadius) / bhRadius);
                    drawSize *= 1 + strength * 2;
                }

                // Blueshifting near the black hole
                if (strength > 0.3) {
                    const shift = (strength - 0.3) * 2;
                    s.color[2] = Math.min(255, s.color[2] + shift * 40);
                }
            }

            // Subtle twinkling
            const twinkle = Math.sin(t * s.speed * 20 + i * 0.7) * 0.15 + 0.85;
            drawAlpha *= twinkle;

            if (drawAlpha < 0.02) continue;
            if (drawX < -5 || drawX > W + 5 || drawY < -5 || drawY > H + 5) continue;

            // Draw star
            ctx.globalAlpha = drawAlpha;
            ctx.fillStyle = `rgb(${s.color[0] | 0},${s.color[1] | 0},${s.color[2] | 0})`;

            if (drawSize > 1.8) {
                // Brighter stars get a glow
                ctx.beginPath();
                ctx.arc(drawX, drawY, drawSize / dpr, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = drawAlpha * 0.15;
                ctx.beginPath();
                ctx.arc(drawX, drawY, drawSize * 2.5 / dpr, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Small stars: fast rect
                const sz = drawSize / dpr;
                ctx.fillRect(drawX - sz / 2, drawY - sz / 2, sz, sz);
            }
        }
        ctx.globalAlpha = 1;

        // ── ACCRETION DISK ──
        // Draw the glowing ring around the black hole
        const diskSegments = 360;
        for (let i = 0; i < diskSegments; i++) {
            const angle = (i / diskSegments) * Math.PI * 2 + t * 0.8;
            const noise = Math.sin(angle * 6 + t * 3) * 0.15 + Math.sin(angle * 13 + t * 1.7) * 0.1;

            for (let ring = 0; ring < 8; ring++) {
                const ringRatio = ring / 8;
                const r = accretionInner + (accretionOuter - accretionInner) * ringRatio;
                const wobble = Math.sin(angle * 3 + ring + t * 2) * r * 0.03;

                const px = bhX + Math.cos(angle) * (r + wobble);
                const py = bhY + Math.sin(angle) * (r + wobble) * 0.28; // Flatten for perspective

                // Color: inner=hot white/blue, mid=orange, outer=red/dark
                let cr: number, cg: number, cb: number;
                const heatAlpha = (1 - ringRatio) * (0.6 + noise * 0.4);

                if (ringRatio < 0.25) {
                    // Inner: white-hot
                    cr = 255; cg = 240; cb = 220;
                } else if (ringRatio < 0.5) {
                    // Mid-inner: orange-yellow
                    cr = 255; cg = 180 + noise * 40; cb = 60;
                } else if (ringRatio < 0.75) {
                    // Mid-outer: deep orange
                    cr = 240; cg = 120 + noise * 30; cb = 30;
                } else {
                    // Outer: red-dim
                    cr = 180; cg = 50 + noise * 20; cb = 20;
                }

                const particleSize = (1.5 + ringRatio * 2) / dpr;
                ctx.globalAlpha = heatAlpha * 0.6;
                ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
                ctx.fillRect(px - particleSize / 2, py - particleSize / 2, particleSize, particleSize);
            }
        }

        // ── ACCRETION GLOW (bloom) ──
        ctx.globalAlpha = 0.12;
        const glowGrad = ctx.createRadialGradient(bhX, bhY, accretionInner * 0.5, bhX, bhY, accretionOuter * 1.5);
        glowGrad.addColorStop(0, "rgba(255,200,100,0.4)");
        glowGrad.addColorStop(0.3, "rgba(255,140,40,0.2)");
        glowGrad.addColorStop(0.7, "rgba(200,60,20,0.08)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.save();
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(bhX, bhY / 0.3, accretionOuter * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ── BLACK HOLE (event horizon) ──
        ctx.globalAlpha = 1;
        const bhGrad = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, bhRadius * 1.6);
        bhGrad.addColorStop(0, "rgba(0,0,0,1)");
        bhGrad.addColorStop(0.6, "rgba(0,0,0,1)");
        bhGrad.addColorStop(0.85, "rgba(0,0,0,0.95)");
        bhGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bhGrad;
        ctx.beginPath();
        ctx.arc(bhX, bhY, bhRadius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Inner shadow ring (photon sphere)
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "rgba(200,160,100,0.15)";
        ctx.lineWidth = 1.5 / dpr;
        ctx.beginPath();
        ctx.arc(bhX, bhY, bhRadius * 1.15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;

        // ── GRAVITATIONAL LENS RING (Einstein ring) ──
        ctx.globalAlpha = 0.06 + Math.sin(t * 0.5) * 0.02;
        ctx.strokeStyle = "rgba(180,200,255,0.3)";
        ctx.lineWidth = 2 / dpr;
        ctx.beginPath();
        ctx.arc(bhX, bhY, bhRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        animFrameRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            initStars(canvas.width, canvas.height);
        };

        resize();
        animFrameRef.current = requestAnimationFrame(draw);

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [draw, initStars]);

    if (isMessagesPage) return null;

    return (
        <footer
            ref={containerRef}
            role="contentinfo"
            aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden min-h-[550px] md:min-h-[650px] flex flex-col justify-end"
        >
            {/* Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
                style={{ display: "block" }}
            />

            {/* Top fade mask */}
            <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

            {/* ═══════════════ CONTENT ═══════════════ */}

            {/* Links Grid */}
            <div className="container relative z-30 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-center md:text-left w-full max-w-4xl mx-auto">

                    {/* 1. Keşif Modülü */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <h4 className="text-xs font-bold text-blue-100 uppercase tracking-widest">Keşif Modülü</h4>
                        </div>
                        <nav aria-label="Keşif bağlantıları" className="flex flex-col gap-2">
                            <Link href="/kesfet" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Keşfet</Link>
                            <Link href="/testler" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Testler</Link>
                            <Link href="/sozluk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sözlük</Link>
                        </nav>
                    </div>

                    {/* 2. Topluluk */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            <h4 className="text-xs font-bold text-purple-100 uppercase tracking-widest">Topluluk</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/forum" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Forum</Link>
                            <Link href="/siralamalar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sıralamalar</Link>
                            <Link href="/yazar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Yazarlar</Link>
                        </nav>
                    </div>

                    {/* 3. Kurumsal */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <h4 className="text-xs font-bold text-green-100 uppercase tracking-widest">Kurumsal</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/hakkimizda" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Hakkımızda</Link>
                            <Link href="/iletisim" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">İletişim</Link>
                            <Link href="/blog" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Blog</Link>
                        </nav>
                    </div>

                    {/* 4. Protokoller */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <h4 className="text-xs font-bold text-red-100 uppercase tracking-widest">Protokoller</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Gizlilik</Link>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Şartlar</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">KVKK</Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-40 w-full border-t border-white/5 bg-black/60 backdrop-blur-sm pb-10 pt-6">
                <div className="container flex flex-col items-center justify-center gap-3 text-center">
                    <SiteLogo className="h-9 w-9 text-yellow-400 opacity-90" />
                    <p className="text-xs font-mono text-zinc-500">
                        &copy; 2025 FİZİKHUB.
                    </p>
                    <span className="text-orange-500/80 font-bold text-[10px] tracking-[0.2em] font-mono">
                        İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.
                    </span>
                </div>
            </div>
        </footer>
    );
}
