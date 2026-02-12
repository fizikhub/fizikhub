"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Layers, Feather, MessageSquareDashed, UserRound, Plus } from "lucide-react";
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
                bg-white/80 dark:bg-[#121212]/80
                backdrop-blur-xl
                border-t-[3px] border-black dark:border-white/20
                flex items-center justify-around
                px-4
                pb-safe
                relative
                shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]
            ">
                <NavItem
                    href="/"
                    icon={Layers}
                    label="Akış"
                    isActive={pathname === "/"}
                />

                <NavItem
                    href="/makale"
                    icon={Feather}
                    label="Blog"
                    isActive={pathname.startsWith("/makale")}
                />

                <div className="relative -top-5">
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-14 h-14
                            bg-[#FACC15]
                            border-[3px] border-black
                            rounded-full
                            shadow-[4px_4px_0px_0px_#000]
                            active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                            transition-all
                            hover:scale-105
                        "
                    >
                        <Plus className="w-8 h-8 text-black stroke-[3px]" />
                    </ViewTransitionLink>
                </div>

                <NavItem
                    href="/forum"
                    icon={MessageSquareDashed}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                />

                <NavItem
                    href="/profil"
                    icon={UserRound}
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
                "flex flex-col items-center justify-center min-w-[60px] h-full relative group",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            )}
        >
            <motion.div
                initial={false}
                animate={isActive ? { y: -2 } : { y: 0 }}
                className="flex flex-col items-center gap-1"
            >
                <div className={cn(
                    "p-2 transition-all duration-300 rounded-xl",
                    isActive && "bg-black/5 dark:bg-white/10"
                )}>
                    <Icon className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isActive ? "stroke-[2.5px] scale-110" : "stroke-[2px] group-hover:scale-110"
                    )} />
                </div>
                {isActive && (
                    <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-2 w-1 h-1 bg-black dark:bg-white rounded-full"
                    />
                )}
            </motion.div>
        </ViewTransitionLink>
    );
}
