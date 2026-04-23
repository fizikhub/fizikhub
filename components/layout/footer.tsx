"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import {
    ArrowUpRight,
    Github,
    Instagram,
    Twitter,
    Youtube,
} from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { label: "Kütüphane", href: "/makale", color: "bg-[#FACC15]" },
    { label: "Forum", href: "/forum", color: "bg-[#23A9FA]" },
    { label: "Simülasyon", href: "/simulasyonlar", color: "bg-[#34D399]" },
    { label: "Sıralama", href: "/siralamalar", color: "bg-[#F97316]" },
    { label: "Sözlük", href: "/sozluk", color: "bg-[#A78BFA]" },
    { label: "Hakkımızda", href: "/hakkimizda", color: "bg-[#F472B6]" },
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

                @keyframes footerBarPulse {
                    0%,
                    100% {
                        transform: scaleX(1);
                        opacity: 0.85;
                    }
                    50% {
                        transform: scaleX(1.03);
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
                                : `footerFormulaDrift ${10 + index * 1.2}s ease-in-out ${index * -0.8}s infinite`,
                        }}
                    >
                        {formula}
                    </span>
                ))}
            </div>

            <div className="container relative mx-auto max-w-[1180px]">
                <section
                    className={cn(
                        "relative overflow-hidden rounded-[24px] border-[3px] border-black dark:border-zinc-800",
                        "bg-[#f4f4f5] dark:bg-[#27272a]",
                        "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.52)]"
                    )}
                >
                    <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                    />

                    <div className="grid gap-0 lg:grid-cols-[0.95fr_1.25fr]">
                        <div className="border-b-[3px] border-black p-4 dark:border-zinc-800 sm:p-5 lg:border-b-0 lg:border-r-[3px]">
                            <div className="flex items-start justify-between gap-4">
                                <Link
                                    href="/"
                                    className="inline-flex"
                                    aria-label="FizikHub ana sayfa"
                                    style={{
                                        animation: reduceMotion ? "none" : "footerLogoFloat 4s ease-in-out infinite",
                                        transformOrigin: "left center",
                                    }}
                                >
                                    <DankLogo />
                                </Link>

                                <div className="flex gap-1.5">
                                    {SOCIAL_LINKS.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={cn(
                                                "flex h-9 w-9 items-center justify-center rounded-[12px] border-[2px] border-black",
                                                "bg-white text-black shadow-[2px_2px_0px_0px_#000]",
                                                "transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                                "dark:border-zinc-700 dark:bg-[#1e1e21] dark:text-white"
                                            )}
                                        >
                                            <social.icon className="h-4 w-4 stroke-[2.4px]" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div
                                    className="h-2.5 w-24 rounded-full bg-[#FACC15] shadow-[2px_2px_0px_0px_#000]"
                                    style={{
                                        animation: reduceMotion ? "none" : "footerBarPulse 3.8s ease-in-out infinite",
                                        transformOrigin: "left center",
                                    }}
                                />
                                <h2 className="max-w-[13ch] text-[1.42rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-black dark:text-white sm:text-[1.78rem]">
                                    Bilimi Ti&apos;ye Alıyoruz Ama Ciddili Şekilde.
                                </h2>
                                <p className="text-[0.8rem] font-black uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    İzinsiz kullananı kara deliğe atarız.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5">
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            "group relative overflow-hidden rounded-[18px] border-[2px] border-black dark:border-zinc-700",
                                            "bg-white px-3 py-3.5 shadow-[3px_3px_0px_0px_#000]",
                                            "transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000]",
                                            "dark:bg-[#1e1e21] dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.45)] dark:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.55)]"
                                        )}
                                    >
                                        <span className={cn("absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-black", link.color)} />
                                        <div className="flex min-h-[54px] flex-col justify-between gap-3 pt-5">
                                            <span className="text-[0.84rem] font-black uppercase leading-none tracking-tight text-black dark:text-white sm:text-[0.95rem]">
                                                {link.label}
                                            </span>
                                            <ArrowUpRight className="h-4 w-4 stroke-[2.5px] text-zinc-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t-[3px] border-black px-4 py-3 dark:border-zinc-800 sm:px-5">
                        <div className="flex flex-wrap gap-1.5">
                            {UTILITY_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={cn(
                                        "rounded-full border-[2px] border-black bg-white px-3 py-1.5",
                                        "text-[0.66rem] font-black uppercase tracking-[0.1em] text-black shadow-[2px_2px_0px_0px_#000]",
                                        "transition-all duration-200 hover:bg-[#FACC15] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
                                        "dark:border-zinc-700 dark:bg-[#1e1e21] dark:text-zinc-100 dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.45)]"
                                    )}
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
