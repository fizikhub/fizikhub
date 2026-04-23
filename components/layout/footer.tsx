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
        <footer className="relative overflow-hidden border-t-[3px] border-black/15 bg-background px-2 pb-24 pt-7 text-foreground sm:px-4 md:pb-10">
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
                        opacity: 0.88;
                    }
                    50% {
                        transform: scaleX(1.05);
                        opacity: 1;
                    }
                }

                @keyframes footerSweep {
                    0% {
                        transform: translate3d(-120%, 0, 0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(120%, 0, 0);
                        opacity: 0;
                    }
                }

                @keyframes footerShellFloat {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }
                    50% {
                        transform: translate3d(0, -2px, 0);
                    }
                }

                @keyframes footerIconBob {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes footerRailSlide {
                    0% {
                        background-position: 0% 50%;
                    }
                    100% {
                        background-position: 200% 50%;
                    }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[86px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.035] via-transparent to-transparent dark:from-white/[0.03]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent dark:via-white/20" />
                {FORMULAS.map((formula, index) => (
                    <span
                        key={formula}
                        className="absolute top-4 font-mono text-[11px] font-bold tracking-normal text-black/10 dark:text-white/10"
                        style={{
                            left: `${5 + index * 15.5}%`,
                            animation: reduceMotion
                                ? "none"
                                : `footerFormulaDrift ${10 + index * 1.2}s ease-in-out ${index * -0.8}s infinite`,
                        }}
                    >
                        {formula}
                    </span>
                ))}
            </div>

            <div className="relative mx-auto w-full max-w-[1400px]">
                <section
                    className={cn(
                        "relative overflow-hidden rounded-[30px] border-[3px] border-black dark:border-zinc-800",
                        "bg-[#27272a] text-white",
                        "shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.62)]"
                    )}
                    style={{
                        animation: reduceMotion ? "none" : "footerShellFloat 6.4s ease-in-out infinite",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                        }}
                    />
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(105deg,transparent_0%,transparent_35%,rgba(255,255,255,0.07)_50%,transparent_65%,transparent_100%)]"
                        style={{
                            animation: reduceMotion ? "none" : "footerSweep 8s ease-in-out infinite",
                        }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#FACC15,#23A9FA,#34D399,#FACC15)] bg-[length:200%_100%]"
                        style={{
                            animation: reduceMotion ? "none" : "footerRailSlide 6s linear infinite",
                        }}
                    />
                    <div className="pointer-events-none absolute bottom-6 right-4 hidden text-[6.5rem] font-black uppercase leading-none tracking-normal text-white/[0.035] sm:block lg:text-[8rem]">
                        FizikHub
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%,rgba(0,0,0,0.1))]" />

                    <div className="relative border-b-[3px] border-black/70 px-5 py-6 dark:border-zinc-800 sm:px-7 sm:py-7">
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
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

                            <div className="flex shrink-0 gap-1.5 sm:gap-2.5">
                                {SOCIAL_LINKS.map((social, index) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-[12px] border-[2px] border-black sm:h-11 sm:w-11",
                                            "bg-white text-black shadow-[3px_3px_0px_0px_#000]",
                                            "transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                            "dark:border-zinc-700 dark:bg-[#1b1b1f] dark:text-white"
                                        )}
                                        style={{
                                            animation: reduceMotion
                                                ? "none"
                                                : `footerIconBob ${3.7 + index * 0.35}s ease-in-out ${index * -0.45}s infinite`,
                                        }}
                                    >
                                        <social.icon className="h-4 w-4 stroke-[2.4px]" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 max-w-[720px] sm:mt-7">
                            <div
                                className="mb-4 h-3 w-32 rounded-full bg-[#FACC15] shadow-[2px_2px_0px_0px_#000] sm:w-40"
                                style={{
                                    animation: reduceMotion ? "none" : "footerLinePulse 4s ease-in-out infinite",
                                    transformOrigin: "left center",
                                }}
                            />
                            <h2 className="max-w-[19ch] text-[1.55rem] font-black uppercase leading-[0.92] tracking-normal text-white sm:max-w-[22ch] sm:text-[2rem] lg:text-[2.25rem]">
                                Bilimi Ti&apos;ye Alıyoruz Ama Ciddili Şekilde.
                            </h2>
                            <p className="mt-3 text-[0.82rem] font-black uppercase tracking-normal text-zinc-400 sm:text-[0.92rem]">
                                İzinsiz kullananı kara deliğe atarız.
                            </p>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-2 gap-x-7 gap-y-5 px-5 py-5 sm:px-7 sm:py-6 md:gap-x-14">
                        {NAV_SECTIONS.map((section) => (
                            <div key={section.title} className="min-w-0">
                                <div className="mb-3.5 flex items-center gap-3">
                                    <span
                                        className={cn("h-9 w-3 shrink-0 rounded-full border-[2px] border-black", section.accent)}
                                        style={{
                                            animation: reduceMotion ? "none" : "footerLinePulse 4.4s ease-in-out infinite",
                                            transformOrigin: "center",
                                        }}
                                    />
                                    <h3 className="text-[0.84rem] font-black uppercase tracking-normal text-zinc-300 sm:text-[0.98rem]">
                                        {section.title}
                                    </h3>
                                </div>

                                <div className="space-y-1">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={cn(
                                                "group flex items-center justify-between gap-3 border-b border-white/10 py-3.5",
                                                "text-[0.92rem] font-black uppercase tracking-normal text-white transition-colors sm:text-[1.08rem]",
                                                "hover:border-white/30",
                                                section.hover
                                            )}
                                        >
                                            <span>{link.label}</span>
                                            <ArrowUpRight className="hidden h-4 w-4 shrink-0 stroke-[2.4px] text-zinc-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current sm:block" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative border-t-[3px] border-black/70 px-5 py-4 sm:px-7 dark:border-zinc-800">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.76rem] font-black uppercase tracking-normal text-zinc-400 sm:text-[0.8rem]">
                            {UTILITY_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="transition-all duration-200 hover:-translate-y-[1px] hover:text-[#FACC15]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mt-4 flex flex-col gap-1.5 border-t-[3px] border-black/10 px-1 pt-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left dark:border-white/10">
                    <p className="text-[11px] font-black uppercase tracking-normal text-zinc-500">
                        FizikHub © {year}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-normal text-zinc-400 sm:text-[11px]">
                        Bilim karakterini kaybetmeden.
                    </p>
                </div>
            </div>
        </footer>
    );
}
