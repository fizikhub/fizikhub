"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// GARGANTUA FOOTER — Interstellar-quality black hole animation
// Smooth gradient rendering, 20K stars, photon ring, lensed disk
// ═══════════════════════════════════════════════════════════════

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const starsRef = useRef<Float32Array | null>(null); // x, y, size, brightness, twinkleSpeed, r, g, b = 8 per star
    const timeRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ──── STAR INITIALIZATION ────
    const initStars = useCallback((w: number, h: number) => {
        const N = 20000;
        const buf = new Float32Array(N * 8);

        for (let i = 0; i < N; i++) {
            const off = i * 8;
            buf[off] = Math.random() * w;          // x
            buf[off + 1] = Math.random() * h;      // y
            buf[off + 2] = Math.random() < 0.97     // size
                ? Math.random() * 1.0 + 0.2
                : Math.random() * 1.8 + 1.0;
            buf[off + 3] = Math.random() * 0.6 + 0.2; // brightness
            buf[off + 4] = Math.random() * 2 + 0.5;   // twinkle speed

            // Color distribution
            const roll = Math.random();
            if (roll < 0.55) {
                // White
                buf[off + 5] = 230 + Math.random() * 25;
                buf[off + 6] = 235 + Math.random() * 20;
                buf[off + 7] = 240 + Math.random() * 15;
            } else if (roll < 0.75) {
                // Blue-white
                buf[off + 5] = 170 + Math.random() * 40;
                buf[off + 6] = 195 + Math.random() * 40;
                buf[off + 7] = 235 + Math.random() * 20;
            } else if (roll < 0.9) {
                // Warm yellow
                buf[off + 5] = 240 + Math.random() * 15;
                buf[off + 6] = 210 + Math.random() * 30;
                buf[off + 7] = 160 + Math.random() * 30;
            } else {
                // Orange-red (rare)
                buf[off + 5] = 240 + Math.random() * 15;
                buf[off + 6] = 150 + Math.random() * 50;
                buf[off + 7] = 90 + Math.random() * 40;
            }
        }
        starsRef.current = buf;
    }, []);

    // ──── MAIN RENDER LOOP ────
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const dpr = window.devicePixelRatio || 1;

        timeRef.current += 0.003;
        const t = timeRef.current;

        // Black hole params
        const bhX = W * 0.5;
        const bhY = H * 0.38;
        const baseR = Math.min(W, H);
        const eventHorizon = baseR * 0.065;
        const photonR = eventHorizon * 1.25;

        // ──── CLEAR ────
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);

        // ──── STARS ────
        const stars = starsRef.current;
        if (stars) {
            const len = stars.length / 8;
            for (let i = 0; i < len; i++) {
                const off = i * 8;
                const sx = stars[off];
                const sy = stars[off + 1];
                const sz = stars[off + 2];
                const sb = stars[off + 3];
                const sp = stars[off + 4];

                // Distance from black hole center
                const dx = sx - bhX;
                const dy = sy - bhY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Stars inside event horizon are invisible
                if (dist < eventHorizon * 1.1) continue;

                // Dim stars near the black hole (gravitational redshift)
                let alpha = sb;
                if (dist < eventHorizon * 3) {
                    alpha *= Math.min(1, (dist - eventHorizon * 1.1) / (eventHorizon * 1.9));
                }

                // Twinkling
                alpha *= 0.7 + 0.3 * Math.sin(t * sp * 6 + i * 1.3);

                if (alpha < 0.03) continue;

                const r = stars[off + 5] | 0;
                const g = stars[off + 6] | 0;
                const b = stars[off + 7] | 0;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgb(${r},${g},${b})`;

                const drawSz = sz / dpr;
                if (sz > 1.5) {
                    // Bright star with subtle glow
                    ctx.beginPath();
                    ctx.arc(sx, sy, drawSz, 0, 6.2832);
                    ctx.fill();
                    ctx.globalAlpha = alpha * 0.08;
                    ctx.beginPath();
                    ctx.arc(sx, sy, drawSz * 3, 0, 6.2832);
                    ctx.fill();
                } else {
                    ctx.fillRect(sx - drawSz * 0.5, sy - drawSz * 0.5, drawSz, drawSz);
                }
            }
        }
        ctx.globalAlpha = 1;

        // ──── ACCRETION DISK (back — behind the black hole) ────
        drawAccretionDisk(ctx, bhX, bhY, eventHorizon, dpr, t, true);

        // ──── BLACK HOLE (event horizon) ────
        // Smooth dark sphere
        const bhGrad = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, eventHorizon * 1.4);
        bhGrad.addColorStop(0, "rgba(0,0,0,1)");
        bhGrad.addColorStop(0.7, "rgba(0,0,0,1)");
        bhGrad.addColorStop(0.88, "rgba(0,0,0,0.98)");
        bhGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bhGrad;
        ctx.beginPath();
        ctx.arc(bhX, bhY, eventHorizon * 1.4, 0, 6.2832);
        ctx.fill();

        // ──── PHOTON RING (thin bright ring at event horizon edge) ────
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(t * 0.7) * 0.1;
        const ringGrad = ctx.createRadialGradient(bhX, bhY, photonR - 2 / dpr, bhX, bhY, photonR + 3 / dpr);
        ringGrad.addColorStop(0, "rgba(255,200,120,0)");
        ringGrad.addColorStop(0.35, "rgba(255,210,140,0.6)");
        ringGrad.addColorStop(0.5, "rgba(255,240,220,0.9)");
        ringGrad.addColorStop(0.65, "rgba(255,210,140,0.6)");
        ringGrad.addColorStop(1, "rgba(255,200,120,0)");
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(bhX, bhY, photonR + 3 / dpr, 0, 6.2832);
        ctx.fill();
        ctx.restore();

        // ──── ACCRETION DISK (front — in front of the black hole) ────
        drawAccretionDisk(ctx, bhX, bhY, eventHorizon, dpr, t, false);

        // ──── LENSED LIGHT (top arc — back of disk bent over the top) ────
        ctx.save();
        const lensArcR = eventHorizon * 1.7;
        ctx.globalAlpha = 0.25 + Math.sin(t * 0.5) * 0.05;
        ctx.strokeStyle = "rgba(255,190,100,0.5)";
        ctx.lineWidth = (3 + Math.sin(t * 1.2) * 0.5) / dpr;
        ctx.beginPath();
        ctx.arc(bhX, bhY, lensArcR, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = "rgba(255,160,60,0.3)";
        ctx.lineWidth = 8 / dpr;
        ctx.beginPath();
        ctx.arc(bhX, bhY, lensArcR + 2 / dpr, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.restore();

        // ──── AMBIENT GLOW around the black hole ────
        ctx.save();
        ctx.globalAlpha = 0.07;
        const ambGrad = ctx.createRadialGradient(bhX, bhY, eventHorizon, bhX, bhY, eventHorizon * 5);
        ambGrad.addColorStop(0, "rgba(255,180,80,0.3)");
        ambGrad.addColorStop(0.3, "rgba(255,120,40,0.1)");
        ambGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ambGrad;
        ctx.beginPath();
        ctx.arc(bhX, bhY, eventHorizon * 5, 0, 6.2832);
        ctx.fill();
        ctx.restore();

        animRef.current = requestAnimationFrame(draw);
    }, []);

    // ──── ACCRETION DISK RENDERER ────
    function drawAccretionDisk(
        ctx: CanvasRenderingContext2D,
        cx: number, cy: number,
        eventHorizon: number,
        dpr: number,
        t: number,
        isBack: boolean
    ) {
        ctx.save();

        // Disk is an ellipse: wide horizontally, thin vertically (perspective)
        const diskOuter = eventHorizon * 4.5;
        const diskInner = eventHorizon * 1.5;
        const diskLayers = 12;
        const flatness = 0.18; // How flat the ellipse is (perspective)

        // Only draw top half (back) or bottom half (front)
        const startAngle = isBack ? Math.PI : 0;
        const endAngle = isBack ? Math.PI * 2 : Math.PI;

        for (let layer = 0; layer < diskLayers; layer++) {
            const ratio = layer / diskLayers;
            const layerR = diskInner + (diskOuter - diskInner) * ratio;

            // Color: inner=white-hot → orange → red → dim
            let r: number, g: number, b: number, a: number;
            if (ratio < 0.15) {
                r = 255; g = 245; b = 230; a = 0.8;
            } else if (ratio < 0.3) {
                r = 255; g = 210; b = 140; a = 0.65;
            } else if (ratio < 0.5) {
                r = 255; g = 160; b = 60; a = 0.45;
            } else if (ratio < 0.7) {
                r = 230; g = 100; b = 30; a = 0.3;
            } else if (ratio < 0.85) {
                r = 180; g = 60; b = 20; a = 0.18;
            } else {
                r = 120; g = 35; b = 15; a = 0.08;
            }

            // Subtle rotation animation
            const rotOffset = t * 0.15 * (1 + ratio * 0.5);

            ctx.globalAlpha = a;
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = (2.5 - ratio * 1.5 + 0.5) / dpr;

            ctx.beginPath();
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotOffset * 0.02);
            ctx.scale(1, flatness);
            ctx.arc(0, 0, layerR, startAngle, endAngle);
            ctx.restore();
            ctx.stroke();

            // Bloom layer
            if (ratio < 0.4) {
                ctx.globalAlpha = a * 0.15;
                ctx.lineWidth = (6 + (1 - ratio) * 8) / dpr;
                ctx.beginPath();
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotOffset * 0.02);
                ctx.scale(1, flatness);
                ctx.arc(0, 0, layerR, startAngle, endAngle);
                ctx.restore();
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    // ──── LIFECYCLE ────
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
        animRef.current = requestAnimationFrame(draw);
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    }, [draw, initStars]);

    if (isMessagesPage) return null;

    return (
        <footer
            ref={containerRef}
            role="contentinfo"
            aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden min-h-[520px] md:min-h-[620px] flex flex-col justify-end"
        >
            {/* Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 block" />

            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            {/* ═══════════════ CONTENT ═══════════════ */}
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
            <div className="relative z-40 w-full border-t border-white/5 bg-black/70 backdrop-blur-sm pb-10 pt-6">
                <div className="container flex flex-col items-center justify-center gap-3 text-center">
                    <SiteLogo className="h-9 w-9 text-yellow-400 opacity-90" />
                    <p className="text-xs font-mono text-zinc-500">&copy; 2025 FİZİKHUB.</p>
                    <span className="text-orange-500/80 font-bold text-[10px] tracking-[0.2em] font-mono">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                </div>
            </div>
        </footer>
    );
}
