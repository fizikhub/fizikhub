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
            { label: "Konu Rehberi", href: "/konular" },
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
        className="h-[128px] w-[158px] overflow-visible sm:h-[144px] sm:w-[178px] lg:h-[164px] lg:w-[202px]"
    >
        <defs>
            <filter id="footerUfoShadow" x="-30%" y="-35%" width="160%" height="190%">
                <feDropShadow dx="0" dy="13" stdDeviation="13" floodColor="#000000" floodOpacity="0.52" />
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#86efac" floodOpacity="0.2" />
            </filter>
            <filter id="footerSoftGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="footerDomeSheen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.45" />
            </filter>
            <linearGradient id="footerGlass" x1="86" y1="12" x2="171" y2="101" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.88" />
                <stop offset="0.38" stopColor="#b7f7d4" stopOpacity="0.36" />
                <stop offset="1" stopColor="#0f172a" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="footerBeam" x1="130" y1="104" x2="130" y2="210" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#bbf7d0" stopOpacity="0.34" />
                <stop offset="0.5" stopColor="#4ade80" stopOpacity="0.13" />
                <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="footerSaucerTop" x1="42" y1="70" x2="218" y2="129" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0f1115" />
                <stop offset="0.2" stopColor="#5b616b" />
                <stop offset="0.5" stopColor="#e4e7ec" />
                <stop offset="0.8" stopColor="#5f6670" />
                <stop offset="1" stopColor="#111317" />
            </linearGradient>
            <linearGradient id="footerSaucerLip" x1="33" y1="86" x2="227" y2="139" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#151923" />
                <stop offset="0.28" stopColor="#5f6672" />
                <stop offset="0.55" stopColor="#cbd5e1" />
                <stop offset="0.78" stopColor="#626a75" />
                <stop offset="1" stopColor="#171a20" />
            </linearGradient>
            <linearGradient id="footerSaucerUnderside" x1="60" y1="111" x2="200" y2="139" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#111827" />
                <stop offset="0.5" stopColor="#3f3f46" />
                <stop offset="1" stopColor="#111827" />
            </linearGradient>
            <radialGradient id="footerAlienSkin" cx="35%" cy="24%" r="78%">
                <stop offset="0" stopColor="#d9f99d" />
                <stop offset="0.35" stopColor="#7ee787" />
                <stop offset="0.72" stopColor="#22c55e" />
                <stop offset="1" stopColor="#166534" />
            </radialGradient>
            <radialGradient id="footerAlienEye" cx="34%" cy="25%" r="72%">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="0.13" stopColor="#172554" />
                <stop offset="0.58" stopColor="#020617" />
                <stop offset="1" stopColor="#020617" />
            </radialGradient>
            <radialGradient id="footerCoreLight" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff7ad" />
                <stop offset="0.55" stopColor="#facc15" />
                <stop offset="1" stopColor="#ca8a04" />
            </radialGradient>
            <clipPath id="footerDomeClip">
                <path d="M72 80 C73 31 99 10 130 10 C161 10 187 31 188 80 C171 88 89 88 72 80 Z" />
            </clipPath>
            <clipPath id="footerSaucerClip">
                <ellipse cx="130" cy="98" rx="104" ry="30" />
            </clipPath>
        </defs>

        <g filter="url(#footerUfoShadow)">
            <motion.path
                d="M88 103 L40 210 H220 L172 103 Z"
                fill="url(#footerBeam)"
                initial={{ opacity: 0.28, scaleY: 0.96 }}
                animate={{ opacity: [0.18, 0.34, 0.2], scaleY: [0.94, 1.02, 0.96] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "130px 103px" }}
            />
            <motion.path
                d="M106 106 L82 210 H178 L154 106 Z"
                fill="#bbf7d0"
                initial={{ opacity: 0.08 }}
                animate={{ opacity: [0.05, 0.16, 0.07] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <g clipPath="url(#footerDomeClip)">
                <motion.g
                    animate={{ y: [0, -1.2, 0], rotate: [-0.35, 0.35, -0.35] }}
                    transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "130px 66px" }}
                >
                    <path d="M101 88 C100 70 111 61 130 61 C149 61 160 70 159 88 Z" fill="#14532d" opacity="0.88" />
                    <path d="M96 58 C93 37 108 26 130 26 C152 26 167 37 164 58 C166 75 151 88 130 88 C109 88 94 75 96 58 Z" fill="url(#footerAlienSkin)" stroke="#052e16" strokeWidth="2.5" />
                    <path d="M107 37 C113 27 125 24 137 27" fill="none" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" opacity="0.38" />
                    <path d="M99 68 C91 75 88 82 90 91" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.38" />
                    <path d="M161 68 C169 75 172 82 170 91" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.38" />
                    <ellipse cx="116" cy="56" rx="8.6" ry="15" fill="url(#footerAlienEye)" transform="rotate(-15 116 56)" />
                    <ellipse cx="144" cy="56" rx="8.6" ry="15" fill="url(#footerAlienEye)" transform="rotate(15 144 56)" />
                    <circle cx="118.5" cy="50" r="2.1" fill="#ffffff" opacity="0.92" />
                    <circle cx="141.5" cy="50" r="2.1" fill="#ffffff" opacity="0.92" />
                    <path d="M122 73 C127 76 133 76 138 73" fill="none" stroke="#064e3b" strokeWidth="2.4" strokeLinecap="round" />
                </motion.g>

                <path d="M72 80 C73 31 99 10 130 10 C161 10 187 31 188 80 C171 88 89 88 72 80 Z" fill="url(#footerGlass)" stroke="#f8fafc" strokeOpacity="0.68" strokeWidth="2.4" />
                <path d="M91 39 C101 20 134 13 158 27" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
                <path d="M161 37 C172 48 177 62 177 75" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.22" />
                <path d="M178 48 C183 59 184 69 181 78" fill="none" stroke="#ecfeff" strokeWidth="1.8" strokeLinecap="round" opacity="0.32" filter="url(#footerDomeSheen)" />
            </g>

            <ellipse cx="130" cy="111" rx="72" ry="17" fill="url(#footerSaucerUnderside)" opacity="0.72" />
            <ellipse cx="130" cy="98" rx="104" ry="30" fill="url(#footerSaucerLip)" stroke="#050505" strokeWidth="5" />
            <g clipPath="url(#footerSaucerClip)" opacity="0.42">
                <path d="M40 95 H220" stroke="#f8fafc" strokeWidth="2" opacity="0.3" />
                <path d="M58 112 C92 123 168 123 202 112" fill="none" stroke="#020617" strokeWidth="3" opacity="0.45" />
                <path d="M78 83 C101 77 159 77 182 83" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.25" />
            </g>
            <ellipse cx="130" cy="89" rx="80" ry="18" fill="url(#footerSaucerTop)" stroke="#111111" strokeWidth="4" />
            <ellipse cx="130" cy="85" rx="55" ry="9.5" fill="#27272a" stroke="#111111" strokeWidth="3" opacity="0.96" />
            <path d="M39 101 C80 122 180 122 221 101" fill="none" stroke="#111827" strokeOpacity="0.62" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M58 88 C97 74 163 74 202 88" fill="none" stroke="#f4f4f5" strokeOpacity="0.24" strokeWidth="3" strokeLinecap="round" />
            <path d="M85 96 C105 101 155 101 175 96" fill="none" stroke="#020617" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />

            {[
                { cx: 49, cy: 96, fill: "#ef4444", delay: 0 },
                { cx: 88, cy: 112, fill: "#facc15", delay: 0.55 },
                { cx: 130, cy: 116, fill: "#60a5fa", delay: 1.1 },
                { cx: 172, cy: 112, fill: "#facc15", delay: 1.65 },
                { cx: 211, cy: 96, fill: "#ef4444", delay: 2.2 },
            ].map((light) => (
                <motion.g
                    key={`${light.cx}-${light.cy}`}
                    animate={{ opacity: [0.55, 0.95, 0.62], scale: [0.96, 1.08, 0.98] }}
                    transition={{ duration: 2.8, delay: light.delay, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: `${light.cx}px ${light.cy}px` }}
                >
                    <circle cx={light.cx} cy={light.cy} r="8" fill={light.fill} opacity="0.14" filter="url(#footerSoftGlow)" />
                    <circle cx={light.cx} cy={light.cy} r="5.2" fill={light.fill} stroke="#111111" strokeWidth="1.5" />
                </motion.g>
            ))}
            <motion.circle
                cx="130"
                cy="102"
                r="7"
                fill="url(#footerCoreLight)"
                animate={{ opacity: [0.62, 0.92, 0.68], scale: [0.97, 1.08, 0.99] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "130px 102px" }}
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
        <footer className="relative w-full overflow-hidden border-t-[4px] border-black bg-background px-5 pb-28 pt-12 text-foreground dark:border-zinc-800 sm:px-8 md:pb-12 md:pt-14">
            
            {/* Grainy Paper Noise Background */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Wobbly UFO Animation (Soft & Natural) */}
            <motion.div
                initial={shouldReduceMotion ? false : { x: "-18vw", y: 0, rotate: -1.2 }}
                animate={
                    shouldReduceMotion
                        ? { x: "48vw", y: 0, rotate: 0 }
                        : {
                            x: ["-18vw", "14vw", "44vw", "76vw", "118vw"],
                            y: [0, -8, 4, -6, 0],
                            rotate: [-1.2, 1.1, -0.8, 1.2, -1],
                        }
                }
                transition={
                    shouldReduceMotion
                        ? undefined
                        : {
                            x: { duration: 32, ease: "linear", repeat: Infinity },
                            y: { duration: 7.5, ease: "easeInOut", repeat: Infinity },
                            rotate: { duration: 9, ease: "easeInOut", repeat: Infinity },
                        }
                }
                className="absolute top-10 sm:top-20 z-0 pointer-events-none opacity-40 dark:opacity-30"
            >
                <UFOAlien />
            </motion.div>

            <div className="relative z-20 mx-auto grid w-full max-w-[1400px] gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start lg:gap-20">
                
                {/* Brand & Slogan Section */}
                <div className="flex flex-col gap-6 md:max-w-[640px] lg:max-w-[720px]">
                    <Link
                        href="/"
                        className="inline-flex shrink-0 transition-transform hover:-translate-y-1"
                        aria-label="FizikHub ana sayfa"
                    >
                        <DankLogo />
                    </Link>
                    
                    <div className="space-y-3">
                        <h2 className="max-w-[720px] text-[1.9rem] font-black uppercase leading-[1.03] tracking-tight sm:text-[2.5rem] lg:text-[3rem]">
                            BİLİMİ <span className="text-[#FACC15] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Tİ&apos;YE ALIYORUZ</span> AMA CİDDİLİ ŞEKİLDE.
                        </h2>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="grid w-full grid-cols-2 gap-8 sm:w-auto sm:min-w-[420px] sm:gap-14">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title} className="flex flex-col gap-4">
                            <h3 className="text-xl font-black uppercase tracking-normal text-zinc-950 dark:text-white">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-1.5 text-[1.02rem] font-black uppercase tracking-normal text-zinc-500 transition-colors hover:text-[#FACC15] dark:text-zinc-400 dark:hover:text-[#FACC15]"
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
                    <p className="text-center text-[0.95rem] font-black uppercase tracking-normal text-zinc-500 dark:text-zinc-400 md:text-left">
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
                                    "group flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-black bg-white transition-all duration-200 sm:h-11 sm:w-11 sm:border-[3px]",
                                    "shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-[#FACC15] sm:shadow-[4px_4px_0px_0px_#000]",
                                    "dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#27272a] dark:hover:bg-[#FACC15] dark:hover:text-black sm:dark:shadow-[4px_4px_0px_0px_#27272a]"
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
