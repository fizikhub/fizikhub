"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Github, Youtube, ArrowUpRight } from "lucide-react";
import { m as motion } from "framer-motion";

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
    { icon: Twitter, href: "https://twitter.com/fizikhub", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/fizikhub", label: "Instagram" },
    { icon: Github, href: "https://github.com/fizikhub", label: "Github" },
    { icon: Youtube, href: "https://youtube.com/fizikhub", label: "Youtube" },
];

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="w-full bg-background border-t border-white/5 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
            {/* Subtle Gradient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neo-yellow/20 to-transparent" />
            
            <div className="container max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-fit"
                        >
                            <div className="transform scale-90 origin-left grayscale hover:grayscale-0 transition-all duration-500">
                                <DankLogo />
                            </div>
                        </motion.div>
                        
                        <p className="max-w-xs text-secondary-foreground/60 text-sm md:text-base leading-relaxed font-medium">
                            Kozmosun dilini anlamlandırma çabası. Fizik, astronomi ve ötesine dair kapsamlı Türkçe bilim platformu.
                        </p>

                        <div className="flex gap-4">
                            {SOCIAL_LINKS.map((social) => (
                                <Link 
                                    key={social.label} 
                                    href={social.href}
                                    className="p-2 rounded-lg bg-secondary/50 border border-white/5 text-secondary-foreground/40 hover:text-neo-yellow hover:border-neo-yellow/30 hover:bg-secondary transition-all group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {FOOTER_LINKS.map((group, idx) => (
                            <div key={group.title} className="flex flex-col gap-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-neo-yellow/80">
                                    {group.title}
                                </h4>
                                <ul className="flex flex-col gap-3">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link 
                                                href={link.href}
                                                className="text-sm font-medium text-secondary-foreground/60 hover:text-foreground transition-colors flex items-center group gap-1"
                                            >
                                                <span>{link.label}</span>
                                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-6">
                        <p className="text-[11px] font-bold text-secondary-foreground/30 uppercase tracking-[0.1em]">
                            &copy; 2026 FIZIKHUB INC. TÜM HAKLARI SAKLIDIR.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">
                            SİSTEMLER ÇEVRİMİÇİ
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle background ornamentation */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neo-yellow/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
}
