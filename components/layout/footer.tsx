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
        ],
    },
    {
        title: "Topluluk",
        links: [
            { label: "Forum", href: "/forum" },
            { label: "Sıralamalar", href: "/siralamalar" },
            { label: "Hakkımızda", href: "/hakkimizda" },
        ],
    },
    {
        title: "Yasal",
        links: [
            { label: "KVKK", href: "/kvkk" },
            { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
            { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
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
];

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#09090b] px-5 pb-28 pt-16 sm:px-6 md:pb-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FACC15]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_70%)]" />
                <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-[#FACC15]/[0.05] blur-3xl" />
                <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-sky-400/[0.04] blur-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
            </div>

            <div className="container relative mx-auto max-w-[1250px]">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8">
                        <Link href="/" className="inline-flex" aria-label="FizikHub ana sayfa">
                            <DankLogo />
                        </Link>

                        <div className="mt-6 space-y-4 text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                                <span className="h-2 w-2 rotate-45 bg-[#FACC15]" />
                                FizikHub Bilim Platformu
                            </div>

                            <div className="space-y-3">
                                <p className="max-w-md text-2xl font-black italic leading-[1.02] tracking-[-0.04em] text-white sm:text-[2.15rem]">
                                    Bilimi tiye alıyoruz,
                                    <span className="mt-2 block w-fit bg-[#FACC15] px-3 py-1 text-black shadow-[3px_3px_0px_0px_#000]">
                                        ama ciddi şekilde.
                                    </span>
                                </p>
                                <p className="max-w-lg text-sm leading-6 text-zinc-400 sm:text-[15px]">
                                    Makaleler, forum tartışmaları, simülasyonlar ve kavramlar aynı çatı altında; merakı canlı tutan temiz bir bilim akışı.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2.5">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className={cn(
                                        "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#111113] text-zinc-400",
                                        "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FACC15]/40 hover:text-white"
                                    )}
                                >
                                    <social.icon className="h-[16px] w-[16px]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {FOOTER_LINKS.map((group) => (
                            <div
                                key={group.title}
                                className="rounded-[24px] border border-white/[0.08] bg-[#111113]/85 p-5 backdrop-blur-sm sm:p-6"
                            >
                                <div className="mb-5 flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rotate-45 bg-[#FACC15] shadow-[0_0_0_2px_#09090b]" />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-500">
                                        {group.title}
                                    </h4>
                                </div>

                                <ul className="space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center text-[15px] font-black uppercase tracking-[-0.02em] text-white transition-colors duration-150 hover:text-[#FACC15]"
                                            >
                                                <span className="border-b border-transparent pb-0.5 transition-colors duration-150 group-hover:border-[#FACC15]/40">
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        © {year} FizikHub. Tüm hakları saklıdır.
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {UTILITY_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
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
