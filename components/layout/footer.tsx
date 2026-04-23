"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
    {
        title: "İçerik",
        accent: "bg-[#FACC15]",
        hover: "hover:text-[#FACC15]",
        links: [
            { label: "Kütüphane", href: "/makale" },
            { label: "Simülasyon", href: "/simulasyonlar" },
            { label: "Sözlük", href: "/sozluk" },
        ],
    },
    {
        title: "Topluluk",
        accent: "bg-[#23A9FA]",
        hover: "hover:text-[#23A9FA]",
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

const FORMULAS = [
    "E = mc²",
    "ΔxΔp ≥ ħ/2",
    "pV = nRT",
    "F = ma",
    "λ = h/p",
    "P = IV",
];

export function Footer() {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="relative overflow-hidden border-t-[3px] border-black/15 bg-background px-4 pb-24 pt-8 text-foreground sm:px-6 md:pb-10">
            <style jsx>{`
                @keyframes footerFormulaDrift {
                    0% {
                        transform: translate3d(-4%, 0, 0);
                    }
                    50% {
                        transform: translate3d(4%, -5px, 0);
                    }
                    100% {
                        transform: translate3d(-4%, 0, 0);
                    }
                }

                @keyframes footerLogoFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes footerLinePulse {
                    0%,
                    100% {
                        transform: scaleX(1);
                        opacity: 0.9;
                    }
                    50% {
                        transform: scaleX(1.04);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[82px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.035] via-transparent to-transparent dark:from-white/[0.03]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent dark:via-white/20" />
                {FORMULAS.map((formula, index) => (
                    <span
                        key={formula}
                        className="absolute top-4 font-mono text-[11px] font-bold tracking-wide text-black/10 dark:text-white/10"
                        style={{
                            left: `${6 + index * 15}%`,
                            animation: reduceMotion
                                ? "none"
                                : `footerFormulaDrift ${10 + index * 1.15}s ease-in-out ${index * -0.85}s infinite`,
                        }}
                    >
                        {formula}
                    </span>
                ))}
            </div>

            <div className="container relative mx-auto max-w-[1120px]">
                <section
                    className={cn(
                        "relative overflow-hidden rounded-[24px] border-[3px] border-black dark:border-zinc-800",
                        "bg-[#27272a] text-white",
                        "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.58)]"
                    )}
                >
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                        }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.14),transparent_28%)]" />

                    <div className="relative border-b-[3px] border-black/70 px-4 py-4 sm:px-5 sm:py-5 dark:border-zinc-800">
                        <div className="flex items-start justify-between gap-4">
                            <Link
                                href="/"
                                className="inline-flex shrink-0"
                                aria-label="FizikHub ana sayfa"
                                style={{
                                    animation: reduceMotion ? "none" : "footerLogoFloat 4s ease-in-out infinite",
                                    transformOrigin: "left center",
                                }}
                            >
                                <DankLogo />
                            </Link>

                                <div className="flex shrink-0 gap-1">
                                    {SOCIAL_LINKS.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-[11px] border-[2px] border-black sm:h-9 sm:w-9 sm:rounded-[12px]",
                                                "bg-white text-black shadow-[2px_2px_0px_0px_#000]",
                                                "transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                                "dark:border-zinc-700 dark:bg-[#1b1b1f] dark:text-white"
                                            )}
                                        >
                                            <social.icon className="h-[15px] w-[15px] stroke-[2.4px] sm:h-4 sm:w-4" />
                                        </a>
                                    ))}
                                </div>
                        </div>

                        <div className="mt-5 max-w-[440px]">
                            <div
                                className="mb-3 h-2.5 w-20 rounded-full bg-[#FACC15] shadow-[2px_2px_0px_0px_#000]"
                                style={{
                                    animation: reduceMotion ? "none" : "footerLinePulse 4s ease-in-out infinite",
                                    transformOrigin: "left center",
                                }}
                            />
                            <h2 className="max-w-[12ch] text-[1.34rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-[1.75rem]">
                                Bilimi Ti&apos;ye Alıyoruz Ama Ciddili Şekilde.
                            </h2>
                            <p className="mt-2 text-[0.78rem] font-black uppercase tracking-[0.12em] text-zinc-400">
                                İzinsiz kullananı kara deliğe atarız.
                            </p>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-2 gap-4 px-4 py-4 sm:px-5 sm:py-5 md:gap-8">
                        {NAV_SECTIONS.map((section) => (
                            <div key={section.title} className="min-w-0">
                                <div className="mb-3 flex items-center gap-3">
                                    <span className={cn("h-8 w-3 shrink-0 rounded-full border-[2px] border-black", section.accent)} />
                                    <h3 className="text-[0.8rem] font-black uppercase tracking-[0.1em] text-zinc-300 sm:text-[0.92rem] sm:tracking-[0.12em]">
                                        {section.title}
                                    </h3>
                                </div>

                                <div className="space-y-1">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={cn(
                                                "group flex items-center justify-between gap-3 border-b border-white/10 py-2.5",
                                                "text-[0.83rem] font-black uppercase tracking-tight text-white transition-colors sm:text-[0.97rem]",
                                                "hover:border-white/30",
                                                section.hover
                                            )}
                                        >
                                            <span>{link.label}</span>
                                            <ArrowUpRight className="h-4 w-4 shrink-0 stroke-[2.4px] text-zinc-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative border-t-[3px] border-black/70 px-4 py-3 sm:px-5 dark:border-zinc-800">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-black uppercase tracking-[0.13em] text-zinc-400">
                            {UTILITY_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="transition-colors hover:text-[#FACC15]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mt-4 flex flex-col gap-1.5 border-t-[3px] border-black/10 pt-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left dark:border-white/10">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                        FizikHub © {year}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 sm:text-[11px]">
                        Bilim karakterini kaybetmeden.
                    </p>
                </div>
            </div>
        </footer>
    );
}
