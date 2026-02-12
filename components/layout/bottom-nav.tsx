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
                h-[50px]
                bg-white/90 dark:bg-[#0a0a0a]/90
                backdrop-blur-md
                border-t-[3px] border-black dark:border-white/20
                flex items-center justify-around
                px-2
                pb-safe
                relative
                shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]
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
                    label="Blog"
                    isActive={pathname.startsWith("/makale")}
                />

                <div className="relative -top-4">
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-12 h-12
                            bg-[#FACC15]
                            border-[3px] border-black
                            rounded-full
                            shadow-[3px_3px_0px_0px_#000]
                            active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                            transition-all
                            hover:scale-105
                        "
                    >
                        <Plus className="w-7 h-7 text-black stroke-[3px]" />
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
                "flex flex-col items-center justify-center min-w-[55px] h-full relative group",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            )}
        >
            <motion.div
                initial={false}
                animate={isActive ? { y: -2 } : { y: 0 }}
                className="flex flex-col items-center gap-0.5"
            >
                <div className={cn(
                    "p-1.5 transition-all duration-300 rounded-lg",
                    isActive && "bg-black/5 dark:bg-white/10"
                )}>
                    <Icon className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isActive ? "stroke-[2.5px] scale-110" : "stroke-[2px] group-hover:scale-110"
                    )} />
                </div>
                {isActive && (
                    <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 w-1 h-1 bg-black dark:bg-white rounded-full"
                    />
                )}
            </motion.div>
        </ViewTransitionLink>
    );
}
