"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Twitter, Instagram, Github, Youtube, ArrowUpRight } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
    {
        title: "Laboratuvar",
        accent: "bg-[#FACC15]",
        links: [
            { label: "Kütüphane", href: "/makale" },
            { label: "Simülasyonlar", href: "/simulasyonlar" },
            { label: "Sözlük", href: "/sozluk" },
        ],
    },
    {
        title: "Topluluk",
        accent: "bg-[#23A9FA]",
        links: [
            { label: "Forum", href: "/forum" },
            { label: "Sıralamalar", href: "/siralamalar" },
            { label: "Hakkımızda", href: "/hakkimizda" },
        ],
    },
];

const SOCIAL_LINKS = [
    { icon: Twitter, href: "https://twitter.com/fizikhub", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/fizikhub", label: "Instagram" },
    { icon: Github, href: "https://github.com/fizikhub", label: "Github" },
    { icon: Youtube, href: "https://youtube.com/fizikhub", label: "Youtube" },
];

const UTILITY_LINKS = [
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
    { label: "KVKK", href: "/kvkk" },
];

const FORMULAS = [
    "E = mc²",
    "ΔxΔp ≥ ħ/2",
    "pV = nRT",
    "F = ma",
    "λ = h/p",
    "P = IV",
];

function FooterCard({
    title,
    accent,
    links,
}: {
    title: string;
    accent: string;
    links: { label: string; href: string }[];
}) {
    return (
        <section
            className={cn(
                "relative overflow-hidden rounded-[20px] border-[3px] border-black dark:border-zinc-800",
                "bg-white dark:bg-[#27272a]",
                "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)]",
                "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
            )}
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
            />

            <div className="relative border-b-[3px] border-black dark:border-zinc-800 px-3.5 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                    <span
                        className={cn("h-7 w-2.5 shrink-0 rounded-full border-2 border-black", accent)}
                        style={{
                            animation: "footerAccentPulse 3.6s ease-in-out infinite",
                        }}
                    />
                    <h3 className="min-w-0 text-[0.8rem] font-black uppercase tracking-tight text-black dark:text-white sm:text-[1.05rem] lg:text-[1.2rem]">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="relative space-y-2 p-3.5 sm:p-5">
                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={cn(
                            "group flex items-center justify-between rounded-[16px] border-[2px] border-black dark:border-zinc-700",
                            "bg-[#f4f4f5] dark:bg-[#1e1e21] px-3 py-2.5",
                            "text-[0.82rem] font-black uppercase tracking-tight text-black dark:text-white sm:text-[0.95rem]",
                            "transition-all duration-200 hover:bg-[#FACC15] hover:text-black dark:hover:bg-[#FACC15] dark:hover:text-black"
                        )}
                    >
                        <span>{link.label}</span>
                        <ArrowUpRight className="hidden h-4 w-4 stroke-[2.5px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function Footer() {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="relative overflow-hidden border-t-[3px] border-black/20 bg-background px-4 pb-24 pt-8 text-foreground sm:px-6 md:pb-10 md:pt-10">
            <style jsx>{`
                @keyframes footerFormulaFloat {
                    0% {
                        transform: translate3d(-6%, 0, 0);
                    }
                    50% {
                        transform: translate3d(6%, -8px, 0);
                    }
                    100% {
                        transform: translate3d(-6%, 0, 0);
                    }
                }

                @keyframes footerAccentPulse {
                    0%,
                    100% {
                        transform: scaleY(1);
                        filter: brightness(1);
                    }
                    50% {
                        transform: scaleY(1.08);
                        filter: brightness(1.08);
                    }
                }

                @keyframes footerLogoDrift {
                    0%,
                    100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-2px) rotate(-1deg);
                    }
                }

                @keyframes footerPanelBreath {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                        filter: brightness(1);
                    }
                    50% {
                        transform: translate3d(0, -2px, 0);
                        filter: brightness(1.04);
                    }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[88px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] via-transparent to-transparent dark:from-white/[0.03]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent dark:via-white/20" />
                {FORMULAS.map((formula, index) => (
                    <span
                        key={formula}
                        className="absolute top-4 font-mono text-[11px] font-bold tracking-wide text-black/10 dark:text-white/10"
                        style={{
                            left: `${6 + index * 15}%`,
                            animation: reduceMotion ? "none" : `footerFormulaFloat ${11 + index * 1.25}s ease-in-out ${index * -1.1}s infinite`,
                        }}
                    >
                        {formula}
                    </span>
                ))}
            </div>

            <div className="container relative mx-auto max-w-[1250px]">
                <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12 lg:gap-5">
                    <section
                        className={cn(
                            "overflow-hidden rounded-[22px] border-[3px] border-black dark:border-zinc-800",
                            "bg-white dark:bg-[#27272a]",
                            "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)]",
                            "lg:col-span-5"
                        )}
                        style={{
                            animation: reduceMotion ? "none" : "footerPanelBreath 5.8s ease-in-out infinite",
                        }}
                    >
                        <div className="relative overflow-hidden border-b-[3px] border-black dark:border-zinc-800 px-4 py-3.5 sm:px-5 sm:py-4">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.18),transparent_38%)]" />
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                            />

                            <div className="relative flex items-start justify-between gap-4">
                                <Link
                                    href="/"
                                    className="inline-flex"
                                    aria-label="FizikHub ana sayfa"
                                    style={{
                                        animation: reduceMotion ? "none" : "footerLogoDrift 4.8s ease-in-out infinite",
                                        transformOrigin: "left center",
                                    }}
                                >
                                    <DankLogo />
                                </Link>

                                <div className="hidden sm:flex flex-wrap justify-end gap-2">
                                    {SOCIAL_LINKS.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={cn(
                                                "flex h-11 w-11 items-center justify-center rounded-[14px]",
                                                "border-[2px] border-black bg-white text-black shadow-[2px_2px_0px_0px_#000]",
                                                "transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                                "dark:bg-[#1e1e21] dark:text-white dark:border-zinc-700 dark:hover:bg-[#FACC15] dark:hover:text-black"
                                            )}
                                        >
                                            <social.icon className="h-[18px] w-[18px] stroke-[2.3px]" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mt-3">
                                <div className="space-y-1">
                                    <h2 className="max-w-[15ch] text-[1.36rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-black dark:text-white sm:text-[1.8rem] lg:text-[2rem]">
                                        Bilimi Ti&apos;ye Alıyoruz Ama Ciddili Şekilde.
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col gap-2.5 px-4 py-3.5 sm:px-5 sm:py-4">
                            <div className="flex flex-wrap gap-1.5 sm:hidden">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-[14px]",
                                            "border-[2px] border-black bg-white text-black shadow-[2px_2px_0px_0px_#000]",
                                            "transition-all duration-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                            "dark:bg-[#1e1e21] dark:text-white dark:border-zinc-700"
                                        )}
                                    >
                                        <social.icon className="h-[18px] w-[18px] stroke-[2.3px]" />
                                    </a>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
                                {UTILITY_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            "rounded-full border-[2px] border-black px-2 py-1.5 text-center",
                                            "bg-[#f4f4f5] text-[8px] font-black uppercase tracking-[0.08em] text-black sm:px-3 sm:text-[11px]",
                                            "transition-all duration-200 hover:bg-[#FACC15]",
                                            "dark:border-zinc-700 dark:bg-[#1e1e21] dark:text-zinc-200 dark:hover:bg-[#FACC15] dark:hover:text-black"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-3.5 lg:col-span-7 lg:grid-cols-2 lg:gap-5">
                        <div>
                            <FooterCard {...FOOTER_LINKS[0]} />
                        </div>
                        <div>
                            <FooterCard {...FOOTER_LINKS[1]} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-t-[3px] border-black/10 pt-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left dark:border-white/10">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500">
                        FizikHub © {year}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 sm:text-[11px]">
                        İzinsiz kullananı kara deliğe atarız.
                    </p>
                </div>
            </div>
        </footer>
    );
}
