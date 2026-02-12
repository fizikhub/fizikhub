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
                bg-white/80 dark:bg-[#121212]/80
                backdrop-blur-xl
                border-t border-black/10 dark:border-white/10
                flex items-center justify-around
                px-2
                pb-safe
                relative
                shadow-sm
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

                <div className="relative -top-5">
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-12 h-12
                            bg-[#FACC15]
                            border-2 border-black dark:border-white
                            rounded-full
                            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)]
                            active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px]
                            transition-all duration-300
                            group
                        "
                    >
                        <Plus className="w-6 h-6 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
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
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-500"
            )}
        >
            <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex flex-col items-center gap-0.5"
            >
                <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 border border-transparent",
                    isActive
                        ? "bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/5"
                        : "group-hover:bg-black/5 dark:group-hover:bg-white/5"
                )}>
                    <Icon className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive ? "stroke-[2.75px] scale-105" : "stroke-[2px]"
                    )} />
                </div>
            </motion.div>
        </ViewTransitionLink>
    );
}
