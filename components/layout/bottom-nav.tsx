"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Zap, Library, MessageSquareCode, Fingerprint, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[50] md:hidden transition-all duration-500 ease-out font-sans",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
            <nav className="
                w-full
                h-[64px]
                bg-white/90 dark:bg-[#09090b]/80
                backdrop-blur-2xl
                border-t border-black/10 dark:border-white/10
                flex items-center justify-between
                px-6
                pb-safe
                relative
                shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]
            ">
                <NavItem
                    href="/"
                    icon={Zap}
                    label="Akış"
                    isActive={pathname === "/"}
                />

                <NavItem
                    href="/makale"
                    icon={Library}
                    label="Kütüphane"
                    isActive={pathname.startsWith("/makale")}
                />

                <div className="relative -top-6">
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-14 h-14
                            bg-[#FACC15]
                            border-[3px] border-black dark:border-white/10
                            rounded-full
                            shadow-[0px_8px_20px_-6px_rgba(250,204,21,0.5)]
                            active:scale-95
                            transition-all duration-300
                            hover:rotate-90 hover:scale-110
                            z-20
                        "
                    >
                        <Plus className="w-8 h-8 text-black stroke-[3px]" />
                    </ViewTransitionLink>
                    {/* Glow effect behind the button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#FACC15] blur-[20px] opacity-40 -z-10 rounded-full" />
                </div>

                <NavItem
                    href="/forum"
                    icon={MessageSquareCode}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                />

                <NavItem
                    href="/profil"
                    icon={Fingerprint}
                    label="Kimlik"
                    isActive={pathname.startsWith("/profil")}
                />
            </nav>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <ViewTransitionLink
            href={href}
            className={cn(
                "flex flex-col items-center justify-center h-full relative group w-12",
                isActive ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 w-full h-full bg-black/5 dark:bg-white/5 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <motion.div
                whileTap={{ scale: 0.8 }}
                className="relative flex flex-col items-center gap-1"
            >
                <div className="relative">
                    <Icon className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                    )} />
                    {isActive && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-2 h-2 bg-[#FACC15] rounded-full border-2 border-white dark:border-[#09090b]"
                        />
                    )}
                </div>
            </motion.div>
        </ViewTransitionLink>
    );
}
