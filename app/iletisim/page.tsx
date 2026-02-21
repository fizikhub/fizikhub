import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
    title: "İletişim | Fizikhub",
    description: "Fizikhub ekibiyle iletişime geçin. Soru, görüş ve önerileriniz için bize ulaşın.",
    openGraph: {
        title: "İletişim — Fizikhub",
        description: "Fizikhub ekibiyle iletişime geçin. Soru, görüş ve önerileriniz için bize ulaşın.",
        type: "website",
        url: "https://fizikhub.com/iletisim",
    },
    alternates: { canonical: "https://fizikhub.com/iletisim" },
};

export default function ContactPage() {
    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'İletişim', href: '/iletisim' }]} />

            <style>{`
                /* ===== STARFIELD ===== */
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.4); }
                }
                @keyframes floatY {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-18px) rotate(3deg); }
                }
                @keyframes floatY2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-24px) rotate(-4deg); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(48px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(48px) rotate(-360deg); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes scanline {
                    0%   { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes ufoBeam {
                    0%, 100% { opacity: 0.08; height: 70px; }
                    50%       { opacity: 0.22; height: 100px; }
                }
                @keyframes rocketFly {
                    0%   { transform: translate(-60px, 80px) rotate(-30deg); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translate(calc(100vw + 60px), -80px) rotate(-30deg); opacity: 0; }
                }
                @keyframes rocketFly2 {
                    0%   { transform: translate(calc(100vw + 60px), 60px) rotate(150deg); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translate(-60px, -60px) rotate(150deg); opacity: 0; }
                }
                @keyframes pulseRing {
                    0%   { transform: scale(1);   opacity: 0.5; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(32px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes cardHoverIn {
                    to { transform: translate(-3px,-3px); box-shadow: 7px 7px 0 #000; }
                }
                @keyframes blink {
                    0%,100%{opacity:1}50%{opacity:0}
                }
                @keyframes saucerWobble {
                    0%,100%{transform:rotate(-4deg) translateY(0);}
                    50%    {transform:rotate(4deg)  translateY(-10px);}
                }
                @keyframes engineGlow {
                    0%,100%{opacity:0.6; transform:scaleX(1);}
                    50%{opacity:1; transform:scaleX(1.15);}
                }

                .star { animation: twinkle var(--dur, 3s) ease-in-out infinite var(--delay,0s); }
                .ufo-float { animation: floatY 5s ease-in-out infinite; }
                .planet-float { animation: floatY2 7s ease-in-out infinite; }
                .rocket-fly  { animation: rocketFly  18s linear infinite; }
                .rocket-fly2 { animation: rocketFly2 24s linear infinite 6s; }
                .spin-slow   { animation: spin 20s linear infinite; }
                .saucer-wobble { animation: saucerWobble 4s ease-in-out infinite; }
                .engine-glow   { animation: engineGlow 0.8s ease-in-out infinite; }

                .contact-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .contact-card:hover {
                    transform: translate(-3px,-3px);
                    box-shadow: 7px 7px 0 #000;
                }
                .contact-card:active {
                    transform: translate(0,0);
                    box-shadow: 3px 3px 0 #000;
                }
                .slide-up-1 { animation: slideUp 0.6s ease-out 0.1s both; }
                .slide-up-2 { animation: slideUp 0.6s ease-out 0.25s both; }
                .slide-up-3 { animation: slideUp 0.6s ease-out 0.4s both; }
                .slide-up-4 { animation: slideUp 0.6s ease-out 0.55s both; }
                .slide-up-5 { animation: slideUp 0.6s ease-out 0.7s both; }

                .pulse-ring::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 2px solid #FFC800;
                    animation: pulseRing 2s ease-out infinite;
                }
            `}</style>

            {/* ===== MAIN WRAPPER ===== */}
            <div className="relative min-h-screen bg-zinc-950 overflow-x-hidden pb-24 pt-8 sm:pt-16">

                {/* ===== STARFIELD ===== */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    {[
                        { top: '5%', left: '12%', size: 2, dur: '2.5s', delay: '0s' },
                        { top: '8%', left: '80%', size: 3, dur: '3.5s', delay: '0.3s' },
                        { top: '15%', left: '35%', size: 1, dur: '2s', delay: '0.8s' },
                        { top: '22%', left: '62%', size: 2, dur: '4s', delay: '0.5s' },
                        { top: '30%', left: '90%', size: 3, dur: '3s', delay: '1.2s' },
                        { top: '40%', left: '7%', size: 2, dur: '3.2s', delay: '0.2s' },
                        { top: '45%', left: '50%', size: 1, dur: '2.8s', delay: '1.5s' },
                        { top: '55%', left: '23%', size: 3, dur: '3.7s', delay: '0.4s' },
                        { top: '60%', left: '75%', size: 2, dur: '2.2s', delay: '0.9s' },
                        { top: '70%', left: '44%', size: 1, dur: '3.9s', delay: '1.8s' },
                        { top: '78%', left: '88%', size: 3, dur: '2.7s', delay: '0.6s' },
                        { top: '85%', left: '18%', size: 2, dur: '3.1s', delay: '1.1s' },
                        { top: '92%', left: '60%', size: 1, dur: '4.2s', delay: '0.7s' },
                        { top: '12%', left: '55%', size: 2, dur: '3.4s', delay: '2s' },
                        { top: '68%', left: '5%', size: 3, dur: '2.9s', delay: '1.4s' },
                        { top: '33%', left: '28%', size: 1, dur: '3.6s', delay: '0.1s' },
                        { top: '82%', left: '38%', size: 2, dur: '2.3s', delay: '1.7s' },
                        { top: '50%', left: '95%', size: 3, dur: '4.1s', delay: '0.3s' },
                        { top: '18%', left: '48%', size: 1, dur: '2.6s', delay: '1.3s' },
                        { top: '74%', left: '67%', size: 2, dur: '3.8s', delay: '0.5s' },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="star absolute rounded-full bg-white"
                            style={{
                                top: s.top,
                                left: s.left,
                                width: s.size,
                                height: s.size,
                                ['--dur' as any]: s.dur,
                                ['--delay' as any]: s.delay,
                            }}
                        />
                    ))}
                </div>

                {/* ===== FLYING ROCKET #1 ===== */}
                <div
                    className="rocket-fly absolute pointer-events-none"
                    style={{ top: '20%', left: 0, zIndex: 5 }}
                    aria-hidden="true"
                >
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        {/* Rocket body */}
                        <ellipse cx="28" cy="26" rx="9" ry="20" fill="#FFC800" stroke="#000" strokeWidth="2.5" />
                        {/* Nose */}
                        <polygon points="28,2 20,14 36,14" fill="#ff4444" stroke="#000" strokeWidth="2" />
                        {/* Fins */}
                        <polygon points="19,38 10,52 22,44" fill="#FFC800" stroke="#000" strokeWidth="2" />
                        <polygon points="37,38 46,52 34,44" fill="#FFC800" stroke="#000" strokeWidth="2" />
                        {/* Window */}
                        <circle cx="28" cy="26" r="5" fill="#23A9FA" stroke="#000" strokeWidth="2" />
                        {/* Engine */}
                        <ellipse cx="28" cy="48" rx="6" ry="4" fill="#ff8800" stroke="#000" strokeWidth="2" className="engine-glow" />
                        <ellipse cx="28" cy="52" rx="4" ry="3" fill="#ffcc00" className="engine-glow" style={{ animationDelay: '0.2s' }} />
                    </svg>
                </div>

                {/* ===== FLYING ROCKET #2 ===== */}
                <div
                    className="rocket-fly2 absolute pointer-events-none"
                    style={{ top: '65%', left: 0, zIndex: 5 }}
                    aria-hidden="true"
                >
                    <svg width="44" height="44" viewBox="0 0 56 56" fill="none">
                        <ellipse cx="28" cy="26" rx="9" ry="20" fill="#FF90E8" stroke="#000" strokeWidth="2.5" />
                        <polygon points="28,2 20,14 36,14" fill="#ffffff" stroke="#000" strokeWidth="2" />
                        <polygon points="19,38 10,52 22,44" fill="#FF90E8" stroke="#000" strokeWidth="2" />
                        <polygon points="37,38 46,52 34,44" fill="#FF90E8" stroke="#000" strokeWidth="2" />
                        <circle cx="28" cy="26" r="5" fill="#00F050" stroke="#000" strokeWidth="2" />
                        <ellipse cx="28" cy="48" rx="6" ry="4" fill="#ff8800" stroke="#000" strokeWidth="2" className="engine-glow" />
                    </svg>
                </div>

                {/* ===== UFO TOP-RIGHT ===== */}
                <div
                    className="ufo-float absolute pointer-events-none"
                    style={{ top: '4%', right: '3%', zIndex: 6 }}
                    aria-hidden="true"
                >
                    <svg width="110" height="80" viewBox="0 0 110 80" fill="none" className="saucer-wobble">
                        {/* Beam */}
                        <polygon points="32,52 78,52 62,150 48,150" fill="#FFC800" opacity="0.12" className="engine-glow" />
                        {/* Saucer base */}
                        <ellipse cx="55" cy="54" rx="40" ry="10" fill="#27272a" stroke="#000" strokeWidth="2.5" />
                        {/* Dome */}
                        <ellipse cx="55" cy="44" rx="24" ry="16" fill="#23A9FA" stroke="#000" strokeWidth="2.5" />
                        {/* Dome shine */}
                        <ellipse cx="48" cy="38" rx="8" ry="5" fill="white" opacity="0.25" />
                        {/* Lights */}
                        {[20, 36, 55, 74, 90].map((x, i) => (
                            <circle key={i} cx={x} cy="54" r="4" fill={['#FFC800', '#FF90E8', '#00F050', '#23A9FA', '#ff4444'][i]} stroke="#000" strokeWidth="1.5"
                                style={{ animation: `twinkle ${1.2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s` }} />
                        ))}
                        {/* Antenna */}
                        <line x1="55" y1="28" x2="55" y2="16" stroke="#000" strokeWidth="2.5" />
                        <circle cx="55" cy="13" r="5" fill="#FFC800" stroke="#000" strokeWidth="2" />
                    </svg>
                </div>

                {/* ===== PLANET LEFT ===== */}
                <div
                    className="planet-float absolute pointer-events-none"
                    style={{ top: '50%', left: '-30px', zIndex: 2 }}
                    aria-hidden="true"
                >
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        {/* Planet body */}
                        <circle cx="60" cy="60" r="50" fill="#1e1b4b" stroke="#000" strokeWidth="3" />
                        {/* Surface details */}
                        <ellipse cx="40" cy="45" rx="12" ry="8" fill="#312e81" opacity="0.7" />
                        <ellipse cx="70" cy="70" rx="18" ry="10" fill="#4338ca" opacity="0.5" />
                        <circle cx="55" cy="30" r="8" fill="#3730a3" opacity="0.6" />
                        {/* Shine */}
                        <ellipse cx="40" cy="35" rx="14" ry="9" fill="white" opacity="0.07" />
                        {/* Ring */}
                        <ellipse cx="60" cy="60" rx="75" ry="16" fill="none" stroke="#FFC800" strokeWidth="3" opacity="0.5" />
                        <ellipse cx="60" cy="60" rx="75" ry="16" fill="none" stroke="#000" strokeWidth="5" opacity="0.3" strokeDasharray="30 20" />
                        {/* Orbiting moon */}
                        <g style={{ animation: 'orbit 8s linear infinite', transformOrigin: '60px 60px' }}>
                            <circle cx="108" cy="60" r="7" fill="#e4e4e7" stroke="#000" strokeWidth="2" />
                        </g>
                    </svg>
                </div>

                {/* ===== SMALL UFO BOTTOM-LEFT ===== */}
                <div
                    className="ufo-float absolute pointer-events-none"
                    style={{ bottom: '10%', left: '5%', zIndex: 5, animationDelay: '1.5s' }}
                    aria-hidden="true"
                >
                    <svg width="64" height="42" viewBox="0 0 64 42" fill="none">
                        <polygon points="18,30 46,30 38,70 26,70" fill="#FF90E8" opacity="0.15" />
                        <ellipse cx="32" cy="30" rx="24" ry="6" fill="#27272a" stroke="#000" strokeWidth="2" />
                        <ellipse cx="32" cy="24" rx="14" ry="10" fill="#00F050" stroke="#000" strokeWidth="2" />
                        <ellipse cx="28" cy="20" rx="5" ry="3" fill="white" opacity="0.3" />
                        {[12, 24, 32, 40, 52].map((x, i) => (
                            <circle key={i} cx={x} cy="30" r="3" fill={['#FFC800', '#00F050', '#23A9FA', '#FF90E8', '#ff4444'][i]} stroke="#000" strokeWidth="1.5"
                                style={{ animation: `twinkle ${1 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }} />
                        ))}
                        <line x1="32" y1="14" x2="32" y2="7" stroke="#000" strokeWidth="2" />
                        <circle cx="32" cy="5" r="3" fill="#FFC800" stroke="#000" strokeWidth="1.5" />
                    </svg>
                </div>

                {/* ===== CONTENT ===== */}
                <div className="relative z-10 container max-w-4xl mx-auto px-4 sm:px-6">

                    {/* ===== HEADER ===== */}
                    <div className="text-center mb-10 sm:mb-16 slide-up-1">
                        {/* Pill badge */}
                        <div className="inline-flex items-center gap-2 bg-zinc-900 border-[2.5px] border-black shadow-[3px_3px_0_#000] rounded-full px-4 py-1.5 mb-5">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-400" style={{ animation: 'blink 1.4s step-end infinite' }} />
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Sinyalimiz Açık</span>
                        </div>

                        <h1 className="font-black uppercase tracking-tighter leading-none text-white" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}>
                            <span className="text-[#FFC800]">İLETİ</span>ŞİM
                        </h1>
                        <p className="mt-4 text-zinc-400 font-semibold text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                            Evrenin herhangi bir köşesinden mesaj gönderebilirsiniz. Sinyalinizi
                            aldığımızda en kısa sürede geri döneceğiz.
                        </p>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <div className="h-[2px] w-16 bg-zinc-700" />
                            <div className="w-2 h-2 rounded-full bg-[#FFC800] border border-black" />
                            <div className="h-[2px] w-16 bg-zinc-700" />
                        </div>
                    </div>

                    {/* ===== CARDS GRID ===== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

                        {/* Email Card */}
                        <a
                            href="mailto:iletisim@fizikhub.com"
                            className="contact-card block bg-[#FFC800] border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] p-6 slide-up-2"
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-black border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,0.2)] pulse-ring">
                                        <svg className="w-7 h-7 text-[#FFC800]" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M3 8l9 6 9-6M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-black/60 mb-1">E-Posta</span>
                                    <span className="block text-xl font-black text-black uppercase tracking-tight leading-tight">
                                        iletisim@<br />fizikhub.com
                                    </span>
                                    <span className="mt-2 inline-block text-xs font-bold text-black/70 border-2 border-black rounded-full px-3 py-0.5 bg-white/60">
                                        Mesaj gönder →
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Location Card */}
                        <div className="contact-card bg-zinc-900 border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] p-6 slide-up-2">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-[#FFC800] border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0_#000]">
                                        <svg className="w-7 h-7 text-black" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Konumuz</span>
                                    <span className="block text-xl font-black text-white uppercase tracking-tight leading-tight">
                                        İstanbul,<br />Türkiye
                                    </span>
                                    <span className="mt-2 inline-block text-xs font-bold text-zinc-400">
                                        GMT+3 · 🌍 Uzaydan da memnuniyetle
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== SOCIAL ROW ===== */}
                    <div className="mb-8 slide-up-3">
                        <div className="bg-zinc-900 border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Sosyal Medya</p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    {
                                        label: 'Twitter / X', href: 'https://x.com/fizikhub', color: '#000',
                                        icon: (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zM17.08 20.25h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        ),
                                        textColor: 'text-white'
                                    },
                                    {
                                        label: 'Instagram', href: 'https://instagram.com/fizikhub', color: '#E1306C',
                                        icon: (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                            </svg>
                                        ),
                                        textColor: 'text-white'
                                    },
                                    {
                                        label: 'E-Posta', href: 'mailto:iletisim@fizikhub.com', color: '#FFC800',
                                        icon: (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
                                                <path d="M3 8l9 6 9-6M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                                            </svg>
                                        ),
                                        textColor: 'text-black'
                                    },
                                ].map((s, i) => (
                                    <a
                                        key={i}
                                        href={s.href}
                                        target={s.href.startsWith('mailto') ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        className={`contact-card flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-[2.5px] border-black shadow-[3px_3px_0_#000] font-black text-sm uppercase tracking-wide ${s.textColor}`}
                                        style={{ background: s.color }}
                                    >
                                        {s.icon}
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== WORKING HOURS STRIP ===== */}
                    <div className="slide-up-4">
                        <div className="bg-zinc-900 border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Animated satellite */}
                            <div className="flex-shrink-0" aria-hidden="true">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="spin-slow">
                                    {/* Main body */}
                                    <rect x="24" y="24" width="16" height="16" rx="3" fill="#27272a" stroke="#000" strokeWidth="2.5" />
                                    {/* Solar panels */}
                                    <rect x="2" y="27" width="18" height="10" rx="2" fill="#23A9FA" stroke="#000" strokeWidth="2" />
                                    <rect x="44" y="27" width="18" height="10" rx="2" fill="#23A9FA" stroke="#000" strokeWidth="2" />
                                    {/* Panel dividers */}
                                    <line x1="2" y1="32" x2="20" y2="32" stroke="#000" strokeWidth="1.5" />
                                    <line x1="44" y1="32" x2="62" y2="32" stroke="#000" strokeWidth="1.5" />
                                    {/* Antenna */}
                                    <line x1="32" y1="24" x2="32" y2="12" stroke="#000" strokeWidth="2.5" />
                                    <circle cx="32" cy="10" r="4" fill="#FFC800" stroke="#000" strokeWidth="2" />
                                    {/* Thruster */}
                                    <circle cx="32" cy="32" r="4" fill="#FFC800" stroke="#000" strokeWidth="2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Yanıt Süresi</p>
                                <p className="text-white font-black text-lg uppercase tracking-tight leading-tight">
                                    24–48 Saat İçinde
                                </p>
                                <p className="text-zinc-400 text-sm font-semibold mt-1">
                                    Pazartesi – Cuma, 09:00 – 18:00
                                </p>
                            </div>

                            <div className="sm:ml-auto">
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" style={{ animation: 'blink 1.4s step-end infinite' }} />
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ===== SPACE ILLUSTRATION BANNER ===== */}
                    <div className="mt-8 slide-up-5">
                        <div className="relative bg-zinc-950 border-[3px] border-black rounded-[10px] shadow-[4px_4px_0_#000] overflow-hidden p-6 sm:p-8">

                            {/* Mini stars inside banner */}
                            {[[7, '12%'], [91, '28%'], [42, '8%'], [73, '45%'], [18, '38%'], [60, '55%']].map(([l, t], i) => (
                                <div key={i} className="star absolute rounded-full bg-white" style={{
                                    left: `${l}%`, top: t, width: i % 2 ? 2 : 1, height: i % 2 ? 2 : 1,
                                    ['--dur' as any]: `${2 + i * 0.5}s`,
                                    ['--delay' as any]: `${i * 0.3}s`
                                }} />
                            ))}

                            {/* Small planet top-right of banner */}
                            <div className="absolute top-2 right-4 pointer-events-none" aria-hidden="true" style={{ animation: 'floatY2 6s ease-in-out infinite 2s' }}>
                                <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                                    <circle cx="27" cy="27" r="22" fill="#1e1b4b" stroke="#000" strokeWidth="2.5" />
                                    <ellipse cx="20" cy="20" rx="6" ry="4" fill="#312e81" opacity="0.7" />
                                    <ellipse cx="34" cy="32" rx="8" ry="5" fill="#4338ca" opacity="0.5" />
                                    <ellipse cx="27" cy="27" rx="33" ry="7" fill="none" stroke="#FFC800" strokeWidth="2" opacity="0.4" />
                                    <ellipse cx="18" cy="16" rx="6" ry="4" fill="white" opacity="0.06" />
                                </svg>
                            </div>

                            {/* Text */}
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                                    🚀 Fikir &amp; İş Birliği
                                </p>
                                <h2 className="font-black uppercase tracking-tighter text-white leading-tight text-2xl sm:text-3xl mb-2">
                                    Bir projen mi var?
                                </h2>
                                <p className="text-zinc-400 text-sm sm:text-base font-semibold leading-relaxed max-w-md">
                                    Yazarlık başvurusu, reklam, iş birliği veya her türlü öneri için
                                    aynı iletişim adreslerimize ulaşabilirsiniz. Sinyalinizi kaçırmayız.
                                </p>
                                <a
                                    href="mailto:iletisim@fizikhub.com"
                                    className="contact-card mt-5 inline-flex items-center gap-2.5 bg-[#FFC800] border-[2.5px] border-black rounded-lg shadow-[3px_3px_0_#000] px-5 py-2.5 text-black font-black uppercase text-sm tracking-wide"
                                >
                                    <svg className="w-4 h-4" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M3 8l9 6 9-6M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                                    </svg>
                                    Hemen Yaz
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
