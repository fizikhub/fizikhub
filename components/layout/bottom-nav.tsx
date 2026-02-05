"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
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
                h-[56px]
                bg-white/95 dark:bg-zinc-950/95
                backdrop-blur-xl
                border-t-[1.5px] border-black dark:border-white/10
                flex items-center justify-around
                px-4
                pb-safe
                relative
                shadow-[0_-4px_12px_-5px_rgba(0,0,0,0.15)]
            ">
                <NavItem
                    href="/"
                    icon={Home}
                    label="Akış"
                    isActive={pathname === "/"}
                />

                <NavItem
                    href="/makale"
                    icon={BookOpen}
                    label="Yazılar"
                    isActive={pathname.startsWith("/makale")}
                />

                <div className="relative -top-3">
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-12 h-12
                            bg-[#FACC15]
                            border-[2px] border-black
                            rounded-2xl
                            shadow-[3px_3px_0px_0px_#000]
                            active:shadow-none active:translate-x-[1px] active:translate-y-[1px]
                            transition-all
                        "
                    >
                        <Plus className="w-6 h-6 text-black stroke-[3.5px]" />
                    </ViewTransitionLink>
                </div>

                <NavItem
                    href="/forum"
                    icon={MessageCircle}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                />

                <NavItem
                    href="/profil"
                    icon={User}
                    label="Profil"
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
                "flex flex-col items-center justify-center min-w-[60px] h-full relative py-1",
                isActive ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-500"
            )}
        >
            <motion.div
                initial={false}
                animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex flex-col items-center gap-0.5"
            >
                <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-300",
                    isActive && "bg-[#FACC15]/20 dark:bg-[#FACC15]/30"
                )}>
                    <Icon className={cn(
                        "w-5 h-5 transition-all text-black dark:text-white",
                        isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                    )} />
                </div>
                <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest transition-all",
                    isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
                )}>
                    {label}
                </span>
            </motion.div>

            {isActive && (
                <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 w-8 h-[3px] bg-[#FACC15] rounded-t-full"
                />
            )}
        </ViewTransitionLink>
    );
}
