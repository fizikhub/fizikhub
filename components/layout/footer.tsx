"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { cn } from "@/lib/utils";

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

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const year = new Date().getFullYear();

    if (isChatPage) return null;

    return (
        <footer className="w-full border-t-[4px] border-black bg-white px-5 pb-24 pt-16 text-black dark:border-zinc-800 dark:bg-[#121212] dark:text-white sm:px-8 md:pb-16">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 lg:flex-row lg:justify-between lg:gap-24">
                
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
                        <h2 className="text-[1.75rem] font-black uppercase leading-[1.1] tracking-tight sm:text-[2.25rem]">
                            Bilimi Ti'ye Alıyoruz Ama Ciddili Şekilde.
                        </h2>
                        <p className="text-[0.9rem] font-bold uppercase tracking-normal text-zinc-500 dark:text-zinc-400 sm:text-[1rem]">
                            İzinsiz kullananı kara deliğe atarız.
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="mt-2 flex shrink-0 gap-3">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className={cn(
                                    "group flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-white transition-all duration-200",
                                    "shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                                    "dark:border-zinc-700 dark:bg-[#1c1c1f] dark:text-white dark:shadow-[4px_4px_0px_0px_#27272a] dark:hover:shadow-none"
                                )}
                            >
                                <social.icon className="h-5 w-5 stroke-[2.5px] transition-transform group-hover:scale-110" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex w-full flex-col gap-10 sm:flex-row sm:gap-20 lg:w-auto">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title} className="flex flex-col gap-5">
                            <h3 className="text-xl font-black uppercase tracking-normal">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-1 text-[1.1rem] font-bold uppercase tracking-normal text-zinc-600 transition-colors hover:text-[#FACC15] dark:text-zinc-400 dark:hover:text-[#FACC15]"
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
            <div className="mx-auto mt-16 flex w-full max-w-[1400px] flex-col-reverse items-center justify-between gap-6 border-t-[3px] border-black/10 pt-6 sm:flex-row dark:border-white/10">
                <p className="text-[12px] font-black uppercase tracking-wider text-zinc-500">
                    FizikHub © {year}
                </p>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                    {UTILITY_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-[12px] font-black uppercase tracking-wider text-zinc-500 transition-colors hover:text-[#FACC15] dark:text-zinc-400 dark:hover:text-[#FACC15]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
