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

const QUICK_LINKS = [
    { label: "Kütüphane", href: "/makale", accent: "from-[#FACC15] to-[#FFD76A]" },
    { label: "Forum", href: "/forum", accent: "from-[#23A9FA] to-[#67C8FF]" },
    { label: "Simülasyon", href: "/simulasyonlar", accent: "from-[#34D399] to-[#6EE7B7]" },
    { label: "Sıralama", href: "/siralamalar", accent: "from-[#F97316] to-[#FDBA74]" },
    { label: "Sözlük", href: "/sozluk", accent: "from-[#A78BFA] to-[#C4B5FD]" },
    { label: "Hakkımızda", href: "/hakkimizda", accent: "from-[#F472B6] to-[#F9A8D4]" },
];

const UTILITY_LINKS = [
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
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

function QuickLink({
    label,
    href,
    accent,
}: {
    label: string;
    href: string;
    accent: string;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative overflow-hidden rounded-[16px] border-[2px] border-black dark:border-zinc-700",
                "bg-white dark:bg-[#27272a]",
                "px-3 py-3 shadow-[3px_3px_0px_0px_#000]",
                "transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000]",
                "dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.55)]"
            )}
        >
            <div
                className={cn(
                    "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-90 transition-transform duration-300 group-hover:scale-x-[1.02]",
                    accent
                )}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[0.82rem] font-black uppercase tracking-tight text-black dark:text-white sm:text-[0.95rem]">
                    {label}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 stroke-[2.4px] text-zinc-500 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white" />
            </div>
        </Link>
    );
}

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
                        transform: translate3d(4%, -6px, 0);
                    }
                    100% {
                        transform: translate3d(-4%, 0, 0);
                    }
                }

                @keyframes footerGlowShift {
                    0%,
                    100% {
                        opacity: 0.45;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.68;
                        transform: scale(1.04);
                    }
                }

                @keyframes footerLogoBob {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
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
                                : `footerFormulaDrift ${10 + index * 1.3}s ease-in-out ${index * -0.9}s infinite`,
                        }}
                    >
                        {formula}
                    </span>
                ))}
            </div>

            <div className="container relative mx-auto max-w-[1240px]">
                <div className="grid gap-3.5 lg:grid-cols-[1.05fr_1.25fr] lg:gap-4">
                    <section
                        className={cn(
                            "relative overflow-hidden rounded-[22px] border-[3px] border-black dark:border-zinc-800",
                            "bg-[#f5f5f5] dark:bg-[#27272a]",
                            "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.52)]"
                        )}
                    >
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply dark:mix-blend-screen"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                        />
                        <div
                            className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-[#FACC15]/20 blur-3xl"
                            style={{
                                animation: reduceMotion ? "none" : "footerGlowShift 5.8s ease-in-out infinite",
                            }}
                        />

                        <div className="relative flex items-start justify-between gap-4 border-b-[3px] border-black px-4 py-4 dark:border-zinc-800 sm:px-5">
                            <Link
                                href="/"
                                aria-label="FizikHub ana sayfa"
                                className="inline-flex"
                                style={{
                                    animation: reduceMotion ? "none" : "footerLogoBob 4.2s ease-in-out infinite",
                                    transformOrigin: "left center",
                                }}
                            >
                                <DankLogo />
                            </Link>

                            <div className="grid shrink-0 grid-cols-4 gap-1.5">
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

                        <div className="relative space-y-3 px-4 py-4 sm:px-5">
                            <div className="inline-flex -rotate-[1.5deg] rounded-[10px] border-[2px] border-black bg-[#FACC15] px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                                <span className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-black">
                                    Çıkış Katı
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="max-w-[15ch] text-[1.32rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-black dark:text-white sm:text-[1.7rem]">
                                    Bilimi Ti&apos;ye Alıyoruz Ama Ciddili Şekilde.
                                </h2>
                                <p className="text-[0.8rem] font-black uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                    İzinsiz kullananı kara deliğe atarız.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                                {UTILITY_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            "rounded-full border-[2px] border-black px-2.5 py-2 text-center",
                                            "bg-white text-[0.64rem] font-black uppercase tracking-[0.08em] text-black shadow-[2px_2px_0px_0px_#000]",
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

                    <section
                        className={cn(
                            "relative overflow-hidden rounded-[22px] border-[3px] border-black dark:border-zinc-800",
                            "bg-[#f5f5f5] dark:bg-[#27272a]",
                            "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.52)]"
                        )}
                    >
                        <div className="relative flex items-center justify-between gap-3 border-b-[3px] border-black px-4 py-3 dark:border-zinc-800 sm:px-5">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-3 rounded-full border-2 border-black bg-[#23A9FA]" />
                                <h3 className="text-[0.9rem] font-black uppercase tracking-[0.08em] text-black dark:text-white sm:text-[1rem]">
                                    Hızlı Erişim
                                </h3>
                            </div>
                            <span className="rounded-full border-[2px] border-black bg-black px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#FACC15] dark:border-zinc-700">
                                Minimal
                            </span>
                        </div>

                        <div className="relative grid grid-cols-2 gap-2.5 p-3.5 sm:grid-cols-3 sm:gap-3 sm:p-5">
                            {QUICK_LINKS.map((link) => (
                                <QuickLink key={link.label} {...link} />
                            ))}
                        </div>
                    </section>
                </div>

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
