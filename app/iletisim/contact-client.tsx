"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { Mail, MapPin, Clock, ArrowUpRight, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* =====================================================
   CONTACT PAGE -  PREMIUM NEO-BRUTALIST SPACE THEME
   =====================================================
   - Canvas-based starfield (performant)
   - Framer Motion stagger reveals
   - CSS-only UFO + rocket illustrations
   - Full mobile responsive
   ===================================================== */

// ─── STARFIELD CANVAS ───────────────────────────────
function StarfieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let stars: { x: number; y: number; r: number; speed: number; opacity: number; phase: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 2;
            initStars();
        };

        const initStars = () => {
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.3,
                speed: Math.random() * 0.3 + 0.05,
                opacity: Math.random(),
                phase: Math.random() * Math.PI * 2,
            }));
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const star of stars) {
                const twinkle = 0.4 + 0.6 * Math.sin(time * 0.001 * star.speed + star.phase);
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
                ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        };

        resize();
        animId = requestAnimationFrame(draw);
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    );
}

// ─── FLOATING UFO  ──────────────────────────────────
function FloatingUFO({ className, size = 120, delay = 0 }: { className?: string; size?: number; delay?: number }) {
    return (
        <motion.div
            className={cn("absolute pointer-events-none select-none", className)}
            animate={{
                y: [0, -20, 0, -12, 0],
                rotate: [-3, 2, -2, 3, -3],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
        >
            <svg width={size} height={size * 0.7} viewBox="0 0 120 84" fill="none">
                {/* Beam */}
                <motion.path
                    d="M 35 56 L 85 56 L 72 120 L 48 120 Z"
                    fill="url(#beamGrad)"
                    animate={{ opacity: [0.05, 0.2, 0.05] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <defs>
                    <linearGradient id="beamGrad" x1="60" y1="56" x2="60" y2="120" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFC800" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#FFC800" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Saucer body */}
                <ellipse cx="60" cy="54" rx="45" ry="11" fill="#1c1c1e" stroke="#000" strokeWidth="3" />
                <ellipse cx="60" cy="52" rx="45" ry="11" fill="#27272a" stroke="#000" strokeWidth="3" />

                {/* Dome */}
                <ellipse cx="60" cy="42" rx="26" ry="18" fill="#0ea5e9" stroke="#000" strokeWidth="3" />
                <ellipse cx="60" cy="42" rx="26" ry="18" fill="url(#domeShine)" />
                <defs>
                    <radialGradient id="domeShine" cx="0.4" cy="0.3" r="0.7">
                        <stop stopColor="white" stopOpacity="0.35" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Lights */}
                {[18, 34, 50, 66, 82, 98].map((x, i) => (
                    <motion.circle
                        key={i}
                        cx={x}
                        cy="53"
                        r="4"
                        fill={["#FFC800", "#FF90E8", "#00F050", "#23A9FA", "#ff4444", "#FFC800"][i]}
                        stroke="#000"
                        strokeWidth="2"
                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}

                {/* Antenna */}
                <line x1="60" y1="24" x2="60" y2="12" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                <motion.circle
                    cx="60" cy="9" r="5"
                    fill="#FFC800" stroke="#000" strokeWidth="2.5"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </svg>
        </motion.div>
    );
}

// ─── FLYING ROCKET ──────────────────────────────────
function FlyingRocket({ direction = "ltr", top = "20%", delay = 0, color = "#FFC800" }: { direction?: "ltr" | "rtl"; top?: string; delay?: number; color?: string }) {
    const isLtr = direction === "ltr";
    return (
        <motion.div
            className="absolute pointer-events-none select-none"
            style={{ top, zIndex: 5 }}
            initial={{ x: isLtr ? "-80px" : "calc(100vw + 80px)", y: 0 }}
            animate={{
                x: isLtr ? "calc(100vw + 80px)" : "-80px",
                y: isLtr ? -100 : -60,
            }}
            transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
                delay,
            }}
        >
            <svg width="48" height="60" viewBox="0 0 48 60" fill="none" style={{ transform: isLtr ? "rotate(-35deg)" : "rotate(215deg)" }}>
                {/* Body */}
                <ellipse cx="24" cy="24" rx="10" ry="22" fill={color} stroke="#000" strokeWidth="2.5" />
                {/* Nose */}
                <path d="M 24 0 L 14 14 L 34 14 Z" fill="#ef4444" stroke="#000" strokeWidth="2" />
                {/* Fins */}
                <path d="M 14 36 L 4 52 L 18 42 Z" fill={color} stroke="#000" strokeWidth="2" />
                <path d="M 34 36 L 44 52 L 30 42 Z" fill={color} stroke="#000" strokeWidth="2" />
                {/* Window */}
                <circle cx="24" cy="24" r="6" fill="#0ea5e9" stroke="#000" strokeWidth="2" />
                <circle cx="22" cy="22" r="2" fill="white" opacity="0.5" />
                {/* Engine flames */}
                <motion.ellipse
                    cx="24" cy="48" rx="7" ry="5"
                    fill="#ff8800" stroke="#000" strokeWidth="1.5"
                    animate={{ scaleY: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                />
                <motion.ellipse
                    cx="24" cy="54" rx="4" ry="4"
                    fill="#ffcc00"
                    animate={{ scaleY: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                />
            </svg>
        </motion.div>
    );
}

// ─── ORBITING PLANET ────────────────────────────────
function FloatingPlanet({ className }: { className?: string }) {
    return (
        <motion.div
            className={cn("absolute pointer-events-none select-none", className)}
            animate={{ y: [0, -15, 0], rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                {/* Ring behind */}
                <ellipse cx="70" cy="70" rx="68" ry="14" fill="none" stroke="#FFC800" strokeWidth="3" opacity="0.25"
                    strokeDasharray="12 8" />

                {/* Planet */}
                <circle cx="70" cy="70" r="44" fill="#1e1b4b" stroke="#000" strokeWidth="3" />
                <ellipse cx="52" cy="55" rx="14" ry="9" fill="#312e81" opacity="0.6" />
                <ellipse cx="82" cy="78" rx="18" ry="11" fill="#4338ca" opacity="0.4" />
                <circle cx="60" cy="40" r="10" fill="#3730a3" opacity="0.5" />
                {/* Atmosphere shine */}
                <ellipse cx="55" cy="48" rx="18" ry="12" fill="white" opacity="0.06" />

                {/* Ring in front */}
                <ellipse cx="70" cy="70" rx="68" ry="14" fill="none" stroke="#FFC800" strokeWidth="3" opacity="0.45" />

                {/* Moon orbiting */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "70px 70px" }}
                >
                    <circle cx="130" cy="70" r="8" fill="#d4d4d8" stroke="#000" strokeWidth="2" />
                    <circle cx="128" cy="68" r="2" fill="#a1a1aa" opacity="0.5" />
                </motion.g>
            </svg>
        </motion.div>
    );
}

// ─── ANIMATED SATELLITE ─────────────────────────────
function Satellite({ className }: { className?: string }) {
    return (
        <motion.div
            className={cn("pointer-events-none select-none", className)}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <rect x="24" y="24" width="16" height="16" rx="3" fill="#27272a" stroke="#000" strokeWidth="2.5" />
                <rect x="2" y="27" width="18" height="10" rx="2" fill="#0ea5e9" stroke="#000" strokeWidth="2" />
                <rect x="44" y="27" width="18" height="10" rx="2" fill="#0ea5e9" stroke="#000" strokeWidth="2" />
                <line x1="11" y1="32" x2="20" y2="32" stroke="#000" strokeWidth="1" />
                <line x1="44" y1="32" x2="53" y2="32" stroke="#000" strokeWidth="1" />
                <line x1="32" y1="24" x2="32" y2="14" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="11" r="4" fill="#FFC800" stroke="#000" strokeWidth="2" />
                <circle cx="32" cy="32" r="4" fill="#FFC800" stroke="#000" strokeWidth="2" />
            </svg>
        </motion.div>
    );
}

// ─── CARD WRAPPER ───────────────────────────────────
function NeoCard({ children, className, delay = 0, href }: { children: React.ReactNode; className?: string; delay?: number; href?: string }) {
    const content = (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: -3, y: -3, boxShadow: "7px 7px 0px 0px #000" }}
            whileTap={{ x: 0, y: 0, boxShadow: "3px 3px 0px 0px #000" }}
            className={cn(
                "relative bg-zinc-900 border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] p-5 sm:p-6 overflow-hidden transition-colors",
                className
            )}
        >
            {/* Noise texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );

    if (href) {
        return <a href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">{content}</a>;
    }
    return content;
}

// ─── MAIN CLIENT COMPONENT ──────────────────────────
export function ContactPageClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax for decorative elements
    const springConfig = { stiffness: 50, damping: 30 };
    const parallaxX = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig);
    const parallaxY = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), springConfig);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, [mouseX, mouseY]);

    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div ref={containerRef} className="relative min-h-screen bg-zinc-950 overflow-x-hidden pb-24 pt-6 sm:pt-14">

            {/* ──── STARFIELD (Canvas for perf) ──── */}
            <StarfieldCanvas />

            {/* ──── PARALLAX DECORATIONS ──── */}
            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <FloatingUFO className="top-[2%] right-[2%] sm:right-[5%] hidden sm:block" size={110} />
                <FloatingUFO className="bottom-[15%] left-[2%]" size={70} delay={2} />
                <FloatingPlanet className="top-[40%] left-[-40px] sm:left-[-20px]" />
            </motion.div>

            {/* ──── FLYING ROCKETS ──── */}
            <FlyingRocket direction="ltr" top="18%" delay={2} color="#FFC800" />
            <FlyingRocket direction="rtl" top="62%" delay={10} color="#FF90E8" />

            {/* ──── CONTENT ──── */}
            <motion.div
                className="relative z-10 container max-w-4xl mx-auto px-4 sm:px-6"
                variants={stagger}
                initial="hidden"
                animate="show"
            >
                {/* ── HEADER ── */}
                <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
                    <motion.div
                        className="inline-flex items-center gap-2 mb-5"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles className="w-5 h-5 text-[#FFC800]" />
                    </motion.div>

                    <h1 className="font-black uppercase tracking-tighter leading-[0.9] text-white" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>
                        <span className="text-[#FFC800]">İLETİ</span>ŞİM
                    </h1>

                    <p className="mt-5 text-zinc-400 font-semibold text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                        Evrenin herhangi bir köşesinden bize ulaşabilirsiniz.
                        Mesajınızı aldığımızda en kısa sürede geri döneceğiz.
                    </p>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <motion.div
                            className="h-[2.5px] w-20 bg-gradient-to-r from-transparent to-zinc-600"
                            initial={{ scaleX: 0, originX: 1 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        />
                        <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-[#FFC800] border-2 border-black"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="h-[2.5px] w-20 bg-gradient-to-l from-transparent to-zinc-600"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        />
                    </div>
                </motion.div>

                {/* ── CARDS GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

                    {/* Email */}
                    <NeoCard href="mailto:iletisim@fizikhub.com" className="bg-[#FFC800] hover:bg-[#ffda4a]" delay={0.2}>
                        <div className="flex items-start gap-4">
                            <motion.div
                                className="flex-shrink-0 w-14 h-14 rounded-full bg-black border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,0.2)]"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Mail className="w-7 h-7 text-[#FFC800]" strokeWidth={2.5} />
                            </motion.div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-1">E-Posta</span>
                                <span className="block text-lg sm:text-xl font-black text-black uppercase tracking-tight leading-tight">
                                    iletisim@<br />fizikhub.com
                                </span>
                                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-black/70 border-2 border-black rounded-full px-3 py-0.5 bg-white/50">
                                    Mesaj gönder <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </NeoCard>

                    {/* Location */}
                    <NeoCard delay={0.3}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#FFC800] border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0_#000]">
                                <MapPin className="w-7 h-7 text-black" strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Konum</span>
                                <span className="block text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight">
                                    İstanbul,<br />Türkiye
                                </span>
                                <span className="mt-2 inline-block text-xs font-bold text-zinc-400">
                                    GMT+3 · 🌍 Uzaydan da kabul
                                </span>
                            </div>
                        </div>
                    </NeoCard>
                </div>

                {/* ── SOCIAL ── */}
                <NeoCard delay={0.4} className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Sosyal Medya</p>
                    <div className="flex flex-wrap gap-3">
                        {[
                            {
                                label: "Twitter / X", href: "https://x.com/fizikhub", bg: "#000",
                                text: "text-white",
                                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zM17.08 20.25h1.833L7.084 4.126H5.117z" /></svg>
                            },
                            {
                                label: "Instagram", href: "https://instagram.com/fizikhub", bg: "#E1306C",
                                text: "text-white",
                                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            },
                            {
                                label: "E-Posta", href: "mailto:iletisim@fizikhub.com", bg: "#FFC800",
                                text: "text-black",
                                icon: <Mail className="w-5 h-5" strokeWidth={2.5} />
                            },
                        ].map((s, i) => (
                            <motion.a
                                key={i}
                                href={s.href}
                                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-[2.5px] border-black shadow-[3px_3px_0_#000] font-black text-sm uppercase tracking-wide",
                                    s.text
                                )}
                                style={{ background: s.bg }}
                                whileHover={{ x: -2, y: -2, boxShadow: "5px 5px 0 #000" }}
                                whileTap={{ x: 0, y: 0, boxShadow: "2px 2px 0 #000" }}
                            >
                                {s.icon}
                                {s.label}
                            </motion.a>
                        ))}
                    </div>
                </NeoCard>

                {/* ── RESPONSE TIME ── */}
                <NeoCard delay={0.5} className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Satellite className="flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Yanıt Süresi</p>
                            <p className="text-white font-black text-lg sm:text-xl uppercase tracking-tight leading-tight">
                                24–48 Saat İçinde
                            </p>
                            <p className="text-zinc-400 text-sm font-semibold mt-1">
                                Pazartesi – Cuma, 09:00 – 18:00
                            </p>
                        </div>
                        <div className="sm:ml-auto">
                            <motion.span
                                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5"
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                                Aktif
                            </motion.span>
                        </div>
                    </div>
                </NeoCard>

                {/* ── CTA BANNER ── */}
                <NeoCard delay={0.6} className="relative">
                    {/* Cosmic glow */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#FFC800]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-2 mb-3">
                        <Rocket className="w-5 h-5 text-[#FFC800]" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Fikir &amp; İş Birliği
                        </p>
                    </div>

                    <h2 className="font-black uppercase tracking-tighter text-white leading-tight text-2xl sm:text-3xl mb-2">
                        Bir projen mi var?
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base font-semibold leading-relaxed max-w-md">
                        Yazarlık başvurusu, reklam, iş birliği veya her türlü öneri için
                        aynı iletişim adreslerimize ulaşabilirsiniz.
                    </p>

                    <motion.a
                        href="mailto:iletisim@fizikhub.com"
                        className="mt-5 inline-flex items-center gap-2.5 bg-[#FFC800] border-[2.5px] border-black rounded-lg shadow-[3px_3px_0_#000] px-5 py-2.5 text-black font-black uppercase text-sm tracking-wide"
                        whileHover={{ x: -2, y: -2, boxShadow: "5px 5px 0 #000" }}
                        whileTap={{ x: 0, y: 0, boxShadow: "2px 2px 0 #000" }}
                    >
                        <Mail className="w-4 h-4" strokeWidth={2.5} />
                        Hemen Yaz
                        <ArrowUpRight className="w-4 h-4" />
                    </motion.a>
                </NeoCard>
            </motion.div>
        </div>
    );
}
