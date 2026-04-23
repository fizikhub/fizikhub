"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Github, Youtube } from "lucide-react";
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
        <footer className="w-full bg-[#09090b] relative pt-12 pb-28 md:pb-10 px-5 sm:px-6 border-t border-white/[0.06]">
            <div className="container max-w-6xl mx-auto">

                {/* === TOP: Brand + Link Grid === */}
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mb-10">

                    {/* BRAND COLUMN */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 lg:max-w-sm flex-shrink-0">
                        <DankLogo />

                        <div className="space-y-3">
                            <p className="text-lg md:text-xl font-black italic text-white leading-tight tracking-tight">
                                Bilimi tiye alıyoruz,{" "}
                                <span className="relative inline-block mt-0.5">
                                    <span className="relative z-10 text-black px-1.5 py-0.5">ama ciddili şekilde.</span>
                                    <span className="absolute inset-0 bg-[#FACC15] -rotate-1 z-0" />
                                </span>
                            </p>
                            <p className="text-[13px] leading-relaxed text-zinc-400 max-w-xs mx-auto lg:mx-0">
                                Kozmosun dilini çözmeye çalışanların, kuantumdan evrene her şeyi sorgulayanların dijital üssü.
                            </p>
                        </div>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center gap-2.5 pt-1">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className={cn(
                                        "w-9 h-9 flex items-center justify-center rounded-lg",
                                        "bg-white/[0.05] border border-white/[0.08]",
                                        "text-zinc-400 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.15]",
                                        "transition-all duration-200"
                                    )}
                                >
                                    <social.icon className="w-[15px] h-[15px]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* LINKS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8 flex-1 pt-1">
                        {FOOTER_LINKS.map((group) => (
                            <div key={group.title}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 bg-[#FACC15] rotate-45 flex-shrink-0" />
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                        {group.title}
                                    </h4>
                                </div>
                                <ul className="flex flex-col gap-2.5">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-[13px] font-semibold text-zinc-300 hover:text-white transition-colors duration-150"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* === DIVIDER === */}
                <div className="h-px bg-white/[0.06] mb-6" />

                {/* === BOTTOM BAR === */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-zinc-500 tracking-wide">
                        © 2026 FizikHub. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-5">
                        <Link href="/kurallar" className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
                            Kurallar
                        </Link>
                        <Link href="/gizlilik-politikasi" className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
                            Gizlilik Politikası
                        </Link>
                        <Link href="/kvkk" className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
                            KVKK
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
