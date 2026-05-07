"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

const NAV_SECTIONS = [
    {
        title: "İçerik",
        links: [
            { label: "Kütüphane", href: "/makale" },
            { label: "Simülasyon", href: "/simulasyonlar" },
            { label: "Sözlük", href: "/sozluk" },
        ],
    },
    {
        title: "Topluluk",
        links: [
            { label: "Forum", href: "/forum" },
            { label: "Sıralama", href: "/siralamalar" },
            { label: "Hakkımızda", href: "/hakkimizda" },
        ],
    },
];

const UTILITY_LINKS = [
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik", href: "/gizlilik-politikasi" },
    { label: "Şartlar", href: "/kullanim-sartlari" },
    { label: "KVKK", href: "/kvkk" },
];

const SOCIAL_LINKS = [
    { icon: Twitter, href: "https://twitter.com/fizikhub", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/fizikhub", label: "Instagram" },
    { icon: Github, href: "https://github.com/fizikhub", label: "Github" },
    { icon: Youtube, href: "https://youtube.com/fizikhub", label: "Youtube" },
];

const UFOAlien = () => (
    <svg
        viewBox="0 0 260 210"
        width="260"
        height="210"
        aria-hidden="true"
        className="h-[150px] w-[190px] overflow-visible sm:h-[188px] sm:w-[232px] lg:h-[210px] lg:w-[260px]"
    >
        <defs>
            <filter id="footerUfoShadow" x="-30%" y="-35%" width="160%" height="190%">
                <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.42" />
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#86efac" floodOpacity="0.2" />
            </filter>
            <linearGradient id="footerGlass" x1="88" y1="10" x2="170" y2="104" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.88" />
                <stop offset="0.42" stopColor="#b7f7d4" stopOpacity="0.34" />
                <stop offset="1" stopColor="#111827" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="footerBeam" x1="130" y1="99" x2="130" y2="210" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#86efac" stopOpacity="0.44" />
                <stop offset="0.55" stopColor="#22c55e" stopOpacity="0.16" />
                <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="footerSaucerTop" x1="45" y1="70" x2="214" y2="127" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#18181b" />
                <stop offset="0.22" stopColor="#5f646d" />
                <stop offset="0.5" stopColor="#c7ccd3" />
                <stop offset="0.78" stopColor="#5f646d" />
                <stop offset="1" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="footerSaucerLip" x1="33" y1="86" x2="227" y2="139" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1f2937" />
                <stop offset="0.34" stopColor="#71717a" />
                <stop offset="0.64" stopColor="#d4d4d8" />
                <stop offset="1" stopColor="#27272a" />
            </linearGradient>
            <radialGradient id="footerAlienSkin" cx="35%" cy="24%" r="78%">
                <stop offset="0" stopColor="#d9f99d" />
                <stop offset="0.35" stopColor="#7ee787" />
                <stop offset="0.72" stopColor="#22c55e" />
                <stop offset="1" stopColor="#166534" />
            </radialGradient>
            <radialGradient id="footerAlienEye" cx="34%" cy="28%" r="72%">
                <stop offset="0" stopColor="#f8fafc" stopOpacity="0.85" />
                <stop offset="0.18" stopColor="#0f172a" />
                <stop offset="1" stopColor="#020617" />
            </radialGradient>
            <radialGradient id="footerCoreLight" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fef08a" />
                <stop offset="0.55" stopColor="#facc15" />
                <stop offset="1" stopColor="#ca8a04" />
            </radialGradient>
            <clipPath id="footerDomeClip">
                <path d="M72 80 C73 31 99 10 130 10 C161 10 187 31 188 80 C171 88 89 88 72 80 Z" />
            </clipPath>
        </defs>

        <g filter="url(#footerUfoShadow)">
            <motion.path
                d="M86 101 L26 210 H234 L174 101 Z"
                fill="url(#footerBeam)"
                initial={{ opacity: 0.42, scaleY: 0.94 }}
                animate={{ opacity: [0.28, 0.5, 0.32], scaleY: [0.9, 1.04, 0.96] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "130px 101px" }}
            />
            <motion.path
                d="M97 104 L62 210 H198 L163 104 Z"
                fill="#bbf7d0"
                opacity="0.14"
                initial={{ opacity: 0.12 }}
                animate={{ opacity: [0.08, 0.2, 0.1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <g clipPath="url(#footerDomeClip)">
                <motion.g
                    animate={{ y: [0, -1.8, 0], rotate: [-0.5, 0.5, -0.5] }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "130px 66px" }}
                >
                    <path d="M98 87 C97 69 109 60 130 60 C151 60 163 69 162 87 Z" fill="#14532d" opacity="0.9" />
                    <path d="M93 58 C90 35 106 24 130 24 C154 24 170 35 167 58 C169 76 153 90 130 90 C107 90 91 76 93 58 Z" fill="url(#footerAlienSkin)" stroke="#052e16" strokeWidth="2.5" />
                    <path d="M104 35 C110 24 124 20 137 24" fill="none" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
                    <ellipse cx="114" cy="55" rx="10" ry="17" fill="url(#footerAlienEye)" transform="rotate(-17 114 55)" />
                    <ellipse cx="146" cy="55" rx="10" ry="17" fill="url(#footerAlienEye)" transform="rotate(17 146 55)" />
                    <circle cx="117" cy="49" r="2.6" fill="#ffffff" opacity="0.9" />
                    <circle cx="143" cy="49" r="2.6" fill="#ffffff" opacity="0.9" />
                    <path d="M121 74 C126 78 134 78 139 74" fill="none" stroke="#064e3b" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M97 44 C88 36 83 28 80 18" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
                    <path d="M163 44 C172 36 177 28 180 18" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="79" cy="16" r="4.5" fill="#bef264" stroke="#365314" strokeWidth="2" />
                    <circle cx="181" cy="16" r="4.5" fill="#bef264" stroke="#365314" strokeWidth="2" />
                </motion.g>

                <path d="M72 80 C73 31 99 10 130 10 C161 10 187 31 188 80 C171 88 89 88 72 80 Z" fill="url(#footerGlass)" stroke="#f8fafc" strokeOpacity="0.68" strokeWidth="2.4" />
                <path d="M90 40 C100 19 134 12 159 27" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.32" />
                <path d="M161 37 C172 48 177 62 177 75" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.22" />
            </g>

            <ellipse cx="130" cy="97" rx="105" ry="31" fill="url(#footerSaucerLip)" stroke="#050505" strokeWidth="5" />
            <ellipse cx="130" cy="88" rx="82" ry="19" fill="url(#footerSaucerTop)" stroke="#111111" strokeWidth="4" />
            <ellipse cx="130" cy="84" rx="56" ry="10" fill="#27272a" stroke="#111111" strokeWidth="3" opacity="0.96" />
            <path d="M36 101 C76 124 184 124 224 101" fill="none" stroke="#111827" strokeOpacity="0.62" strokeWidth="4" strokeLinecap="round" />
            <path d="M54 87 C95 71 165 71 206 87" fill="none" stroke="#f4f4f5" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />

            {[
                { cx: 48, cy: 96, fill: "#ef4444", delay: 0 },
                { cx: 87, cy: 113, fill: "#facc15", delay: 0.35 },
                { cx: 130, cy: 119, fill: "#60a5fa", delay: 0.7 },
                { cx: 173, cy: 113, fill: "#facc15", delay: 1.05 },
                { cx: 212, cy: 96, fill: "#ef4444", delay: 1.4 },
            ].map((light) => (
                <motion.g
                    key={`${light.cx}-${light.cy}`}
                    animate={{ opacity: [0.55, 1, 0.7], scale: [0.92, 1.16, 0.96] }}
                    transition={{ duration: 1.9, delay: light.delay, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: `${light.cx}px ${light.cy}px` }}
                >
                    <circle cx={light.cx} cy={light.cy} r="10" fill={light.fill} opacity="0.16" />
                    <circle cx={light.cx} cy={light.cy} r="5.8" fill={light.fill} stroke="#111111" strokeWidth="1.6" />
                </motion.g>
            ))}
            <motion.circle
                cx="130"
                cy="103"
                r="9"
                fill="url(#footerCoreLight)"
                animate={{ opacity: [0.72, 1, 0.78], scale: [0.96, 1.1, 0.98] }}
                transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "130px 103px" }}
            />
        </g>
    </svg>
);

export function Footer() {
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="relative w-full overflow-hidden border-t-[4px] border-black bg-zinc-100 px-5 pb-28 pt-12 text-foreground dark:border-zinc-800 dark:bg-[#202020] sm:px-8 md:pb-12 md:pt-14">
            
            {/* Grainy Paper Noise Background */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.08]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                }}
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0)_32%),radial-gradient(circle_at_50%_18%,rgba(250,204,21,0.16),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:auto,auto,44px_44px,44px_44px] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_35%),radial-gradient(circle_at_50%_18%,rgba(134,239,172,0.12),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-px w-[min(92vw,1180px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent opacity-70" />

            {/* Wobbly UFO Animation (Soft & Natural) */}
            <motion.div
                initial={shouldReduceMotion ? false : { x: "-22vw", y: 0 }}
                animate={
                    shouldReduceMotion
                        ? { x: "48vw", y: 6, rotate: 0 }
                        : {
                            x: ["-22vw", "26vw", "58vw", "122vw"],
                            y: [4, -14, 10, -6],
                            rotate: [-2.5, 2.2, -1.5, 2.5],
                        }
                }
                transition={
                    shouldReduceMotion
                        ? undefined
                        : {
                            x: { duration: 38, ease: "linear", repeat: Infinity },
                            y: { duration: 7.5, ease: "easeInOut", repeat: Infinity },
                            rotate: { duration: 8.5, ease: "easeInOut", repeat: Infinity },
                        }
                }
                className="pointer-events-none absolute top-12 z-0 opacity-55 mix-blend-multiply dark:opacity-55 dark:mix-blend-screen sm:top-14"
            >
                <UFOAlien />
            </motion.div>

            <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
                
                {/* Brand & Slogan Section */}
                <div className="flex flex-col gap-6 lg:max-w-xl">
                    <Link
                        href="/"
                        className="inline-flex shrink-0 transition-transform hover:-translate-y-1"
                        aria-label="FizikHub ana sayfa"
                    >
                        <DankLogo />
                    </Link>
                    
                    <div className="space-y-3">
                        <h2 className="max-w-[720px] text-[1.85rem] font-black uppercase leading-[1.02] tracking-normal sm:text-[2.6rem] lg:text-[3.1rem]">
                            BİLİMİ <span className="text-[#FACC15] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Tİ&apos;YE ALIYORUZ</span> AMA CİDDİLİ ŞEKİLDE.
                        </h2>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="grid w-full grid-cols-2 gap-8 sm:w-auto sm:min-w-[440px] sm:gap-14">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title} className="flex flex-col gap-4">
                            <h3 className="text-lg font-black uppercase tracking-normal sm:text-xl">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-1 text-[1.05rem] font-bold uppercase tracking-normal text-zinc-600 transition-colors hover:text-[#FACC15] dark:text-zinc-400 dark:hover:text-[#FACC15]"
                                        >
                                            <span>{link.label}</span>
                                            <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Utility Bar */}
            <div className="relative z-20 mx-auto mt-12 flex w-full max-w-[1400px] flex-col gap-8 border-t-[3px] border-black/10 pt-8 dark:border-white/10 lg:mt-16">
                
                {/* Top part of Bottom Bar: Legal Text & Socials */}
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <p className="text-center text-[0.95rem] font-bold uppercase tracking-normal text-zinc-500 dark:text-zinc-400 md:text-left">
                        İzinsiz kullananı kara deliğe atarız.
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex shrink-0 gap-3">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className={cn(
                                    "group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-[2px] sm:border-[3px] border-black bg-white transition-all duration-200",
                                    "shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                                    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:shadow-[3px_3px_0px_0px_#27272a] sm:dark:shadow-[4px_4px_0px_0px_#27272a] dark:hover:shadow-none"
                                )}
                            >
                                <social.icon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5px] transition-transform group-hover:scale-110" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom part: Copyright and Legal Links */}
                <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
                    <p className="text-[12px] font-black uppercase tracking-wider text-zinc-500">
                        FizikHub © {year}
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                        {UTILITY_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-[12px] font-black uppercase tracking-wider text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
