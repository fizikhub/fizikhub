"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Github, Youtube, ArrowRight, ExternalLink } from "lucide-react";
import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
    {
        title: "Laboratuvar",
        links: [
            { label: "Kütüphane", href: "/makale" },
            { label: "Simülasyonlar", href: "/simulasyonlar" },
            { label: "Sözlük", href: "/sozluk" },
        ]
    },
    {
        title: "Topluluk",
        links: [
            { label: "Forum", href: "/forum" },
            { label: "Sıralamalar", href: "/siralamalar" },
            { label: "Hakkımızda", href: "/hakkimizda" },
        ]
    },
    {
        title: "Yasal",
        links: [
            { label: "KVKK", href: "/kvkk" },
            { label: "Gizlilik", href: "/gizlilik-politikasi" },
            { label: "Şartlar", href: "/sartlar" },
        ]
    }
];

const SOCIAL_LINKS = [
    { icon: Twitter, href: "https://twitter.com/fizikhub", color: "hover:bg-[#1DA1F2]", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/fizikhub", color: "hover:bg-[#E1306C]", label: "Instagram" },
    { icon: Github, href: "https://github.com/fizikhub", color: "hover:bg-[#333]", label: "Github" },
    { icon: Youtube, href: "https://youtube.com/fizikhub", color: "hover:bg-[#FF0000]", label: "Youtube" },
];

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="w-full bg-background relative overflow-hidden pt-24 pb-32 md:pb-12 px-6 border-t-[3px] border-black dark:border-white/5">
            {/* 1. GHOST BACKGROUND TEXT - Massive & Subtle */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
                <span className="text-[20vw] font-black italic tracking-tighter uppercase whitespace-nowrap leading-none transform -rotate-12 translate-y-12">
                    FIZIKHUB
                </span>
            </div>

            {/* 2. DECORATIVE GRADIENT LINE */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-neo-yellow via-transparent to-neo-yellow/20" />

            <div className="container max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-20">
                    
                    {/* BRANDING SECTION */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:max-w-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="transform hover:scale-105 hover:-rotate-1 transition-transform duration-300">
                                <DankLogo />
                            </div>
                        </motion.div>
                        
                        <div className="space-y-4">
                            <p className="text-xl md:text-2xl font-black italic leading-tight tracking-tight text-foreground">
                                Bilimi tiye alıyoruz, <br className="hidden sm:block" />
                                <span className="relative inline-block mt-1">
                                    <span className="relative z-10 text-black px-2 py-0.5">ama ciddili şekilde.</span>
                                    <motion.span 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        className="absolute inset-0 bg-neo-yellow -rotate-1 z-0" 
                                    />
                                </span>
                            </p>
                            <p className="text-sm md:text-base font-bold text-muted-foreground/80 max-w-sm">
                                Kozmosun dilini çözmeye çalışanların, kuantumdan evrene her şeyi sorgulayanların dijital üssü.
                            </p>
                        </div>

                        {/* BOXY SOCIAL BUTTONS */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            {SOCIAL_LINKS.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ y: -4, x: -4 }}
                                    className={cn(
                                        "w-12 h-12 flex items-center justify-center bg-background border-[3px] border-black dark:border-zinc-700",
                                        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]",
                                        "hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]",
                                        "transition-all duration-200 group relative overflow-hidden",
                                        social.color
                                    )}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 relative z-10 group-hover:text-white transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* LINKS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 flex-1">
                        {FOOTER_LINKS.map((group, groupIdx) => (
                            <div key={group.title} className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-neo-yellow border-2 border-black rotate-45" />
                                    <h4 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                                        {group.title}
                                    </h4>
                                </div>
                                <ul className="flex flex-col gap-4">
                                    {group.links.map((link, linkIdx) => (
                                        <motion.li 
                                            key={link.label}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (groupIdx * 0.1) + (linkIdx * 0.05) }}
                                            viewport={{ once: true }}
                                        >
                                            <Link 
                                                href={link.href}
                                                className="group text-lg md:text-xl font-black uppercase tracking-tight text-foreground hover:text-neo-yellow transition-colors flex items-center gap-2"
                                            >
                                                <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neo-yellow" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="pt-12 border-t-[3px] border-black dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center md:text-left">
                            &copy; 2026 FIZIKHUB INC. TÜM HAKLARI UZAYDA SAKLIDIR.
                        </p>
                        <div className="h-px w-8 bg-zinc-800 hidden md:block" />
                        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 border-2 border-dashed border-black dark:border-zinc-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                SİSTEMLER ÇEVRİMİÇİ
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                         <Link href="/kurallar" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors">Yıldız Yasaları</Link>
                         <Link href="/gizlilik-politikasi" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors">Gizlilik Protokolü</Link>
                    </div>
                </div>
            </div>

            {/* DECORATIVE NOISE OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </footer>
    );
}
