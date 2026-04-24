"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <svg viewBox="0 0 200 160" width="160" height="128" className="overflow-visible drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_15px_20px_rgba(0,0,0,1)]">
        <defs>
            <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
            <linearGradient id="beam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(74,222,128, 0.5)" />
                <stop offset="100%" stopColor="rgba(74,222,128, 0)" />
            </linearGradient>
            <radialGradient id="alienSkin" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#166534" />
            </radialGradient>
        </defs>

        {/* Tractor Beam */}
        <path d="M70 85 L15 160 L185 160 L130 85 Z" fill="url(#beam)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />

        {/* Alien inside */}
        {/* Body */}
        <path d="M75 85 C 70 60, 130 60, 125 85" fill="url(#alienSkin)" />
        {/* Head */}
        <path d="M65 55 C 55 20, 145 20, 135 55 C 140 80, 60 80, 65 55" fill="url(#alienSkin)" />
        {/* Eyes (Black shiny) */}
        <ellipse cx="82" cy="45" rx="10" ry="16" fill="#000" transform="rotate(-20 82 45)" />
        <ellipse cx="118" cy="45" rx="10" ry="16" fill="#000" transform="rotate(20 118 45)" />
        <circle cx="85" cy="42" r="3" fill="#fff" />
        <circle cx="115" cy="42" r="3" fill="#fff" />

        {/* Glass Dome */}
        <path d="M45 60 C 45 5, 155 5, 155 60" fill="url(#glass)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M60 35 C 60 10, 140 10, 140 35" fill="rgba(255,255,255,0.25)" /> {/* Glass Highlight */}

        {/* UFO Body - Bottom Ring */}
        <ellipse cx="100" cy="70" rx="95" ry="25" fill="#27272a" stroke="#000" strokeWidth="4" />
        {/* UFO Body - Middle Ring (Metal) */}
        <ellipse cx="100" cy="65" rx="100" ry="20" fill="#71717a" stroke="#000" strokeWidth="4" />
        {/* UFO Body - Top Rim */}
        <ellipse cx="100" cy="60" rx="65" ry="12" fill="#52525b" stroke="#000" strokeWidth="3" />
        
        {/* Detail Lines */}
        <path d="M20 70 Q 100 95 180 70" fill="none" stroke="#3f3f46" strokeWidth="2" />

        {/* Lights (Animated) */}
        <circle cx="15" cy="65" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '1.2s' }} />
        <circle cx="15" cy="65" r="5" fill="#ef4444" />
        
        <circle cx="50" cy="80" r="5" fill="#eab308" />
        
        <circle cx="100" cy="85" r="6" fill="#3b82f6" className="animate-pulse" style={{ animationDuration: '0.8s' }} />
        
        <circle cx="150" cy="80" r="5" fill="#eab308" />
        
        <circle cx="185" cy="65" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '1.7s', animationDelay: '0.4s' }} />
        <circle cx="185" cy="65" r="5" fill="#ef4444" />
    </svg>
);

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="relative w-full overflow-hidden border-t-[4px] border-black bg-background px-5 pb-10 pt-12 text-foreground dark:border-zinc-800 sm:px-8 md:pb-12 md:pt-14">
            
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
                initial={{ x: "-20vw", y: 0 }}
                animate={{ 
                    x: ["-20vw", "120vw"],
                    y: [0, -15, 10, -10, 0], 
                    rotate: [-3, 3, -2, 2, -3] 
                }}
                transition={{
                    x: { duration: 35, ease: "linear", repeat: Infinity },
                    y: { duration: 6, ease: "easeInOut", repeat: Infinity },
                    rotate: { duration: 8, ease: "easeInOut", repeat: Infinity }
                }}
                className="absolute top-10 sm:top-20 z-0 pointer-events-none opacity-40 dark:opacity-30"
            >
                <UFOAlien />
            </motion.div>

            <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
                
                {/* Brand & Slogan Section */}
                <div className="flex flex-col gap-6 lg:max-w-md">
                    <Link
                        href="/"
                        className="inline-flex shrink-0 transition-transform hover:-translate-y-1"
                        aria-label="FizikHub ana sayfa"
                    >
                        <DankLogo />
                    </Link>
                    
                    <div className="space-y-3">
                        <h2 className="text-[1.8rem] font-black uppercase leading-[1.1] tracking-tight sm:text-[2.2rem]">
                            BİLİMİ <span className="text-[#FACC15] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Tİ'YE ALIYORUZ</span> AMA CİDDİLİ ŞEKİLDE.
                        </h2>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex w-full flex-col gap-8 sm:flex-row sm:gap-16 lg:w-auto">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title} className="flex flex-col gap-4">
                            <h3 className="text-xl font-black uppercase tracking-normal">
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
